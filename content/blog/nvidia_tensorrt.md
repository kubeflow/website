+++
title = "GPU-Accelerated Inference for Kubernetes with the NVIDIA TensorRT Inference Server and Kubeflow"
description = "Scaling inference with GPUs"
weight = 20
publishDate = 2018-09-13T09:52:19-07:00
draft = false
+++

The need to deploy and serve AI models in production-scale environments has increased in step with the rapid growth of machine learning (ML) and deep learning (DL) development. However, creating an inference solution to deploy these models is a difficult task.

Performance is critical since these AI-backed services most often power end-user applications. Support for multiple AI frameworks is also key because AI use cases — spanning recommender systems, convolutional networks, natural language processing, and more — often employ different ones.

The last mile when deploying in production environments is transitioning from a development setup to a production deployment cluster, since a large number of interconnected components must be integrated to enable portability and scalability.

To solve these challenges, NVIDIA has worked closely with the Kubeflow community to bring support for its new [NVIDIA TensorRT inference server](https://developer.nvidia.com/tensorrt) to Kubeflow.

## About NVIDIA TensorRT Inference Server

The NVIDIA TensorRT inference server is a containerized, production-ready AI inference server for data center deployments. It maximizes utilization of GPU servers, supports all the top AI frameworks, and provides metrics for dynamic deployments.

Capable of running multiple models (including versioned models or models from different frameworks) concurrently on the same GPU, it solves scaling problems with support for clusters that have multiple homogeneous or heterogeneous GPUs.

Figure 1 shows the internal architecture of the NVIDIA TensorRT inference server including how requests are scheduled to be sent to the model necessary to fulfill the client request. Client requests come in via HTTP or gRPC, depending on the developer’s choice. The requests are handled and passed on to the per-model scheduling queues, managed by the internal scheduler. Each request is passed through the appropriate model, whether it is for image classification, recommendation, or speech-to-text and so forth. The models are loaded onto GPU memory from the Model Repository and the Model Management component migrates models across and within GPUs based on model usage and resource availability. The result is sent back for response handling. Using HTTP endpoints, reporting metrics can be used to autoscale in your Kubernetes cluster. Figure 2 lists the metrics the NVIDIA TensorRT inference server provides.

<figure class="image">
					<img src="../tensorrt_inference_server.svg" alt="TensorRT Inference Server - Internal Diagram">
					<figcaption>Figure 1. The NVIDIA TensorRT inference server schedules client requests, handles the inference compute, and reports metrics.</figcaption>
</figure

<figure class="image">
					<img src="../tensorrt_metrics.svg" alt="TensorRT Inference Server - Metrics">
          <figcaption>Figure 2. The NVIDIA TensorRT inference server provides the above metrics for users to autoscale and monitor usage.</figcaption>
</figure>

The NVIDIA TensorRT inference server is one major component of a larger inference ecosystem. Figure 3 shows an example of this ecosystem including the NVIDIA TensorRT inference server microservice in collaboration with Kubeflow. Users can utilize their own components outside of the NVIDIA TensorRT inference server or use CNCF recommended components.

<figure class="image">
					<img src="../tensorrt_architecture.svg" alt="TensorRT Inference Server - Architecture">
          <figcaption>Figure 3. The NVIDIA TensorRT inference server enables flexible deployment of the inference model.</figcaption>
</figure>

## NVIDIA TensorRT Inference Server and Kubeflow
Kubernetes has become the platform of choice for managing containerized workloads. Kubeflow extends the platform to make machine learning composable, portable, and scalable.

Using the NVIDIA TensorRT inference server on a Kubernetes cluster facilitated by Kubleflow’s components enables a powerful ML/DL workflow and allows Kubeflow users to get maximum utilization of their NVIDIA GPUs when deploying models at scale. NVIDIA TensorRT inference server uses NVIDIA® CUDA® streams to exploit the GPU’s hardware scheduling capabilities to simultaneously execute multiple models.

## Getting Started Using the NVIDIA TensorRT Inference Server and Kubeflow
Getting started requires some initial setup. At a high level, start with setting up a Google Kubernetes Engine (GKE) cluster suitable for running the NVIDIA TensorRT inference server and install the NVIDIA CUDA driver on the GPU nodes. 

Once that’s complete, pull the NVIDIA TensorRT inference server image from the [NVIDIA GPU Cloud](https://www.nvidia.com/en-us/gpu-cloud/) (NGC) container registry using a Kubernetes secret. Next, configure and place your model repository into a Google Cloud Storage bucket. 

Then use the io.ksonnet.pkg.nvidia-inference-server prototype to generate Kubernetes YAML and deploy to that cluster. 

For a more detailed explanation and step-by-step guidance for this process, refer to this [GitHub repo](https://github.com/deadeyegoodwin/kubeflow/tree/deadeyegoodwin/trtserver/kubeflow/nvidia-inference-server).


## Learn More About Kubeflow and NVIDIA TensorRT Inference Server 
Using Kubeflow with the NVIDIA TensorRT inference server makes it simple to deploy GPU-accelerated inference services into data center production environments.

To get involved in the Kubeflow project, learn how to contribute [here](https://www.kubeflow.org/docs/about/contributing/) and try the [Getting Started with Kubeflow](https://www.kubeflow.org/docs/started/getting-started/).

For more information on the NVIDIA TensorRT inference server, please refer to the following resources:

  - [User Guide](https://docs.nvidia.com/deeplearning/sdk/inference-user-guide/index.html)
  - [Client SDK](https://github.com/NVIDIA/dl-inference-server)
  - [Release Notes](https://docs.nvidia.com/deeplearning/sdk/inference-release-notes/index.html)
  - [DevTalk Forum](https://devtalk.nvidia.com/default/board/262/container-inference-server/)

*Tripti Singhal (Product Manager – Deep Learning Software, NVIDIA) <br>
David Goodwin (Principal Software Engineer – Machine Learning, NVIDIA)*
