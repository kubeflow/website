+++
title = "End-to-end Kubeflow on GCP"
description = "Guide to Kubeflow on Google Cloud Platform"
weight = 10
toc = true
[menu.docs]
  parent = "gke"
  weight = 10
+++

This guide walks you through an end-to-end example of Kubeflow on Google
Cloud Platform (GCP). By working through the guide, you'll learn
how to deploy Kubeflow on Kubernetes Engine (GKE), train a machine learning 
model for image classification, save the trained model, and use the model for 
online inference (also known as online prediction).

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


  ![Prediction UI](/docs/images/gcp-e2e-ui-prediction.png)

In the above screenshot, the image shows a hand-written **8**. The table below 
the image shows a bar graph for each  classification label from 0 to 9. Each bar 
represents the probability that the image matches the respective label. Looks
like it's pretty confident this one is an 8!

### The overall workflow

Here's an overview of what you accomplish by following this guide:

* Setting up [Kubeflow][kubeflow] in a [Kubernetes Engine][kubernetes-engine]
  cluster.

* Testing the code locally using a [Jupyter notebook][jupyterhub].

* Training the model:

  * Packaging a TensorFlow program in a [Kubernetes][kubernetes] container.
  * Uploading the container to [Container Registry][container-registry].
  * Submitting a [tf.train][tf-train] job.

* Using the model for prediction (inference):

  * Saving the trained model to [Cloud Storage][cloud-storage].
  * Using [TensorFlow Serving][tf-serving] to serve the model.
  * Building a simple web app to send a prediction request to the model and display
    the result.

Let's get started!

## Setup

### Download the project files

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

1. Press Enter/Return to add the URI.
1. Click **Create**.
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

    For example, the following commands set the zone to `us-central1-c`:

    ```
    export ZONE=us-central1-c
    gcloud config set compute/zone $ZONE
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
    export KUBEFLOW_VERSION=0.2.5
    curl https://raw.githubusercontent.com/kubeflow/kubeflow/v${KUBEFLOW_VERSION}/scripts/gke/deploy.sh | bash
    ```

    While the script is running, you may see an error message like this:

    ```
    gcloud deployment-manager --project=<your-project> deployments describe <your-deployment>
    ERROR: (gcloud.deployment-manager.deployments.describe) ResponseError: code=404, message=The object 'projects/<your-project>/global/deployments/<your-deployment>' is not found.
    ```

    You can safely ignore the message, as the script goes ahead and creates
    the deployment for you.

1. Check the resources deployed in the `kubeflow` namespace:

    ```
    kubectl -n kubeflow get all
    ```

