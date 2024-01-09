+++
title = "Troubleshooting"
description = "Problems and solutions for common problems with Kubeflow Notebooks"
weight = 100
                    
+++

## ISSUE: notebook not starting

### SOLUTION: check events of Notebook

Run the following command then check the `events` section to make sure that there are no errors:

```shell
kubectl describe notebooks "${MY_NOTEBOOK_NAME}" --namespace "${MY_PROFILE_NAMESPACE}"
```

### SOLUTION: check events of Pod

Run the following command then check the `events` section to make sure that there are no errors:

```shell
kubectl describe pod "${MY_NOTEBOOK_NAME}-0" --namespace "${MY_PROFILE_NAMESPACE}"
```

### SOLUTION: check YAML of Pod

Run the following command and check the Pod YAML looks as expected:

```shell
kubectl get pod "${MY_NOTEBOOK_NAME}-0" --namespace "${MY_PROFILE_NAMESPACE}" -o yaml
```

### SOLUTION: check logs of Pod

Run the following command to get the logs from the Pod:

```shell
kubectl logs "${MY_NOTEBOOK_NAME}-0" --namespace "${MY_PROFILE_NAMESPACE}"
```

## ISSUE: manually delete notebook

### SOLUTION: use kubectl to delete Notebook resource

Run the following command to delete a Notebook resource manually:

```shell
kubectl delete notebook "${MY_NOTEBOOK_NAME}" --namespace "${MY_PROFILE_NAMESPACE}"
```