+++
title = "Troubleshooting Guide for Jupyter Notebooks"
description = "Fixing common problems of Jupyter notebook deployments on Kubeflow"
weight = 50
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

## Persistent Volumes and Persistent Volumes Claims

First, make sure that [Persistent Volumes Claims (PVCs)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) are bounded when using Jupyter notebooks. This should
not be a problem when using managed Kubernetes. But if you are using Kubernetes
on-prem, check out the guide to [Kubeflow on-prem in a multi-node Kubernetes cluster](/docs/other-guides/kubeflow-on-multinode-cluster/) if you are running Kubeflow in multi-node on-prem environment. Otherwise, look at the [Pods stuck in Pending State](/docs/other-guides/troubleshooting/#pods-stuck-in-pending-state) guide to troubleshoot this problem.

## Check the status of notebooks

Run the following commands replacing `${NOTEBOOK}` with your notebook file name:

```shell
kubectl get notebooks -o yaml ${NOTEBOOK}
kubectl describe notebooks ${NOTEBOOK}
```

Check the `events` section to make sure that there are no errors.

## Check the status of statefulsets

Make sure that the number of `statefulsets` equals the desired number. If it is
not the case, check for errors using the `kubectl describe`. 

```shell
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

```shell
kubectl get pod -o yaml ${NOTEBOOK}-0
```

* The name of the Pod should start with `jupyter`.
* If you are using username/password auth with Jupyter the pod will be named `jupyter-${USERNAME}`.
* If you are using [Identity-Aware Proxy (IAP)](https://cloud.google.com/iap/docs/concepts-overview) on [GKE](https://cloud.google.com/iap/docs/enabling-kubernetes-howto), the pod will be named as follows: `jupyter-accounts-2egoogle-2ecom-3USER-40DOMAIN-2eEXT`, where `USER@DOMAIN.EXT` is the Google account you used with IAP.

Once you know the name of the pod, run:

```shell
kubectl describe pod ${NOTEBOOK}-0
```

* Check the `events` for any errors trying to schedule the pod.
* One common error is not being able to schedule the pod because there aren't enough resources in the cluster.

If the error still persists, check for the errors in the logs of containers.

```shell
kubectl logs ${NOTEBOOK}-0
```

## Delete notebooks manually

It is possible to delete notebooks manually with the following command:

```shell
kubectl delete notebook ${NOTEBOOK}
```

Note that deleting the `statefulset` is not enough, it's necessary to delete the `notebook` resource.

## Note for GCP Users

If you're using Google Cloud, you may encounter an error, such as:

```
Type     Reason        Age                     From                    Message
----     ------        ----                    ----                    -------
Warning  FailedCreate  2m19s (x26 over 7m39s)  statefulset-controller  create Pod test1-0 in StatefulSet test1 failed error: pods "test1-0" is forbidden: error looking up service account kubeflow/default-editor: serviceaccount "default-editor" not found
```

To fix this problem, create a service account named `default-editor` with cluster-admin role.

```shell
kubectl create sa default-editor
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user default-editor
```
