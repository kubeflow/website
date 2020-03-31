+++
title = "Configure Kubeflow Pipeline on AWS"
weight = 90
+++

## S3 Access from Kubeflow Pipeline Pod

If you write any files to S3 in your application, use `use_aws_secret` to attach aws secret to access S3.

```python
import kfp
from kfp import components
from kfp import dsl
from kfp.aws import use_aws_secret

def iris_comp():
    return kfp.dsl.ContainerOp(
        .....
        output_artifact_paths={'mlpipeline-ui-metadata': '/mlpipeline-ui-metadata.json'}
    )

@dsl.pipeline(
    name='IRIS Classification pipeline',
    description='IRIS Classification using LR in SKLEARN'
)
def iris_pipeline():
    iris_task = iris_comp().apply(use_aws_secret('aws-secret', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'))

```

## Support S3 Artifact Store

Kubeflow Pipeline supports different artifact viewers. You can create files in S3 and reference them in output artifacts in your application like beflow.

```python
metadata = {
        'outputs' : [
          {
              'source': 's3://bucket/kubeflow/README.md',
              'type': 'markdown',
          },
          {
              'type': 'confusion_matrix',
              'format': 'csv',
              'schema': [
                  {'name': 'target', 'type': 'CATEGORY'},
                  {'name': 'predicted', 'type': 'CATEGORY'},
                  {'name': 'count', 'type': 'NUMBER'},
              ],
              'source': 's3://bucket/confusion_matrics.csv',
              # Convert vocab to string because for bealean values we want "True|False" to match csv data.
              'labels': list(map(str, vocab)),
          },
          {
              'type': 'tensorboard',
              'source': 's3://bucket/tb-events',
          }
        ]
    }
```

In order for `ml-pipeline-ui` to read these artifacts,

1. Create a Kubernetes secret `aws-secret` with at least S3 read policies in `kubeflow` namespace.

  ```yaml
  apiVersion: v1
  kind: Secret
  metadata:
    name: aws-secret
    namespace: kubeflow
  type: Opaque
  data:
    AWS_ACCESS_KEY_ID: YOUR_BASE64_ACCESS_KEY
    AWS_SECRET_ACCESS_KEY: YOUR_BASE64_SECRET_ACCESS
  ```

  > Note: To get base64 string, run `echo -n $AWS_ACCESS_KEY_ID | base64`

1. Update deployment `ml-pipeline-ui` to use AWS credential environment viariables by running `kubectl edit deployment ml-pipeline-ui -n kubeflow`.

  ```yaml
  apiVersion: extensions/v1beta1
  kind: Deployment
  metadata:
    name: ml-pipeline-ui
    namespace: kubeflow
    ...
  spec:
    template:
      spec:
        containers:
        - env:
          - name: AWS_ACCESS_KEY_ID
            valueFrom:
              secretKeyRef:
                key: AWS_ACCESS_KEY_ID
                name: aws-secret
          - name: AWS_SECRET_ACCESS_KEY
            valueFrom:
              secretKeyRef:
                key: AWS_SECRET_ACCESS_KEY
                name: aws-secret
          ....
          image: gcr.io/ml-pipeline/frontend:0.2.0
          name: ml-pipeline-ui
  ```

Here's an example.
<img src="/docs/images/aws/kfp-viewer-tensorboard.png"
  alt="Kubeflow Pipeline viewer tensorboard"
  class="mt-3 mb-3 border border-info rounded">

## Support Tensorboard in Kubeflow Pipeline

 [Tensorboard](/docs/pipelines/sdk/output-viewer/#tensorboard) need some extra settings on AWS.

1. Create a Kubernetes secret `aws-secret` S3 read policies in `kubeflow` namespace, check above example.

1. Create a configmap to store template spec of viewer tensorboard pod. Replace `<your_region>` with your S3 region.

  ```yaml
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: ml-pipeline-ui-viewer-template
  data:
    viewer-tensorboard-template.json: |
      {
          "spec": {
              "containers": [
                  {
                      "env": [
                          {
                              "name": "AWS_ACCESS_KEY_ID",
                              "valueFrom": {
                                  "secretKeyRef": {
                                      "name": "aws-secret",
                                      "key": "AWS_ACCESS_KEY_ID"
                                  }
                              }
                          },
                          {
                              "name": "AWS_SECRET_ACCESS_KEY",
                              "valueFrom": {
                                  "secretKeyRef": {
                                      "name": "aws-secret",
                                      "key": "AWS_SECRET_ACCESS_KEY"
                                  }
                              }
                          },
                          {
                              "name": "AWS_REGION",
                              "value": "<your_region>"
                          }
                      ]
                  }
              ]
          }
      }
  ```

1. Update deployment `ml-pipeline-ui` to use this sepc by running `kubectl edit deployment ml-pipeline-ui -n kubeflow`.

  ```yaml
  apiVersion: extensions/v1beta1
  kind: Deployment
  metadata:
    name: ml-pipeline-ui
    namespace: kubeflow
    ...
  spec:
    template:
      spec:
        containers:
        - env:
          - name: VIEWER_TENSORBOARD_POD_TEMPLATE_SPEC_PATH
            value: /etc/config/viewer-tensorboard-template.json
          ....
          volumeMounts:
          - mountPath: /etc/config
            name: config-volume
        .....
        volumes:
        - configMap:
            defaultMode: 420
            name: ml-pipeline-ui-viewer-template
          name: config-volume
  ```

### Replace KFP object storage with S3

Minio is default object storage of KFP and it's been used to persist Kubeflow Pipeline workflow and Argo artifacts data. Minio storage is persist volume based and it's not that reliable in production.
We are working on a few stories to provide an option to use S3 instead and it should be avialable soon.

[IAM For Service Account](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) for KFP is also in progress for EKS users, tensorflow aws sdk version is low and doesn't support `assume-web-identity-role`, you still need to use it. We will at least make KFP to use iam for service account in next release.
