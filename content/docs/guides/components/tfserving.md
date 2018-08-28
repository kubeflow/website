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

Deploy the model component. Ksonnet will pick up existing parameters for your environment (e.g. cloud, nocloud) and customize the resulting deployment appropriately. To see more parameters look through [tf-serving.libsonnet](https://github.com/kubeflow/kubeflow/blob/master/kubeflow/tf-serving/tf-serving.libsonnet).

```
ks apply ${KF_ENV} -c ${MODEL_COMPONENT}
```

As before, a few pods and services have been created in your cluster. You can get the inception serving endpoint by querying kubernetes:

```
kubectl get svc inception -n=${NAMESPACE}
NAME        TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)          AGE
...
inception   LoadBalancer   10.35.255.136   ww.xx.yy.zz   9000:30936/TCP   28m
...
```

In this example, you should be able to use the inception_client to hit ww.xx.yy.zz:9000

The model at gs://kubeflow-models/inception is publicly accessible. However, if your environment doesn't
have google cloud credential setup, TF serving will not be able to read the model.
See this [issue](https://github.com/kubeflow/kubeflow/issues/621) for example.
To setup the google cloud credential, you should either have the environment variable
`GOOGLE_APPLICATION_CREDENTIALS` pointing to the credential file, or run `gcloud auth login`.
See [doc](https://cloud.google.com/docs/authentication/) for more detail.

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
Create the Bigquery dataset D and table T under your project P.
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

Start sending requests, and the fluentd worker will stream them to Bigquery.

### Next steps:
1. Support different backends other than Bigquery
1. Support request id (so that the logs can be joined). [Issue](https://github.com/kubeflow/kubeflow/issues/1220).
1. Optionally logs response and other metadata. We probably need a log config other than just sampling probability.