1. Kubeflow will be available at the following URI after several minutes:

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
      **Important:** This directory contains JSON files containing the secrets
      for your service accounts. **Checking your keys into source control is not
      advised.**
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
export BUCKET_NAME=${DEPLOYMENT_NAME}-bucket
gsutil mb -c regional -l us-central1 gs://${BUCKET_NAME}
```

## (Optional) Test the code in a Jupyter notebook

The sample you downloaded contains all the code you need. If you like, you
can experiment with and test the code in a Jupyter notebook.

The Kubeflow deployment script deployed [JupyterHub][jupyterhub] and a
corresponding load balancer service. You can choose to connect to JupyterHub
using the Kubeflow URL or locally.

1. Choose one of the options below to connect to JupyterHub:

    * To connect to JupyterHub using the Kubeflow URL:

        1. Open a web browser and go to your Kubeflow URL:

            ```
            https://<deployment-name>.endpoints.<project>.cloud.goog/
            ```

        1. Click **JupyterHub**. This takes you to the **Spawner Options** page.

    * Alternatively, follow the
    [Kubeflow guide to Jupyter notebooks][kubeflow-jupyter] to connect
    to JupyterHub locally.

1. Enter the following details on the **Spawner Options** page:

    * **Image:** Select a **CPU** image for the TensorFlow version that you're
      using.
    * **CPU:** Enter `1`.
    * **Memory:** Enter `2Gi`.
    * **Extra Resource Limits:** No need to enter anything here.

1. Click **Spawn**.

    It takes a few minutes for the notebook server to start.
    After a minute or so, you should see a message on the web page:

    ```
    Your server is starting up.
    You will be redirected automatically when it's ready for you.
    ```

    You should also see an **event log** which you can check periodically
    while the server starts.

    When the server is ready, the Jupyter notebook dashboard opens in your
    browser.

1. Create a new notebook by clicking **New > Python 2** on the Jupyter
   dashboard.

     You can read about using notebooks in the
     [Jupyter documentation][jupyter-nbviewer].

1. Copy the code from your sample model at
   `tensorflow-model/MNIST.py` and paste the code into a cell in your Jupyter
   notebook.

1. Adjust the code as follows for running in the notebook:

    * Remove the definitions of the input arguments at the top of the program
      and set the `arg_steps` variable to the specific value of `2000`.
      Thus in the section on defining input arguments you should have just
      the following:

        ```
        # define input arguments
        arg_steps = 2000
        ```

    * Remove all code after the training steps. There's no need to export the
      model or save it to Cloud Storage at this point.

1. Run the cell in the notebook. You should see output directly beneath the
   notebook cell, something like this:

    ```
    Extracting MNIST_data/train-images-idx3-ubyte.gz
    Extracting MNIST_data/train-labels-idx1-ubyte.gz
    Extracting MNIST_data/t10k-images-idx3-ubyte.gz
    Extracting MNIST_data/t10k-labels-idx1-ubyte.gz
    step 0/2000, training accuracy 0.08
    step 100/2000, training accuracy 0.84
    step 200/2000, training accuracy 0.82
    step 300/2000, training accuracy 0.96
    step 400/2000, training accuracy 0.86
    step 500/2000, training accuracy 0.94
    step 600/2000, training accuracy 0.9
    step 700/2000, training accuracy 0.96
    step 800/2000, training accuracy 0.98
    step 900/2000, training accuracy 0.94
    step 1000/2000, training accuracy 0.94
    step 1100/2000, training accuracy 0.98
    step 1200/2000, training accuracy 0.98
    step 1300/2000, training accuracy 0.98
    step 1400/2000, training accuracy 0.94
    step 1500/2000, training accuracy 0.98
    step 1600/2000, training accuracy 1
    step 1700/2000, training accuracy 1
    step 1800/2000, training accuracy 0.98
    step 1900/2000, training accuracy 0.92
    0.9589
    ```

    The above output indicates that the program retrieved the sample training
    data then trained the model for 2000 steps, reaching a final accuracy level
    of 0.9589.

If you want to play more with the code, try adjusting the number of training
steps by setting `arg_steps` to a different value, or experiment with adjusting
other parts of the code.

## Prepare to run your training application on Kubernetes Engine

When you downloaded the project files at the start of the tutorial, you
downloaded the code for your TensorFlow application. The
`kubeflow-introduction/tensorflow-model` directory contains:

* A Python file, `MNIST.py`, containing TensorFlow code.
* A Dockerfile to build the application into a container image.
* A README file.

The Python program, `MNIST.py`, does the following:

* Defines a simple feed-forward neural network with two hidden layers.
* Defines tensor operations to train and evaluate the model’s weights.
* Runs a number of training cycles.
* Saves the trained model to your Cloud Storage bucket.

### Build the container for your training application

To deploy your code to Kubernetes, you must first build your local project into
a [Docker][docker] container image and push the image to
[Container Registry][container-registry] so that it's available in the cloud.

1. Copy your key file to the directory containing your sample TensorFlow
   application, to give Docker access to your Cloud Storage bucket. Make sure
   you copy the key for the **...-user@...** account, not the key for the
   `...-admin@...` account:

    ```
    cp ${DEPLOYMENT_NAME}_deployment_manager_configs/${DEPLOYMENT_NAME}-user@${PROJECT}.iam.gserviceaccount.com.json tensorflow-model/key.json
    ```

1. Create a version tag from the current UNIX timestamp, to be associated with
   your model each time it runs :

    ```
    export VERSION_TAG=$(date +%s)
    ```

1. Set the path in Container Registry that you want to push the image to:

    ```
    export TRAIN_IMG_PATH=gcr.io/${PROJECT}/${DEPLOYMENT_NAME}-train:${VERSION_TAG}
    ```

1. Build the Docker image for the `tensorflow-model` directory:

    ```
    docker build -t ${TRAIN_IMG_PATH} ./tensorflow-model \
      --build-arg version=${VERSION_TAG} \
      --build-arg bucket=${BUCKET_NAME}
    ```

    The container is tagged with its eventual path in Container Registry, but it
    hasn't been uploaded to Container Registry yet.

    **Note:** The `--build-arg` flags in the `docker build` command
    pass the arguments into the Dockerfile, which then passes them on to the
    Python program.

    If everything went well, your program is now encapsulated in a new
    container.

1. Test the container locally:

    ```
    docker run -it ${TRAIN_IMG_PATH}
    ```

    You may see some warnings from TensorFlow about deprecated functionality.
    Then you should see training logs start appearing in your output, similar
    to these:

    ```
    step 0/2000, training accuracy 0.14
    step 100/2000, training accuracy 0.8
    step 200/2000, training accuracy 0.94
    step 300/2000, training accuracy 0.94
    step 400/2000, training accuracy 0.96
    step 500/2000, training accuracy 0.94
    step 600/2000, training accuracy 0.94
    step 700/2000, training accuracy 0.88
    step 800/2000, training accuracy 0.98
    step 900/2000, training accuracy 0.88
    step 1000/2000, training accuracy 0.84
    step 1100/2000, training accuracy 0.96
    step 1200/2000, training accuracy 0.98
    step 1300/2000, training accuracy 0.94
    step 1400/2000, training accuracy 0.98
    step 1500/2000, training accuracy 1
    step 1600/2000, training accuracy 0.96
    step 1700/2000, training accuracy 0.96
    step 1800/2000, training accuracy 0.96
    step 1900/2000, training accuracy 0.96
    ```

1. When you see log entries similar to those above, your model training is
   working. You can terminate the container with **Ctrl+c**. Don't worry if
   you see an error saying that your service account doesn't
   have GET access on the bucket. That access is not necessary at this point.

Next, upload the container image to Container Registry so that you can
run it on your Kubernetes Engine cluster.

1. Push the container to Container Registry:

    ```
    docker push ${TRAIN_IMG_PATH}
    ```
    The push may take a few minutes to complete. You should see Docker progress 
    updates in your command window.

1. Wait until the process is complete, then you should see your new container
   image listed on the [Container Registry page][gcp-container-registry]
   on the GCP console.

<a id="train-model"></a>
### Train the model on Kubernetes Engine

Now you are ready to run the TensorFlow training job on your cluster on
Kubernetes Engine.

1. Workaround for a permissioning problem: Go to the
   [GCP IAM](https://console.cloud.google.com/iam-admin/iam) page and add the
   **Storage Admin** role to your service account:
   `<DEPLOYMENT_NAME>-admin@<PROJECT_ID>.iam.gserviceaccount.com`.

1. Use the [`ks generate`][ks-generate] command to generate a ksonnet component
   from the [`tf-job` prototype][tf-job-prototype]. The code below generates a
   component called `train1`:

    ```
    cd ${HOME}/kubeflow-introduction/${DEPLOYMENT_NAME}_ks_app
    ks generate tf-job-operator train1
    ```

    You should now see a new file, `train1.jsonnet`, in your
    `${DEPLOYMENT_NAME}_ks_app/components/` directory.

1. Edit the file at `${DEPLOYMENT_NAME}_ks_app/components/train1.jsonnet` and
   replace its contents with the following:

    ```
    local env = std.extVar("__ksonnet/environments");
    local params = std.extVar("__ksonnet/params").components["train1"];

    local k = import "k.libsonnet";

    // @param name string Name for the job.
    // @param image string Path to container image for training app.
    // @param storage_bucket string Path to your Cloud Storage bucket, like
    //        gs://your-bucket-name

    local name = params.name;
    local image = params.image;
    local storage_bucket = params.storage_bucket;
    local work_dir = "/opt/kubeflow-working";

    local namespace = env.namespace;

    local tfjob = {
    apiVersion: "kubeflow.org/v1alpha2",
    kind: "TFJob",
    metadata: {
        name: name,
        namespace: namespace,
    },
    spec: {
        tfReplicaSpecs: {
        Worker: {
            replicas: 1,
            template: {
            spec: {
                containers: [
                {
                    args: [
                    "python",
                    "MNIST.py",
                    "--bucket=" + storage_bucket,
                    ],
                    image: image,
                    name: "tensorflow",
                    workingDir: work_dir,
                },
                ],
                restartPolicy: "OnFailure",
            },
            },
        },
        Ps: {
            replicas: 1,
            template: {
            spec: {
                containers: [
                {
                    args: [
                    "python",
                    "MNIST.py",
                    "--bucket=" + storage_bucket,
                    ],
                    image: image,
                    name: "tensorflow",
                    workingDir: work_dir,
                },
                ],
                restartPolicy: "OnFailure",
            },
            },
            tfReplicaType: "PS",
        },
        },
    },
    };

    k.core.v1.list.new([
        tfjob,
    ])
    ```

    For more information about the TFJob resource defined in the above file,
    see the guide to [TensorFlow training with Kubeflow][tf-training].

1. Use the [`ks param set`][ks-param-set] command to customize the component’s
   parameters, pointing to your training container in Container Registry and
   your Cloud Storage bucket:

    ```
    ks param set train1 name "train1-"${VERSION_TAG}
    ks param set train1 image ${TRAIN_IMG_PATH}
    ks param set train1 storage_bucket "gs://"${BUCKET_NAME}
    ```
1. List the parameters for your component, to check the options set:

    ```
    ks param list train1
    ```

1. [Apply][ks-apply] the container to the cluster. The following command applies
   the container in the `default` ksonnet environment, because that's the
   environment created by the `deploy.sh` script:

    ```
    ks apply default -c train1
    ```

    There should now be new workloads on the cluster, with names that start with
    `train1-${VERSION_TAG}-`.

    You can see the workloads on the
    [Kubernetes Engine Workloads page][gcp-console-workloads] on the GCP
    console. Click the **train1** workload, then click
    **Container logs** to see the logs.

When training is complete, you should see the model data pushed into your
Cloud Storage bucket, tagged with the same version number as the container
that generated it. To explore, click your bucket name on the
[Cloud Storage page][gcp-console-storage] on the GCP Console.

In a production environment, it’s likely that you will need to run more than one
training job for the model. Kubeflow gives you a simple deploy pipeline you can
use to train new versions of your model repeatedly. You don’t need to regenerate
the `tf-job-operator` ksonnet component every time. When you have a new version
to push:

* Build a new container with a new version tag.
* Run the `ks param set` command to modify the parameters for the 
  `tf-job-operator` ksonnet component to point to the new version of your
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
[TensorFlow Serving][tf-serving]. Unlike when using `tf-job-operator`, you don't
need a custom container for the server process. Instead, all the information the
server needs is stored in the model file.

Follow these instructions to point the server component to the Cloud Storage
bucket where your model data is stored, so that the server can spin up to handle
requests:

1. [Generate][ks-generate] a ksonnet component from the prototype. The code
   below names the server `mnist-serve`:

    ```
    cd ${HOME}/kubeflow-introduction/${DEPLOYMENT_NAME}_ks_app
    ks generate tf-serving serve --name=mnist-serve
    ```

1. Set a ksonnet parameter to define the path to your model on Cloud Storage:

    ```
    ks param set serve modelPath gs://${BUCKET_NAME}/
    ```

1. [Apply][ks-apply] the component to the cluster:

    ```
    ks apply default -c serve
    ```

    Note that you don’t need to add a `VERSION_TAG`, even though you may have
    multiple versions of your model saved in your bucket. Instead, the serving
    component picks up on the most recent tag and serves that version of the
    model.

    There should now be a new workload on the cluster, with the name
    `mnist-serve-v1`.

    You can see the workload on the
    [Kubernetes Engine Workloads page][gcp-console-workloads] on the GCP
    console. Click the **mnist-serve-v1** workload, then click
    **Container logs** to see the logs.

    You can also see the **mnist-serve** service on the
     [Kubernetes Engine Services page][gcp-console-services].

## Send online prediction requests to your model

Now you can deploy the final piece of your system: a web interface that can
interact with a trained model server.

### Deploy the sample web UI

When you downloaded the project files at the start of the tutorial, you
downloaded the code for a simple web UI. The code is stored in the
`kubeflow-introduction/web-ui` directory.

The web UI uses a [Flask][flask] server to host the HTML/CSS/JavaScript files
for the web page. The Python program, `mnist_client.py`, contains a function
that interacts directly with the TensorFlow model server.

The `kubeflow-introduction/web-ui` directory also contains a Dockerfile to build
the application into a container image.

### Build a container and push it to Container Registry

Follow these steps to build a container from your code:

1. Move back to the `kubeflow-introduction` project directory:

    ```
    cd ${HOME}/kubeflow-introduction
    ```

1. Set the path in [Container Registry][container-registry] to push the
   container image to:

    ```
    export UI_IMG_PATH=gcr.io/${PROJECT}/${DEPLOYMENT_NAME}-web-ui
    ```

1. Build the Docker image for the `web-ui` directory:

    ```
    docker build -t ${UI_IMG_PATH} ./web-ui
    ```

1. Push the container to Container Registry:

    ```
    docker push ${UI_IMG_PATH}
    ```

    The push may take a few minutes to complete. You should see Docker progress 
    updates in your command window.

1. Wait until the process is complete, then you should see your new container
   image listed on the [Container Registry page][gcp-container-registry]
   on the GCP console.

### Create a ksonnet component

To deploy the web UI to the cluster, you need another ksonnet component. This
time, use ksonnet's built-in `deployed-service` prototype. The component
creates the deployment and load balancer so you can connect with your Flask
server from outside the cluster.

1. Move back into your ksonnet application directory:

    ```
    cd ${HOME}/kubeflow-introduction/${DEPLOYMENT_NAME}_ks_app
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

    Now there should be a new web UI running in the cluster. You can see the 
    **web-ui** entry on the
    [Kubernetes Engine Workloads page][gcp-console-workloads] and on the
    [Services page][gcp-console-services].

