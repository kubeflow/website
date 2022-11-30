+++
title = "BentoML"
description = "Model serving with BentoML"
weight = 45

+++


[BentoML](https://bentoml.org) makes it easy to create ML-powered prediction services that are ready to deploy and scale.

Data Scientists and ML Engineers use BentoML to:

* Accelerate and standardize the process of taking ML models to production.
* Build scalable and high performance prediction services.
* Continuously deploy, monitor, and operate prediction services in production.

This guide demonstrates how to serve a BentoML deployable, “bento”, in a Kubernetes cluster.


## Prerequisites

Before starting this tutorial, make sure you have the following:

* a Kubernetes cluster and `kubectl` installed on your local machine.
    * `kubectl` install instruction: https://kubernetes.io/docs/tasks/tools/install-kubectl/
* Docker and Docker Hub installed and configured in your local machine.
    * Docker install instruction: https://docs.docker.com/get-docker/
* Python 3.8 or above and required PyPI packages: `bentoml`,
    * ```pip install bentoml```


## Download and import the example bento
This step of the guide will download and import the pre-built example Iris Classifier bento. BentoML provides CLI commands for importing and exporting bentos. Follow the BentoML [quickstart tutorial](https://docs.bentoml.org/en/latest/tutorial.html) if you wish to learn how to build bentos from scratch.

With system already configured with AWS access:
```
pip install fs-s3fs
bentoml import s3://bentoml.com/quickstart/iris_classifier.bento
```

For the system without AWS configuration:
```
#Download the example bento to a local directory
curl https://bentoml.com.s3.amazonaws.com/quick star/iris_classifier.bento --output ./iris_classifier.bento
bentoml import ./iris_classifier.bento
```
After import is complete. Use `bentoml list iris_classifier` command to confirm the import was successful.
```
# example output

Tag                               Size       Creation Time        Path
iris_classifier:6mxwnbar3wj672ue  15.87 KiB  2022-08-01 14:07:36  ~/bentoml/bentos/iris_classifier/6mxwnbar3wj672ue
iris_classifier:bazyb4hyegn272ue  15.92 KiB  2022-06-29 20:02:28  ~/bentoml/bentos/iris_classifier/bazyb4hyegn272ue
iris_classifier:x33xm2gp5wrpb2ue  19.69 KiB  2022-05-09 16:14:17  ~/bentoml/bentos/iris_classifier/x33xm2gp5wrpb2ue
```

BentoML provides first-class support for containerization. Use the `bentoml containerize` command to build a Docker image and push to the Docker registry.
```
# Replace `{docker_username} with your Docker Hub username
bentoml containerize iris_classifier:latest -t {docker_username}/iris_classifier
docker push {docker_username}/iris_classifier
```


## Deploy model server to Kubernetes

The following is an example YAML file for specifying the resources required to run and
expose a BentoML model server in a Kubernetes cluster. Replace `{docker_username}`
with your Docker Hub username and save it to `iris-classifier.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: iris-classifier
  name: iris-classifier
  namespace: kubeflow
spec:
  ports:
  - name: classify
    port: 3000
    targetPort: 3000
  selector:
    app: iris-classifier
  type: LoadBalancer
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: iris-classifier
  name: iris-classifier
  namespace: kubeflow
spec:
  selector:
    matchLabels:
      app: iris-classifier
  template:
    metadata:
      labels:
        app: iris-classifier
    spec:
      containers:
      - image: {docker_username}/iris_classifier
        imagePullPolicy: IfNotPresent
        name: iris-classifier
        ports:
        - containerPort: 3000
```

Use `kubectl` CLI to deploy the model API server to the Kubernetes cluster

```shell
kubectl apply -f iris-classifier.yaml
```

## Send prediction request

Use `kubectl describe` command to get the `NODE_PORT`

```shell
kubectl describe svc iris-classifier --namespace kubeflow
```

And then send the request:

```shell
curl -i \
  --header "Content-Type: application/json" \
  --request POST \
  --data '[[5.1, 3.5, 1.4, 0.2]]' \
  http://EXTERNAL_IP:NODE_PORT/classify
```

## Additional resources

* [GitHub repository](https://github.com/bentoml/BentoML)
* [BentoML documentation](https://docs.bentoml.org)
* [Quick start guide](https://docs.bentoml.org/en/latest/quickstart.html)
* [Community](https://l.linklyhq.com/l/ktIc)
