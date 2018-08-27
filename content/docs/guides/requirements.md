+++
title = "Requirements"
description = "Requirements"
weight = 10
toc = true
bref= "This guide will walk you through the basics of deploying and interacting with Kubeflow. Some understanding of Kubernetes, Tensorflow, and Ksonnet are useful in completing the contents of this guide."
aliases = ["/docs/guides/"]
[menu.docs]
  parent = "guides"
  weight = 1
+++

* [Kubernetes](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
* [TensorFlow](https://www.tensorflow.org/get_started/)
* [ksonnet](https://ksonnet.io/docs/tutorial)

For an end to end example illustrating in details how to deploy kubeflow and run a training job from scratch, check out this [tutorial](https://ai.intel.com/lets-flow-within-kubeflow/).

 * ksonnet version {{% ksonnet-min-version %}} or later. See the [ksonnet component page](/docs/guides/components/ksonnet/) for an explanation of why we use ksonnet.
 * An existing Kubernetes cluster using Kubernetes {{% kubernetes-min-version %}} or later:
   * A minimum of 0.6 CPU in cluster (Reserved for 3 replicated ambassador pods and according to your need add additional CPUs)
   * Node with storage >= 10 GB (Due to the ML libraries and third party packages being bundled in Kubeflow Docker images)


