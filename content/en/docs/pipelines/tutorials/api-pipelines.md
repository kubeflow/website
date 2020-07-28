+++
title = "Experiment with the Kubeflow Pipelines API"
description = "Get started with the Kubeflow Pipelines API"
weight = 20
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


This tutorial demonstrates how to use the Kubeflow Pipelines API to build, run, and manage pipelines. This guide is recommended for users who would like to learn how to manage Kubeflow Pipelines using the REST API.

## Before you start

This tutorial assumes that you have access to the `ml-pipeline` service. If Kubeflow is not configured to use an identity provider, use port-forwarding to directly access the service.

```
SVC_PORT=$(kubectl -n kubeflow get svc/ml-pipeline -o json | jq ".spec.ports[0].port")
kubectl port-forward -n kubeflow svc/ml-pipeline ${SVC_PORT}:8888
```

This tutorial assumes that the service is accessible on localhost.

You also need to install [jq](https://stedolan.github.io/jq/download/), and the [Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).

## Building and running a pipeline

Follow this guide to download, compile, and run the [`sequential.py` sample pipeline](https://github.com/kubeflow/pipelines/blob/master/samples/core/sequential/sequential.py). To learn how to compile and run pipelines using the Kubeflow Pipelines SDK or a Jupyter notebook, follow the [experimenting with Kubeflow Pipelines samples tutorial](/docs/pipelines/tutorials/build-pipeline/).

```
PIPELINE_URL=https://raw.githubusercontent.com/kubeflow/pipelines/master/samples/core/sequential/sequential.py
PIPELINE_FILE=${PIPELINE_URL##*/}
PIPELINE_NAME=${PIPELINE_FILE%.*}

wget -O ${PIPELINE_FILE} ${PIPELINE_URL}
dsl-compile --py ${PIPELINE_FILE} --output ${PIPELINE_NAME}.tar.gz
```

After running the commands above, you should get two files in your current directory: `sequential.py` and `sequential.tar.gz`. Run the following command to deploy the generated `.tar.gz` file as you would do using the [Kubeflow Pipelines UI](/docs/pipelines/sdk/build-component/#deploy-the-pipeline), but this time using the REST API.

```
SVC=localhost:8888
PIPELINE_ID=$(curl -F "uploadfile=@${PIPELINE_NAME}.tar.gz" ${SVC}/apis/v1beta1/pipelines/upload | jq -r .id)
```

If the operation was successful, you should see the pipeline in the central dashboard. You can also get the details using the `PIPELINE_ID` with the following API call.

```
curl ${SVC}/apis/v1beta1/pipelines/${PIPELINE_ID} | jq
```

The response should be similar to the following one:

```
{
  "id": "d30d28d7-0bfc-4f0c-8a57-6844a8ec9742",
  "created_at": "2020-02-20T16:15:02Z",
  "name": "sequential.tar.gz",
  "parameters": [
    {
      "name": "url",
      "value": "gs://ml-pipeline-playground/shakespeare1.txt"
    }
  ],
  "default_version": {
    "id": "d30d28d7-0bfc-4f0c-8a57-6844a8ec9742",
    "name": "sequential.tar.gz",
    "created_at": "2020-02-20T16:15:02Z",
    "parameters": [
      {
        "name": "url",
        "value": "gs://ml-pipeline-playground/shakespeare1.txt"
      }
    ],
    "resource_references": [
      {
        "key": {
          "type": "PIPELINE",
          "id": "d30d28d7-0bfc-4f0c-8a57-6844a8ec9742"
        },
        "relationship": "OWNER"
      }
    ]
  }
}
```

Finally, use the `PIPELINE_ID` to trigger a run of your pipeline.

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

Run the following command occasionally to see how the status of your run changes. After a while, the status of your pipeline should change to **Succeeded**.

```
curl ${SVC}/apis/v1beta1/runs/${RUN_ID} | jq
```

The response should be similar to the following one:

```
{
  "run": {
    "id": "4ff0debd-d6d7-4681-8593-21ec002e6e0c",
    "name": "sequential_run",
    "pipeline_spec": {
      "pipeline_id": "d30d28d7-0bfc-4f0c-8a57-6844a8ec9742",
      "pipeline_name": "sequential.tar.gz",
      "workflow_manifest": "{...}"
    },
    "resource_references": [
      {
        "key": {
          "type": "EXPERIMENT",
          "id": "27af7eee-ce0a-44ba-a44d-07142abfc83c"
        },
        "name": "Default",
        "relationship": "OWNER"
      }
    ],
    "created_at": "2020-02-20T16:18:58Z",
    "scheduled_at": "1970-01-01T00:00:00Z",
    "finished_at": "1970-01-01T00:00:00Z",
    "status": "Succeeded"
  },
  "pipeline_runtime": {
    "workflow_manifest": "{...}"
  }
}
```

Read [Kubeflow Pipelines API Reference](/docs/pipelines/reference/api/kubeflow-pipeline-api-spec/) to learn more about how to use the API.
