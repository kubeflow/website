+++
title = "Troubleshooting Guide"
description = "Fixing common problems in Kubeflow notebooks"
weight = 50
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

## Persistent Volumes and Persistent Volumes Claims

First, make sure that PVCs are bounded when using Jupter notebooks. This should
not be a problem when using managed Kuberenetes. But if you are using Kubernetes
on-prem, check out the guide to [Kubeflow on-prem in a multi-node Kubernetes cluster](/docs/other-guides/kubeflow-on-multinode-cluster/) if you are running Kubeflow in multi-node on-prem environment. Otherwise, look at the [Pods stuck in Pending State](/docs/other-guides/troubleshooting/#pods-stuck-in-pending-state) guide to troubleshoot this problem.

## Check the status of notebooks

Run the commands below.

```
kubectl get notebooks -o yaml ${NOTEBOOK}
kubectl describe notebooks ${NOTEBOOK}
```

Check the `events` section to make sure that there are no errors.

## Check the status of statefulsets

Make sure that the number of `statefulsets` equals the desired number. If it is
not the case, check for errors using the `kubectl describe`. 


```
kubectl get statefulsets -o yaml ${NOTEBOOK}
kubectl describe statefulsets ${NOTEBOOK}
```


The output should look like below:
```
NAME            DESIRED   CURRENT   AGE
your-notebook   1         1         9m4s
```
## Check the status of Pods

If the number of statefulsets didn't match the desired number, make sure that 
the number of Pods match the number of desired Pods in the first  command. 
In case it didn't match, follow the steps below to further investigate the issue.

```
kubectl get pod -o yaml ${NOTEBOOK}-0
```

* The name of the Pod should start with `jupyter`
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
kubectl describe pod ${NOTEBOOK}-0
```

* Look at the `events` to see if there are any errors trying to schedule the pod
* One common error is not being able to schedule the pod because there aren’t enough resources in the cluster.


If the error still persisted, check for the errors in the logs of containers.

```
kubectl logs ${NOTEBOOK}-0
```

## Note for GCP Users

You may encounter error below:
```
Type     Reason        Age                     From                    Message
----     ------        ----                    ----                    -------
Warning  FailedCreate  2m19s (x26 over 7m39s)  statefulset-controller  create Pod test1-0 in StatefulSet test1 failed error: pods "test1-0" is forbidden: error looking up service account kubeflow/default-editor: serviceaccount "default-editor" not found
```

To fix this problem, create a service account named `default-editor` with cluster-admin role.

```
kubectl create sa default-editor
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user default-editor
```
