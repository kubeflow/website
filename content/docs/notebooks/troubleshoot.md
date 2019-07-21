+++
title = "Troubleshooting Guide"
description = "Fixing common problems in Kubeflow notebooks"
weight = 50
+++

## Persistent Volumes and Persistent Volumes Claims

First, make sure that PVCs are bounded when using jupter notebooks. This should
not be a problem when using managed Kuberenets. But if you are using Kubernetes
on-prem, checkout this guide.

## Check for errors in Pods


Run the commands below.

```
kubectl get notebooks -o yaml ${NOTEBOOK}
kubectl describe notebooks ${NOTEBOOK}
```

Make sure that the number of Pods match the number of desired Pods in the first 
command. In case it didn't match run the command below and check for any errors
in the `events` section.


## Check the status of statufulsets

```
kubectl get statefulsets -o yaml ${NOTEBOOK}
kubectl describe statefulsets ${NOTEBOOK}
```


