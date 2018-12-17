+++
title = "TensorFlow Serving"
description = ""
weight = 10
toc = true
bref= "Serving Tensorflow models"
[menu]
[menu.docs]
  parent = "components"
 weight = 51
+++

## Serving a model

We treat each deployed model as two [components](https://ksonnet.io/docs/tutorial#2-generate-and-deploy-an-app-component)
in your APP: one tf-serving-deployment, and one tf-serving-service.
We can think of the service as a model, and the deployment as the version of the model.

Generate the service(model) component

```
ks generate tf-serving-service mnist-service
ks param set mnist-service modelName mnist    // match your deployment mode name
ks param set mnist-service trafficRule v1:100    // optional, it's the default value
```

Generate the deployment(version) component

```
MODEL_COMPONENT=mnist-v1
ks generate tf-serving-deployment-gcp ${MODEL_COMPONENT}
ks param set ${MODEL_COMPONENT} modelName mnist
ks param set ${MODEL_COMPONENT} versionName v1   // optional, it's the default value
ks param set ${MODEL_COMPONENT} modelBasePath gs://kubeflow-examples-data/mnist
ks param set ${MODEL_COMPONENT} gcpCredentialSecretName user-gcp-sa
ks param set ${MODEL_COMPONENT} injectIstio true   // If you want to use istio
```

We enable TF Serving's REST API, and it's able to serve HTTP requests. The API is the same as our http proxy before.

### Pointing to the model
Depending where model file is located, set correct parameters

*Google cloud*

Set the param as above section.

We need a service account that can access the model.
If you are using Kubeflow's click-to-deploy app, there should be already a secret, `user-gcp-sa`, in the cluster.

The model at gs://kubeflow-examples-data/mnist is publicly accessible. However, if your environment doesn't
have google cloud credential setup, TF serving will not be able to read the model.
See this [issue](https://github.com/kubeflow/kubeflow/issues/621) for example.
To setup the google cloud credential, you should either have the environment variable
`GOOGLE_APPLICATION_CREDENTIALS` pointing to the credential file, or run `gcloud auth login`.
See [doc](https://cloud.google.com/docs/authentication/) for more detail.

*S3*

To use S3, generate a different prototype
```
ks generate tf-serving-deployment-aws ${MODEL_COMPONENT} --name=${MODEL_NAME}
```

First you need to create secret that will contain access credentials. Use base64 to encode your credentials and check deails here [Creating a Secret Manually](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret-manually)
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
ks param set ${MODEL_COMPONENT} modelBasePath ${MODEL_PATH}
ks param set ${MODEL_COMPONENT} s3Enable True
ks param set ${MODEL_COMPONENT} s3SecretName secretname
```

Optionally you can also override default parameters of S3

```
# S3 region
ks param set ${MODEL_COMPONENT} s3AwsRegion us-west-1

# Whether or not to use https for S3 connections
ks param set ${MODEL_COMPONENT} s3UseHttps true

# Whether or not to verify https certificates for S3 connections
ks param set ${MODEL_COMPONENT} s3VerifySsl true

# URL for your s3-compatible endpoint.
ks param set ${MODEL_COMPONENT} s3Endpoint s3.us-west-1.amazonaws.com
```

### Using GPU
To serve a model with GPU, first make sure your Kubernetes cluster has a GPU node. Then set an additional param:
```
ks param set ${MODEL_COMPONENT} numGpus 1
```
 There is an [example](https://github.com/kubeflow/examples/blob/master/object_detection/tf_serving_gpu.md)
for serving an object detection model with GPU.

### Deploying

```
ks apply ${KF_ENV} -c mnist-service
ks apply ${KF_ENV} -c ${MODEL_COMPONENT}
```

### Sending prediction request directly
If the service type is LoadBalancer, it will have its own accessible external ip.
Get the external ip by:

```
kubectl get svc mnist-service
```

And then send the request

```
curl -X POST -d @input.json http://EXTERNAL_IP:8500/v1/models/mnist:predict
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
python iap_request.py https://YOUR_HOST/tfserving/models/mnist IAP_CLIENT_ID --input=YOUR_INPUT_FILE
```

## Telemetry and Rolling out model using Istio

Please look at the [Istio guide](/docs/guides/components/istio/).

## Logs and metrics with Stackdriver
See [here](/docs/guides/monitoring/) for instructions to get logs and metrics
using Stackdriver.
