+++
title = "Uninstalling Kubeflow Operator"
description = "Instructions for uninstalling Kubeflow Operator"
weight = 20
+++

This guide describes how to uninstall the Kubeflow Operator.

You can always uninstall the operator with following commands

```shell
# switch to the cloned kfctl directory
cd kfctl

# uninstall the operator
kubectl delete -f deploy/operator.yaml -n ${OPERATOR_NAMESPACE}
kubectl delete clusterrolebinding kubeflow-operator
kubectl delete -f deploy/service_account.yaml -n ${OPERATOR_NAMESPACE}
kubectl delete -f deploy/crds/kfdef.apps.kubeflow.org_kfdefs_crd.yaml
kubectl delete ns ${OPERATOR_NAMESPACE}
```
