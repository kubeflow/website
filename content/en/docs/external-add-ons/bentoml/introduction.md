+++
title = "Introduction"
description = "A brief introduction to BentoML Yatai"
weight = 1
+++

## What is BentoML?

[BentoML](https://github.com/bentoml/BentoML) is an open-source framework for high-performance ML model serving. 
It provides a standard interface for defining a prediction service with support for multiple ML frameworks, including PyTorch, TensorFlow, Scikit-Learn, XGBoost, and more. 
BentoML also provides a model management system for packaging, deploying, and managing models in production.

## What is BentoML Yatai?

[BentoML Yatai](https://github.com/bentoml/Yatai) helps you run BentoML on Kubernetes clusters.
It provides a central hub for managing BentoML services and models, and a set of Kubernetes operators for deploying BentoML services as microservices in a Kubernetes cluster.

### Kubeflow Integration

Starting with the release of Kubeflow 1.7, BentoML provides a native integration with Kubeflow through Yatai.
This integration allows you to package models trained in Kubeflow notebooks or pipelines, and deploy them as microservices in a Kubernetes cluster through BentoML's cloud native components and custom resource definitions (CRDs). 

This documentation provides a comprehensive guide on how to use BentoML and Kubeflow together to streamline the process of deploying models at scale.

## Example: Fraud Detection on Kubeflow

In this tutorial, we will deploy a fraud detection application that determines whether a transaction is fraudulent by simultaneously calling three models trained with the [Kaggle IEEE-CIS Fraud Detection dataset](https://www.kaggle.com/c/ieee-fraud-detection) in the Kubeflow notebook. 

We have already built and uploaded the application as a [Bento](https://docs.bentoml.org/en/latest/concepts/bento.html), an archive with all the source code, models, data files and dependency configurations required for running the application. 
If you're interested in learning how to train the models and build the Bento, see the [Fraud Detection on Kubeflow](https://github.com/bentoml/BentoML/tree/main/examples/kubeflow) example project. 

Here we will focus on the two deployment workflows using BentoML's Kubernetes operators:

1. deploying directly from the Bento
2. deploying from an OCI image built from the Bento

All source code for model training, service definition, and Kubernetes deployment can be found in the [Fraud Detection on Kubeflow](https://github.com/bentoml/BentoML/tree/main/examples/kubeflow) example.

<img src="https://user-images.githubusercontent.com/861225/226851915-141ccf42-0374-4b68-89bd-450c8edf1c06.png" class="mt-3 mb-3 p-3 border border-info rounded"></img>

### Prerequisites

Before starting this tutorial, make sure you have the following:

* A Kubernetes cluster and `kubectl` installed on your local machine.
    * `kubectl` install instruction: https://kubernetes.io/docs/tasks/tools/install-kubectl/
* Kubeflow and BentoML Yatai installed in the Kubernetes cluster.
    * Kubeflow manifests: https://github.com/kubeflow/manifests 
    * BentoML Yatai manifests: https://github.com/kubeflow/manifests/tree/master/contrib/bentoml
* Docker and Docker Hub installed and configured in your local machine.
    * Docker install instruction: https://docs.docker.com/get-docker/
* Python 3.8 or above and required PyPI packages: `bentoml`
    * `pip install bentoml`

### Deploy to Kubernetes Cluster

BentoML offers three custom resource definitions (CRDs) in the Kubernetes cluster.

- [BentoRequest](https://docs.bentoml.org/projects/yatai/en/latest/concepts/bentorequest_crd.html) - Describes the metadata needed for building the container image of the Bento, such as the download URL. Created by the user and reconciled by the `yatai-image-builder` operator.
- [Bento](https://docs.bentoml.org/projects/yatai/en/latest/concepts/bento_crd.html) - Describes the metadata for the Bento such as the address of the image. Created by users or by the `yatai-image-builder` operator after reconciling the `BentoRequest` resources.
- [BentoDeployment](https://docs.bentoml.org/projects/yatai/en/latest/concepts/bentodeployment_crd.html) - Describes the metadata of the deployment such as resources and autoscaling behaviors. Reconciled by the `yatai-deployment` operator to create Kubernetes deployments of API Servers and Runners.

Next, we will demonstrate two ways of deployment.

1. Deploying using a `BentoRequest` resource by providing a Bento
2. Deploying Using a `Bento` resource by providing a pre-built container image from a Bento

### Deploy with BentoRequest CRD

In this workflow, we will use the `yatai-image-builder` operator to download and containerize the Bento and push the resulting OCI image to a remote registry. We will then use the `yatai-deployment` operator to deploy the containerized Bento image.

Apply the `BentoRequest` and `BentoDeployment` resources as defined in [deployment_from_bentorequest.yaml](https://raw.githubusercontent.com/bentoml/BentoML/main/examples/kubeflow/deployment_from_bentorequest.yaml).

```bash
curl -s https://raw.githubusercontent.com/bentoml/BentoML/main/examples/kubeflow/deployment_from_bentorequest.yaml | kubectl apply -f -
```

Once the resources are created, the `yatai-image-builder` operator will reconcile the `BentoRequest` resource and spawn a pod to download and build the container image from the provided Bento defined in the resource.

The `yatai-image-builder` operator will push the built image to the container registry specified during the installation and create a `Bento` resource with the same name.
At the same time, the `yatai-deployment` operator will reconcile the `BentoDeployment` resource with the provided name and create Kubernetes deployments of API Servers and Runners from the container image specified in the `Bento` resource.

### Deploy with Bento CRD

In this workflow, we will build and push the container image from the Bento. We will then leverage the `yatai-deployment` operator to deploy the containerized Bento image.

Download and import the Bento for the Fraud Detection application, `fraud_detection.bento`.

```bash
curl -k https://bentoml.com.s3.amazonaws.com/kubeflow/fraud_detection.bento -o fraud_detection.bento
bentoml import fraud_detection.bento
```

Containerize the image through `containerize` sub-command.

```bash
bentoml containerize fraud_detection:o5smnagbncigycvj -t your-username/fraud_detection:o5smnagbncigycvj
```

Push the containerized Bento image to a remote repository of your choice.

```bash
docker push your-username/fraud_detection:o5smnagbncigycvj
```

Update the image to the address of your repository and apply the `Bento` and `BentoDeployment` resources as defined in [deployment_from_bento.yaml](https://raw.githubusercontent.com/bentoml/BentoML/main/examples/kubeflow/deployment_from_bento.yaml).

```bash
curl -s https://raw.githubusercontent.com/bentoml/BentoML/main/examples/kubeflow/deployment_from_bento.yaml | kubectl apply -f -
```

Once the resources are created, the `yatai-deployment` operator will reconcile the `BentoDeployment` resource with the provided name and create Kubernetes deployments of API Servers and Runners from the container image specified in the `Bento` resource.

### Verify Deployment

Verify the deployment of API Servers and Runners. Note that API server and runners are run in separate pods and created in separate deployments that can be scaled independently.

```bash
kubectl -n kubeflow get pods -l yatai.ai/bento-deployment=fraud-detection

NAME                                        READY   STATUS    RESTARTS   AGE
fraud-detection-67f84686c4-9zzdz            4/4     Running   0          10s
fraud-detection-runner-0-86dc8b5c57-q4c9f   3/3     Running   0          10s
fraud-detection-runner-1-846bdfcf56-c5g6m   3/3     Running   0          10s
fraud-detection-runner-2-6d48794b7-xws4j    3/3     Running   0          10s
```

Port forward the Fraud Detection service to test locally.
You should be able to visit the Swagger page of the service by requesting http://0.0.0.0:8080 while port forwarding.

```bash
kubectl -n kubeflow port-forward svc/fraud-detection 8080:3000 --address 0.0.0.0
```

### Conclusion

Congratulations! You completed the example.

Let's recap what we have learned:

- Trained three fraud detection models and saved them to the BentoML model store.
- Created a BentoML service that runs inferences on all three models simultaneously, combines and returns the results.
- Containerized the BentoML service into an OCI image and pushed the image to a remote repository.
- Created BentoML CRDs on Kubernetes to deploy the Bento in a microservice architecture.

## Additional Resources

* [GitHub repository](https://github.com/bentoml/BentoML)
* [BentoML documentation](https://docs.bentoml.org)
* [Quick start tutorial](https://docs.bentoml.org/en/latest/tutorial.html)
* [Community Slack](https://l.linklyhq.com/l/ktIc)
