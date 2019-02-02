+++
title = "End-to-end Kubeflow on GCP"
description = "Kubeflow on Google Cloud Platform"
weight = 10
+++

This guide walks you through an end-to-end example of Kubeflow on Google
Cloud Platform (GCP). By working through the guide, you'll learn
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

After training, the model is able to classify incoming images into 10 categories
(0 to 9) based on what it's learned about handwritten images. In other words, 
you send an image to the model, and the model does its best to identify the 
digit shown in the image.
<img src="/docs/images/gcp-e2e-ui-prediction.png" 
    alt="Prediction UI"
    class="mt-3 mb-3 p-3 border border-info rounded">

In the above screenshot, the image shows a hand-written **8**. The table below 
the image shows a bar graph for each classification label from 0 to 9. Each bar 
represents the probability that the image matches the respective label. 
Judging by this screenshot, the model seems pretty confident that this image
is an 8.

### The overall workflow

Here's an overview of what you accomplish by following this guide:

* Setting up [Kubeflow][kubeflow] in a [GKE][kubernetes-engine]
  cluster.

* Testing the code locally using a [Jupyter notebook][jupyterhub].

* Training the model:

  * Packaging a TensorFlow program in a [Kubernetes][kubernetes] container.
  * Uploading the container to [Container Registry][container-registry].
  * Submitting a [tf.train][tf-train] job.

* Using the model for prediction (inference):

  * Saving the trained model to [Cloud Storage][cloud-storage].
  * Using [TensorFlow Serving][tf-serving] to serve the model.
  * Running a simple web app to send a prediction request to the model and 
    display the result.

Let's get started!

## Setup

### Download the project files