### Access the web UI in your browser

Follow these steps to access the web UI in your web browser.

1. Get the external IP address of the service: Go to the
   the [Kubernetes Engine Services page][gcp-console-services], click the entry
   for **web-ui** to see the service details, and copy the
   IP address next to **External endpoints**.

1. Open the IP address into your browser. The web UI should load, offering you
   three fields to connect to the prediction server:

    ![Connection UI](/docs/images/gcp-e2e-ui-connect.png)

1. By default, the fields on the above web page are pre-filled with the details 
   of the TensorFlow server that's running in the cluster:  a name, an address, 
   and a port. You can change them if you used different values:

  * **Server Name:** `mnist-serve` - The name that you gave to your serving 
    component.

  * **Server Address:** `mnist-serve` - You can enter the server address as a 
    domain name or an IP address. Note that this is an internal IP address for
    the `mnist-serve` service within your cluster, not a public address.
    Kubernetes provides an internal DNS service, so you can write the name of
    the service in the address field. Kubernetes routes all requests to the 
    required IP address automatically.

  * **Port:** `9000` - The server listens on port 9000 by default.

1. Click **Connect**. The system finds the server in your cluster and displays
   the classification results.

## The final product

Below the connect screen, you should see a prediction UI for your MNIST 
model.

  ![Prediction UI](/docs/images/gcp-e2e-ui-prediction.png)

Each  time you refresh the page, it loads a random image from the MNIST test
dataset and performs a prediction. In the above screenshot, the image shows a
hand-written **8**. The table below the image shows a bar graph for each 
classification label from 0 to 9. Each bar represents
the probability that the image matches the respective label. 
Because the model was properly trained, the confidence level should be high and 
mistakes should be rare. See if you can find any!

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
[gcp-console-services]: https://console.cloud.google.com/kubernetes/discovery
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
[tf-training]: /docs/guides/components/tftraining/

[deploy-script]: https://github.com/kubeflow/kubeflow/blob/master/scripts/gke/deploy.sh

[jupyterhub]: http://jupyter.org/hub
[kubeflow-jupyter]: /docs/guides/components/jupyter/
[jupyter-nbviewer]: https://jupyter-notebook.readthedocs.io/en/latest/notebook.html#notebook-user-interface
