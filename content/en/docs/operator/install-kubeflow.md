+++
title = "Installing Kubeflow"
description = "Instructions for Kubeflow deployment with Kubeflow Operator"
weight = 10
+++

This guide describes how to use the Kubeflow Operator to deploy Kubeflow. As mentioned in the Operator [introduction](/docs/operator/introduction.md), the Operator also allows you to monitor and manage the Kubeflow installation beyond the initial installation.

## Prerequisites

* Kubeflow Operator needs to be deployed on your cluster for rest of steps to work. Please follow the [`Install the Kubeflow Operator`](/docs/operator/install-operator) guide to install the Kubeflow Operator

## Deployment Instructions

The Kubeflow Operator uses the KfDef as its custom resource. You can compose a KfDef configuration or pick a default KfDef from the Kubeflow [manifests](https://github.com/kubeflow/manifests/tree/master/kfdef) repo. Keep in mind choosing the release that will work with the Kubeflow Operator.

### Prepare KfDef configuration

The `metadata.name` field must be set for the KfDef manifests whether it is downloaded from the Kubeflow manifests repo or is originally written. Following example shows how to prepare the KfDef manifests

```shell
# download a default KfDef configuration from remote repo
export KFDEF_URL=https://raw.githubusercontent.com/kubeflow/manifests/v1.1-branch/kfdef/kfctl_ibm.yaml
export KFDEF=$(echo "${KFDEF_URL}" | rev | cut -d/ -f1 | rev)
curl -L ${KFDEF_URL} > ${KFDEF}

# add metadata.name field
# Note: yq can be installed from https://github.com/mikefarah/yq
export KUBEFLOW_DEPLOYMENT_NAME=kubeflow
yq w ${KFDEF} 'metadata.name' ${KUBEFLOW_DEPLOYMENT_NAME} > ${KFDEF}.tmp && mv ${KFDEF}.tmp ${KFDEF}
```

### Deploy the Kubeflow with the Kubeflow Operator

Kubeflow Operator is watching on any KfDef resource in the Kubernetes cluster. Depends on how the operator is installed, there are a couple of ways to start the Kubeflow deployment. You can always manually run with following commands

```shell
# create the namespace for Kubeflow deployment
KUBEFLOW_NAMESPACE=kubeflow
kubectl create ns ${KUBEFLOW_NAMESPACE}

# create the KfDef custom resource
kubectl create -f ${KFDEF} -n ${KUBEFLOW_NAMESPACE}
```

Note: in the example above, ${KFDEF} points to a local KfDef configuration file, however, it can also points to a remote URL containing a valid KfDef configuration.

### Watch the deployment progress

The Kubeflow deployment is carried on by the operator, you can watch the progress with this command

```shell
kubectl logs deployment/kubeflow-operator -n ${OPERATOR_NAMESPACE} -f
```

Verify the Kubeflow deployment by monitoring the pods in the ${KUBEFLOW_NAMESPACE}

```shell
kubectl get pod -n ${KUBEFLOW_NAMESPACE}

NAME                                                     READY   STATUS    RESTARTS   AGE
admission-webhook-bootstrap-stateful-set-0               1/1     Running   3          2m26s
admission-webhook-deployment-5bc5f97cfd-chjnm            1/1     Running   2          46s
application-controller-stateful-set-0                    1/1     Running   0          2m30s
argo-ui-669bcd8bfc-5dk5c                                 1/1     Running   0          45s
cache-deployer-deployment-b75f5c5f6-42n6l                2/2     Running   1          45s
cache-server-85bccd99bd-tfrnr                            2/2     Running   0          44s
centraldashboard-8849f64cf-l45zc                         1/1     Running   0          44s
jupyter-web-app-deployment-6c568f4cbc-pd68m              1/1     Running   0          43s
kubeflow-pipelines-profile-controller-846cc56f44-cmbbf   1/1     Running   0          43s
metacontroller-0                                         1/1     Running   0          96s
metadata-writer-59d755696c-fh6px                         2/2     Running   0          43s
minio-d45d44d4f-rmxft                                    1/1     Running   0          42s
ml-pipeline-6bc56cd86d-kn7zt                             1/2     Running   0          42s
ml-pipeline-persistenceagent-6f99b56974-x2f52            2/2     Running   0          41s
ml-pipeline-scheduledworkflow-d596b8bd-qdz6m             2/2     Running   0          41s
ml-pipeline-ui-8695cc6b46-hr8p5                          2/2     Running   0          40s
ml-pipeline-viewer-crd-5998ff7f56-5rn4s                  2/2     Running   2          40s
ml-pipeline-visualizationserver-cbbb5b5b-w7rbd           2/2     Running   0          39s
mysql-76597cf5b5-jpsrx                                   1/2     Running   0          39s
notebook-controller-deployment-756587d86-fffg8           1/1     Running   0          38s
profiles-deployment-865b78d47f-pbgl4                     2/2     Running   0          38s
workflow-controller-54dccb7dc4-hkg9s                     1/1     Running   0          37s
```
