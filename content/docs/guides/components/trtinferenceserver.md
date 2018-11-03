# NVIDIA TensorRT Inference Server

NVIDIA TensorRT Inference Server is a REST and GRPC service for deep-learning
inferencing of TensorRT, TensorFlow and Caffe2 models. The server is
optimized deploy machine and deep learning algorithms on both GPUs and
CPUs at scale.

These instructions detail how to set up a GKE cluster suitable for
running the NVIDIA TensorRT Inference Server and how to use the
`io.ksonnet.pkg.nvidia-inference-server` prototype to generate
Kubernetes YAML and deploy to that cluster.

For more information on the NVIDIA TensorRT Inference Server see the [NVIDIA TensorRT
Inference Server User
Guide](https://docs.nvidia.com/deeplearning/sdk/inference-user-guide/index.html)
and the [NVIDIA TensorRT Inference Server
Clients](https://github.com/NVIDIA/dl-inference-server) open-source
repository.

## Setup

Please refer to the [Google Kubernetes Engine Cluster for Kubeflow](https://www.kubeflow.org/docs/started/getting-started-gke/) guide for set up instructions.  

## NVIDIA TensorRT Inference Server Image

The docker image for the NVIDIA TensorRT Inference Server is available on the
[NVIDIA GPU Cloud](https://ngc.nvidia.com). Below you will add a
Kubernetes secret to allow you to pull this image. As initialization
you must first register at NVIDIA GPU Cloud and follow the directions
to obtain your API key. You can confirm the key is correct by
attempting to login to the registry and checking that you can pull the
inference server image. See [Pull an Image from a Private
Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry)
for more information about using a private registry.

```shell
$ docker login nvcr.io
Username: $oauthtoken
Password: <your-api-key>
```

Now use the NVIDIA GPU Cloud API key from above to create a kubernetes
secret called `ngc`. This secret allows Kubernetes to pull the
inference server image from the NVIDIA GPU Cloud registry. Replace
<api-key> with your API key and <ngc-email> with your NVIDIA GPU Cloud
email. Make sure that for `docker-username` you specify the value
exactly as shown, including the backslash.

```shell
$ kubectl create secret docker-registry ngc --docker-server=nvcr.io --docker-username=\$oauthtoken --docker-password=<api-key> --docker-email=<ngc-email>
```

## Model Repository

The inference server needs a repository of models that it will make
available for inferencing. You can find an example repository in the
[open-source repo](https://github.com/NVIDIA/dl-inference-server) and
instructions on how to create your own model repository in the [NVIDIA
Inference Server User
Guide](https://docs.nvidia.com/deeplearning/sdk/inference-user-guide/index.html).

For this example you will place the model repository in a Google Cloud
Storage bucket.

```shell
$ gsutil mb gs://inference-server-model-store
```

Following these
[instructions](https://github.com/NVIDIA/dl-inference-server) download
the example model repository to your system and copy it into the GCS
bucket.

```shell
$ gsutil cp -r model_store gs://inference-server-model-store
```

## Kubernetes Generation and Deploy

Next use ksonnet to generate Kubernetes configuration for the NVIDIA TensorRT
Inference Server deployment and service. The --image option points to
the NVIDIA Inference Server container in the [NVIDIA GPU Cloud
Registry](https://ngc.nvidia.com). For the current implementation you
must use the 18.08.1 container. The --modelRepositoryPath option
points to our GCS bucket that contains the model repository that you
set up earlier.

```shell
$ ks init my-inference-server
$ cd my-inference-server
$ ks registry add kubeflow https://github.com/kubeflow/kubeflow/tree/master/kubeflow
$ ks pkg install kubeflow/nvidia-inference-server
$ ks generate nvidia-inference-server iscomp --name=inference-server --image=nvcr.io/nvidia/inferenceserver:18.08.1-py2 --modelRepositoryPath=gs://inference-server-model-store/tf_model_store
```

Next deploy the service.

```shell
$ ks apply default -c iscomp
```

## Using the TensorRT Inference Server

Now that the inference server is running you can send HTTP or GRPC
requests to it to perform inferencing. By default the inferencing
service is exposed with a LoadBalancer service type. Use the following
to find the external IP for the inference service. In this case it is
35.232.176.113.

```shell
$ kubectl get services
NAME         TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)                                        AGE
inference-se LoadBalancer   10.7.241.36   35.232.176.113   8000:31220/TCP,8001:32107/TCP,8002:31682/TCP   1m
kubernetes   ClusterIP      10.7.240.1    <none>           443/TCP                                        1h
```

The inference server exposes an HTTP endpoint on port 8000, and GRPC
endpoint on port 8001 and a Prometheus metrics endpoint on port
8002. You can use curl to get the status of the inference server from
the HTTP endpoint.

```shell
$ curl 35.232.176.113:8000/api/status
```

Follow the
[instructions](https://github.com/NVIDIA/dl-inference-server) to build
the inference server example image and performance clients. You can
then use these examples to send requests to the server. For example,
for an image classification model use the image\_client example to
perform classification of an image.

```shell
$ image_client -u 35.232.176.113:8000 -m resnet50_netdef -c3 mug.jpg
Output probabilities:
batch 0: 504 (COFFEE MUG) = 0.777365267277
batch 0: 968 (CUP) = 0.213909029961
batch 0: 967 (ESPRESSO) = 0.00294389552437
```

## Cleanup

When done use `ks` to remove the deployment.

```shell
$ ks delete default -c iscomp
```

If you create a cluster then make sure to also delete that.

```shell
$ gcloud container clusters delete myinferenceserver
```
