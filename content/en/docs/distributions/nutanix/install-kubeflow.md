+++
title = "Install Kubeflow on Nutanix Karbon"
description = "How to deploy Kubeflow on a Nutanix Karbon cluster"
weight = 4
                    
+++

## Prerequisites


* Make sure you first create a Kubernetes cluster using Nutanix Karbon. See [Nutanix Karbon documentation](https://portal.nutanix.com/page/documents/details?targetId=Karbon-v2_2:kar-karbon-deploy-karbon-t.html) at the Nutanix Support Portal. 

* Install [Terraform](https://www.terraform.io/downloads.html) based on your platform

* Install kubectl from [Install Tools](https://kubernetes.io/docs/tasks/tools/#kubectl)

* Download [Kubeconfig](https://portal.nutanix.com/page/documents/details?targetId=Karbon-v2_2:kar-karbon-download-kubeconfig-t.html) of your deployed Karbon cluster. 


## Installing Kubeflow

Do these steps to deploy Kubeflow 1.4 on your Karbon cluster.

1. Download the terraform script to deploy kubeflow on Nutanix Karbon by cloning the Github repository shown.

   ```
   git clone https://github.com/nutanix/karbon-platform-services.git
   cd automation/infrastructure/terraform/kcs/install_kubeflow
    
   ```

2. Create `env.tfvars` file in the same folder with the following cluster variables. Override other variables from variables.tf file if required.

   ```
   prism_central_username = "enter username"
   prism_central_password = "enter password"
   prism_central_endpoint = "enter endpoint_ip_or_host_fqdn"
   karbon_cluster_name    = "enter karbon_cluster_name"
   kubeconfig_filename    = "enter karbon_cluster_name-kubectl.cfg"
   kubeflow_version       = "1.4.0"
   ```

3. Apply terraform commands to deploy Kubeflow in the cluster.  

   ```
   terraform init
   terraform plan --var-file=env.tfvars
   terraform apply --var-file=env.tfvars
   ```

4. Make sure all the pods are running before continuing to the next step.

   ```
   $ kubectl -n kubeflow get pods

   NAME                                                         READY   STATUS    RESTARTS   AGE
   admission-webhook-deployment-65dcd649d8-468g9                1/1     Running   0          3m39s
   cache-deployer-deployment-6b78494889-6lfg9                   2/2     Running   1          3m1s
   cache-server-bff956474-lm952                                 2/2     Running   0          3m
   centraldashboard-6b5fb79878-h9dqn                            1/1     Running   0          3m40s
   jupyter-web-app-deployment-75559c6c87-mt4q2                  1/1     Running   0          3m1s
   katib-controller-79f44b76bb-t7rzl                            1/1     Running   0          3m
   katib-db-manager-6d9857f658-p4786                            1/1     Running   0          2m59s
   katib-mysql-586f79b694-2qcl5                                 1/1     Running   0          2m59s
   katib-ui-5fdb7869cf-jmssr                                    1/1     Running   0          3m
   kfserving-controller-manager-0                               2/2     Running   0          3m15s
   kubeflow-pipelines-profile-controller-6cfd6bf9bd-cptgg       1/1     Running   0          2m59s
   metacontroller-0                                             1/1     Running   0          3m15s
   metadata-envoy-deployment-6756c995c9-gqkbd                   1/1     Running   0          3m
   metadata-grpc-deployment-7cb87744c7-4crm9                    2/2     Running   3          3m40s
   metadata-writer-6bf5cfd7d8-fgq9f                             2/2     Running   0          3m40s
   minio-5b65df66c9-9z7mg                                       2/2     Running   0          2m59s
   ....

   ```

## Add a new Kubeflow user

New users are created using the Profile resource. A new namespace is created with the same Profile name. For creating a new user with email `user@example.com` in a namespace `project1`, apply the following profile

   ```
   cat <<EOF | kubectl apply -f -
   apiVersion: kubeflow.org/v1beta1
   kind: Profile
   metadata:
       name: project1   # replace with the name of profile you want, this will be the user's namespace name
   spec:
       owner:
           kind: User
           name: user2@example.com   # replace with the user email
   EOF
   ``` 
    
If you are using basic authentication, add the user credentials in dex which is the default OpenId Connect provider in Kubeflow. Generate the hash by using bcrypt (available at https://bcrypt-generator.com) in the following configmap
 
    
   ```
   kubectl edit cm dex -o yaml -n auth
   ```

Add the following  under staticPasswords section
    
   ```
   - email: user2@example.com
     hash: <hash>
     username: user2
   ```

## Setup a LoadBalancer (Optional)
  If you already have a load balancer set up for your Karbon cluster, you can skip this step. If you do not wish to
  expose the kubeflow dashboard to an external load balancer IP, you can also skip this step.
  If not, you can install the [MetalLB](https://metallb.universe.tf/) load balancer manifests on your Karbon cluster.
  ```
  $ kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.10.2/manifests/namespace.yaml
  $ kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.10.2/manifests/metallb.yaml
  ```

  After the manifests have been applied, we need to configure MetalLB with the IP range that it can use to assign external IPs to services of type LoadBalancer. You can find the range from the subnet in Prism Central’s [networking and security](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Flow-Networking-Guide:ear-flow-nw-view-subnet-list-pc-r.html) settings.
  ```
  apiVersion: v1
  kind: ConfigMap
  metadata:
    namespace: metallb-system
    name: config
  data:
    config: |
      address-pools:
        - name: default
          protocol: layer2
          addresses:
          - <IP_ADDRESS_RANGE: x.x.x.x-x.x.x.x>
  ```
  Create a ConfigMap with the following information, substitute the addresses field with your IP address range, and apply it to the cluster.
  ```
  $ kubectl apply -f metallb-configmap.yaml
  ```

## Access Kubeflow Central Dashboard
There are multiple ways to acces your Kubeflow Central Dashboard:
- Port Forward: The default way to access Kubeflow Central Dashboard is by using Port-Forward. You can port forward the istio ingress gateway to local port 8080.
    
   ```
   kubectl --kubeconfig=<karbon_k8s_cluster_kubeconfig_path> port-forward svc/istio-ingressgateway -n istio-system 8080:80
   ```
    
  You can now access the Kubeflow Central Dashboard at http://localhost:8080. At the Dex login page, enter user credentials that you previously created.
    
 
- NodePort: For accessing through NodePort, you need to configure HTTPS. Create a certificate using cert-manager for your Worker node IP in your cluster. Add HTTPS to kubeflow gateway as given in [Istio Secure Gateways](https://istio.io/latest/docs/tasks/traffic-management/ingress/secure-ingress/). Then access your cluster at
   
   ```
   https://<worknernode-ip>:<https-nodeport>
   ```
- LoadBalancer: If you have a LoadBalancer set up (See optional "Setup a LoadBalancer" section above), you can access the dashboard using the external IP by making the following changes.
  - Update Istio Gateway to expose port 443 with HTTPS and make port 80 redirect to 443:
    ```
    kubectl -n kubeflow edit gateways.networking.istio.io kubeflow-gateway
    ```
    The updated gateway spec should look like:
    ```yaml
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
        - '*'
        port:
            name: http
            number: 80
            protocol: HTTP
        # Upgrade HTTP to HTTPS
        tls:
            httpsRedirect: true
    - hosts:
        - '*'
        port:
            name: https
            number: 443
            protocol: HTTPS
        tls:
            mode: SIMPLE
            privateKey: /etc/istio/ingressgateway-certs/tls.key
            serverCertificate: /etc/istio/ingressgateway-certs/tls.crt
    ```
  - Change the type of the istio-ingressgateway service to LoadBalancer
    ```
    kubectl -n istio-system  patch service istio-ingressgateway -p '{"spec": {"type": "LoadBalancer"}}'
    ```
    Get the IP address for the `LoadBalancer`
    ```
    kubectl -n istio-system get svc istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0]}'
    ```
    Set the `REDIRECT_URL` in `oidc-authservice-parameters` configmap to something like `https://x.x.x.x/login/oidc` where the `x.x.x.x` is the IP address of your istio-ingressgateway.
    ```
    kubectl -n istio-system edit configmap oidc-authservice-parameters
    ```
    Append the same to the `redirectURIs` list in `dex` configmap
    ```
    kubectl -n auth edit configmap dex
    ```
    Rollout restart authservice and dex
    ```
    kubectl -n istio-system rollout restart statefulset authservice
    kubectl -n auth rollout restart deployment dex
    ```
    Create a `certificate.yaml` with the YAML below to create a self-signed certificate
    ```
    apiVersion: cert-manager.io/v1alpha2
    kind: Certificate
    metadata:
      name: istio-ingressgateway-certs
      namespace: istio-system
    spec:
      commonName: istio-ingressgateway.istio-system.svc
      ipAddresses:
        - <ISTIO_INGRESSGATEWAY_IP_ADDRESS: x.x.x.x>
      isCA: true
      issuerRef:
        kind: ClusterIssuer
        name: kubeflow-self-signing-issuer
      secretName: istio-ingressgateway-certs
    ```
    Apply `certificate.yaml` to the `istio-system` namespace
    ```
    kubectl -n istio-system apply -f certificate.yaml
    ```
  - You can now access the kubeflow dashboard by navigating to the istio-ingressgateway external IP e.g. `x.x.x.x`
    