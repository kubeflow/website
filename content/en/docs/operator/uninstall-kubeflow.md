+++
title = "Uninstalling Kubeflow"
description = "Instructions for uninstalling Kubeflow with Kubeflow Operator"
weight = 15
+++

This guide describes how to delete the Kubeflow deployment when it is deployed with the Kubeflow Operator.

To delete the Kubeflow deployment, simply delete the KfDef custom resource from the cluster.

```shell
kubectl delete kfdef ${KUBEFLOW_DEPLOYMENT_NAME} -n ${KUBEFLOW_NAMESPACE}
```

Note: ${KUBEFLOW_DEPLOYMENT_NAME} and ${KUBEFLOW_NAMESPACE} are defined in the [Installing Kubeflow](/docs/operator/install-kubeflow) guide.

Besides the above approach, if the Kubeflow Operator is installed through the OLM console as outlined in the [Installing Kubeflow Operator](/docs/operator/install-kubeflow) guide, you can also delete the Kubeflow deployment through the console.
