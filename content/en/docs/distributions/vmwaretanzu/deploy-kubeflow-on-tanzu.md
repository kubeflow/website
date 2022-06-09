+++
title = "Install Kubeflow on VMware Tanzu Kubernetes Grid Service "
description = "Instructions for deploying Kubeflow on VMware Tanzu  Kubernetes Cluster "
weight = 6
+++

This guide describes how to use the kustomize + kubectl to deploy Kubeflow on VMware Tanzu Kubernetes Cluster .

## Prerequisites

* NOTE: All prerequisites must be installed and configured before creating the Tanzu Kubernetes cluster.
Perform the following steps:
1.	Download and Install kubectl for vSphere in our validation for Kubeflow version 1.5 of kubectl requires v1.21+.
2.	Make sure you first create a Tanzu Kubernetes cluster and install GPU Operator on your Tanzu Kubernetes cluster in the configuration session.
3.	Install Kustomize for Kubeflow installation
## Deploy Kubeflow
We used the manifests for installation, perform the following steps to deploy Kubeflow 1.5.0 on your Tanzu Kubernetes cluster:
1.	The following kubectl command creates a ClusterRoleBinding that grants access to authenticated users to run a privileged set of workloads using the default PSP vmware-system-privileged.
```
kubectl create clusterrolebinding default-tkg-admin-privileged-binding --clusterrole=psp:vmware-system-privileged --group=system:authenticated 
```
2.	Set the default storageclass for pv claims of kubeflow components such as MinIO and MySQL:
```
kubectl patch storageclass seletedstorageclassname -p '{"metadata": {"annotations"：{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

3.	Download the scripts to deploy kubeflow by cloning the Github repository:
```
 git clone https://github.com/kubeflow/manifests.git
 git checkout v1.5-branch  
 ```
4.	You can install kubeflow official components by using either of the two options, Install with a single command
```
 while ! kustomize build example | kubectl apply -f -; do echo "Retrying to apply resources"; sleep 10; done
 ```
 or Install individual components. 
* Note: Individual components may have dependencies. If all the individual commands are executed, the result is the same as the single command installation.
6.	Verify all the pods are running. The kubectl apply commands may fail on the first try. This is inherent in how kubernetes and kubectl work. Try to rerun the command until it succeeds.
To check that all Kubeflow-related pods are ready, use the following commands:
```
kubectl get pods -n cert-manager
kubectl get pods -n istio-system
kubectl get pods -n auth
kubectl get pods -n knative-eventing
kubectl get pods -n knative-serving
kubectl get pods -n kubeflow
kubectl get pods -n kubeflow-user-example-com
```
The following diagram shows the pods deployed in the Istio namespace:
```
kubectl get pod -n istio-system
NAME                                    READY        STATUS.    RESTARTS   AGE
authservice-0                           1/1          RUNNING     0         23h
cluster-local-gateway-7796d7bc87-9qb5v  1/1          Running     0         24h
istio-ingressgateway-64b7899489-ft5gn   1/1          Running     0         24h
istio-5d9bb9cb4-5zvzz                   1/1          Running     0         24h
```  
