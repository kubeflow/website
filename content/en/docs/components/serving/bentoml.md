+++
title = "BentoML"
description = "Model serving with BentoML"
weight = 40
+++

{{% stable-status %}}

## Model serving with BentoML

In this guide, we will demo serving a scikit-learn based iris classifier model with
BentoML on a Kubernetes cluster. The same deployment steps is also applicable for models
trained with other machine learning frameworks, see more BentoML examples
[here](https://docs.bentoml.org/en/latest/examples.html).

[BentoML](https://bentoml.org) is an open-source platform for high-performance ML model
serving. It makes building production API endpoint for your ML model easy and supports
all major machine learning training frameworks, including Tensorflow, Keras, PyTorch,
XGBoost, scikit-learn and etc.

BentoML comes with a high-performance API model server with adaptive micro-batching
support, which achieves the advantage of batch processing in online serving. It also
provides model management and model deployment functionality, giving ML teams an
end-to-end model serving workflow, with DevOps best practices baked in.

### Prerequisites

1. a Kubernetes cluster and `kubectl` installed on your local machine.
    * `kubectl` install instruction: https://kubernetes.io/docs/tasks/tools/install-kubectl/
2. Docker and Docker Hub installed and configured in your local machine.
    * Docker install instruction: https://docs.docker.com/get-docker/
3. Python 3.6 or above and required PyPi packages: `bentoml`, `scikit-learn`
    * ```pip install bentoml scikit-learn```

### Build an iris classifier model server with BentoML

The following code defines a BentoML prediction service that requires a `scikit-learn` model, and
asks BentoML to figure out the required PyPI packages automatically. It also defined an
API, which is the entry point for accessing this prediction service. And the API is
expecting a `pandas.DataFrame` object as its input data.

```python
# iris_classifier.py
from bentoml import env, artifacts, api, BentoService
from bentoml.handlers import DataframeHandler
from bentoml.artifact import SklearnModelArtifact

@env(auto_pip_dependencies=True)
@artifacts([SklearnModelArtifact('model')])
class IrisClassifier(BentoService):

    @api(DataframeHandler)
    def predict(self, df):
        return self.artifacts.model.predict(df)
```

The following code trains a classifier model and serve it with the IrisClassifier
defined above:

```python
# main.py
from sklearn import svm
from sklearn import datasets

from iris_classifier import IrisClassifier

if __name__ == "__main__":
    # Load training data
    iris = datasets.load_iris()
    X, y = iris.data, iris.target

    # Model Training
    clf = svm.SVC(gamma='scale')
    clf.fit(X, y)

    # Create a iris classifier service instance
    iris_classifier_service = IrisClassifier()

    # Pack the newly trained model artifact
    iris_classifier_service.pack('model', clf)

    # Save the prediction service to disk for model serving
    saved_path = iris_classifier_service.save()
```

The sample code above can be found in the BentoML repository, run them directly with the
following command:

```shell
git clone git@github.com:bentoml/BentoML.git
python ./bentoml/guides/quick-start/main.py
```

After saving the BentoService instance, you can now start a REST API server with the
model trained and test the API server locally:

```shell
# Start BentoML API server:
bentoml serve IrisClassifier:latest
```

```bash
# Send test request
curl -i \
  --header "Content-Type: application/json" \
  --request POST \
  --data '[[5.1, 3.5, 1.4, 0.2]]' \
  localhost:5000/predict
```

BentoML provides a convenient way of containerizing the model API server with Docker. To
create a docker container image for the sample model above:

Find the file directory of the SavedBundle with `bentoml get` command, which is
directory structured as a docker build context. Running docker build with this
directory produces a docker image containing the model API server. Replace
`{docker_username}` with your Docker Hub username and run the following code:

```shell
saved_path=$(bentoml get IrisClassifier:latest -q | jq -r ".uri.uri")

docker build -t {docker_username}/iris-classifier $saved_path
docker push {docker_username}/iris-classifier
```

### Deploy model server to Kubernetes

The following is an example YAML file for specifying the resources required to run and
expose a BentoML model server in a Kubernetes cluster. Replacing `{docker_username}`
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
  - name: predict
    port: 5000
    targetPort: 5000
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
      - image: {docker_username}/iris-classifier
        imagePullPolicy: IfNotPresent
        name: iris-classifier
        ports:
        - containerPort: 5000
```

Use `kubectl` CLI to deploy the model API server to the kubernetes cluster

```shell
kubectl apply -f iris-classifier.yaml
```

### Send prediction request

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
  http://EXTERNAL_IP:NODE_PORT/predict
```

### Monitor metrics with Prometheus

#### Perquisites

- Prometheus installed in the cluster
  - [Prometheus documentation](https://prometheus.io/docs/introduction/overview/)
  - [Installation instruction with Helm chart](https://github.com/helm/charts/tree/master/stable/prometheus)

BentoML API server provides Prometheus support out of the box. It comes with a "/metrics"
endpoint which includes the essential metrics for model serving and the ability to
create and customize new metrics base on needs.

To enable Prometheus monitoring on the deployed model API server, update the YAML file
with Prometheus related annotations. Change the deployment spec as the following, and replace
`{docker_username}` with your Docker Hub username:

```yaml
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
      annotations:
        prometheus.io/scrape: true
        prometheus.io/port: 5000
    spec:
      containers:
      - image: {docker_username}/iris-classifier
        imagePullPolicy: IfNotPresent
        name: iris-classifier
        ports:
        - containerPort: 5000
```

Apply the change with `kubectl` CLI.

```shell
kubectl apply -f iris-classifier.yaml
```

### Remove deployment

```shell
kubectl delete -f iris-classifier.yaml
```

## Additional resources

* [GitHub repository](https://github.com/bentoml/BentoML)
* [BentoML documentation](https://docs.bentoml.org)
* [Quick start guide](https://docs.bentoml.org/en/latest/quickstart.html)
* [Community](https://join.slack.com/t/bentoml/shared_invite/enQtNjcyMTY3MjE4NTgzLTU3ZDc1MWM5MzQxMWQxMzJiNTc1MTJmMzYzMTYwMjQ0OGEwNDFmZDkzYWQxNzgxYWNhNjAxZjk4MzI4OGY1Yjg)
