+++
title = "Submit Kubernetes Resources"
description = "Submitting Kubernetes resources from a Jupyter notebook"
weight = 40
+++

Kubeflow assigns the `default-editor` service account to the Jupyter notebook
Pods. This service account is bound to the `kubeflow-edit` ClusterRole, which has namespace-scoped permissions to the many Kubernetes resources including:

* Pods
* Deployments
* Services
* Jobs
* TFJobs
* PyTorchJobs

You can get a full list of these permissions using:
```
kubectl describe clusterrole kubeflow-edit
```

You can therefore create the above Kubernetes resources directly from your
Jupyter notebook in Kubeflow. The Kubernetes
[`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
command-line tool is pre-installed in the notebook.

Run the following command in a Jupyter notebook cell to create Kubernetes
resources:

```
!kubectl create -f myspec.yaml
```

The `myspec.yaml` file should describe one of the above Kubernetes resources.
For information about the format of the YAML file, see the
[Kubernetes object guide](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/).

## Next steps

* See the guide to [setting up
  your Jupyter notebooks in Kubeflow](/docs/notebooks/setup/).
* Explore the [components of Kubeflow](/docs/components/), including custom
  Kubernetes resources.
