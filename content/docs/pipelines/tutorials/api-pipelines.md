+++
title = "Experiment with the Pipelines API"
description = "Get started with the Kubeflow Pipelines API"
weight = 1
+++

## Before you start

This tutorial assumes that you have access to the `ml-pipeline` service. If you didn’t configure Kubeflow to integrate with an identity provider, then you can port-forward directly to the service:

```
SVC_PORT=$(kubectl -n kubeflow get svc/ml-pipeline -o json | jq ".spec.ports[0].port")
kubectl port-forward -n kubeflow svc/ml-pipeline ${SVC_PORT}:8888
```

For this tutorial, we are going to assume that the service is accessible in localhost.

You also need to install [jq](https://stedolan.github.io/jq/download/), and the [Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).

## Building and running a pipeline

In this example, similarly to the [Experiment with the Pipelines Samples](/docs/pipelines/tutorials/build-pipeline/) tutorial, we are going to download and compile the
[`sequential.py` sample pipeline](https://github.com/kubeflow/pipelines/blob/master/samples/core/sequential/sequential.py).

```
PIPELINE_URL=https://raw.githubusercontent.com/kubeflow/pipelines/master/samples/core/sequential/sequential.py
PIPELINE_FILE=${PIPELINE_URL##*/}
PIPELINE_NAME=${PIPELINE_FILE%.*}

wget -O ${PIPELINE_FILE} ${PIPELINE_URL}
dsl-compile --py ${PIPELINE_FILE} --output ${PIPELINE_NAME}.tar.gz
```

After running the commands above, you should get two files in your current directory: `sequential.py` and `sequential.tar.gz`. We are going to deploy the generated `.tar.gz` file as we would do using the [Kubeflow Pipelines UI](/docs/pipelines/sdk/build-component/#deploy-the-pipeline), but this time using the API.

```
SVC=localhost:8888
PIPELINE_ID=$(curl -F "uploadfile=@${PIPELINE_NAME}.tar.gz" ${SVC}/apis/v1beta1/pipelines/upload | jq -r .id)
```

If the operation was successful, you should see the pipeline in the central dashboard. You can also get the details using the following API call.

```
curl ${SVC}/apis/v1beta1/pipelines/${PIPELINE_ID} | jq
```

Then, you can trigger a run using the obtained id.

```
RUN_ID=$((
curl -H "Content-Type: application/json" -X POST ${SVC}/apis/v1beta1/runs \
-d @- << EOF
{
   "name":"${PIPELINE_NAME}_run",
   "pipeline_spec":{
      "pipeline_id":"${PIPELINE_ID}"
   }
}
EOF
) | jq -r .run.id)
```

After a while, the status of your pipeline should change to "Succeeded".

```
curl ${SVC}/apis/v1beta1/runs/${RUN_ID} | jq
```

Please, take a look at the [Kubeflow Pipelines API Reference](docs/pipelines/reference/api/kubeflow-pipeline-api-spec/) for more information about how to use the API.
