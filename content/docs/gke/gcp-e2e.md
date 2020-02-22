+++
title = "Tutorial: End-to-end Kubeflow on GCP"
description = "Training an MNIST model with Kubeflow on Google Cloud Platform"
weight = 90
+++

This guide walks you through an end-to-end example of Kubeflow on Google
Cloud Platform (GCP). By working through the guide, you learn
how to deploy Kubeflow on Kubernetes Engine (GKE), train an MNIST machine
learning model for image classification, and use the model for online inference
(also known as online prediction).

## Introductions

### Overview of GCP and GKE

Google Cloud Platform (GCP) is a suite of cloud computing services running
on Google infrastructure. The services include compute power, data storage,
data analytics, and machine learning.

The [Cloud SDK][cloud-sdk] is a set of tools that you can use to interact with
GCP from the command line, including the `gcloud` command and others.

[Kubernetes Engine][kubernetes-engine] (GKE) is a managed service on GCP where
you can deploy containerized applications. You describe the resources that your
application needs, and GKE provisions and manages the underlying
cloud resources.

Here's a list of the primary GCP services that you use when following this
guide:

  * [GKE][kubernetes-engine]
  * [Compute Engine][compute-engine]
  * [Container Registry][container-registry]
  * [Cloud Storage][cloud-storage]

### The model and the data

This tutorial trains a [TensorFlow][tensorflow] model on the
[MNIST dataset][mnist-data], which is the *hello world* for machine learning.

The MNIST dataset contains a large number of images of hand-written digits in
the range 0 to 9, as well as the labels identifying the digit in each image.

After training, the model can classify incoming images into 10 categories
(0 to 9) based on what it's learned about handwritten images. In other words,
you send an image to the model, and the model does its best to identify the
digit shown in the image.
<img src="/docs/images/gcp-e2e-ui-prediction.png"
    alt="Prediction UI"
    class="mt-3 mb-3 p-3 border border-info rounded">

In the above screenshot, the image shows a hand-written **7**. This image was
the input to the model. The table below the image shows a bar graph for each
classification label from 0 to 9, as output by the model. Each bar
represents the probability that the image matches the respective label.
Judging by this screenshot, the model seems pretty confident that this image
is a 7.

### The overall workflow

The following diagram shows what you accomplish by following this guide:

<img src="/docs/images/kubeflow-gcp-e2e-tutorial.svg" 
  alt="ML workflow for training and serving an MNIST model"
  class="mt-3 mb-3 border border-info rounded">


In summary:

* Setting up [Kubeflow][kubeflow] in a [GKE][kubernetes-engine]
  cluster.

* Testing the code locally using a 
  [Jupyter notebook][https://jupyter-notebook.readthedocs.io].

* Training the model:

  * Packaging a TensorFlow program in a [Kubernetes][kubernetes] container.
  * Uploading the container to [Container Registry][container-registry].
  * Submitting a TensorFlow training ([tf.train][tf-train]) job.

* Using the model for prediction (inference):

  * Saving the trained model to [Cloud Storage][cloud-storage].
  * Using [TensorFlow Serving][tf-serving] to serve the model.
  * Running a simple web app to send a prediction request to the model and
    display the result.

It's time to get started!

## Run the MNIST tutorial on GCP

1. Follow the [GCP instructions](/docs/gke/deploy/) to deploy Kubeflow with 
  Cloud Identity-Aware Proxy (IAP).

1. Launch a Jupyter notebook in your Kubeflow cluster. See the guide to
  [setting up your 
  notebooks](/docs/notebooks/setup/#create-a-jupyter-notebook-server-and-add-a-notebook).
  *Note:* This tutorial has been tested with the *Tensorflow 1.15 CPU* image
  as the baseline image for the notebook.

1. Launch a terminal in Jupyter and clone the Kubeflow examples repository:

   ```
   git clone https://github.com/kubeflow/examples.git git_kubeflow-examples
   ```

   * **Tip**: When you start a terminal in Jupyter, run the command `bash` to start
      a bash terminal which is much more friendly than the default shell.

   * **Tip**: You can change the URL for your notebook from '/tree' to '/lab' to switch to using JupyterLab.

1. Open the notebook `mnist/mnist_gcp.ipynb`.

1. Follow the instructions in the notebook to train and deploy MNIST on Kubeflow.


[mnist-data]: http://yann.lecun.com/exdb/mnist/index.html

[tensorflow]: https://www.tensorflow.org/
[tf-train]: https://www.tensorflow.org/api_guides/python/train
[tf-serving]: https://www.tensorflow.org/serving/

[kubernetes]: https://kubernetes.io/
[kubernetes-engine]: https://cloud.google.com/kubernetes-engine/
[container-registry]: https://cloud.google.com/container-registry/
[cloud-storage]: https://cloud.google.com/storage/
[compute-engine]: https://cloud.google.com/compute/
[cloud-sdk]: https://cloud.google.com/sdk/docs/
[kubeflow]: https://www.kubeflow.org/
