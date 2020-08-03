+++
title = "Secure Authentication"
description = "Secure the Kubeflow authentication with HTTPS"
weight = 10
+++

This guide describes how to enable HTTPS for Kubeflow dashboard and all other web UIs using the network load balancer (NLB) feature of IBM Cloud Kubernetes service since it chooses the `classic` worker nodes provider in the installation guide.

**Note**: See NLB details from the official document [Classic: About network load balancers](https://cloud.ibm.com/docs/containers?topic=containers-loadbalancer-about).

## Prerequisites

* Install and configure the [IBM Cloud CLI](https://cloud.ibm.com/docs/cli?topic=cli-getting-started).
* Multi-user, auth-enabled Kubeflow installed by following the guide [Install Kubeflow](../deploy/install-kubeflow/#multi-user-auth-enabled).

## Set up a NLB

Please follow the official guide [Classic: Setting up basic load balancing with an NLB 1.0](https://cloud.ibm.com/docs/containers?topic=containers-loadbalancer) to setup an NLB for your Kuberetes cluster. Notice that the setup process for a multizone cluster differs from that of a single-zone cluster.

1. In order to use exisitng Istio ingress gateway instead of creating a new service, you need to update the service type of `istio-ingressgateway` from `NodePort` to `LoadBalancer`:
    ```SHELL
    kubectl patch svc istio-ingressgateway -n istio-system -p '{"spec":{"type":"LoadBalancer"}}'
    ```
2. Verify the NLB was created successfully. It might take a few minutes for the service to be created and for the app to be available. Run below command and verify the `LoadBalancer Ingress` IP address showed up:
    ```SHELL
    kubectl describe service istio-ingressgateway -n istio-system | grep "LoadBalancer Ingress"
    ```
3. Store the external IP of the `istio-ingressgateway` service in an environment variable:
    ```SHELL
    export INGRESS_GATEWAY_IP=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    ```

## Expose the Istio ingress gateway with DNS and TLS termination
1. Keep Kubernetes cluster name in a environment variable. Run command `export CLUSTER_NAME=<cluster_name>`
1. Create a DNS domain and certificates for the IP of the service `istio-ingressgateway` in namespace `istio-system`:
    ```SHELL
    ibmcloud ks nlb-dns create classic --cluster $CLUSTER_NAME --ip $INGRESS_GATEWAY_IP --secret-namespace istio-system
    ```
1. List the registered domain names:
    ```SHELL
    ibmcloud ks nlb-dns ls --cluster $CLUSTER_NAME
    ```
1. Wait until the status of the certificate (the fourth field) of the new domain name becomes `created`. Then save the value of the column `SSL Cert Secret Name` and `Hostname` in environment variables by running these commands:
    ```SHELL
    export INGRESS_GATEWAY_SECRET=<the secret's name as shown in the SSL Cert Secret Name column>
    export INGRESS_GATEWAY_HOST=<the hostname as shawn in the Hostname column>
    ```
    **Note**: If there are more than one entries in the output, choose the entry matches IP address from the above `LoadBalancer Ingress` of service `istio-ingressgateway`. 
1. Create a secret named `istio-ingressgateway-certs` for the `istio-ingressgateway` pods in namespace `istio-system`:
    ```SHELL
    kubectl get secret $INGRESS_GATEWAY_SECRET --namespace istio-system -o yaml > istio-ingressgateway-certs.yaml
    # In the istio-ingressgateway-certs.yaml file, change the value of name: to istio-ingressgateway-certs and save the file.
    kubectl apply -f istio-ingressgateway-certs.yaml -n istio-system
    kubectl rollout restart deploy istio-ingressgateway -n istio-system
    rm istio-ingressgateway-certs.yaml
    ```
1. Update the gateway `kubeflow-gateway` to expose port `443`. Create resource file `kubeflow-gateway.yaml` like following by replacing `<hostname>` with the value of above `Hostname`:
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
1. Verify that the traffic is routed via HTTPS by using the value of above `Hostname` in your browser. It should redirect traffic from HTTP address to HTTPS address automatically.

**Note**: The certificates for the NLB DNS host secret expires every **90** days. The secret in the `istio-system` namespace is automatically renewed by IBM Cloud Kubernetes Service 37 days before it expires. After this secret is updated, you must manually copy it to the secret `istio-ingressgateway-certs` by repeating commands in the step 6.

## Update authentication provider configuration

When installing Kubeflow with the multi-user, auth-enabled path, it uses an GitHub OAuth application as authentication provider. After enabling Expose the Istio ingress gateway with DNS and TLS, please update this GitHub OAuth app settings by replacing `<hostname>` with the hostname of created SSL certificate:

* Homepage URL: `https://<hostname>/`
* Authorization callback URL: `https://<hostname>/dex/callback`