To simplify this tutorial, you can use a set of prepared files that include
a TensorFlow application for training your model, a web UI to send prediction
requests and display the results, and the [Docker][docker] files to build
runnable containers for the training and prediction applications.
The project files are in the 
[Kubeflow examples repository](https://github.com/kubeflow/examples)
on GitHub.

Clone the project files and go to the directory containing the MNIST example:

```
cd ${HOME}
git clone https://github.com/kubeflow/examples.git
cd examples/mnist
WORKING_DIR=$(pwd)
```

As an alternative to cloning, you can download the 
[Kubeflow examples repository zip file](https://github.com/kubeflow/examples/archive/master.zip).

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
environments for staging and production, for example.

Make sure you have ksonnet version {{% ksonnet-min-version %}} or later.

Follow the steps below to install ksonnet:

1. Follow the [ksonnet installation
   guide][ksonnet-installation], choosing the relevant options for your
   operating system. For example, if you're on Linux:

    * Set some variables for the ksonnet version:

        ```
        export KS_VER={{% ksonnet-min-version %}}
        export KS_PKG=ks_${KS_VER}_linux_amd64
        ```

    * Download the ksonnet package:

        ```
        wget -O /tmp/${KS_PKG}.tar.gz https://github.com/ksonnet/ksonnet/releases/download/v${KS_VER}/${KS_PKG}.tar.gz \
          --no-check-certificate
        ```

    * Unpack the file:

        ```
        mkdir -p ${home}/bin
        tar -xvf /tmp/$KS_PKG.tar.gz -C ${home}/bin
        ```

1. Add the `ks` command to your path:

      ```
      export PATH=$PATH:${home}/bin/$KS_PKG
      ```

For macOS, use the `ks_0.13.0_darwin_amd64` ksonnet package.

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
   `DEPLOYMENT_NAME` environment variable. Note that the name must be the same 
   as the one you use in later steps of this tutorial when configuring the 
   **redirect URI** for the OAuth client credentials. If you don't set this 
   environment variable, your deployment gets the default name of `kubeflow`:

    ```
    export DEPLOYMENT_NAME=kubeflow
    ```

## Deploy Kubeflow

Follow the instructions in the 
[GKE getting-started guide](/docs/started/getting-started-gke) 
to deploy Kubeflow on GCP, taking note of the following:

* Set up **OAuth client credentials** and **Cloud Identity-Aware Proxy (IAP)**
  as prompted during the deployment process. So, do not choose the deployment 
  option to skip IAP. IAP ensures you can connect securely to the Kubeflow
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

The following screenshot shows the Kubeflow deployment UI with hints about
the value for each input field:

<img src="/docs/images/gcp-e2e-deploy-kubeflow.png" 
    alt="Prediction UI"
    class="mt-3 mb-3 p-3 border border-info rounded">

When the cluster is ready, you can do the following:

1. Connect your local `kubectl` session to the cluster:

    ```
    gcloud container clusters get-credentials \
        ${DEPLOYMENT_NAME} --zone ${ZONE} --project ${PROJECT}
    ```

1. Switch to the `kubeflow` namespace to see the resources on the Kubeflow 
   cluster:

    ```
    kubectl config set-context $(kubectl config current-context) --namespace=kubeflow
    ```

1. Check the resources deployed in the `kubeflow` namespace:

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
export BUCKET_NAME=${PROJECT}-${DEPLOYMENT_NAME}-bucket
gsutil mb -c regional -l us-central1 gs://${BUCKET_NAME}
```

## (Optional) Test the code in a Jupyter notebook

The sample you downloaded contains all the code you need. If you like, you
can experiment with and test the code in a Jupyter notebook.

The Kubeflow deployment includes [JupyterHub][jupyterhub] and a
corresponding load balancer service. You can choose to connect to JupyterHub
using the Kubeflow URL or locally.

1. Choose one of the options below to connect to JupyterHub:

    * Click **JUPYTERHUB** on the Kubeflow UI (see screenshot above).
    * Alternatively, follow the
      [Kubeflow guide to Jupyter notebooks][kubeflow-jupyter] to connect
      to JupyterHub locally.

1. Click **Start My Server** if prompted to do so.

1. Leave the **Image** details at the default setting on the JupyterHub 
   **Spawner Options** page. The default gives you a standard CPU image
   with a recent version of TensorFlow.

1. Click **Spawn**.

    It takes a few minutes for the notebook server to start.
    After a minute or so, you should see a message on the web page:

    ```
    Your server is starting up.
    You will be redirected automatically when it's ready for you.
    ```

    You should also see an event log which you can check periodically
    while the server starts.

    When the server is ready, the Jupyter notebook dashboard opens in your
    browser.

1. Create a new notebook by clicking **New > Python 2** on the Jupyter
   dashboard.

     You can read about using notebooks in the
     [Jupyter documentation][jupyter-nbviewer].

1. Copy the code from your sample model at
   `${WORKING_DIR}/model.py` and paste the code into a cell in 
   your Jupyter notebook.

1. Run the cell in the notebook. You should see output directly beneath the
   notebook cell, something like this:

    ```
    INFO:tensorflow:TF_CONFIG {}
    INFO:tensorflow:cluster=None job_name=None task_index=None
    INFO:tensorflow:Will export model
    Extracting /tmp/data/train-images-idx3-ubyte.gz
    Extracting /tmp/data/train-labels-idx1-ubyte.gz
    Extracting /tmp/data/t10k-images-idx3-ubyte.gz
    Extracting /tmp/data/t10k-labels-idx1-ubyte.gz
    WARNING:tensorflow:Using temporary folder as model directory: /tmp/tmpfNskyK
    INFO:tensorflow:Using config: {'_save_checkpoints_secs': None, '_session_config': None, '_keep_checkpoint_max': 5, '_task_type': 'worker', '_global_id_in_cluster': 0, '_is_chief': True, '_cluster_spec': <tensorflow.python.training.server_lib.ClusterSpec object at 0x7f3e975ea550>, '_evaluation_master': '', '_save_checkpoints_steps': 1000, '_keep_checkpoint_every_n_hours': 10000, '_service': None, '_num_ps_replicas': 0, '_tf_random_seed': None, '_master': '', '_device_fn': None, '_num_worker_replicas': 1, '_task_id': 0, '_log_step_count_steps': 100, '_model_dir': '/tmp/tmpfNskyK', '_train_distribute': None, '_save_summary_steps': 100}
    Train and evaluate
    INFO:tensorflow:Running training and evaluation locally (non-distributed).
    INFO:tensorflow:Start train and evaluate loop. The evaluate will happen after every checkpoint. Checkpoint frequency is determined based on RunConfig arguments: save_checkpoints_steps 1000 or save_checkpoints_secs None.
    INFO:tensorflow:Calling model_fn.
    INFO:tensorflow:Done calling model_fn.
    INFO:tensorflow:Create CheckpointSaverHook.
    INFO:tensorflow:Graph was finalized.
    INFO:tensorflow:Running local_init_op.
    INFO:tensorflow:Done running local_init_op.
    INFO:tensorflow:Saving checkpoints for 0 into /tmp/tmpfNskyK/model.ckpt.
    INFO:tensorflow:loss = 2.3082201, step = 1
    INFO:tensorflow:global_step/sec: 6.81158
    INFO:tensorflow:loss = 2.0083964, step = 101 (14.683 sec)
    INFO:tensorflow:Saving checkpoints for 200 into /tmp/tmpfNskyK/model.ckpt.
    INFO:tensorflow:Calling model_fn.
    INFO:tensorflow:Done calling model_fn.
    INFO:tensorflow:Starting evaluation at 2019-02-02-02:35:00
    INFO:tensorflow:Graph was finalized.
    INFO:tensorflow:Restoring parameters from /tmp/tmpfNskyK/model.ckpt-200
    INFO:tensorflow:Running local_init_op.
    INFO:tensorflow:Done running local_init_op.
    INFO:tensorflow:Evaluation [1/1]
    INFO:tensorflow:Finished evaluation at 2019-02-02-02:35:00
    INFO:tensorflow:Saving dict for global step 200: accuracy = 0.8046875, global_step = 200, loss = 0.79056215
    INFO:tensorflow:Saving 'checkpoint_path' summary for global step 200: /tmp/tmpfNskyK/model.ckpt-200
    INFO:tensorflow:Performing the final export in the end of training.
    INFO:tensorflow:Calling model_fn.
    INFO:tensorflow:Done calling model_fn.
    INFO:tensorflow:Signatures INCLUDED in export for Eval: None
    INFO:tensorflow:Signatures INCLUDED in export for Classify: None
    INFO:tensorflow:Signatures INCLUDED in export for Regress: None
    INFO:tensorflow:Signatures INCLUDED in export for Predict: ['serving_default', 'classes']
    INFO:tensorflow:Signatures INCLUDED in export for Train: None
    INFO:tensorflow:Restoring parameters from /tmp/tmpfNskyK/model.ckpt-200
    INFO:tensorflow:Assets added to graph.
    INFO:tensorflow:No assets to write.
    INFO:tensorflow:SavedModel written to: /tmp/tmpfNskyK/export/mnist/temp-1549074900/saved_model.pb
    INFO:tensorflow:Loss for final step: 0.70332366.
    Training done
    Export saved model
    INFO:tensorflow:Calling model_fn.
    INFO:tensorflow:Done calling model_fn.
    INFO:tensorflow:Signatures INCLUDED in export for Eval: None
    INFO:tensorflow:Signatures INCLUDED in export for Classify: None
    INFO:tensorflow:Signatures INCLUDED in export for Regress: None
    INFO:tensorflow:Signatures INCLUDED in export for Predict: ['serving_default', 'classes']
    INFO:tensorflow:Signatures INCLUDED in export for Train: None
    INFO:tensorflow:Restoring parameters from /tmp/tmpfNskyK/model.ckpt-200
    INFO:tensorflow:Assets added to graph.
    INFO:tensorflow:No assets to write.
    INFO:tensorflow:SavedModel written to: mnist/temp-1549074900/saved_model.pb
    Done exporting the model
    ```

    The above output indicates that the program retrieved the sample training
    data then trained the model for 200 steps, reaching a final accuracy level
    of 0.70332366.

If you want to play more with the code, try adjusting the number of training
steps by setting `TF_TRAIN_STEPS` to a different value, such as `2000`, or 
experiment with adjusting other parts of the code.

## Prepare to run your training application on GKE

When you downloaded the project files into your `${WORKING_DIR}` directory at 
the start of the tutorial, you downloaded the TensorFlow code for your 
training application. The code is in a Python file, `model.py`, in your 
`${WORKING_DIR}` directory.

The `model.py` program does the following:

* Downloads the MNIST dataset and loads it for use by the model training code.
* Offers a choice between two models:

  * A two-layer convolutional neural network (CNN). This tutorial uses the
    CNN, which is the default model in  `model.py`.
  * A linear classifier, not used in this tutorial.

* Defines TensorFlow operations to train and evaluate the model.
* Runs a number of training cycles.
* Saves the trained model to a specified location, such as your Cloud Storage 
  bucket.

### Create a ksonnet application

You need a ksonnet project directory to contain the ksonnet configuration files
for your training application.

Your `${WORKING_DIR}` directory includes an example ksonnet application 
directory, `ks_app`. The `components` subdirectory holds a set of `jsonnet` 
configuration files that you can copy and use. These configuration files 
represent Kubernetes resources that you can deploy to your Kubeflow cluster
to train and serve a TensorFlow model.

Follow these steps to create your ksonnet application:

1. Use [`ks_init`](https://github.com/ksonnet/ksonnet/blob/master/docs/cli-reference/ks_init.md) 
   to create a ksonnet project directory:

    ```
    export KS_NAME=my_ksonnet_app
    ks init ${KS_NAME}
    ```

1. Go to the new directory:

    ```
    cd ${KS_NAME}
    ```

1. Copy the pre-written components from the example directory:

    ```
    cp ${WORKING_DIR}/ks_app/components/* ${WORKING_DIR}/${KS_NAME}/components
    ```

1. Add the required Kubeflow resources to your ksonnet project:

    ```
    export KUBEFLOW_VERSION=v0.4.1
    ks registry add kubeflow \
        github.com/kubeflow/kubeflow/tree/${KUBEFLOW_VERSION}/kubeflow
    ks pkg install kubeflow/tf-serving@${KUBEFLOW_VERSION}
    ```



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
run it on your GKE cluster.

1. Run the following command to authenticate to Container Registry:

    ```
    gcloud auth configure-docker
    ```

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
### Train the model on GKE

Now you are ready to run the TensorFlow training job on your cluster on
GKE.

1. Use the [`ks generate`][ks-generate] command to generate a ksonnet component
   from the [`tf-job` prototype][tf-job-prototype]. The code below generates a
   component called `train1`:

    ```
    cd ${WORKING_DIR}/${DEPLOYMENT_NAME}_ks_app
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
    [GKE Workloads page][gcp-console-workloads] on the GCP
    console. Click the **train1...worker-0** workload, then click
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

* Build a new image with a new version tag.
* Run the `ks param set` command to modify the parameters for the 
  `tf-job-operator` ksonnet component to point to the new version of your
  image:

    ```
    ks param set train1 image ${TRAIN_IMG_PATH}
    ```

* Delete and re-apply the component to the cluster with the following commands:

    ```
    ks delete default -c train1
    ks apply default -c train1
    ```

New model versions will appear in appropriately tagged directories in your
Cloud Storage bucket.

<a id="serve-model"></a>
## Serve the trained model

It’s time to put your trained model on a server so that you
can send it prediction requests. You use the
[`tf-serving` prototype][tf-serving-prototype] to handle this task. The
`tf-serving` prototype is the Kubeflow implementation of
[TensorFlow Serving][tf-serving]. Unlike when using `tf-job-operator`, you don't
need a custom image for the serving process. Instead, all the information the
server needs is stored in the model file.

Follow these instructions to point the serving component to the Cloud Storage
bucket where your model is stored, so that the server can spin up to handle
requests:

1. [Generate][ks-generate] a ksonnet component from the prototype. The code
   below names the server `mnist-serve`:

    ```
    cd ${WORKING_DIR}/${DEPLOYMENT_NAME}_ks_app
    ks generate tf-serving serve --name=mnist-serve
    ```

1. Set a ksonnet parameter to define the path to your model on Cloud Storage:

    ```
    ks param set serve modelPath gs://${BUCKET_NAME}/
    ```

1. Set the following parameters to grant the serving container permission to
   read your Cloud Storage bucket:

    ```
    ks param set serve gcpCredentialSecretName user-gcp-sa
    ks param set serve cloud gcp
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
    [GKE Workloads page][gcp-console-workloads] on the GCP
    console. Click the **mnist-serve-v1** workload, then click
    **Container logs** to see the logs.

    You can also see the **mnist-serve** service on the
     [GKE Services page][gcp-console-services].

## Send online prediction requests to your model

Now you can deploy the final piece of your system: a web interface that can
interact with a trained model server.

### Deploy the sample web UI

When you downloaded the project files at the start of the tutorial, you
downloaded the code for a simple web UI. The code is stored in the
`${WORKING_DIR}/web-ui` directory.

The web UI uses a [Flask][flask] server to host the HTML/CSS/JavaScript files
for the web page. The Python program, `mnist_client.py`, contains a function
that interacts directly with the TensorFlow model server.

The `${WORKING_DIR}/web-ui` directory also contains a Dockerfile to build
the application into a container image.

### Build an image and push it to Container Registry

Follow these steps to build an image from your code:

1. Move back to the project directory:

    ```
    cd ${WORKING_DIR}
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
    cd ${WORKING_DIR}/${DEPLOYMENT_NAME}_ks_app
    ```

1. [Generate][ks-generate] the component from its prototype:

    ```
    ks generate deployed-service web-ui \
      --containerPort=5000 \
      --image=${UI_IMG_PATH} \
      --name=web-ui \
      --servicePort=80
    ```

1. [Apply][ks-apply] the component to your cluster:

    ```
    ks apply default -c web-ui
    ```

    Now there should be a new web UI running in the cluster. You can see the 
    **web-ui** entry on the
    [GKE Workloads page][gcp-console-workloads] and on the
    [Services page][gcp-console-services].

### Access the web UI in your browser

Follow these steps to access the web UI in your web browser.

1. Run the following command to access the UI via `kubectl port-forward`:

    ```
    kubectl port-forward -n ${DEPLOYMENT_NAME}  `kubectl get pods --all-namespaces \
      --selector=app=web-ui -o=jsonpath='{.items[0].metadata.name}'` 8080:5000
  ```

1. Open the UI in your web browser at `localhost:8080`. The web UI should load, 
   offering you three fields to connect to the prediction server:
    <img src="/docs/images/gcp-e2e-ui-connect.png" 
        alt="Connection UI"
        class="mt-3 mb-3 border border-info rounded">

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
<img src="/docs/images/gcp-e2e-ui-prediction.png" 
    alt="Prediction UI"
    class="mt-3 mb-3 p-3 border border-info rounded">

Each  time you refresh the page, it loads a random image from the MNIST test
dataset and performs a prediction. In the above screenshot, the image shows a
hand-written **8**. The table below the image shows a bar graph for each 
classification label from 0 to 9. Each bar represents
the probability that the image matches the respective label. 
Because the model was properly trained, the confidence level should be high and 
mistakes should be rare. See if you can find any!

<a id="cleanup"></a>
## Clean up your GCP environment

Run the following commands to delete your deployment and related resources, and
to delete your Cloud Storage bucket when you've finished with it:

```
gcloud deployment-manager --project=${PROJECT} deployments delete ${DEPLOYMENT_NAME}
gsutil rm -r gs://${BUCKET_NAME}
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
[tf-training]: /docs/components/tftraining/

[deploy-script]: https://github.com/kubeflow/kubeflow/blob/master/scripts/gke/deploy.sh

[jupyterhub]: http://jupyter.org/hub
[kubeflow-jupyter]: /docs/components/jupyter/
[jupyter-nbviewer]: https://jupyter-notebook.readthedocs.io/en/latest/notebook.html#notebook-user-interface
