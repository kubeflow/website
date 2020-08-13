+++
title = "Secure Authentication"
description = "Secure the Kubeflow authentication with HTTPS"
weight = 10
+++

This guide describes how to secure the Kubeflow authentication with HTTPS.
You can enable HTTPS for Kubeflow dashboard and all other web UIs using the network load balancer (NLB) feature of IBM Cloud Kubernetes service when choosing the `classic` worker nodes provider in the [Create an IBM Cloud cluster](../../create-cluster#setting-environment-variables) guide .

**Note**: See NLB details from the official document [Classic: About network load balancers](https://cloud.ibm.com/docs/containers?topic=containers-loadbalancer-about).

## Prerequisites

* Install and configure the [IBM Cloud CLI](https://cloud.ibm.com/docs/cli?topic=cli-getting-started).
* Install multi-user, [auth-enabled Kubeflow](../install-kubeflow/#multi-user-auth-enabled).

## Set up an NLB

Follow the official guide [Classic: Setting up basic load balancing with an NLB 1.0](https://cloud.ibm.com/docs/containers?topic=containers-loadbalancer) to setup an NLB for your Kuberetes cluster. Notice that the setup process for a multi-zone cluster differs from that of a single-zone cluster. See [Setting up an NLB 1.0 in a multi-zone cluster](https://cloud.ibm.com/docs/containers?topic=containers-loadbalancer#multi_zone_config) for details.

1. To use the exisitng Istio ingress gateway (instead of creating a new service), you need to update the service type of `istio-ingressgateway` to `LoadBalancer` from `NodePort`:
    ```SHELL
    kubectl patch svc istio-ingressgateway -n istio-system -p '{"spec":{"type":"LoadBalancer"}}'
    ```

2. Verify that the NLB was created successfully. It might take a few minutes for the service to be created and an IP address to be available. Run the command below and check if you can see the `LoadBalancer Ingress` IP address:
    ```SHELL
    kubectl describe service istio-ingressgateway -n istio-system | grep "LoadBalancer Ingress"
    ```

3. Store the external IP of the `istio-ingressgateway` service in an environment variable:
    ```SHELL
    export INGRESS_GATEWAY_IP=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    ```

## Expose the Kubeflow dashboard with DNS and TLS termination

These instructions are using Kubeflow dashboard as an example, however, they apply to other web UI applications since they all go through the Istio ingress gateway.

1. Store the Kubernetes cluster name in an environment variable By run the command `export CLUSTER_NAME=<cluster_name>`
2. Create a DNS domain and certificates for the IP of the service `istio-ingressgateway` in namespace `istio-system`:
    ```SHELL
    ibmcloud ks nlb-dns create classic --cluster $CLUSTER_NAME --ip $INGRESS_GATEWAY_IP --secret-namespace istio-system
    ```
3. List the registered domain names:
    ```SHELL
    ibmcloud ks nlb-dns ls --cluster $CLUSTER_NAME
    ```
4. Wait until the status of the certificate (the fourth field) of the new domain name becomes `created`. Then, save the value of the column `SSL Cert Secret Name` in environment variables by running these commands:
    ```SHELL
    export INGRESS_GATEWAY_SECRET=<the secret's name as shown in the SSL Cert Secret Name column>
    ```
    **Note**: If there is more than one entry in the output, choose the entry that matches the IP address from `LoadBalancer Ingress` (step 2) of service `istio-ingressgateway`. 
5. Create a secret named `istio-ingressgateway-certs` for the `istio-ingressgateway` pods in namespace `istio-system`:
    ```SHELL
    kubectl get secret $INGRESS_GATEWAY_SECRET --namespace istio-system -o yaml > istio-ingressgateway-certs.yaml
    ```

    Update the `istio-ingressgateway-certs.yaml` file, change the value of `metadata.name` to `istio-ingressgateway-certs` followed by:
    ```SHELL
    kubectl apply -f istio-ingressgateway-certs.yaml -n istio-system
    kubectl rollout restart deploy istio-ingressgateway -n istio-system
    rm istio-ingressgateway-certs.yaml
    ```
6. Update the gateway `kubeflow-gateway` to expose port `443`. Create a resource file `kubeflow-gateway.yaml` as follows by replacing `<hostname>` with the value of the column `Hostname` in step 4:
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
        httpsRedirect: true # sends 301 redirect for http requests
        mode: SIMPLE
        privateKey: /etc/istio/ingressgateway-certs/tls.key
        serverCertificate: /etc/istio/ingressgateway-certs/tls.crt
    ```
7. Verify that the traffic is routed via HTTPS by using the value of above `Hostname` in your browser. It should redirect traffic from an HTTP address to HTTPS address automatically.

**Note**: The certificates for the NLB DNS host secret expire every **90** days. The secret in the `istio-system` namespace is automatically renewed by IBM Cloud Kubernetes Service 37 days before it expires. After this secret is updated, you must manually copy it to the `istio-ingressgateway-certs` secret by repeating commands in step 6.

## Update authentication provider configuration

When installing Kubeflow with the multi-user, auth-enabled path, Kubeflow uses an GitHub OAuth application as authentication provider. After enabling Expose the Istio ingress gateway with DNS and TLS, you should update this GitHub OAuth app settings by replacing `<hostname>` with the hostname of created SSL certificate as follows:

* Homepage URL: `https://<hostname>/`
* Authorization callback URL: `https://<hostname>/dex/callback`
