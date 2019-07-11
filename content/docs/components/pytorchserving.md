+++
title = "PyTorch Serving"
description = "Instructions for serving a PyTorch model with Seldon"
+++

This guide walks you through serving a PyTorch trained model in Kubeflow.

## Serving a model

We use [seldon-core](https://github.com/SeldonIO/seldon-core) component deployed following [these](/docs/components/seldon/) instructions to serve the model.

See also this [Example module](https://github.com/kubeflow/examples/blob/master/pytorch_mnist/serving/seldon-wrapper/mnistddpserving.py) which contains the code to wrap the model with Seldon. 

We will wrap this class into a seldon-core microservice which we can then deploy as a REST or GRPC API server.

##  Building a model server

We use the public model server image `gcr.io/kubeflow-examples/mnistddpserving` as an example

  * This server loads the model from the mount point /mnt/kubeflow-gcfs and includes the supporting assets baked into the container image
  * So you can just run this image to get a pre-trained model from the shared persistent disk
  * Serving your own model using this server, exposing predict service as GRPC API

## Building your own model server

You can use the below command to build your own image to wrap your model, also check [this](https://github.com/kubeflow/examples/blob/master/pytorch_mnist/serving/seldon-wrapper/build_image.sh) 
script example that calls the docker Seldon wrapper to build our server image, exposing the predict service as GRPC API.
```
docker run -v $(pwd):/my_model seldonio/core-python-wrapper:0.7 /my_model mnistddpserving 0.1 gcr.io --image-name=kubeflow-examples/mnistddpserving --grpc
```

You can then push the image by running `gcloud docker -- push gcr.io/kubeflow-examples/mnistddpserving:0.1`.

You can find more details about wrapping a model with seldon-core [here](https://docs.seldon.io/projects/seldon-core/en/latest/python/index.html)

## Deploying the model to your Kubeflow cluster

We need to have seldon component deployed, you can deploy the model once trained using a pre-defined ksonnet component, similar to [this](https://github.com/kubeflow/examples/blob/master/pytorch_mnist/ks_app/components/serving_model.jsonnet) example.

Create an environment variable, `${KF_ENV}`, to represent a conceptual
deployment environment such as development, test, staging, or production, as
defined by ksonnet. For this example, we use the `default` environment. You can
read more about Kubeflow's use of ksonnet in the Kubeflow 
[ksonnet component guide](/docs/components/ksonnet/).

Then modify the Ksonnet component 
[parameters](https://github.com/kubeflow/examples/blob/master/pytorch_mnist/ks_app/components/params.libsonnet) to use your specific image.

```bash
export KF_ENV=default
cd ks_app
ks env add ${KF_ENV}
ks apply ${KF_ENV} -c serving_model
```

## Testing model server

Seldon Core component uses ambassador to route it's requests to our model server. To send requests to the model, you can port-forward the ambassador container locally:

```
kubectl port-forward $(kubectl get pods -n ${NAMESPACE} -l service=ambassador -o jsonpath='{.items[0].metadata.name}') -n ${NAMESPACE} 8080:80
```

And send a request, for our example we know is not a torch MNIST image, so it will return an error 500

```
curl -X POST -H 'Content-Type: application/json' -d '{"data":{"int":"8"}}' http://localhost:8080/seldon/mnist-classifier/api/v0.1/predictions
```

We should receive an error response as the model server is expecting a 1x786 vector representing a torch image, this will be sufficient to confirm the server model is up and running
(This is to avoid having to send manually a vector of 786 pixels, you can interact properly with the model using a web interface if you follow all the 
[instructions](https://github.com/kubeflow/examples/tree/master/pytorch_mnist) in the example)

```
{
"timestamp":1540899355053,
"status":500,"error":"Internal Server Error",
"exception":"io.grpc.StatusRuntimeException",
"message":"UNKNOWN: Exception calling application: tensor is not a torch image.",
"path":"/api/v0.1/predictions"
}
```
