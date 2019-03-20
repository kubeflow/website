+++
title = "Pipelines end-to-end on GCP"
description = "An end-to-end tutorial for Kubeflow Pipelines on GCP"
weight = 20
+++

This guide walks you through a Kubeflow Pipelines sample that runs an MNIST
machine learning (ML) model on Google Cloud Platform (GCP).

## Introductions

By working through this tutorial, you learn how to deploy Kubeflow on 
Kubernetes Engine (GKE) and run a pipeline supplied as a Python script. 
The pipeline trains an MNIST model for image classification and serves the model
for online inference (also known as online prediction).

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
[MNIST dataset][mnist-data], which is a *hello world* scenario for machine 
learning.

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

`kubectl` is the command-line tool for Kubernetes. `kubectl` is useful if you 
want to interact with your Kubeflow cluster locally. If you decide not to use
`kubectl`, you can skip the steps later in the tutorial that use the command.

Run the following Cloud SDK command to install `kubectl`:

```
gcloud components install kubectl
```

### Set up some handy environment variables

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
   `DEPLOYMENT_NAME` environment variable. The deployment name must be 
   **4-20 characters** in length. Note that the name must be the same 
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

  * Make sure that you enable **Cloud Identity-Aware Proxy (IAP)**
    as prompted during the deployment process.
  * When setting up the **authorized redirect URI** for the **OAuth client 
    credentials**, use the same value for the `<deployment_name>` as you used
    when setting up the `DEPLOYMENT_NAME` environment variable earlier in this
    tutorial.
  * Choose **Kubeflow version v0.4.1** or later.

    The following screenshot shows the Kubeflow deployment UI with hints about
    the value for each input field:

    <img src="/docs/images/gcp-e2e-deploy-kubeflow.png" 
        alt="Prediction UI"
        class="mt-3 mb-3 p-3 border border-info rounded">

1. (Optional) If you want to examine your cluster while waiting for the UI to
   be available, you can use `kubectl` to connect to your cluster:

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

* While the deployment is running, you can watch your resources appear on the
  GCP console:
    * [Deployment on Deployment Manager][gcp-console-deployment-manager]
    * [Cluster on GKE][gcp-console-kubernetes-engine]
    * [Computing resources on Compute Engine][gcp-console-compute-engine]

