+++
title = "Requirements"
description = "Requirements for Kubeflow"
weight = 5
+++

The guides in this section give detailed information about using Kubeflow and 
its components.

For best understanding of the guides, it's useful to have some knowledge of
the following systems:

* [Kubernetes](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
* [TensorFlow](https://www.tensorflow.org/get_started/)
* [kustomize](https://kustomize.io/)

## Kubeflow requirements

 * kustomize version {{% kustomize-min-version %}} or later. See the 
   [kustomize component guide](https://github.com/kubeflow/manifests#using-kustomize) for details about
   installing kustomize.
 * An existing Kubernetes cluster using Kubernetes version 
   {{% kubernetes-min-version %}} or later:

   * A minimum of 0.6 CPU in cluster (Reserved for 3 replicated ambassador pods and according to your need add additional CPUs)
   * Node with storage >= 10 GB (Due to the ML libraries and third party packages being bundled in Kubeflow Docker images)
