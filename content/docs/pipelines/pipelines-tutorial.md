+++
title = "Pipelines end-to-end guide"
description = "An end-to-end tutorial for Kubeflow Pipelines"
weight = 3
+++

This guide walks you through a Kubeflow Pipelines sample that runs an MNIST
machine learning (ML) model on Google Cloud Platform (GCP). By working through
the guide, you learn how to deploy Kubeflow on Kubernetes Engine (GKE) and run
a pipeline supplied as a Python sample. The pipeline trains an MNIST model for
image classification and uses the model for online inference
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
cloud resources automatically.

Here's a list of the primary GCP services that you use when following this
guide:

  * [Deployment Manager][deployment-manager]
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

## Set up your environment

Let's get started!

### Set up your GCP account and SDK

Follow these steps to set up your GCP environment:

1. Select or create a project on the [GCP Console][gcp-console].
1. Make sure that billing is enabled for your project. See the guide to
  [modifying a project's billing settings][billing-guide].
1. Install the [Cloud SDK][cloud-sdk].

Notes:

* As you work through this tutorial, your project uses billable components of
  GCP. To minimise costs, follow the instructions to
  [clean up your GCP resources](#cleanup) when you've finished with them.
* This guide assumes you want to manage your GCP environment on your own server
  rather than in the [Cloud Shell][cloud-shell] environment. If you choose to
  use the Cloud Shell, some of the components are pre-installed in your shell.

### (Optional) Install kubectl

`kubectl` is the command-line tool for Kubernetes. It's useful if you want
to interact with your Kubeflow cluster locally. If you decide not to use it,
you can skip the steps later in the tutorial that use the command.

Run the following Cloud SDK command to install `kubectl`:

```
gcloud components install kubectl
```

### Set up some handy environment variables

TODO(sarahmaddox): WE DON'T NEED TO DO THIS WHEN THE MNIST MODEL ACCEPTS PARAM VARIABLES.

Set up the following environment variables for use throughout the tutorial:

1. Set your GCP project ID. In the command below, replace `<YOUR-PROJECT-ID>` 
  with your [project ID][gcp-project-id]:

    ```
    export PROJECT=<YOUR-PROJECT-ID>
    gcloud config set project ${PROJECT}
    ```

1. Set the zone for your GCP configuration. Choose a zone that offers the
  resources you need. See the guide to [GCP regions and zones][regions-zones].
    * Ensure you have enough Compute Engine regional capacity.
      By default, the GKE cluster setup described in this guide
      requires 16 CPUs.
    * If you want a GPU, ensure your zone offers GPUs.

    For example, the following commands set the zone to `us-central1-c`:

    ```
    export ZONE=us-central1-c
    gcloud config set compute/zone ${ZONE}
    ```

1. If you want a custom name for your Kubeflow deployment, set the 
   `DEPLOYMENT_NAME` environment variable. Note that the name must be the same 
   as the one you use in later steps of this tutorial when configuring the 
   **redirect URI** for the OAuth client credentials. If you don't set this 
   environment variable, your deployment gets the default name of `kubeflow`:

    ```
    export DEPLOYMENT_NAME=kubeflow
    ```

### Deploy Kubeflow

Deploy Kubeflow on GCP:

1. Follow the instructions in the 
  [GKE getting-started guide](/docs/started/getting-started-gke), 
  taking note of the following:

  * Set up **OAuth client credentials** and **Cloud Identity-Aware Proxy (IAP)**
    as prompted during the deployment process. So, **do not choose the deployment 
    option to skip IAP**. IAP ensures you can connect securely to the Kubeflow
    web applications.
  * When setting up the **authorized redirect URI** for the **OAuth client 
    credentials**, use the same value for the `<deployment_name>` as you used
    when setting up the `DEPLOYMENT_NAME` environment variable earlier in this
    tutorial.
  * Use the Kubeflow **deployment UI** as a quick way to set up a Kubeflow 
    deployment on GCP. The getting-started guide describes how to use the
    deployment UI. If you want more control over the configuration of your
    deployment you can use the `kfctl.sh` script instead of the UI. The script
    is also described in the getting-started guide.
  * Choose **Kubeflow version v0.4.1** or later.

    The following screenshot shows the Kubeflow deployment UI with hints about
    the value for each input field:

    <img src="/docs/images/gcp-e2e-deploy-kubeflow.png" 
        alt="Prediction UI"
        class="mt-3 mb-3 p-3 border border-info rounded">

1. (Optional) Use 'kubectl' to connect to your cluster:

  * Connect your local `kubectl` session to the cluster:

      ```
      gcloud container clusters get-credentials \
          ${DEPLOYMENT_NAME} --zone ${ZONE} --project ${PROJECT}
      ```

  * Switch to the `kubeflow` namespace to see the resources on the Kubeflow 
    cluster:

      ```
      kubectl config set-context $(kubectl config current-context) --namespace=kubeflow
      ```

  * Check the resources deployed in the `kubeflow` namespace:

      ```
      kubectl get all
      ```

1. Access the Kubeflow UI, which becomes available at the following URI after 
   several minutes:

    ```
    https://<deployment-name>.endpoints.<project>.cloud.goog/
    ```

    The following screenshot shows the Kubeflow UI:
    <img src="/docs/images/central-ui.png" 
        alt="Prediction UI"
        class="mt-3 mb-3 p-3 border border-info rounded">

1. Click **Pipeline Dashboard** to access the pipelines UI. The pipelines UI
   looks like this:
    <img src="/docs/images/pipelines-ui.png" 
      alt="Pipelines UI"
      class="mt-3 mb-3 border border-info rounded">

Notes:

* When the deployment has finished, you should have a running cluster in the 
  cloud ready to run your code. You can interact with the cluster either by 
  using [`kubectl`][kubectl] or by going to the
  [GKE page on the GCP Console][gcp-console-kubernetes-engine].

* While the deployment is running, you can watch your resources appear on the
  GCP console:
    * [Deployment on Deployment Manager][gcp-console-deployment-manager]
    * [Cluster on GKE][gcp-console-kubernetes-engine]
    * [Computing resources on Compute Engine][gcp-console-compute-engine]

* It can take 10-15 minutes for the URI to become available. Kubeflow needs
  to provision a signed SSL certificate and register a DNS name.
    * If you own/manage the domain or a subdomain with [Cloud DNS][dns]
      then you can configure this process to be much faster.
    * While you wait you can access Kubeflow services by using `kubectl proxy`
      and `kubectl port-forward` to connect to services in the cluster.

### Create a Cloud Storage bucket

The next step is to create a Cloud Storage bucket to hold your trained model

[Cloud Storage][cloud-storage] is a scalable, fully-managed object/blob store.
You can use it for a range of scenarios including serving website content,
storing data for archival and disaster recovery, or distributing large data
objects to users via direct download. This tutorial uses Cloud Storage to
hold the trained machine learning model and associated data.

Use the [`gsutil mb`][gsutil-mb] command to create a storage bucket. Your
*bucket name* must be unique across all of Cloud Storage.
The following commands create a bucket in the `us-central1` region,
which corresponds to the `us-central1-c` zone used earlier
in the tutorial:

```
export BUCKET_NAME=${PROJECT}-${DEPLOYMENT_NAME}-bucket
gsutil mb -c regional -l us-central1 gs://${BUCKET_NAME}
```

## Prepare your pipeline

To simplify this tutorial, you can use a set of prepared files that include
the pipeline definition and supporting files. The project files are in the 
[Kubeflow examples repository](https://github.com/kubeflow/examples)
on GitHub.

### Download the project files

TODO(sarahmaddox): UPDATE THE LOCATION WHEN THE FILES ARE AVAILABLE

Clone the project files and go to the directory containing the MNIST pipeline
example:

```
cd ${HOME}
git clone https://github.com/kubeflow/examples.git
cd examples/mnist
WORKING_DIR=$(pwd)
```

As an alternative to cloning, you can download the 
[Kubeflow examples repository zip file](https://github.com/kubeflow/examples/archive/master.zip).

### Set up Python

You need **Python 3.5 or above**. If you don't have Python 3 set up, install
[Miniconda](https://conda.io/miniconda.html) as described below:
 
* In a Debian/Ubuntu/[Cloud shell](https://console.cloud.google.com/cloudshell) 
  environment, run the following commands:   

    ```bash
    apt-get update; apt-get install -y wget bzip2
    wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
    bash Miniconda3-latest-Linux-x86_64.sh
    ```

* In a Windows environment, download the 
  [installer](https://repo.continuum.io/miniconda/Miniconda3-latest-Windows-x86_64.exe) 
  and  make sure you select the "*Add Miniconda to my PATH environment variable*" 
  option during the installation.

* In a Mac environment, download the 
  [installer](https://repo.continuum.io/miniconda/Miniconda3-latest-MacOSX-x86_64.sh) 
  and run the following command:

    ```bash
    bash Miniconda3-latest-MacOSX-x86_64.sh
    ```

Create a clean Python 3 environment:
 
```bash
conda create --name mlpipeline python=3.6
source activate mlpipeline
```
 
If the `conda` command is not found, be sure to add Miniconda to your path:
 
```bash
export PATH=MINICONDA_PATH/bin:$PATH
```
 
### Install the Kubeflow Pipelines SDK

Run the following command to install the Kubeflow Pipelines SDK:

```bash
pip3 install https://storage.googleapis.com/ml-pipeline/release/0.1.7/kfp.tar.gz --upgrade
```

TODO(sarahmaddox): DOES THIS MEAN IT'S AUTOMATIC OR MUST I DO IT?
After successful installation the command `dsl-compile` should be added to your 
PATH.

### Compile the sample pipeline

The pipeline is defined in the Python file `mnist-pipeline.py` which you
downloaded from GitHub. When you execute that Python file, it compiles the
pipeline to an  intermediate representation which you can then submit to the 
Kubeflow Pipelines service.

1. Run the following command to compile the pipeline:

    ```
    python3 mnist-pipeline.py
    ```

    You should now have a file called `mnist-pipeline.tar.gz` which contains
    the compiled pipeline.

1. Upload the compiled pipeline to the Kubeflow Pipelines UI.
