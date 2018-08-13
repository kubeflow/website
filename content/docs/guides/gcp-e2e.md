+++
title = "End-to-end Kubeflow on GCP"
description = "Guide to Kubeflow on Google Cloud Platform"
weight = 10
toc = true
[menu.docs]
  parent = "guides"
  weight = 2
+++

This guide shows you how to use Kubeflow on Kubernetes Engine to implement an
end-to-end machine learning workflow. By working through the guide, you'll learn
how to deploy Kubeflow on Kubernetes Engine, train a machine learning model for
image classification, save the trained model, and use the model for online
inference (also known as online prediction).

## Introductions

### Overview of GCP and Kubernetes Engine

Google Cloud Platform (GCP) is a suite of cloud computing services running
on Google infrastructure. The services include compute power, data storage,
data analytics, and machine learning.

The [Cloud SDK][cloud-sdk] is a set of tools that you can use to interact with
GCP from the command line, including the `gcloud` command and others.

[Kubernetes Engine][kubernetes-engine] is a managed service on GCP where you can
deploy containerized applications. You describe the resources that your
application needs, and Kubernetes Engine provisions and manages the underlying
cloud resources automatically.

Here's a list of the primary GCP services that you use when following this
guide:

  * [Deployment Manager][deployment-manager]
  * [Kubernetes Engine][kubernetes-engine]
  * [Compute Engine][compute-engine]
  * [Container Registry][container-registry]
  * [Cloud Storage][cloud-storage]

### The model and the data

This tutorial trains a [TensorFlow][tensorflow] model on the
[MNIST dataset][mnist-data], which is the *hello world* for machine learning.

The MNIST dataset contains a large number of images of hand-written digits in
the range 0 to 9, as well as the labels identifying the digit in each image.

After training, the model classifies incoming images into 10 categories (0 to 9)
based on what it's learned about handwritten images. In other words, you send
an image to the model, and the model does its best to identify the digit shown
in the image.

TODO(sarahmaddox): Add screenshot of the prediction UI - same as shown at end of tutorial.

TODO(sarahmaddox): Add workflow diagrams at the relevant stages in this tutorial.

### The overall workflow

Here's an overview of what you accomplish by following this guide:

* Set up [Kubeflow][kubeflow] in a [Kubernetes Engine][kubernetes-engine]
  cluster.

* Test the code locally using a [Jupyter notebook][jupyterhub].

* Train the model:

  * Package a TensorFlow program in a [Kubernetes][kubernetes] container.
  * Upload the container to [Container Registry][container-registry].
  * Submit a [tf.train][tf-train] job.

* Use the model for prediction (inference):

  * Save the trained model to [Cloud Storage][cloud-storage].
  * Use [TensorFlow Serving][tf-serving] to serve the model.
  * Build a simple web app to send a prediction request to the model and display
    the result.

## Setup

### Download the project files

TODO(sarahmaddox): Update this section when the updated sample is in the Kubeflow repo.

TODO(sarahmaddox): Also change all mentions of directory "kubeflow-introduction" to "kubeflow-gcp" or something similar, depending on repo name.

TODO(sarahmaddox): Add distributed training to the MNIST model (Python code and YAML files).

To simplify this tutorial, you can use a set of prepared files that include
a TensorFlow application for training your model, a web UI to send prediction
requests and display the results, and the [Docker][docker] files to build
runnable containers for the training and prediction applications.

Download the project files and then go to the directory thus created:

```
cd ${HOME}
git clone https://github.com/googlecodelabs/kubeflow-introduction
cd kubeflow-introduction
```

### Set up your GCP account and SDK

Follow these steps to set up your GCP environment:

