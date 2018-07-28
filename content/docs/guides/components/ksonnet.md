+++
title = "Ksonnet"
description = "Ksonnet information related to Kubeflow"
weight = 10
toc = true
[menu]
[menu.docs]
  parent = "components"
  weight = 20
+++

## Creating a ksonnet application

We will be using Ksonnet to deploy kubeflow into your existing cluster. The commands below will the cluster currently
used by `kubectl` and create the namespace `kubeflow`.


```
export KUBEFLOW_VERSION=0.2.2
export KUBEFLOW_KS_DIR=</path/to/store/your/ksonnet/application>
export KUBEFLOW_DEPLOY=false
curl https://raw.githubusercontent.com/kubeflow/kubeflow/v${KUBEFLOW_VERSION}/scripts/deploy.sh | bash
```

This will create a ksonnet application in ${KUBEFLOW_KS_DIR}. Refer to [deploy.sh](https://github.com/kubeflow/kubeflow/blob/v0.2-branch/scripts/deploy.sh)
to see the individual commands run.

**Important**: The commands above will enable collection of **anonymous** user data to help us improve Kubeflow. Do disable usage collection you
can run the following commands

```
cd ${KUBEFLOW_KS_DIR}
ks param set kubeflow-core reportUsage false
```

You can now deploy Kubeflow as follows

```
cd ${KUBEFLOW_KS_DIR}
ks apply default
```



## Why Kubeflow uses Ksonnet

[Ksonnet](https://ksonnet.io/) is a command line tool that makes it easier to manage complex deployments consisting of multiple components. It is designed to
work side by side with kubectl.

Ksonnet allows us to generate Kubernetes manifests from parameterized templates. This makes it easy to customize Kubernetes manifests for your
particular use case. In the examples above we used this functionality to generate manifests for TfServing with a user supplied URI for the model.

One of the reasons we really like ksonnet is because it treats [environment](https://ksonnet.io/docs/concepts#environment) as in (dev, test, staging, prod) as a first class concept. For each environment we can easily deploy the same components but with slightly different parameters
to customize it for a particular environments. We think this maps really well to common workflows. For example, this feature makes it really
easy to run a job locally without GPUs for a small number of steps to make sure the code doesn't crash, and then easily move that to the
Cloud to run at scale with GPUs.



