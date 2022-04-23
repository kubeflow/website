
+++
title = "Install Kubeflow 1.5"
description = "Instructions for deploying Kubeflow 1.5 on Azure"
weight = 4
                    
+++
This guide describes how to use the kustomize to
deploy Kubeflow on Azure.

## Prerequisites

- Install [kustomize version 3.2.0](https://github.com/kubernetes-sigs/kustomize/releases/tag/v3.2.0) 
  - Check installed version ```kustomize version```
- Install and configure the [Azure Command Line Interface (Az)](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
  - Log in with ```az login```
- (Optional) Install Docker
  - For Windows and WSL: [Guide](https://docs.docker.com/docker-for-windows/wsl/)
  - For other OS: [Docker Desktop](https://docs.docker.com/docker-hub/)

You do not need to have an existing Azure Resource Group or Cluster for AKS (Azure Kubernetes Service). You can create a cluster in the deployment process.

## Deployment

The deployment process is split into two ways:

* **Install with a single command** - Entire Kubeflow is installed using a single command. You only need to run `while ! kustomize build example | kubectl apply -f -; do echo "Retrying to apply resources"; sleep 10; done` if you want
  to build all the components of Kubeflow [Guide](https://github.com/kubeflow/manifests#install-with-a-single-command)
* **Install individual components** - Installs each individuals components of Kubeflow seperately. [Guide](https://github.com/kubeflow/manifests#install-individual-components)

## Azure setup

### Azure Login

To log into Azure from the command line interface, run the following commands

  ```
  az login
  az account set --subscription <NAME OR ID OF SUBSCRIPTION>
  ```

### Initial cluster setup for new cluster

Create a resource group:

  ```
  az group create -n <RESOURCE_GROUP_NAME> -l <LOCATION>
  ```

Example variables:

- `RESOURCE_GROUP_NAME=KubeTest`
- `LOCATION=westus`

Create a specifically defined cluster:
  
  ```
  az aks create -g <RESOURCE_GROUP_NAME> -n <NAME> -s <AGENT_SIZE> -c <AGENT_COUNT> -l <LOCATION> --generate-ssh-keys
  ```

Example variables:

- `NAME=KubeTestCluster`
- `AGENT_SIZE=Standard_D4s_v3`
- `AGENT_COUNT=3`
- `RESOURCE_GROUP_NAME=KubeTest`

**NOTE**:  If you are using a GPU based AKS cluster (For example: AGENT_SIZE=Standard_NC6), you also need to [install the NVidia drivers](https://docs.microsoft.com/azure/aks/gpu-cluster#install-nvidia-drivers) on the cluster nodes before you can use GPUs with Kubeflow.

## Kubeflow installation

After creating resource group and AKS, run the following commands

1. Create user credentials. You only need to run this command once, it will update kubeconfig file to current cluster that you have setup .

    ```
    az aks get-credentials --resource-group <RESOURCE_GROUP_NAME> --name <CLUSTER_NAME> --admin
    ```

1. Download the kubectl v1.20.5 release from the
  [kubectl page](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-kubectl-binary-with-curl-on-linux).

1. Check installed version:

    ```
    kubectl version --client
    ```

1. Run the following commands to set up and deploy Kubeflow. 
    ```
    git clone https://github.com/kubeflow/manifests

    cd manifests

    while ! kustomize build example | kubectl apply -f -; do echo "Retrying to apply resources"; sleep 10; done
    ```

2. Run this command to check that the resources have been deployed correctly in namespace `kubeflow`:

      ```
      kubectl get all -n kubeflow
      ```  

3. Change destination rule

    The default installation comes with destinationrule `spec.trafficPolicy: ISTIO_MUTUAL` , change this to `DISABLE`

     ```
     kubectl edit destinationrule -n kubeflow ml-pipeline
     ```

    
     Modify tls.mode (last line) from ISTIO_MUTUAL to DISABLE after modifying we should have
    ```
     spec:
        host:ml-pipeline...
        trafficPolicy:
          tls:
            mode: DISABLE
     ```

    Also, change this:
    ```
    kubectl edit destinationrule -n kubeflow ml-pipeline-ui
    ```
     Modify tls.mode (last line) from ISTIO_MUTUAL to DISABLE after modifying we should have
    ```
     # spec:
     #    host:ml-pipeline...
     #    trafficPolicy:
     #      tls:
     #        mode: DISABLE
    ```


7. Expose load balancer

    To expose Kubeflow with a load balancer service, change the type of the istio-ingressgateway service to LoadBalancer.
    ```
    kubectl patch service -n istio-system istio-ingressgateway -p '{"spec": {"type": "LoadBalancer"}}'
    ```

    After that, obtain the LoadBalancer IP address (this may take more than 15 minutes)
    ```
    kubectl get svc -n istio-system istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0]}'
    ```
    create a self-signed certificate with cert-manager:

    `nano certificate.yaml`:
    ```
    apiVersion: cert-manager.io/v1alpha2
    kind: Certificate
    metadata:
        name: istio-ingressgateway-certs
        namespace: istio-system
    spec:
        commonName: istio-ingressgateway.istio-system.svc
        # Use ipAddresses if your LoadBalancer issues an IP address
        ipAddresses:
        - <LoadBalancer IP>
        isCA: true
        issuerRef:
            kind: ClusterIssuer
            name: kubeflow-self-signing-issuer
        secretName: istio-ingressgateway-certs

    ```
    After creating certificate apply it:
    ```
    kubectl apply -f certificate.yaml -n istio-system
    ```



9. Steps to open the Kubeflow Dashboard  

    Run the following command to get dashboard IP:
    ```
    kubectl get svc -n istio-system istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0]}'
    ```

    Next, open `<loadbalancerip>` in your browser. Login to Kubeflow using default `email : user@example.com` and `password : 12341234` 