* It can take 10-15 minutes for the URI to become available. Kubeflow needs
  to provision a signed SSL certificate and register a DNS name.
    * If you own/manage the domain or a subdomain with [Cloud DNS][dns]
      then you can configure this process to be much faster. See 
      [kubeflow/kubeflow#731](https://github.com/kubeflow/kubeflow/issues/731).
    * While you wait you can access Kubeflow services by using `kubectl proxy`
      and `kubectl port-forward` to connect to services in the cluster.

### Create a Cloud Storage bucket

The next step is to create a Cloud Storage bucket to hold your trained model.

[Cloud Storage][cloud-storage] is a scalable, fully-managed object/blob store.
You can use it for a range of scenarios including serving website content,
storing data for archival and disaster recovery, or distributing large data
objects to users via direct download. This tutorial uses Cloud Storage to
hold the trained machine learning model and associated data.

Use the [`gsutil mb`][gsutil-mb] command to create a storage bucket. Your
*bucket name* must be unique across all of Cloud Storage.
The following commands create a bucket in the region that corresponds to the
zone which you specified earlier in the tutorial:

```
export BUCKET_NAME=${PROJECT}-${DEPLOYMENT_NAME}-bucket
export REGION=$(gcloud compute zones describe $ZONE --format="value(region.basename())")
gsutil mb -c regional -l ${REGION} gs://${BUCKET_NAME}
```

## Prepare your pipeline

To simplify this tutorial, you can use a set of prepared files that include
the pipeline definition and supporting files. The project files are in the 
[Kubeflow examples repository](https://github.com/kubeflow/examples/tree/master/pipelines/mnist-pipelines)
on GitHub.

### Download the project files

Clone the project files and go to the directory containing the MNIST pipeline
example:

```
cd ${HOME}
git clone https://github.com/kubeflow/examples.git
cd examples/pipelines/mnist-pipelines
```

As an alternative to cloning, you can download the 
[Kubeflow examples repository zip file](https://github.com/kubeflow/examples/archive/master.zip).

### Set up Python

You need **Python 3.5 or above**. This tutorial uses Python 3.7.
If you don't have a Python 3 environment set up, install
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

Create a clean Python 3 environment (this tutorial uses Python 3.7):
 
```bash
conda create --name mlpipeline python=3.7
source activate mlpipeline
```
 
If the `conda` command is not found, be sure to add Miniconda to your path:
 
```bash
export PATH=MINICONDA_PATH/bin:$PATH
```
 
### Install the Kubeflow Pipelines SDK

Install the Kubeflow Pipelines SDK, along with other Python dependencies defined
in the `requirements.txt` file:

```bash
pip install -r requirements.txt --upgrade
```

### Compile the sample pipeline

The pipeline is defined in the Python file `mnist_pipeline.py` which you
downloaded from GitHub. When you execute that Python file, it compiles the
pipeline to an intermediate representation which you can then upload to the 
Kubeflow Pipelines service.

Run the following command to compile the pipeline:

```bash
python3 mnist_pipeline.py
```

Alongside your `mnist_pipeline.py` file, you should now have a file called 
`mnist_pipeline.py.tar.gz` which contains the compiled pipeline.

## Run the pipeline

Go back to the the Kubeflow Pipelines UI, which you accessed in an earlier step 
of this tutorial. Now you're ready to upload and run your pipeline using that 
UI.

1. Click **Upload pipeline** on the Kubeflow Pipelines UI:
    <img src="/docs/images/pipelines-upload.png" 
      alt="Upload a pipeline via the UI"
      class="mt-3 mb-3 border border-info rounded">

1. Upload your `mnist_pipeline.py.tar.gz` file and give the pipeline a name:
    <img src="/docs/images/pipelines-uploading.png" 
      alt="Enter the pipeline upload details"
      class="mt-3 mb-3 border border-info rounded">

1. Your pipeline now appears in the list of pipelines on the UI.
   Click your pipeline name:
    <img src="/docs/images/pipelines-mnist-uploaded.png" 
      alt="Uploaded pipeline in list of pipelines"
      class="mt-3 mb-3 border border-info rounded">

1. The UI shows your pipeline's graph and various options.
   Click **Create run**:
    <img src="/docs/images/pipelines-mnist-graph.png" 
      alt="Pipeline graph and options"
      class="mt-3 mb-3 border border-info rounded">

1.  Supply the following **run parameters**:

  * **Run name:** A descriptive name for this run of the pipeline. You can
    submit multiple runs of the same pipeline.
  * **bucket-path:** The Cloud Storage bucket that you created earlier to hold the
    results of the pipeline run.

    The sample supplies the values for the other parameters:

  * train-steps: The number of training steps to run.
  * learning-rate: The learning rate for model training.
  * batch-size: The batch size for model training.

    Then click **Start**:
    <img src="/docs/images/pipelines-start-mnist-run.png" 
      alt="Starting a pipeline run"
      class="mt-3 mb-3 border border-info rounded">

1. The pipeline run now appears in the list of runs:
    <img src="/docs/images/pipelines-mnist-run-list.png" 
      alt="List of pipeline runs"
      class="mt-3 mb-3 border border-info rounded">

1. Click the run to see its details. In the following screenshot, the first
   two components (`train` and `serve`) have finished successfully and the third
   component (`web-ui`) is still running:
    <img src="/docs/images/pipelines-mnist-running.png" 
      alt="A running pipeline"
      class="mt-3 mb-3 border border-info rounded">

1. Click on any component to see its logs. 
    <img src="/docs/images/pipelines-mnist-logs.png" 
      alt="Logs for a pipeline component"
      class="mt-3 mb-3 border border-info rounded">
    
1. When the pipeline run is complete, look at the logs for the `web-ui` 
   component to find the IP address created for the MNIST web interface.
   Copy the IP address and paste it into your web
   browser's address bar. The web UI should appear.

    Below the connect screen, you should see a prediction UI for your MNIST 
    model.
    <img src="/docs/images/gcp-e2e-ui-prediction.png" 
        alt="Prediction UI"
        class="mt-3 mb-3 p-3 border border-info rounded">

    Each  time you refresh the page, it loads a random image from the MNIST test
    dataset and performs a prediction. In the above screenshot, the image shows a
    hand-written **7**. The table below the image shows a bar graph for each 
    classification label from 0 to 9. Each bar represents
    the probability that the image matches the respective label.

## Understanding the pipeline definition code

The pipeline is defined in the Python file `mnist_pipeline.py` which you
downloaded from GitHub. The following sections give an overview of the content
of that file.

### Decorator

The `@dsl.pipeline` decorator provides metadata about the pipeline:

```
@dsl.pipeline(
  name='MNIST',
  description='A pipeline to train and serve the MNIST example.'
)
```

### Function header

The `mnist_pipeline` function defines the pipeline. The function includes a 
number of arguments which are exposed in the Kubeflow Pipelines UI when you
create a new run of the pipeline.
Although you pass these arguments as strings, the arguments are of type 
[`kfp.dsl.PipelineParam`](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline_param.py).

```
def mnist_pipeline(model_export_dir='gs://your-bucket/export',
                   train_steps='200',
                   learning_rate='0.01',
                   batch_size='100'):
```

### The training component (`train`)

The following block defines the `train` component, which handles the training
of the ML model: 

```
train = dsl.ContainerOp(
    name='train',
    image='gcr.io/kubeflow-examples/mnist/model:v20190304-v0.2-176-g15d997b',
    arguments=[
        "/opt/model.py",
        "--tf-export-dir", model_export_dir,
        "--tf-train-steps", train_steps,
        "--tf-batch-size", batch_size,
        "--tf-learning-rate", learning_rate
        ]
).apply(gcp.use_gcp_secret('user-gcp-sa'))
```
A component consists of a 
[`kfp.dsl.ContainerOp`](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_container_op.py)
object with a name and a container path. The container image for
the MNIST training component is defined in the MNIST example's
[`Dockerfile.model`](https://github.com/kubeflow/examples/blob/master/mnist/Dockerfile.model).

The training component runs with access to your `user-gcp-sa` secret, which
ensures the component has read/write access to your Cloud Storage bucket for
storing the output from the model training.

### The model serving component (`serve`)

The following block defines the `serve` component, which serves the trained 
model for prediction:

```
serve = dsl.ContainerOp(
    name='serve',
    image='gcr.io/ml-pipeline/ml-pipeline-kubeflow-deployer:\
            7775692adf28d6f79098e76e839986c9ee55dd61',
    arguments=[
        '--model-export-path', model_export_dir,
        '--server-name', "mnist-service"
    ]
).apply(gcp.use_gcp_secret('user-gcp-sa'))
serve.after(train)
```
The `serve` component differs from the `train` component with respect to
how long the service lasts. While `train` runs a single container and then 
exits, `serve` runs a container that launches long-lived resources in the 
cluster. 

The `ContainerOP` takes two arguments: 

* A path pointing to the location of your trained model.
* A server name. 

The component creates a Kubeflow 
[`tf-serving`](https://github.com/kubeflow/kubeflow/tree/master/kubeflow/tf-serving) 
service within the cluster. This service lives on after the pipeline has
finished running. 

You can see the Dockerfile used to build this container in the 
[Kubeflow Pipelines repository](https://github.com/kubeflow/pipelines/blob/master/components/kubeflow/deployer/Dockerfile).
Like the `train` component, `serve` requires access to the `user-gcp-sa` secret 
for access to the `kubectl` command within the container.

The `serve.after(train)` line specifies that this component must run 
sequentially after the `train` component is complete.

### The web UI component (`web-ui`)

The following block defines the `web-ui` component, which displays a simple
web page. The web application sends an image (picture) to the trained model and 
displays the prediction results:

```
web_ui = dsl.ContainerOp(
    name='web-ui',
    image='gcr.io/kubeflow-examples/mnist/deploy-service:latest',
    arguments=[
        '--image', 'gcr.io/kubeflow-examples/mnist/web-ui:\
                v20190304-v0.2-176-g15d997b-pipelines',
        '--name', 'web-ui',
        '--container-port', '5000',
        '--service-port', '80',
        '--service-type', "LoadBalancer"
    ]
).apply(gcp.use_gcp_secret('user-gcp-sa'))
web_ui.after(serve)
```

Like `serve`, the `web-ui` component launches a service that continues to exist 
after the pipeline is complete. Instead of launching a Kubeflow resource, the 
`web-ui` component launches a standard Kubernetes deployment/service pair. You 
can see the Dockerfile that builds the deployment image in the 
[`./deploy-service/Dockerfile`](https://github.com/kubeflow/examples/blob/master/pipelines/mnist-pipelines/deploy-service/Dockerfile) 
that you downloaded with the sample files. This image runs the 
`gcr.io/kubeflow-examples/mnist/web-ui:v20190304-v0.2-176-g15d997b-pipelines` 
container, which was built from the MNIST example's 
[web-ui Dockerfile](https://github.com/kubeflow/examples/blob/master/mnist/web-ui/Dockerfile).

This component provisions a LoadBalancer service that gives external access to a 
`web-ui` deployment launched in the cluster.

### The main function

The `main` function compiles the pipeline, converting the Python program to
the intermediate YAML representation required by the Kubeflow Pipelines service
and zipping the result into a `tar.gz` file:

```
if __name__ == '__main__':
  import kfp.compiler as compiler
  compiler.Compiler().compile(mnist_pipeline, __file__ + '.tar.gz')
```

<a id="cleanup"></a>
## Clean up your GCP environment

Run the following command to delete your deployment and related resources:

```
gcloud deployment-manager --project=${PROJECT} deployments delete ${DEPLOYMENT_NAME}
```

Delete your Cloud Storage bucket when you've finished with it:

```
gsutil rm -r gs://${BUCKET_NAME}
```

As an alternative to the command line, you can delete the various resources 
using the [GCP Console][gcp-console].

[mnist-data]: http://yann.lecun.com/exdb/mnist/index.html

[tensorflow]: https://www.tensorflow.org/

[kubernetes]: https://kubernetes.io/
[kubectl]: https://kubernetes.io/docs/reference/kubectl/kubectl/

[kubernetes-engine]: https://cloud.google.com/kubernetes-engine/
[container-registry]: https://cloud.google.com/container-registry/
[cloud-storage]: https://cloud.google.com/storage/
[deployment-manager]: https://cloud.google.com/deployment-manager/
[compute-engine]: https://cloud.google.com/compute/
[billing-guide]: https://cloud.google.com/billing/docs/how-to/modify-project
[regions-zones]: https://cloud.google.com/compute/docs/regions-zones/
[iap]: https://cloud.google.com/iap/
[dns]: https://cloud.google.com/dns/docs/

[cloud-sdk]: https://cloud.google.com/sdk/docs/
[gcloud]: https://cloud.google.com/sdk/gcloud/
[gcp-project-id]: https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects
[gcp-locations]: https://cloud.google.com/about/locations/
[gcp-console]: https://console.cloud.google.com/cloud-resource-manager
[gcp-console-kubernetes-engine]: https://console.cloud.google.com/kubernetes
[gcp-console-workloads]: https://console.cloud.google.com/kubernetes/workload
[gcp-console-storage]: https://console.cloud.google.com/storage
[gcp-console-consent]: https://console.cloud.google.com/apis/credentials/consent
[gcp-console-credentials]: https://console.cloud.google.com/apis/credentials
[gcp-console-deployment-manager]: https://console.cloud.google.com/dm/
[gcp-console-compute-engine]: https://console.cloud.google.com/compute/
[gcp-console-services]: https://console.cloud.google.com/kubernetes/discovery
[cr-tf-models]: https://console.cloud.google.com/gcr/images/tensorflow/GLOBAL/models

[cloud-shell]: https://cloud.google.com/sdk/docs/interactive-gcloud
[gcloud-container-clusters-create]: https://cloud.google.com/sdk/gcloud/reference/container/clusters/create
[gcp-machine-types]: https://cloud.google.com/compute/docs/machine-types
[gcp-service-account]: https://cloud.google.com/iam/docs/understanding-service-accounts
[gcp-container-registry]: https://console.cloud.google.com/gcr
[gsutil-mb]: https://cloud.google.com/storage/docs/gsutil/commands/mb
[gsutil-acl-ch]: https://cloud.google.com/storage/docs/gsutil/commands/acl#ch


