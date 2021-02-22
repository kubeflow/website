+++
title = "Securing the Kubeflow authentication with HTTPS"
description = "How to secure the Kubeflow authentication with HTTPS using the network load balancer"
weight = 10
+++

This guide describes how to secure the Kubeflow authentication with HTTPS.
You can enable HTTPS for Kubeflow dashboard (and other web UIs) using the
network load balancer (NLB) feature of the IBM Cloud Kubernetes service—choose
the `classic` worker nodes provider in the
[Setting environment variables](../../create-cluster#setting-environment-variables)
section of the Create an IBM Cloud cluster guide.

**Note**: For details on NLB, go to the official
[Classic: About network load balancers](https://cloud.ibm.com/docs/containers?topic=containers-loadbalancer-about)
guide.

## Prerequisites

* Install and configure the
[IBM Cloud CLI](https://cloud.ibm.com/docs/cli?topic=cli-getting-started).
* Install
[multi-user, auth-enabled Kubeflow](../install-kubeflow/#multi-user-auth-enabled).

## Setting up an NLB

To set up an NLB for your Kubernetes cluster, follow the official
[Classic: Setting up basic load balancing with an NLB 1.0](https://cloud.ibm.com/docs/containers?topic=containers-loadbalancer)
guide. Notice that the setup process for a multi-zone cluster differs from that
of a single-zone cluster. For details, go to
[Setting up an NLB 1.0 in a multi-zone cluster](https://cloud.ibm.com/docs/containers?topic=containers-loadbalancer#multi_zone_config).

1. To use the existing Istio ingress gateway (instead of creating a new
service), you need to update the service type of `istio-ingressgateway` to
`LoadBalancer` from `NodePort`. Run the following command:

    ```shell
    kubectl patch svc istio-ingressgateway -n istio-system -p '{"spec":{"type":"LoadBalancer"}}'
    ```

2. Verify that the NLB was created successfully. It might take a few minutes for
the service to be created and an IP address to be made available. Run the
command below and check if you can see the `LoadBalancer Ingress` IP address:

    ```shell
    kubectl describe service istio-ingressgateway -n istio-system | grep "LoadBalancer Ingress"
    ```

3. Store the external IP of the `istio-ingressgateway` service in an environment
variable:

    ```shell
    export INGRESS_GATEWAY_IP=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    ```

## Exposing the Kubeflow dashboard with DNS and TLS termination

The following instructions use the Kubeflow dashboard as an example. However,
they apply to other web UI applications, since they all go through the Istio
ingress gateway.

1. Store the Kubernetes cluster name in an environment variable by running the
following command:

   ```shell
   export CLUSTER_NAME=<cluster_name>
   ```

2. Create a DNS domain and certificates for the IP of the service
`istio-ingressgateway` in namespace `istio-system`:

    ```shell
    ibmcloud ks nlb-dns create classic --cluster $CLUSTER_NAME --ip $INGRESS_GATEWAY_IP --secret-namespace istio-system
    ```

3. List the registered domain names:

    ```shell
    ibmcloud ks nlb-dns ls --cluster $CLUSTER_NAME
    ```

4. Wait until the status of the certificate—the fourth field—of the new domain
name becomes `created`. Then, save the value of the column `SSL Cert Secret
Name` in environment variables by running these commands (replace
`{SECRET_NAME}` with the secret's name as shown in the `SSL Cert Secret Name`
column):

    ```shell
    export INGRESS_GATEWAY_SECRET={SECRET_NAME}
    ```

    **Note**: If there is more than one entry in the output, choose the one
    that matches the IP address from `LoadBalancer Ingress` (step 2) of service
    `istio-ingressgateway`.

5. Create a secret named `istio-ingressgateway-certs` for the
`istio-ingressgateway` pods in namespace `istio-system`:

    ```shell
    kubectl get secret $INGRESS_GATEWAY_SECRET -n istio-system -o yaml > istio-ingressgateway-certs.yaml
    ```

6. Update the `istio-ingressgateway-certs.yaml` file by changing the value of
`metadata.name` to `istio-ingressgateway-certs` and the value of
`metadata.namespace` to `istio-system`. Then, run the following commands:

    ```shell
    kubectl apply -f istio-ingressgateway-certs.yaml -n istio-system
    kubectl rollout restart deploy istio-ingressgateway -n istio-system
    rm istio-ingressgateway-certs.yaml
    ```

7. Update the gateway `kubeflow-gateway` to expose port `443`. Create a resource
file `kubeflow-gateway.yaml` as follows by replacing `<hostname>` with the value
of the column `Hostname` in step 4:

    ```YAML
    apiVersion: networking.istio.io/v1alpha3
    kind: Gateway
    metadata:
      name: kubeflow-gateway
      namespace: kubeflow
    spec:
      selector:
        istio: ingressgateway
      servers:
      - hosts:
        - '<hostname>'
        port:
          name: https
          number: 443
          protocol: HTTPS
        tls:
          mode: SIMPLE
          privateKey: /etc/istio/ingressgateway-certs/tls.key
          serverCertificate: /etc/istio/ingressgateway-certs/tls.crt
    ```
    
    ```shell
    kubectl apply -f kubeflow-gateway.yaml -n kubeflow
    kubectl rollout restart deploy kubeflow-gateway -n kubeflow
    ```

8. Verify that the traffic is routed via HTTPS by using the value of
above-mentioned `Hostname` in your browser. It should redirect traffic from an
HTTP address to HTTPS address automatically.

**Note**: The certificates for the NLB DNS host secret expire every **90** days.
The secret in the `default` namespace is automatically renewed by IBM Cloud
Kubernetes Service 37 days before it expires. After this secret is updated, you
must manually copy it to the `istio-ingressgateway-certs` secret by repeating
commands in step 5 and 6.

## Optional - KFServing configuration

With this HTTPS setup, you need to make additional changes to get KFServing to work.

1. First, update the Knative domain that is used for the KFServing routes to the
hostname that you used when updating `kubeflow-gateway`.

    ```shell
    kubectl edit configmap config-domain -n knative-serving
    ```

    This will open your default text editor, and you will see something like:

    ```YAML
    apiVersion: v1
    data:
      _example: |
        ################################
        #                              #
        #    EXAMPLE CONFIGURATION     #
        #                              #
        ################################
        # ...
        example.com: |
    kind: ConfigMap
    ...
    ```

    Add a line above the `_example` key with your hostname as the key and an empty string value.
    Be sure to update `<hostname>`:

    ```YAML
    apiVersion: v1
    data:
      <hostname>: ""
      _example: |
       ...
    kind: ConfigMap
    ...
    ```

    Then, save and exit. The routes for your InferenceServices will start using this new domain.

2. Since the certificates provided by IBM Cloud only allow for a single level of domain name added
to the base domain, the domain template for Knative needs to be adjusted so that the certificates
will be valid for the InferenceService routes.

    ```shell
    kubectl edit configmap config-network -n knative-serving
    ```

    This will open your default text editor, and you will again see something like:

    ```YAML
    apiVersion: v1
    data:
      _example: |
        ################################
        #                              #
        #    EXAMPLE CONFIGURATION     #
        #                              #
        ################################
        # ...
    kind: ConfigMap
    ...
    ```

    Add a line above the `_example` key with the `domainTemplate` key like the following:

    ```YAML
    apiVersion: v1
    data:
      domainTemplate: "{{.Name}}-{{.Namespace}}.{{.Domain}}"
      _example: |
       ...
    kind: ConfigMap
    ...
    ```

    Save and exit. The default template uses a two-level subdomain (i.e. `{{.Name}}.{{.Namespace}}.{{.Domain}}`),
    so this just adjusts it to use one.


3. Adjust `kubeflow-gateway` one more time, adding a wildcard host in the HTTPS `hosts` section.

    ```shell
    kubectl edit gateway kubeflow-gateway -n kubeflow
    ```

    This will open your default text editor, but you can also optionally edit `kubeflow-gateway.yaml` file
    you created previously. Here, just add another entry to the HTTPS `hosts` list containing your hostname prepended
    with a `*.` so that the Knative subdomains are properly routed.

    ```YAML
    apiVersion: networking.istio.io/v1alpha3
    kind: Gateway
    metadata:
      name: kubeflow-gateway
      namespace: kubeflow
    spec:
      selector:
        istio: ingressgateway
      servers:
      - hosts:
        - '<hostname>'
        - '*.<hostname>'
        port:
          name: https
          number: 443
          protocol: HTTPS
        tls:
          mode: SIMPLE
          privateKey: /etc/istio/ingressgateway-certs/tls.key
          serverCertificate: /etc/istio/ingressgateway-certs/tls.crt
    ```

    Save and exit.

After these adjustments, InferenceServices should now be reachable via HTTPS. To test out an external
prediction, you can use the `authservice_session` cookie for the Kubeflow dashboard site from the browser. Once
the content of the cookie is retrieved from the browser, it can be added as a header in your request
(e.g. `"Cookie: authservice_session=MTYwNz..."`). For example:

```shell
curl -v https://sklearn-iris-kfserving-test.kf-dev-442dbba0442be6c8c50f31ed96b00532-0001.sjc03.containers.appdomain.cloud/v1/models/sklearn-iris:predict -d '{"instances": [[6.8,  2.8,  4.8,  1.4],[6.0,  3.4,  4.5,  1.6]]}' -H "Cookie: authservice_session=MTYwODMyODk5M3xOd3dBTkVzeU5VSlJRazlQVnpWT1dGUldWa0ZXVDBRMVFsY3pVVFZHVVVGV01rWkRORmd6VmxCVVNsQkVSa2xaUlZVMFRUVldVMEU9fJBHfRCAvs6nSh_J04VlBEq_yqhkUvc5Z1Mqahe9klOd"
```
