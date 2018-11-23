+++
title = "Set Up and Deploy"
description = "Deploy the Kubeflow Pipelines service"
weight = 3
toc = true
bref = "This page guides you through the steps to deploy Kubeflow, including the Kubeflow Pipelines service."

[menu.docs]
  parent = "pipelines"
  weight = 3
+++
## Deploying Kubeflow Pipelines on a local Minikube cluster

Install [Docker](https://docs.docker.com/install/), socat 
(`sudo apt-get install socat` - needed for port forwarding) and 
[Minikube](https://github.com/kubernetes/minikube#installation) (or 
[install Minikube without VM](https://github.com/kubernetes/minikube#linux-continuous-integration-without-vm-support)).

Then continue to [deploy Kubeflow Pipelines](#deploy-kubeflow-pipelines)
as described below.

## Deploying Kubeflow Pipelines on GKE

You can use [Cloud Shell](https://cloud.google.com/shell/docs/quickstart) to run 
all the commands in this guide. 

Alternatively, if you prefer to install and interact with 
Kubernetes Engine (GKE) from your local  machine, make sure you have 
[gcloud CLI](https://cloud.google.com/sdk/) and 
[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#download-as-part-of-the-google-cloud-sdk) 
installed locally.

Follow the 
[GCP  guide](https://cloud.google.com/resource-manager/docs/creating-managing-projects) 
to create a GCP project.

Enable the GKE API on 
[the GCP Console](https://console.developers.google.com/apis/enabled). You can 
find more details about enabling 
[billing](https://cloud.google.com/billing/docs/how-to/modify-project?#enable-billing), 
as well as activating the 
[GKE API](https://cloud.google.com/kubernetes-engine/docs/quickstart#before-you-begin).

We recommend that you use Cloud Shell from the GCP Console to run the following 
commands. Cloud Shell starts with an environment already logged in to your 
account and set to the currently selected project. The following two commands 
are required only in a workstation shell environment; you don't need to run
these commands if you're using Cloud Shell:

```bash
gcloud auth login
gcloud config set project [your-project-id]
```

You need a GKE cluster to run Kubeflow Pipelines. To start a new GKE cluster, 
first set a default compute zone (`us-central1-a` in this case):

```bash
gcloud config set compute/zone us-central1-a
```

Then start a GKE cluster:

```bash
# Specify your cluster name
CLUSTER_NAME=[YOUR-CLUSTER-NAME]
gcloud container clusters create $CLUSTER_NAME \
  --zone us-central1-a \
  --scopes cloud-platform \
  --enable-cloud-logging \
  --enable-cloud-monitoring \
  --machine-type n1-standard-2 \
  --num-nodes 4
```

The above example uses the `cloud-platform` scope so that the cluster can 
invoke GCP APIs. You can find all the options for creating a cluster in the 
[GKE reference guide](https://cloud.google.com/sdk/gcloud/reference/container/clusters/create). 

Next, grant your user account permission to create new cluster roles. This step 
is necessary because installing Kubeflow Pipelines includes installing a few 
[clusterroles](https://github.com/kubeflow/pipelines/search?utf8=%E2%9C%93&q=clusterrole+path%3Aml-pipeline%2Fml-pipeline&type=). 

```bash
kubectl create clusterrolebinding ml-pipeline-admin-binding --clusterrole=cluster-admin --user=$(gcloud config get-value account)
```
 
## Deploy Kubeflow Pipelines

Go to the 
[release page](https://github.com/kubeflow/pipelines/releases) to find a version 
of the pipelines library. Deploy Kubeflow Pipelines to your cluster.

For example:

```bash
PIPELINE_VERSION=0.1.2
kubectl create -f https://storage.googleapis.com/ml-pipeline/release/$PIPELINE_VERSION/bootstrapper.yaml
```

By running `kubectl get job`, you should see a job created that deploys 
Kubeflow Pipelines along with all dependencies in the cluster. Wait for the 
number of successful job runs to reach 1:

```
NAME                      DESIRED   SUCCESSFUL   AGE
deploy-ml-pipeline-wjqwt  1         1            9m
```

You can check the deployment log for any failures:

```bash
kubectl logs $(kubectl get pods -l job-name=[JOB_NAME] -o jsonpath='{.items[0].metadata.name}')
```

By default, the Kubeflow Pipelines service is deployed with usage collection 
turned on. 
It uses [Spartakus](https://github.com/kubernetes-incubator/spartakus) which 
does not report any personal identifiable information (PII).

When deployment is successful, forward a local port to visit the Kubeflow 
Pipelines UI dashboard:

```bash
export NAMESPACE=kubeflow
kubectl port-forward -n ${NAMESPACE} $(kubectl get pods -n ${NAMESPACE} --selector=service=ambassador -o jsonpath='{.items[0].metadata.name}') 8080:80
```

Open your browser and point to 
[localhost:8080/pipeline](http://localhost:8080/pipeline).

## Run your first pipeline

Click through to the **Pipelines** section in the UI, create a new experiment 
and run a sample pipeline. 
For the project name parameter, use your GCP project name. 

To build your own pipelines, see the 
[guide to building a pipeline](/docs/guides/pipelines/build-pipeline).

## Disable usage reporting

If you want to turn off the usage report, you can download the bootstrapper 
file and change the arguments to the deployment job.

For example, download bootstrapper:

```bash
PIPELINE_VERSION=0.0.42
curl https://storage.googleapis.com/ml-pipeline/release/$PIPELINE_VERSION/bootstrapper.yaml --output bootstrapper.yaml
```
and then update argument in the file:

```
        args: [
          ... 
          # uncomment following line
          "--report_usage", "false",
          ...
        ]
```

then create a job using the updated YAML by running 
```kubectl create -f bootstrapper.yaml```

## Uninstall

To uninstall Kubeflow Pipelines, download the bootstrapper file and change the 
arguments to the deployment job.

For example, download bootstrapper:

```bash
PIPELINE_VERSION=0.0.42
curl https://storage.googleapis.com/ml-pipeline/release/$PIPELINE_VERSION/bootstrapper.yaml --output bootstrapper.yaml
```
and then update argument in the file:

```
        args: [
          ... 
          # uncomment following line
          "--uninstall",
          ...
        ]
```
then create job using the updated YAML by running 
```kubectl create -f bootstrapper.yaml```