1. Select or create a project on the [GCP Console][gcp-console].
1. Make sure that billing is enabled for your project. See the guide to
  [modifying a project's billing settings][billing-guide].
1. Install the [Cloud SDK][cloud-sdk].

Notes:

* As you work through this tutorial, your project uses billable components of
  GCP. To minimise costs, follow the instructions to
  [clean up resources](#cleanup) when you've finished with them.
* This guide assumes you want to manage your GCP environment on your own server
  rather than in the [Cloud Shell][cloud-shell] environment. If you choose to
  use the Cloud Shell, you'll notice that some of the components are
  pre-installed in your shell. That's OK.

### Create OAuth client credentials

Create an OAuth client ID to be used to identify the
[Identity Aware Proxy (IAP)][iap] when requesting access to a user's email
to verify their identity.

1. Set up your OAuth consent screen:

    * Go to the [consent screen][gcp-console-consent] on the GCP console and
      enter the information requested.
    * Under **Email address**, select the address that you want to display as a
      public contact. You must use either your email address or a Google Group
      that you own.
    * In the **Product name** box, enter a suitable name like "kubeflow".
    * Under **Authorized domains**, enter the following:

        ```
        <project>.cloud.goog
        ```

     where `<project>` is your GCP project ID.

   * Click **Save**.

1. On the [Credentials][gcp-console-credentials] screen:

    * Click **Create credentials**, and then click **OAuth client ID**.
    * Under **Application type**, select **Web application**.
    * In the **Name** box enter any name.
    * In the **Authorized redirect URIs** box, enter the following:

        ```
        https://<name>.endpoints.<project>.cloud.goog/_gcp_gatekeeper/authenticate
        ```

        `<name>` and `<project>` must have the same values as set in the next
        step when you run [`deploy.sh`][deploy-script].

        `deploy.sh` uses "kubeflow" by default for `<name>` but you can
        configure this with the environment variable `DEPLOYMENT_NAME`.

        `deploy.sh` uses your default GCP project for `<project>` but you can
        configure this with the environment variable `PROJECT`.

1. Click Create.
1. Make note of the **client ID** and **client secret** that appear in the OAuth
  client window. You need them later to enable IAP.
1. Create environment variables from the OAuth client ID and secret:

    ```
    export CLIENT_ID=<CLIENT_ID from OAuth page>
    export CLIENT_SECRET=<CLIENT_SECRET from OAuth page>
    ```

### Install kubectl

Run the following Cloud SDK command to install the
`kubectl` command-line tool for Kubernetes:

```
gcloud components install kubectl
```

### Install ksonnet

Kubeflow makes use of [ksonnet] to help manage deployments. ksonnet acts as a
layer on top of `kubectl`. While Kubernetes is typically managed with static
YAML files, ksonnet adds a further abstraction that is closer to the objects
in object-oriented programming.

With ksonnet, you manage your resources as *prototypes* with empty parameters.
Then you instantiate the prototypes into *components* by defining values for the
parameters. This system makes it easier to deploy slightly different resources
to different clusters at the same time. In this way you can maintain different
environments for staging and production, for example. You can export your
ksonnet components as standard Kubernetes YAML files with `ks show`, or you can
deploy (_apply_) the components directly to the cluster with `ks apply`.

Make sure you have the version of ksonnet specified in the 
[Kubeflow requirements](/docs/guides/requirements).

Follow the steps below to install ksonnet:

1. Follow the [ksonnet installation
   guide][ksonnet-installation], choosing the relevant options for your
   operating system. For example, if you're on Linux:

    * Set some variables for the ksonnet version:

        ```
        export KS_VER=0.12.0
        export KS_PKG=ks_${KS_VER}_linux_amd64
        ```

    * Download the ksonnet package:

        ```
        wget -O /tmp/${KS_PKG}.tar.gz https://github.com/ksonnet/ksonnet/releases/download/v${KS_VER}/${KS_PKG}.tar.gz \
          --no-check-certificate
        ```

    * Unpack the file:

        ```
        mkdir -p ${HOME}/bin
        tar -xvf /tmp/$KS_PKG.tar.gz -C ${HOME}/bin
        ```

1. Add the `ks` command to your path:

      ```
      export PATH=$PATH:${HOME}/bin/$KS_PKG
      ```

## Deploy Kubeflow on GCP

In this section you run the Kubeflow [deploy.sh script][deploy-script] for GCP. 
The script uses [Deployment Manager][deployment-manager] to declaratively manage
all non Kubernetes resources, including your Kubernetes Engine cluster. This 
makes it easy to customize the configuration for your particular use case.
Use environment variables to configure basic settings, such as the deployment
name (`DEPLOYMENT_NAME`) and GCP zone (`ZONE`). For more advanced customization,
update the configuration files for the deployment manager or ksonnet.

Set up and run the `deploy` script:

1. Set an environment variable containing your GCP project ID. In the command
  below, replace `<YOUR-PROJECT-ID>` with your [project ID][gcp-project-id]
  (that is, the custom name of your GCP project):

    ```
    export PROJECT=<YOUR-PROJECT-ID>
    ```

1. Set the zone for your GCP configuration. Choose a zone that offers the
  resources you need. See the guide to GCP [regions and zones][regions-zones].
    * Ensure you have enough Compute Engine regional capacity.
      By default, the Kubernetes Engine cluster setup described in this guide
      requires 16 CPUs.
    * If you want a GPU, ensure your zone offers GPUs.

    For example, the following command sets the zone to `us-central1-c`:

    ```
    gcloud config set compute/zone us-central1-c
    export ZONE=us-central1-c
    ```

1. If you want a custom name for your deployment, set the `DEPLOYMENT_NAME`
   environment variable. Note that the name must be the same as the one you
   used when configuring the **redirect URI** for the OAuth client credentials
   earlier in this tutorial. If you don't set this variable, your deployment
   gets the default name of `kubeflow`:

    ```
    export DEPLOYMENT_NAME=kubeflow
    ```

1. Run the `deploy` script to create your GCP and Kubernetes resources:

    ```
    export KUBEFLOW_VERSION=0.2.2
    curl https://raw.githubusercontent.com/kubeflow/kubeflow/v${KUBEFLOW_VERSION}/scripts/gke/deploy.sh | bash
    ```

1. Check the resources deployed in the `kubeflow` namespace:

    ```
    kubectl -n kubeflow get all
    ```

1. Kubeflow will be available at the following URI:

    ```
    https://<deployment-name>.endpoints.<project>.cloud.goog/
    ```

Notes:

* When the script has finished, you should have a running cluster in the cloud
  ready to run your code. You can interact with the cluster either by using
  [`kubectl`][kubectl] or by going to the
  [Kubernetes Engine page on the GCP Console][gcp-console-kubernetes-engine].
* While the script is running, you can watch your resources appear on the
  GCP console:
    * [Deployment on Deployment Manager][gcp-console-deployment-manager]
    * [Cluster on Kubernetes Engine][gcp-console-kubernetes-engine]
    * [Computing resources on Compute Engine][gcp-console-compute-engine]
* It can take 10-15 minutes for the URI to become available. Kubeflow needs
  to provision a signed SSL certificate and register a DNS name.
    * If you own/manage the domain or a subdomain with [Cloud DNS][dns]
      then you can configure this process to be much faster.
    * While you wait you can access Kubeflow services by using `kubectl proxy`
      and `kubectl port-forward` to connect to services in the cluster.
* The deployment script creates the following directories containing
  your configuration:
    * `{DEPLOYMENT_NAME}_deployment_manager_configs`: Configuration for
      deployment manager.
        **Important** This directory contain JSON files containing secrets for your
        service accounts. **Checking your keys into source control is not advised.**
    * `{DEPLOYMENT_NAME}_ks_app`: Your ksonnet application.

## Create a Cloud Storage bucket

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
export BUCKET_NAME=kubeflow-${PROJECT}
gsutil mb -c regional -l us-central1 gs://${BUCKET_NAME}
```

## Test the code locally in a Jupyter notebook

TODO(sarahmaddox): Add a section to experiment the code locally using a Jupyter notebook

## Prepare and run your training application

When you downloaded the project files at the start of the tutorial, you
downloaded the code for your TensorFlow application. The
`kubeflow-introduction/tensorflow-model` directory contains:

* A Python file, `model.py`, containing TensorFlow code.
* A Dockerfile to build the application into a container image.

The Python program, `model.py`, does the following:

* Defines a simple feed-forward neural network with two hidden layers.
* Defines tensor operations to train and evaluate the model’s weights.
* Runs a number of training cycles.
* Saves the trained model to your Cloud Storage bucket.

### Build the container for your training application

To deploy your code to Kubernetes, you must first build your local project into
a [Docker][docker] container image and push the image to
[Container Registry][container-registry] so that it's available in the cloud.

1. Create a version tag from the current UNIX timestamp, to be associated with
   your model each time it runs :

    ```
    export VERSION_TAG=$(date +%s)
    ```

1. Set the path in Container Registry that you want to push the image to:

    ```
    export TRAIN_IMG_PATH=us.gcr.io/${PROJECT_ID}/${DEPLOYMENT_NAME}-train:${VERSION_TAG}
    ```

1. Build the `tensorflow-model` directory:

    ```
    docker build -t ${TRAIN_IMG_PATH} ./tensorflow-model \
      --build-arg version=${VERSION_TAG} \
      --build-arg bucket=${BUCKET_NAME}
    ```

    The container is tagged with its eventual path in Container Registry, but it
    stays local for now.

    **Note:** The `--build-arg` flags in the `docker build` command are used to
    pass arguments into the dockerfile, which then passes them on to the
    Python program.

    If everything went well, your program should be encapsulated in a new
    container.

1. Test the container locally:

    ```
    docker run -it ${TRAIN_IMG_PATH}
    ```

    You should see training logs start appearing in your output:
    TODO(sarahmaddox): Add example output.

    If you seeing log entries similar to those above, your model training is
    working and you can terminate the container with **Ctrl+c**.

Next, upload the container image to Container Registry so that you can
run it on your Kubernetes Engine cluster.

TODO(sarahmaddox): Not sure if I need the step below - try without it first.

1. Grant Docker access to your Container Registry:

    ```
    gcloud auth configure-docker
    ```

    Enter **y** to continue when prompted.

1. Push the container to Container Registry:

    ```
    docker push ${TRAIN_IMG_PATH}
    ```

1. Wait until the process is complete, then you should see your new container
   image listed on the [Container Registry page][gcp-container-registry]
   on the GCP console.

<a id="train-model"></a>
### Train the model on Kubernetes Engine

Now you are ready to run the TensorFlow training job on your cluster on
Kubernetes Engine.

1. Use the [`ks generate`][ks-generate] command to generate a ksonnet component
   from the [`tf-job` prototype][tf-job-prototype]. The code below generates a
   component called `train`:

    ```
    cd ${HOME}/kubeflow-introduction/${DEPLOYMENT_NAME}_ks_app
    ks generate tf-job-simple train
    ```

    You should now see a new file, `train.jsonnet`, in your
    `${DEPLOYMENT_NAME}_ks_app` directory.

1. Use the [`ks param set`][ks-param-set] command to customize the component’s
   parameters, pointing to your training container in Container Registry and
   your Cloud Storage bucket:

    ```
    ks param set train image ${TRAIN_IMG_PATH}
    ks param set train name "train-"${VERSION_TAG}
    ks param set train output_model_gcs_bucket "${BUCKET_NAME}"
    ```

1. [Apply][ks-apply] the container to the cluster. The following command applies
   the container in the `default` ksonnet environment, because that's the
   environment created by the `deploy.sh` script:

    ```
    ks apply default -c train
    ```

    There should now be new workloads on the cluster, with names that start with
    `train-${VERSION_TAG}-`.

    You can see the workloads on the
    [Kubernetes Engine Workloads page][gcp-console-workloads] on the GCP
    console. Click your **train** component, then click the **Logs** tab to
    see the logs.

When training is complete, you should see the model data pushed into your
Cloud Storage bucket, tagged with the same version number as the container
that generated it. To explore, click your bucket name on the
[Cloud Storage page][gcp-console-storage] on the GCP Console.

In a production environment, it’s likely that you will need to run more than one
training job for the model. Kubeflow gives you a simple deploy pipeline you can
use to train new versions of your model repeatedly. You don’t need to regenerate
the `tf-job-simple` component every time. When you have a new version to push:

* Build a new container with a new version tag.
* Modify your `tf-job-simple` parameters to point to the new version of your
  container.
* Re-apply the container to the cluster.

New model versions will appear in appropriately tagged directories in your
Cloud Storage bucket.

<a id="serve-model"></a>
## Serve the trained model

It’s time to put your trained model on a server so that you
can send it prediction requests. You use the
[`tf-serving` prototype][tf-serving-prototype] to handle this task. The
`tf-serving` prototype is the Kubeflow implementation of
[TensorFlow Serving][tf-serving]. Unlike when using `tf-job-simple`, you don't
need a custom container for the server process. Instead, all the information the
server needs is stored in the model file.

Follow these instructions to point the server component to the Cloud Storage
bucket where your model data is stored, so that the server can spin up to handle
requests:

1. [Generate][ks-generate] a ksonnet component from the prototype. The code
   below names the server `model-serve`:

    ```
    ks generate tf-serving serve --name=model-serve
    ```

1. Set the parameters and [apply][ks-apply] the component to the cluster:

    ```
    ks param set serve modelPath gs://${BUCKET_NAME}/
    ks apply default -c serve
    ```

    Note that you don’t need to add a `VERSION_TAG`, even though you may have
    multiple versions of your model saved in your bucket. Instead, the serving
    component picks up on the most recent tag and serves that version of the
    model.

    You can check the logs of the running server pod to ensure everything is
    working as expected:

    ```
    export POD_NAME=$(kubectl get pods \
      --selector=app=model-serve \
      --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')

    kubectl logs ${POD_NAME}
    ```

    If you get an error, the initialization may not be complete. Wait a moment
    then re-try the command.

## Send online prediction requests to your model

Now you can deploy the final piece of your system: a web interface that can
interact with a trained model server.

### Deploy the sample web UI

When you downloaded the project files at the start of the tutorial, you
downloaded the code for a simple web UI. The code is stored in the
`kubeflow-introduction/web-ui` directory.

The web page consists of a simple [Flask][flask] server that hosts the
HTML/CSS/JavaScript files for the web page. The Flask server makes use of
`mnist_client.py`, which contains a Python function that interacts directly with
the TensorFlow server.

### Build a container and push it to Container Registry

As usual, first build a container from your code:

1. Move back to the `kubeflow-introduction` project directory:

    ```
    cd ${HOME}/kubeflow-introduction
    ```

1. Set the path in [Container Registry][container-registry] to push the
   container image to:

    ```
    export UI_IMG_PATH=us.gcr.io/${PROJECT}/kubeflow-web-ui
    ```

1. Build the `web-ui` directory:

    ```
    docker build -t ${UI_IMG_PATH} ./web-ui
    ```

1. Push the container to Container Registry:

    ```
    docker push ${UI_IMG_PATH}
    ```

### Create a ksonnet component

To deploy the web UI to the cluster, again create a ksonnet component. This
time, use ksonnet's built-in `deployed-service` prototype. The component
creates the deployment and load balancer so you can connect with your Flask
server from outside the cluster.

1. Move back into your ksonnet project directory:

    ```
    cd ${HOME}/kubeflow-introduction/ksonnet-kubeflow
    ```

1. [Generate][ks-generate] the component from its prototype:

    ```
    ks generate deployed-service web-ui \
      --containerPort=5000 \
      --image=${UI_IMG_PATH} \
      --name=web-ui \
      --servicePort=80 \
      --type=LoadBalancer
    ```

1. [Apply][ks-apply] the component to your cluster:

    ```
    ks apply default -c web-ui
    ```

### Access the web UI in your browser

Now there should be a new web UI running in the cluster. Follow these steps to
access the web UI in your web browser.

1. Find the external IP address of the service:

    ```
    kubectl get service web-ui
    ```

    TODO(sarahmaddox): Show example output of the above command

1. Copy the external IP address from the output. (Note that it may take a couple
   of minutes for the IP address to appear.)

1. Paste the IP address into your browser. The web UI should load.

    TODO(sarahmaddox): Show screenshot - 3 fields that need completing

1. On the web page, enter the requested details of the TensorFlow server that's
   running in the cluster:  a name, an address, and a port:

  * **Server Name:** The name that you gave to your serving component:
    `model-serve`.

  * **Server Address:** You can enter the server address as a domain name or an
    IP address. Note that this is an internal IP address for the `model-serve`
    service within your cluster, not a public address. To simplify addressing
    issues, Kubernetes has an internal DNS service, so you can write the name of
    the service in the address field: `model-serve`. Kubernetes routes all
    requests to the required IP address automatically.

  * **Port:** The server listens on port 9000 by default.

1. Click **Connect**. The system finds the server in your cluster and displays
   the classification results.

## The final product

You should see an interface for your machine learning model.

TODO(sarahmaddox): Show screenshot - the same one as at the start of the tutorial

Each  time you refresh the page, it loads a random image from the MNIST testing
set and performs a prediction. The table below the image displays the
probability of each class label. Because the model was properly trained, the
confidence level should be high and mistakes should be rare. See if you can
find any!

<a id="cleanup"></a>
## Clean up your GCP environment

Run the following commands to delete your deployment and reclaim all resources:

```
gcloud deployment-manager --project=${PROJECT} deployments delete ${DEPLOYMENT_NAME}
gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
```

[mnist-data]: http://yann.lecun.com/exdb/mnist/index.html

[tensorflow]: https://www.tensorflow.org/
[tf-train]: https://www.tensorflow.org/api_guides/python/train
[tf-serving]: https://www.tensorflow.org/serving/

[kubernetes]: https://kubernetes.io/
[kubectl]: https://kubernetes.io/docs/reference/kubectl/kubectl/
[docker]: https://www.docker.com/

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
[cr-tf-models]: https://console.cloud.google.com/gcr/images/tensorflow/GLOBAL/models

[cloud-shell]: https://cloud.google.com/sdk/docs/interactive-gcloud
[gcloud-container-clusters-create]: https://cloud.google.com/sdk/gcloud/reference/container/clusters/create
[gcp-machine-types]: https://cloud.google.com/compute/docs/machine-types
[gcp-service-account]: https://cloud.google.com/iam/docs/understanding-service-accounts
[gcp-container-registry]: https://console.cloud.google.com/gcr
[gsutil-mb]: https://cloud.google.com/storage/docs/gsutil/commands/mb
[gsutil-acl-ch]: https://cloud.google.com/storage/docs/gsutil/commands/acl#ch

[ksonnet]: https://ksonnet.io/
[ksonnet-installation]: https://ksonnet.io/#get-started
[ks-init]: https://ksonnet.io/docs/cli-reference#ks-init
[ks-generate]: https://github.com/ksonnet/ksonnet/blob/master/docs/cli-reference/ks_generate.md
[ks-param-set]: https://github.com/ksonnet/ksonnet/blob/master/docs/cli-reference/ks_param_set.md
[ks-apply]: https://github.com/ksonnet/ksonnet/blob/master/docs/cli-reference/ks_apply.md

[flask]: http://flask.pocoo.org/
[jupyterhub]: https://jupyter.org/hub

[kubeflow]: https://www.kubeflow.org/
[kubeflow-core]: https://github.com/kubeflow/kubeflow/tree/master/kubeflow/core
[tf-job-prototype]: https://github.com/kubeflow/kubeflow/blob/master/kubeflow/examples/prototypes/tf-job-simple.jsonnet
[tf-serving-prototype]: https://github.com/kubeflow/kubeflow/tree/master/kubeflow/tf-serving

[deploy-script]: https://github.com/kubeflow/kubeflow/blob/master/scripts/gke/deploy.sh
