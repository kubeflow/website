+++
title = "Access Control for Azure Deployment"
description = "Restrict access of your deployment to specified IP addresses"
weight = 100
+++

This section shows how to restrict access to only certain IP addresses for your LoadBalancer Service on Azure. At a later date, it will also include formal authentication through Azure. This method is not the most ideal way to secure your Kubernetes cluster, as it requires that you access the service from the same IP address every time. This process was adapted from [the Kubernetes guide to configuring a firewall](https://kubernetes.io/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/#restrict-access-for-loadbalancer-service).


When using a service with `spec.type: LoadBalancer`, you can specify the IP ranges that are allowed to access the load balancer by using `spec.loadBalancerSourceRanges`. This is currently supported on all major cloud providers. 

## Editing the LoadBalancer Service
Use the `kubectl edit svc <loadbalancer-name> -n kubeflow` to add your source ranges. This command will open the editor defined by you KUBE_EDITOR or EDITOR environment variables or fall back to 'vi' for Linux or 'notepad' for Windows. More information about using alternative editors and options for this command can be found in [the kubectl edit documentation](https://www.mankier.com/1/kubectl-edit).
## Internal Subnet Access
Assuming 10.0.0.0/8 is the address for the internal subnet, a load balancer will be created such that the deployment is only accessible from internal Kubernetes cluster IPs. This will not allow clients from outside your Kubernetes cluster to access the load balancer.

```
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  ports:
  - port: 8765
    targetPort: 9376
  selector:
    app: example
  type: LoadBalancer
  loadBalancerSourceRanges:
  - 10.0.0.0/8
```
## External IP Addresses 
In the following example, a load balancer will be created that is only accessible to clients with IP addresses from 130.211.204.1 and 130.211.204.2.
```
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  ports:
  - port: 8765
    targetPort: 9376
  selector:
    app: example
  type: LoadBalancer
  loadBalancerSourceRanges:
  - 130.211.204.1/32
  - 130.211.204.2/32
```
