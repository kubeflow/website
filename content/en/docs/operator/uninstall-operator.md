+++
title = "Uninstalling Kubeflow Operator"
description = "Instructions for uninstalling Kubeflow Operator"
weight = 20
+++

This guide describes how to uninstall the Kubeflow Operator.

If the Kubeflow Operator is installed through the OLM console, it can be uninstalled through the console. Navigate to the `Installed Operators` page and find the Kubeflow Operator. Choose the `Uninstall Operator` option to uninstall the operator.

<img src="/docs/images/operator-uninstall-kubeflow.png" 
    alt="Uninstall Kubeflow Operator in OLM console"
    class="mt-3 mb-3 border border-info rounded">

Alternately you can always uninstall the operator with following commands

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
