+++
title = "TensorFlow Batch Predict"
description = "See Kubeflow [v0.6 docs](https://v0-6.kubeflow.org/docs/components/serving/tfbatchpredict/) for Batch Prediction with TensorFlow models"
weight = 60
+++

[Batch Predict](https://github.com/kubeflow/batch-predict) is not supported in Kubeflow versions greater than 0.6.

{{% alert title="Alpha version" color="warning" %}}
These docs are for an <b>alpha</b> release of Batch prediction and the batch predict code hasn't been updated in over a year. It's not clear what the path forward is on this feature. If you are using this it, the development team is interested in any feedback you have.
{{% /alert %}}

## Kubeflow Batch Predict

Kubeflow batch-predict allows users to run predict jobs over a trained
TensorFlow model in SavedModel format in a batch mode. It is
[apache-beam](https://beam.apache.org/)-based and currently runs with a local
runner on a single node in a Kubernetes cluster.


## Run a TensorFlow Batch Predict Job

**Note:** Before running a job, you should have [deployed kubeflow to your cluster](#deploy-kubeflow).

To run batch prediction, we create a Kubernetes job to run beam.  Kubeflow provides a [ksonnet prototype](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/kubeflow/examples/prototypes/tf-batch-predict.jsonnet) suitable for you to to generate a component which you can then customize for your jobs.

### Create the component

```
MY_BATCH_PREDICT_JOB=my_batch_predict_job
GCP_CREDENTIAL_SECRET_NAME=user-gcp-sa
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

The supported parameters and their usage:

  * **inputFilePatterns** The list of input files or file patterns, separated by commas.

  * **inputFileFormat** One of the following values: json, tfrecord, and tfrecord_gzip.

  * **modelPath** The path containing the model files in SavedModel format.

  * **batchSize** Number of prediction instances in one batch. This largely
    depends on how many instances can be held and processed simultaneously in the
    memory of your machine.

  * **outputResultPrefix** Output path to save the prediction results.

  * **outputErrorPrefix** Output path to save the prediction errors.

  * **numGpus** Number of GPUs to use per machine.

  * **gcpCredentialSecretName** Secret name if used on GCP. Only needed for running the jobs in GKE in order to output results to GCS.

You can set or update values for optional parameters after generating the
component. For example, you can set the modelPath to a new value (e.g. to test
out another model) or set the output to another gcs location (e.g. in order not
to overwrite the results from previous
runs). For example:

```
ks param set --env=default ${MY_BATCH_PREDICT_JOB} modelPath gs://my_new_bucket/my_new_model
ks param set --env=default ${MY_BATCH_PREDICT_JOB} outputResultPrefix gs://my_new_bucket/my_new_output
```


### Use GPUs

To use GPUs your cluster must be configured to use GPUs.

  * Nodes must have GPUs attached.
  * The Kubernetes cluster must recognize the `nvidia.com/gpu` resource type.
  * GPU drivers must be installed on the cluster.
  * For more information:
      * [Kubernetes instructions for scheduling GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
      * [GKE instructions](https://cloud.google.com/kubernetes-engine/docs/concepts/gpus)

When all the conditions above are satisfied, you should set the number of GPUs to a positive integer. For example:

```
ks param set --env=default ${MY_BATCH_PREDICT_JOB} numGpus 1
```

This way, the batch-predict job will use a GPU version of docker image and add appropriate
configuration to start the kubernetes job.


### Submit the job

```
export KF_ENV=default
ks apply ${KF_ENV} -c ${MY_BATCH_PREDICT_JOB_NAME}
```

The `KF_ENV` environment variable represents a conceptual deployment environment 
such as development, test, staging, or production, as defined by 
ksonnet. For this example, we use the `default` environment.
You can read more about Kubeflow's use of ksonnet in the Kubeflow 
[ksonnet component guide](/docs/components/ksonnet/).

You should see that a job is started to provision the batch-predict docker image.
Then a pod starts to run the job.

```
kubectl get pods
kubectl logs -f ${POD_NAME}
```

You can check the state of the pod to determine if a job is running,
failed, or completed. Once it is completed, you can check
the result output location to see if any sensible results are generated. If
anything goes wrong, check the error output location where the error message is
stored.

### Delete the job

```
ks delete ${KF_ENV} -c ${MY_BATCH_PREDICT_JOB_NAME}
```
