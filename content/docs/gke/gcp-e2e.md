+++
title = "End-to-end Kubeflow on GCP"
description = "Kubeflow on Google Cloud Platform"
weight = 10
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

### The overall workflow

Here's an overview of what you accomplish by following this guide:

* Setting up [Kubeflow][kubeflow] in a [GKE][kubernetes-engine]
  cluster.

* Testing the code locally using a [Jupyter notebook][jupyter-notebook].

* Training the model:

  * Packaging a TensorFlow program in a [Kubernetes][kubernetes] container.
  * Uploading the container to [Container Registry][container-registry].
  * Submitting a TensorFlow training ([tf.train][tf-train]) job.

* Using the model for prediction (inference):

  * Saving the trained model to [Cloud Storage][cloud-storage].
  * Using [TensorFlow Serving][tf-serving] to serve the model.
  * Running a simple web app to send a prediction request to the model and
    display the result.

Let's get started!

## Set up your environment

### Download the project files

To simplify this tutorial, you can use a set of prepared files that include
a TensorFlow application for training your model, a web UI to send prediction
requests and display the results, and the [Docker][docker] files to build
runnable containers for the training and prediction applications.
The project files are in the [Kubeflow examples
repository](https://github.com/kubeflow/examples/tree/master/mnist)
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
1. Install the [Cloud SDK][cloud-sdk]. If you already have the SDK installed,
  run `gcloud components update` to get the latest versions of the SDK tools.

Notes:

* As you work through this tutorial, your project uses billable components of
  GCP. To minimise costs, follow the instructions to
  [clean up your GCP resources](#cleanup) when you've finished with them.
* This guide assumes you want to manage your GCP environment on your own server
  rather than in the [Cloud Shell][cloud-shell] environment. If you choose to
  use the Cloud Shell, some of the components are pre-installed in your shell.

### Install Docker

Follow the [Docker installation guide](https://docs.docker.com/install/).

### Install kubectl

Run the following Cloud SDK command to install the
`kubectl` command-line tool for Kubernetes:

```
gcloud components install kubectl
```

### Install kustomize

Kubeflow makes use of [kustomize](https://github.com/kubernetes-sigs/kustomize)
to help manage deployments.

{{% alert title="Make sure you have version 2.0.3 of kustomize" color="warning" %}}
This tutorial does not work with later versions of kustomize, due to bug
<a href="https://github.com/kubernetes-sigs/kustomize/issues/1295">/kustomize/issues/1295</a>.
{{% /alert %}}

Install kustomize
[v2.0.3](https://github.com/kubernetes-sigs/kustomize/releases/tag/v2.0.3).
See the [kustomize installation
guide](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/INSTALL.md).

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
   `DEPLOYMENT_NAME` environment variable. If you don't set this
   environment variable, your deployment gets the default name of `kubeflow`:

    ```
    export DEPLOYMENT_NAME=kubeflow
    ```

## Deploy Kubeflow

Follow the instructions in the
guide to [deploying Kubeflow on GCP](/docs/gke/deploy/),
taking note of the following:

* Make sure you deploy Kubeflow **{{% kf-latest-version %}}** or later.
* Set up **OAuth client credentials** and **Cloud Identity-Aware Proxy (IAP)**
  as prompted during the deployment process.

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

    If you own/manage the domain or a subdomain with [Cloud DNS][dns]
    then you can configure this process to be much faster.

## Create a Cloud Storage bucket

The next step is to create a Cloud Storage bucket to hold your trained model.

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

The Kubeflow deployment includes services for spawning and managing
[Jupyter notebooks][jupyter-notebook].

1. Follow the [Kubeflow notebooks setup guide](/docs/notebooks/setup/) to
  create a Jupyter notebook server and open the Jupyter UI.
  Accept the default settings when configuring your notebook server. The
  default configuration gives you a standard CPU image with a recent version of TensorFlow.

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

    Don't worry if you see the following message after the model has finished
    exporting:
    `An exception has occurred, use %tb to see the full traceback. SystemExit.`
    The message occurs because you haven't yet set up a location for storing the
    model.

If you want to play more with the code, try adjusting the number of training
steps by setting `max_steps` to a different value, such as `2000`, or
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

### Build the container for your training application

To deploy your code to Kubernetes, you must first build your local project into
a [Docker][docker] container image and push the image to
[Container Registry][container-registry] so that it's available in the cloud.

1. Create a version tag from the current UNIX timestamp, to be associated with
   your model each time it runs:

    ```
    export VERSION_TAG=$(date +%s)
    ```

1. Set the path in Container Registry that you want to push the image to:

    ```
    export TRAIN_IMG_PATH=gcr.io/${PROJECT}/${DEPLOYMENT_NAME}-train:${VERSION_TAG}
    ```

1. Build the Docker image for your working directory:

    ```
    docker build $WORKING_DIR -t $TRAIN_IMG_PATH -f $WORKING_DIR/Dockerfile.model
    ```

    The container is tagged with its eventual path in Container Registry, but it
    hasn't been uploaded to Container Registry yet.

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
    Train and evaluate
    INFO:tensorflow:Running training and evaluation locally (non-distributed).
    INFO:tensorflow:Start train and evaluate loop. The evaluate will happen after 1 secs (eval_spec.throttle_secs) or training is finished.
    INFO:tensorflow:Calling model_fn.
    INFO:tensorflow:Done calling model_fn.
    INFO:tensorflow:Create CheckpointSaverHook.
    INFO:tensorflow:Graph was finalized.
    2019-02-02 04:17:20.655001: I tensorflow/core/platform/cpu_feature_guard.cc:140] Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX2 FMA
    INFO:tensorflow:Running local_init_op.
    INFO:tensorflow:Done running local_init_op.
    INFO:tensorflow:Saving checkpoints for 1 into /tmp/tmph861eL/model.ckpt.
    INFO:tensorflow:loss = 2.3235848, step = 1
    INFO:tensorflow:Saving checkpoints for 4 into /tmp/tmph861eL/model.ckpt.
    INFO:tensorflow:Loss for final step: 2.2987146.
    INFO:tensorflow:Calling model_fn.
    INFO:tensorflow:Done calling model_fn.
    INFO:tensorflow:Starting evaluation at 2019-02-02-04:17:21
    INFO:tensorflow:Graph was finalized.
    INFO:tensorflow:Restoring parameters from /tmp/tmph861eL/model.ckpt-4
    INFO:tensorflow:Running local_init_op.
    INFO:tensorflow:Done running local_init_op.
    INFO:tensorflow:Evaluation [1/1]
    INFO:tensorflow:Finished evaluation at 2019-02-02-04:17:22
    INFO:tensorflow:Saving dict for global step 4: accuracy = 0.1640625, global_step = 4, loss = 2.2869625
    INFO:tensorflow:Calling model_fn.
    INFO:tensorflow:Done calling model_fn.
    INFO:tensorflow:Create CheckpointSaverHook.
    INFO:tensorflow:Graph was finalized.
    INFO:tensorflow:Restoring parameters from /tmp/tmph861eL/model.ckpt-4
    INFO:tensorflow:Running local_init_op.
    INFO:tensorflow:Done running local_init_op.
    INFO:tensorflow:Saving checkpoints for 5 into /tmp/tmph861eL/model.ckpt.
    INFO:tensorflow:loss = 2.3025892, step = 5
    INFO:tensorflow:Saving checkpoints for 7 into /tmp/tmph861eL/model.ckpt.
    INFO:tensorflow:Loss for final step: 2.2834966.
    ...
    ```

1. When you see log entries similar to those above, your model training is working. You can terminate the container with **Ctrl+c**.

Next, upload the container image to Container Registry so that you can run it on your GKE cluster.

1. Run the following command to authenticate to Container Registry:

    ```
    gcloud auth configure-docker --quiet
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

### Prepare your training component to run on GKE

1. Enter the `training/GCS` directory:

    ```
    cd ${WORKING_DIR}/training/GCS
    ```

1. Give the job a name so that you can identify it later:

    ```
    kustomize edit add configmap mnist-map-training   --from-literal=name=mnist-train-dist
    ```

1. Configure your custom training image:

    ```
    kustomize edit set image training-image=${TRAIN_IMG_PATH}
    ```

1. Configure the image to run distributed by setting the number of parameter servers and workers to use. The `numPs` means the number of Ps (parameter server) and the `numWorkers` means the number of worker:

    ```
    ../base/definition.sh --numPs 1 --numWorkers 2
    ```

1. Set the training parameters (training steps, batch size and learning rate):

    ```
    kustomize edit add configmap mnist-map-training   --from-literal=trainSteps=200
    kustomize edit add configmap mnist-map-training   --from-literal=batchSize=100
    kustomize edit add configmap mnist-map-training   --from-literal=learningRate=0.01
    ```

1. Configure parameters for where the training results and exported model will be saved in Cloud Storage.  Use a subdirectory based on the `VERSION_TAG`, so that if the tutorial is run more than once, the training can start fresh each time.

    ```
    export BUCKET_PATH=${BUCKET_NAME}/${VERSION_TAG}
    kustomize edit add configmap mnist-map-training   --from-literal=modelDir=gs://${BUCKET_PATH}/
    kustomize edit add configmap mnist-map-training   --from-literal=exportDir=gs://${BUCKET_PATH}/export
    ```

### Check the permissions for your training component

You need to ensure that your Python code has the required permissions
to read/write to your Cloud Storage bucket. Kubeflow solves this by creating a
`user`
[service account](https://cloud.google.com/iam/docs/understanding-service-accounts)
within your project as a part of the deployment. You can use the following
command to list the service accounts for your Kubeflow deployment:

```
gcloud iam service-accounts list | grep ${DEPLOYMENT_NAME}
```

Kubeflow granted the `user` service account the necessary permissions to read
and write to your storage bucket. Kubeflow also added a
[Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/)
named `user-gcp-sa` to your cluster, containing the credentials needed to
authenticate as this service account within the cluster:

```
kubectl describe secret user-gcp-sa
```

To access your storage bucket from inside the `train` container, you must set the [GOOGLE_APPLICATION_CREDENTIALS](https://cloud.google.com/docs/authentication/getting-started) environment variable to point to the JSON file contained in the secret.
Set the variable by passing the following parameters:

```
kustomize edit add configmap mnist-map-training --from-literal=secretName=user-gcp-sa
kustomize edit add configmap mnist-map-training --from-literal=secretMountPath=/var/secrets
kustomize edit add configmap mnist-map-training --from-literal=GOOGLE_APPLICATION_CREDENTIALS=/var/secrets/user-gcp-sa.json
```

<a id="train-model"></a>
## Train the model on GKE

Now you are ready to run the TensorFlow training job on your cluster on
GKE.

Apply the container to the cluster:

```
kustomize build . |kubectl apply -f -
```

When the command finishes running, there should be a new workload on the
cluster, with the name `mnist-train-dist-chief-0`. If you set the option to run
a distributed workload, the `worker` workloads show up on the cluster too.
You can see the workloads on the [GKE Workloads page][gcp-console-workloads]
on the GCP console. To see the logs, click the **mnist-train-dist-chief-0**
workload, then click **Container logs**.

### View your trained model on Cloud Storage

When training is complete, you should see the model data pushed into your
Cloud Storage bucket, tagged with the same version number as the container
that generated it. To explore, click your bucket name on the
[Cloud Storage page][gcp-console-storage] on the GCP Console.

The output from the training application includes the following:

* A set of checkpoints that you can use to resume training from a given
  point later.
* An `export` directory that holds the trained model in a format that the
  [TensorFlow Serving][tf-serving] component can read. Read on to see how
  to serve your model for prediction using TensorFlow Serving.

<a id="serve-model"></a>
## Serve the trained model

Now you can put your trained model on a server and send it prediction requests.

1. Enter the `serving/GCS` directory:
    ```
    cd $WORKING_DIR/serving/GCS
    ```

1. Set a name for the TensorFlow Serving job:

    ```
    kustomize edit add configmap mnist-map-serving   --from-literal=name=mnist-service
    ```

1. Set your model path:

    ```
    kustomize edit add configmap mnist-map-serving   --from-literal=modelBasePath=gs://${BUCKET_PATH}/export
    ```

1. Deploy the model, and run a service to make the deployment accessible to
  other pods in the cluster:

    ```
    kustomize build . |kubectl apply -f -
    ```

1. You can check the deployment by running the following command:

    ```
    kubectl describe deployments mnist-service
    ```

1. The service makes the `mnist-service` deployment accessible over port 9000.
  Run the following command to get the details of the service:

    ```
    kubectl describe service mnist-service
    ```
    You can also see the **mnist-service** service on the
    [GKE Services page][gcp-console-services] on the GCP Console. Click the
    service name to see the service details. You can see that it listens for
    connections within the cluster on port 9000.

## Send online prediction requests to your model

Now you can deploy the final piece of your system: a web interface that can
interact with a trained model server.

### Deploy the sample web UI

When you downloaded the project files at the start of the tutorial, you
downloaded the code for a simple web UI. The code is stored in the
`${WORKING_DIR}/web-ui` directory.

The web UI uses a [Flask][flask] server to host the HTML, CSS, and JavaScript
files for the web page. The Python program, `mnist_client.py`, contains a
function that interacts directly with the TensorFlow model server.

The `${WORKING_DIR}/web-ui` directory also contains a Dockerfile to build
the application into a container image.

<a id="build-ui"></a>
### (Optional) Build an image and push it to Container Registry

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
    docker build ${WORKING_DIR}/web-ui -t ${UI_IMG_PATH}
    ```

1. Allow Docker access to your Container Registry:

    ```
    gcloud auth configure-docker --quiet
    ```

1. Push the container to Container Registry:

    ```
    docker push ${UI_IMG_PATH}
    ```

    The push may take a few minutes to complete. You should see Docker progress
    updates in your command window.

1. Wait until the process is complete, then you should see your new container
   image listed on the [Container Registry page][gcp-container-registry]
   on the GCP console. The container name is `<DEPLOYMENT_NAME>-web-ui`.

### Deploy the web UI to the cluster

Follow these steps to deploy the web UI to your Kubeflow cluster:

The example comes with a simple web front end that can be used with your model.

1. Enter the `front` directory:

    ```
    cd ${WORKING_DIR}/front
    ```

2. If you chose to build an image for the web UI and uploaded it to
  Container Registry in the [previous step](#build-ui), then you need to update
  the path to the image in the deployment configuration:

  * Edit the `deployment.yaml` file in `${WORKING_DIR}/front`.
  * Change the `image` value to  match your `${UI_IMG_PATH}`. The result should
    look like this:

    ```
    ...
    spec:
    containers:
    - image: gcr.io/<your-project>/<your-deployment-name>-web-ui
    ...
    ```

    (You can choose to use the image already deployed to Container Registry. In
    that case, you do not need to edit the `deployment.yaml` file.)

3. Deploy the web front end to your cluster:

    ```
    kustomize build . |kubectl apply -f -
    ```

    Now there should be a new web UI running in the cluster. You can see the
    **web-ui** entry on the [GKE Workloads page][gcp-console-workloads] and on
    the [Services page][gcp-console-services].

### Access the web UI in your browser

The web-ui service added is of type `ClusterIP`, meaning it can’t be accessed from outside the cluster. In order to load the web UI in your web browser, you have to set up a direct connection to the cluster:

```sh
kubectl port-forward svc/web-ui 8080:80
```

Visit `http://localhost:8080/` to access the web UI in your browser. (If you're working from the [Cloud Shell](https://cloud.google.com/shell/), you can instead click the ['web preview'](https://cloud.google.com/shell/docs/using-web-preview) button and then select "Preview on Port 8080" to connect.)


1. The web UI offers three fields to connect to the prediction server:
    <img src="/docs/images/gcp-e2e-ui-connect.png"
        alt="Connection UI"
        class="mt-3 mb-3 border border-info rounded">

1. By default, the fields on the above web page are pre-filled with the details
   of the TensorFlow server that's running in the cluster:  a name, an address,
   and a port. You can change them if you used different values:

  * **Model Name:** `mnist` - The name that you gave to your serving
    component.

  * **Server Address:** `mnist-service` - You can enter the server address as a
    domain name or an IP address. Note that this is an internal IP address for
    the `mnist-service` service within your cluster, not a public address.
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
hand-written **7**. The table below the image shows a bar graph for each
classification label from 0 to 9. Each bar represents
the probability that the image matches the respective label.

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

Delete the container images uploaded to Container Registry:

```
// Find the digest id for each container image:
gcloud container images list-tags gcr.io/${PROJECT}/${DEPLOYMENT_NAME}-train
gcloud container images list-tags gcr.io/${PROJECT}/${DEPLOYMENT_NAME}-web-ui

// Delete each image:
gcloud container images delete gcr.io/$PROJECT/${DEPLOYMENT_NAME}-train:$DIGEST_ID
gcloud container images delete gcr.io/$PROJECT/${DEPLOYMENT_NAME}-web-ui:$DIGEST_ID
```
As an alternative to the command line, you can delete the various resources
using the [GCP Console][gcp-console].

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

[flask]: http://flask.pocoo.org/

[kubeflow]: https://www.kubeflow.org/
[kubeflow-core]: https://github.com/kubeflow/kubeflow/tree/master/kubeflow/core
[tf-job-prototype]: https://github.com/kubeflow/kubeflow/blob/master/kubeflow/examples/prototypes/tf-job-simple.jsonnet
[tf-serving-prototype]: https://github.com/kubeflow/kubeflow/tree/master/kubeflow/tf-serving
[tf-training]: /docs/components/tftraining/

[deploy-script]: https://github.com/kubeflow/kubeflow/blob/master/scripts/gke/deploy.sh

[jupyter-notebook]: https://jupyter-notebook.readthedocs.io
[kubeflow-jupyter]: /docs/notebooks/
[jupyter-nbviewer]: https://jupyter-notebook.readthedocs.io/en/latest/notebook.html#notebook-user-interface
