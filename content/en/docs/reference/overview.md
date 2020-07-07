+++
title = "Reference Overview"
description = "Reference documentation for Kubeflow APIs and services."
weight = 1

+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


<a id="tfjob"></a>
## TFJob

TFJob is a Kubernetes
[custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
that you can use to run TensorFlow training jobs on Kubernetes. For help with
using TFJob with Kubeflow, see the [user guide](/docs/components/tftraining/).

API references:

  * [v1](/docs/reference/tfjob/v1/tensorflow/)
  * [v1beta2](/docs/reference/tfjob/v1beta2/tensorflow/)

<a id="pytorchjob"></a>
## PyTorchJob

PyTorchJob is a Kubernetes
[custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
that you can use to run PyTorch training jobs on Kubernetes. For help with
using PyTorch with Kubeflow, see the [user guide](/docs/components/pytorch/).

API references:

  * [v1](/docs/reference/pytorchjob/v1/pytorch/)
  * [v1beta2](/docs/reference/pytorchjob/v1beta2/pytorch/)

<a id="mpijob">

## MPIJob

MPIJob is a Kubernetes
[custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
that you can use to run allreduce-style distributed training jobs on Kubernetes. For help with
using MPIJob with Kubeflow, see the [user guide](/docs/components/mpi/).

API references:

  * [v1alpha2](/docs/reference/mpijob/v1alpha2/mpi/)

<a id="notebook-crd">

## Notebook

Notebook CRD is a Kubernetes
[custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
that you can use to manage Jupyter Notebook servers on Kubernetes. For help with
using notebooks with Kubeflow, see the [user guide](/docs/components/notebooks/).

API references:

  * [v1](/docs/reference/notebook/v1/)