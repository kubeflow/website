+++
title = "TensorFlow Batch Predict"
description = ""
weight = 10
toc = true
bref= "Batch Prediction for TensorFlow models"
[menu]
[menu.docs]
  parent = "components"
  weight = 60
+++

## Kubeflow Batch Predict

Kubeflow batch-predict allows users to run predict jobs over a trained
TensorFlow model in SavedModel format in a batch mode. It is
[apache-beam](https://beam.apache.org/)-based and can run either locally
using a local runner in a K8s cluster or remotely using a remote
[runners](https://beam.apache.org/documentation/runners/capability-matrix/)
such as [Google Dataflow](https://cloud.google.com/dataflow) on GCP or other cloud services.


## Run a TensorFlow Batch Predict Job

**Note:** Before running a job, you should have [deployed kubeflow to your cluster](#deploy-kubeflow).

We treat each TensorFlow batch predict job as a [component](https://ksonnet.io/docs/tutorial#2-generate-and-deploy-an-app-component) in your APP.

Kubeflow ships with a [ksonnet prototype](https://ksonnet.io/docs/concepts#prototype)
suitable for you to to generate a component which you can then customize for your jobs.

### Create the component

```
MY_BATCH_PREDICT_JOB=my_batch_predict_job
GCP_CREDENTIAL_SECRET_NAME=my_secret
INPUT_FILE_PATTERNS=gs://my_data_bucket/my_file_pattens
MODEL_PATH=gs://my_model_bucket/my_model
OUTPUT_RESULT_PREFIX=gs://my_data_bucket/my_result_prefix
OUTPUT_ERROR_PREFIX=gs://my_data_bucket/my_error_prefix
BATCH_SIZE=4
INPUT_FILE_FORMAT=my_format

ks registry add kubeflow-git github.com/kubeflow/kubeflow/tree/${VERSION}/kubeflow
ks pkg install kubeflow-git/examples

ks generate tf-batch-predict ${MY_BATCH_PREDICT_JOB}
  --gcpCredentialSecretName=${GCP_CREDENTIAL_SECRET_NAME} \
  --inputFilePatterns=${INPUT_FILE_PATTERNS} \
  --inputFileFormat=${INPUT_FILE_FORMAT} \
  --modelPath=${MODEL_PATH} \
  --outputResultPrefix=${OUTPUT_RESULT_PREFIX} \
  --outputErrorPrefix=${OUTPUT_ERROR_PREFIX} \
  --batchSize=${BATCH_SIZE}

```

### Parameterize the component

You can set or update values for other optional parameters. For example, you can
set the inputFileFormat to a new value or set the output to another gcs
location. For example:

```
ks param set --env=default ${MY_BATCH_PREDICT_JOB} inputFileFormat tfrecord
ks param set --env=default ${MY_BATCH_PREDICT_JOB} outputResultPrefix gs://my_new_bucket
```

### Using GPUs

To use GPUs your cluster must be configured to use GPUs.

  * Nodes must have GPUs attached
  * K8s cluster must recognize the `nvidia.com/gpu` resource type
  * GPU drivers must be installed on the cluster.
  * For more information:
      * [K8s Instructions For Scheduling GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
      * [GKE Instructions](https://cloud.google.com/kubernetes-engine/docs/concepts/gpus)

When all the conditions above is satisfied, you should set the number of GPU to a positive
integer. For example:

```
ks param set --env=default ${MY_BATCH_PREDICT_JOB} numGpus 1
```

This way, the batch-predict job will use a GPU version and add appriorate
configuration when starting the kubenetes job.


### Submit the job

```
ks apply ${KF_ENV} -c ${MY_BATCH_PREDICT_JOB_NAME}

```

You should see that a job is started to provision the batch-predict docker image.
Then a pod starts to run the job.

```
kubectl get pods
kubectl logs -f ${POD_NAME}
```

You can check the state of the pod to determine if a job is in running,
failed, or completed. Once it is completed, you can check
${OUTPUT_RESULT_PREFIX} on gcs to see if any sensible results are generated. If
anything goes wrong, check ${OUTPUT_ERROR_PREFIX} where the error message is
stored.


### Delete the job

```
ks delete ${KF_ENV} -c ${MY_BATCH_PREDICT_JOB_NAME}
```

## Parameters for tf-batch-predict prototype


**Parameters**

  * **inputFilePatterns** The list of input files or file patterns, separated by commas.

  * **inputFileFormat** One of the following formats: json, tfrecord, and tfrecord_gzip. For the model in this example, the input is a JPEG-encoded image string tensor. The input file contains TF records of JPEG bytes. If you use a model from the [model zoo](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md) directly, the input is a numpy array instead. Then, your input file should contain multiple numeric arrays. Then the input format should be json. [Here](gs://kubeflow-examples-data/object-detection-coco/data/object-detection-images.json) is such a sample input, which contains two images.

  * **modelPath** The directory contains the model files in SavedModel format.

  * **batchSize** Number of records in one batch in the input data. Depending on the memory in your machine, it is
  recommend to be 1 to 4, up to 8 in this example.

  * **outputResultPrefix** Output path to save the prediction results.

  * **outputErrorPrefix** Output path to save the prediction errors.

  * **outputErrorPrefix** Output path to save the prediction errors.

  * **numGpus** Number of GPUs to use.

  * **gcpCredentialSecretName** Secret name if used on GCP.
