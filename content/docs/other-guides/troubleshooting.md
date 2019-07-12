+++
title = "Troubleshooting"
description = "Finding and fixing problems in your Kubeflow deployment"
weight = 20
+++


## TensorFlow and AVX
There are some instances where you may encounter a TensorFlow-related Python installation or a pod launch issue that results in a SIGILL (illegal instruction core dump). Kubeflow uses the pre-built binaries from the TensorFlow project which, beginning with version 1.6, are compiled to make use of the [AVX](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions) CPU instruction. This is a recent feature and your CPU might not support it. Check the host environment for your node to determine whether it has this support.

Linux:
```
grep -ci avx /proc/cpuinfo
```

### AVX2
Some components requirement AVX2 for better performance, e.g. TF Serving.
To ensure the nodes support AVX2, we added
[minCpuPlatform](https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform)
arg in our deployment
[config](https://github.com/kubeflow/kubeflow/blob/master/scripts/gke/deployment_manager_configs/cluster.jinja#L105).

On GCP this will fail in regions (e.g. us-central1-a) that do not explicitly have Intel
Haswell (even when there are other newer platforms in the region).
In that case, please choose another region, or change the config to other
[platform](https://en.wikipedia.org/wiki/List_of_Intel_CPU_microarchitectures)
newer than Haswell.

## Minikube

On [Minikube](https://github.com/kubernetes/minikube) the Virtualbox/VMware drivers for Minikube are recommended as there is a known
issue between the KVM/KVM2 driver and TensorFlow Serving. The issue is tracked in [kubernetes/minikube#2377](https://github.com/kubernetes/minikube/issues/2377).

We recommend increasing the amount of resources Minikube allocates

```
minikube start --cpus 4 --memory 8096 --disk-size=40g
```

  * Minikube by default allocates 2048Mb of RAM for its VM which is not enough
    for JupyterHub.
  * The larger disk is needed to accommodate Kubeflow's Jupyter images which
    are 10s of GBs due to all the extra Python libraries we include.

If you just installed Minikube following instructions from the [quick start guide](https://kubernetes.io/docs/getting-started-guides/minikube/#installation), you most likely
created a VM with the default resources. You would want to recreate your Minikube with the appropriate resource settings.
```
minikube stop
minikube delete
minikube start --cpus 4 --memory 8096 --disk-size=40g
```

If you encounter a jupyter-xxxx pod in Pending status, described with:
```
Warning  FailedScheduling  8s (x22 over 5m)  default-scheduler  0/1 nodes are available: 1 Insufficient memory.
```
  * Then try recreating your Minikube cluster (and re-apply Kubeflow using ksonnet) with more resources (as your environment allows):

## RBAC clusters

If you are running on a Kubernetes cluster with [RBAC enabled](https://kubernetes.io/docs/admin/authorization/rbac/#command-line-utilities), you may get an error like the following when deploying Kubeflow:

```
ERROR Error updating roles kubeflow-test-infra.jupyter-role: roles.rbac.authorization.k8s.io "jupyter-role" is forbidden: attempt to grant extra privileges: [PolicyRule{Resources:["*"], APIGroups:["*"], Verbs:["*"]}] user=&{your-user@acme.com  [system:authenticated] map[]} ownerrules=[PolicyRule{Resources:["selfsubjectaccessreviews"], APIGroups:["authorization.k8s.io"], Verbs:["create"]} PolicyRule{NonResourceURLs:["/api" "/api/*" "/apis" "/apis/*" "/healthz" "/swagger-2.0.0.pb-v1" "/swagger.json" "/swaggerapi" "/swaggerapi/*" "/version"], Verbs:["get"]}] ruleResolutionErrors=[]
```

This error indicates you do not have sufficient permissions. In many cases you can resolve this just by creating an appropriate
clusterrole binding like so and then redeploying kubeflow

```commandline
kubectl create clusterrolebinding default-admin --clusterrole=cluster-admin --user=your-user@acme.com
```

  * Replace `your-user@acme.com` with the user listed in the error message.

If you're using GKE, you may want to refer to [GKE's RBAC docs](https://cloud.google.com/kubernetes-engine/docs/how-to/role-based-access-control) to understand
how RBAC interacts with IAM on GCP.

## Problems spawning Jupyter pods

If you're having trouble spawning Jupyter notebooks, check that the pod is getting
scheduled

```
kubectl -n ${NAMESPACE} get pods
```

  * Look for pods whose name starts with juypter
  * If you are using username/password auth with Jupyter the pod will be named

  ```
  jupyter-${USERNAME}
  ```

  * If you are using IAP on GKE the pod will be named

    ```
    jupyter-accounts-2egoogle-2ecom-3USER-40DOMAIN-2eEXT
    ```

    * Where USER@DOMAIN.EXT is the Google account used with IAP

Once you know the name of the pod do

```
kubectl -n ${NAMESPACE} describe pods ${PODNAME}
```

  * Look at the events to see if there are any errors trying to schedule the pod
  * One common error is not being able to schedule the pod because there aren't
    enough resources in the cluster.

## Pods stuck in Pending state

There are three pods that have Persistent Volume Claims (PVCs) that will get stuck in pending state if they are unable to bind their PVC. The three pods are minio, mysql, and vizier-db.
Check the status of the PVC requests

```
kubectl -n ${NAMESPACE} get pvc
```

  * Look for the status of "Bound"
  * PVC requests in "Pending" state indicate that the scheduler was unable to bind the required PVC. 

If you have not configured [dynamic provisioning] (https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) for your cluster, including a default storage class, then you must create a [persistent volume] (https://kubernetes.io/docs/concepts/storage/persistent-volumes/) for each of the PVCs.

You can use the example below to create local persistent volumes.

```commandline
sudo mkdir /mnt/pv[1-3]

kubectl create -f - <<EOF
kind: PersistentVolume
apiVersion: v1
metadata:
  name: pv-volume1
spec:
  storageClassName:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/pv1"
---
kind: PersistentVolume
apiVersion: v1
metadata:
  name: pv-volume2
spec:
  storageClassName:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/pv2"
---
kind: PersistentVolume
apiVersion: v1
metadata:
  name: pv-volume3
spec:
  storageClassName:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/pv3"
EOF
```
Once created the scheduler will successfully start the remaining three pods. The PVs may also be created prior to running any of the `kfctl.sh` commands.


## OpenShift
If you are deploying Kubeflow in an [OpenShift](https://github.com/openshift/origin) environment which encapsulates Kubernetes, you will need to adjust the security contexts for the ambassador and Jupyter-hub deployments in order to get the pods to run.

```commandline
oc adm policy add-scc-to-user anyuid -z ambassador
oc adm policy add-scc-to-user anyuid -z jupyter-hub
```
Once the anyuid policy has been set, you must delete the failing pods and allow them to be recreated in the project deployment.

You will also need to adjust the privileges of the tf-job-operator service account for TFJobs to run. Do this in the project where you are running TFJobs:

```commandline
oc adm policy add-role-to-user cluster-admin -z tf-job-operator
```

## Docker for Mac
The [Docker for Mac](https://www.docker.com/docker-mac) Community Edition now ships with Kubernetes support (1.9.2) which can be enabled from their edge channel. If you decide to use this as your Kubernetes environment on Mac, you may encounter the following error when deploying Kubeflow:

```commandline
ks apply default
ERROR Attempting to deploy to environment 'default' at 'https://127.0.0.1:8443', but cannot locate a server at that address
```

This error is due to the fact that the default cluster installed by Docker for Mac is actually set to `https://localhost:6443`. One option is to directly edit the generated `environments/default/spec.json` file to set the "server" variable to the correct location, then retry the deployment. However, it is preferable to initialize your ksonnet app using the desired kube config:

```commandline
kubectl config use-context docker-for-desktop
ks init my-kubeflow
```

## 403 API rate limit exceeded error

Because ksonnet uses GitHub to pull kubeflow, unless user specifies GitHub API token, it will quickly consume maximum API call quota for anonymous.
To fix this issue first create GitHub API token using this [guide](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/), and assign this token to GITHUB_TOKEN environment variable.

```commandline
export GITHUB_TOKEN=<< token >>
```

## ks apply produces error "Unknown variable: env"

Kubeflow requires a [specific version of ksonnet](/docs/started/requirements).
If you run `ks apply` with an older version of ksonnet you will likely get the error `Unknown variable: env` as illustrated below:

```shell
export KF_ENV=default
ks apply ${KF_ENV}
ERROR Error reading /Users/xxx/projects/devel/go/src/github.com/kubeflow/kubeflow/my-kubeflow/environments/nocloud/main.jsonnet: /Users/xxx/projects/devel/go/src/github.com/kubeflow/kubeflow/my-kubeflow/components/jupyterhub.jsonnet:8:49-52 Unknown variable: env

  namespace: if params.namespace == "null" then env.namespace else params.namespace
```

You can check the ksonnet version as follows:

```shell
ks version
```

If your ksonnet version is lower than what is specified in the [requirements](/docs/started/requirements), please upgrade it and follow the [guide](/docs/components/ksonnet) to recreate the app.

## ksonnet on Windows
There are some known issues with ksonnet and Windows. You might consider 
alternative solutions.

 * construct base object: Failed to filter components ([kubeflow #481](https://github.com/kubeflow/kubeflow/issues/481))
 * "ks apply" fails to correctly process paths in Windows shell ([ksonnet #382](https://github.com/ksonnet/ksonnet/issues/382))
 
