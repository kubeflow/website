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
* [ksonnet](https://ksonnet.io/docs/tutorial)

## Kubeflow requirements

 * ksonnet version {{% ksonnet-min-version %}} or later. See the [ksonnet component page](/docs/components/ksonnet/) for an explanation of why we use ksonnet.
 * An existing Kubernetes cluster using Kubernetes {{% kubernetes-min-version %}} or later:
   * A minimum of 0.6 CPU in cluster (Reserved for 3 replicated ambassador pods and according to your need add additional CPUs)
   * Node with storage >= 10 GB (Due to the ML libraries and third party packages being bundled in Kubeflow Docker images)



