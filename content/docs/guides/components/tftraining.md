+++
title = "TensorFlow Training"
description = ""
weight = 10
toc = true
bref= "Training using TensorFlow"
[menu]
[menu.docs]
  parent = "components"
  weight = 60
+++

## Submitting a TensorFlow training job

**Note:** Before submitting a training job, you should have [deployed kubeflow to your cluster](#deploy-kubeflow). Doing so ensures that
the [`TFJob` custom resource](https://github.com/kubeflow/tf-operator) is available when you submit the training job.

We treat each TensorFlow job as a [component](https://ksonnet.io/docs/tutorial#2-generate-and-deploy-an-app-component) in your APP.

## Run the TfCnn example

Kubeflow ships with a [ksonnet prototype](https://ksonnet.io/docs/concepts#prototype) suitable for running the [TensorFlow CNN Benchmarks](https://github.com/tensorflow/benchmarks/tree/master/scripts/tf_cnn_benchmarks).

You can also use this prototype to generate a component which you can then customize for your jobs.

Create the component

```
CNN_JOB_NAME=mycnnjob

ks registry add kubeflow-git github.com/kubeflow/kubeflow/tree/${VERSION}/kubeflow
ks pkg install kubeflow-git/examples

ks generate tf-job-simple ${CNN_JOB_NAME} --name=${CNN_JOB_NAME}
```

Submit it

```
ks apply ${KF_ENV} -c ${CNN_JOB_NAME}
```

Monitor it (Please refer to the [TfJob docs](https://github.com/kubeflow/tf-operator#monitoring-your-job))

```
kubectl get -o yaml tfjobs ${CNN_JOB_NAME}
```

Delete it

```
ks delete ${KF_ENV} -c ${CNN_JOB_NAME}
```

## Customizing the TFJob

Generating a component as in the previous step will create a file named 

```
components/${CNN_JOB_NAME}.jsonnet
```

A jsonnet file is basically a json file defining the manifest for your TFJob. You can modify this manifest
to run your jobs.

Typically you will want to change the following values

1. Change the image to point to the docker image containing your code
1. Change the number and types of replicas
1. Change the resources (requests and limits) assigned to each resource
1. Set any environment variables

   * For example, you might need to configure various environment variables to talk to datastores like GCS or S3

1. Attach PV's if you want to use PVs for storage.

## Submitting a TensorFlow training job

**Note:** Before submitting a training job, you should have [deployed kubeflow to your cluster](#deploy-kubeflow). Doing so ensures that
the [`TFJob` custom resource](https://github.com/kubeflow/tf-operator) is available when you submit the training job.

We treat each TensorFlow job as a [component](https://ksonnet.io/docs/tutorial#2-generate-and-deploy-an-app-component) in your APP.

## Run the TfCnn example

Kubeflow ships with a [ksonnet prototype](https://ksonnet.io/docs/concepts#prototype) suitable for running the [TensorFlow CNN Benchmarks](https://github.com/tensorflow/benchmarks/tree/master/scripts/tf_cnn_benchmarks).

You can also use this prototype to generate a component which you can then customize for your jobs.

Create the component

```
CNN_JOB_NAME=mycnnjob

ks registry add kubeflow-git github.com/kubeflow/kubeflow/tree/${VERSION}/kubeflow
ks pkg install kubeflow-git/examples

ks generate tf-job-simple ${CNN_JOB_NAME} --name=${CNN_JOB_NAME}
```

Submit it

```
ks apply ${KF_ENV} -c ${CNN_JOB_NAME}
```

Monitor it (Please refer to the [TfJob docs](https://github.com/kubeflow/tf-operator#monitoring-your-job))

```
kubectl get -o yaml tfjobs ${CNN_JOB_NAME}
```

Delete it

```
ks delete ${KF_ENV} -c ${CNN_JOB_NAME}
```

## Customizing the TFJob

Generating a component as in the previous step will create a file named 

```
components/${CNN_JOB_NAME}.jsonnet
```

A jsonnet file is basically a json file defining the manifest for your TFJob. You can modify this manifest
to run your jobs.

Typically you will want to change the following values

1. Change the image to point to the docker image containing your code
1. Change the number and types of replicas
1. Change the resources (requests and limits) assigned to each resource
1. Set any environment variables

   * For example, you might need to configure various environment variables to talk to datastores like GCS or S3

1. Attach PV's if you want to use PVs for storage.



