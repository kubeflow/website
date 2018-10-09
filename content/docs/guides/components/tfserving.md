+++
title = "TensorFlow Serving"
description = ""
weight = 10
toc = true
bref= "Training and serving using TFJob"
[menu]
[menu.docs]
  parent = "components"
 weight = 50
+++

## Serving a model

We treat each deployed model as a [component](https://ksonnet.io/docs/tutorial#2-generate-and-deploy-an-app-component) in your APP.

Generate Tensorflow model server component

```
MODEL_COMPONENT=serveInception
MODEL_NAME=inception
ks generate tf-serving ${MODEL_COMPONENT} --name=${MODEL_NAME}
```

### Serving http requests
To serve http traffic with the REST API, you can deploy the http-proxy container.

Deploy [http proxy](https://github.com/kubeflow/kubeflow/tree/master/components/k8s-model-server/http-proxy)
```
ks param set ${MODEL_COMPONENT} deployHttpProxy true
```

TF Serving now has built-in http server. We will support this and make it easy to use soon.

### Pointing to the model
Depending where model file is located, set correct parameters

*Google cloud*

```
MODEL_PATH=gs://kubeflow-models/inception
ks param set ${MODEL_COMPONENT} modelPath ${MODEL_PATH}
```

*S3*

To use S3, first you need to create secret that will contain access credentials.

```
apiVersion: v1
metadata:
  name: secretname
data:
  AWS_ACCESS_KEY_ID: bmljZSB0cnk6KQ==
  AWS_SECRET_ACCESS_KEY: YnV0IHlvdSBkaWRuJ3QgZ2V0IG15IHNlY3JldCE=
kind: Secret
```

Enable S3, set url and point to correct Secret

```
MODEL_PATH=s3://kubeflow-models/inception
ks param set ${MODEL_COMPONENT} modelPath ${MODEL_PATH}
ks param set ${MODEL_COMPONENT} s3Enable True
ks param set ${MODEL_COMPONENT} s3SecretName secretname
```

Optionally you can also override default parameters of S3

```
# S3 region
ks param set ${MODEL_COMPONENT} s3AwsRegion us-west-1

# true Whether or not to use https for S3 connections
ks param set ${MODEL_COMPONENT} s3UseHttps true

# Whether or not to verify https certificates for S3 connections
ks param set ${MODEL_COMPONENT} s3VerifySsl true

# URL for your s3-compatible endpoint.
ks param set ${MODEL_COMPONENT} s3Endpoint http://s3.us-west-1.amazonaws.com
```

*NFS*

```
MODEL_PATH=/mnt/var/nfs/general/inception
MODEL_STORAGE_TYPE=nfs
NFS_PVC_NAME=nfs
ks param set ${MODEL_COMPONENT} modelPath ${MODEL_PATH}
ks param set ${MODEL_COMPONENT} modelStorageType ${MODEL_STORAGE_TYPE}
ks param set ${MODEL_COMPONENT} nfsPVC ${NFS_PVC_NAME}
```

### Using GPU
To serve a model with GPU, first make sure your Kubernetes cluster has a GPU node. Then set an additional param:
```
ks param set ${MODEL_COMPONENT} numGpus 1
```
 There is an [example](https://github.com/kubeflow/examples/blob/master/object_detection/tf_serving_gpu.md)
for serving an object detection model with GPU.

### Deploying

Deploy the model component. Ksonnet will pick up existing parameters for your environment (e.g. cloud, nocloud) and customize the resulting deployment appropriately. To see more parameters look through tf-serving {{% tf-serving-version %}} or later.

```
ks apply ${KF_ENV} -c ${MODEL_COMPONENT}
```

The model at gs://kubeflow-models/inception is publicly accessible. However, if your environment doesn't
have google cloud credential setup, TF serving will not be able to read the model.
See this [issue](https://github.com/kubeflow/kubeflow/issues/621) for example.
To setup the google cloud credential, you should either have the environment variable
`GOOGLE_APPLICATION_CREDENTIALS` pointing to the credential file, or run `gcloud auth login`.
See [doc](https://cloud.google.com/docs/authentication/) for more detail.

### Sending prediction request directly
If the service type is LoadBalancer, it will have its own accessible external ip.
Get the external ip by:

```
kubectl get svc inception
```

And then send the request

```
curl -X POST -d @input.json http://EXTERNAL_IP:8000/model/inception:predict
```

### Sending prediction request through ingress and IAP
If the service type is ClusterIP, you can access through ingress.
It's protected and only one with right credentials can access the endpoint.
Below shows how to programmatically authenticate a service account to access IAP.

1. Save the client id you used to [deploy Kubeflow](https://www.kubeflow.org/docs/started/getting-started-gke/) as `IAP_CLIENT_ID`.
2. Create a service account
   ```
   gcloud iam service-accounts create --project=$PROJECT $SERVICE_ACCOUNT
   ```
3. Grant the service account access to IAP enabled resources:
   ```
   gcloud projects add-iam-policy-binding $PROJECT \
    --role roles/iap.httpsResourceAccessor \
    --member serviceAccount:$SERVICE_ACCOUNT
   ```
4. Download the service account key:
   ```
   gcloud iam service-accounts keys create ${KEY_FILE} \
      --iam-account ${SERVICE_ACCOUNT}@${PROJECT}.iam.gserviceaccount.com
   ```
5. Export the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to point to the key file of the service account.

Finally, you can send the request with this python
[script](https://github.com/kubeflow/kubeflow/blob/master/docs/gke/iap_request.py)

```
python iap_request.py https://YOUR_HOST/models/MODEL_NAME/ IAP_CLIENT_ID --input=YOUR_INPUT_FILE
```

## Telemetry using Istio

Please look at the [Istio guide](/docs/guides/components/istio/).

## Logs and metrics with Stackdriver
See [here](/docs/guides/monitoring/) for instructions to get logs and metrics
using Stackdriver.

## Request logging

It currently supports streaming to BigQuery.

### Motivation
Logging the requests and responses enables log analysis, continuous training, and skew detection.

### Usage:
Create the BigQuery dataset D and table T under your project P.
The schema should also be set.

```
ks pkg install kubeflow/tf-serving
ks generate tf-serving-request-log mnist --gcpProject=P --dataset=D --table=T
```

Modify `tf-serving-with-request-log.jsonnet` as needed:
  - change the param of http proxy for logging, e.g. `--request_log_prob=0.1` (Default is 0.01).

```
ks apply ENV -c mnist
```

Start sending requests, and the fluentd worker will stream them to BigQuery.

### Next steps:
1. Support different backends other than Bigquery
1. Support request id (so that the logs can be joined). [Issue](https://github.com/kubeflow/kubeflow/issues/1220).
1. Optionally logs response and other metadata. We probably need a log config other than just sampling probability.
