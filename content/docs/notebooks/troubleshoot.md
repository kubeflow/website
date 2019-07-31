+++
title = "Troubleshooting Guide"
description = "Fixing common problems in Kubeflow notebooks"
weight = 50
+++

## Persistent Volumes and Persistent Volumes Claims

First, make sure that PVCs are bounded when using jupter notebooks. This should
not be a problem when using managed Kuberenets. But if you are using Kubernetes
on-prem, checkout [https://www.kubeflow.org/docs/use-cases/kubeflow-on-multinode-cluster/](this) guide.

## Check the status of notebooks


Run the commands below.

```
kubectl get notebooks -o yaml ${NOTEBOOK}
kubectl describe notebooks ${NOTEBOOK}
```

Check the `events` section to make sure that there is not any errors.

## Check the status of statufulsets

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
In case it didn't match run the command below and check for any errors 
in the `events` section.

```
kubectl get pod -o yaml ${NOTEBOOK}-0
kubectl describe pod ${NOTEBOOK}-0
```

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
kubectl create clusterrolebinding default-editor \
  --clusterrole=cluster-admin \
  --group=system:serviceaccounts
```
