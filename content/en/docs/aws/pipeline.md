+++
title = "Configure Kubeflow Pipelines on AWS"
description = "Customize Kubeflow Pipelines to use AWS Services"
weight = 90
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

## Authenticate Kubeflow Pipeline using SDK inside cluster

In v1.1.0, in-cluster communitation from notebook to Kubeflow Pipeline is not supported in this phase. In order to use `kfp` as previous, user needs to pass a cookie to KFP for communication as a walkaround.
You can follow following steps to get cookie from your browser after you login Kubeflow. Following examples uses Chrome browser.

> Note: You have to use images in [AWS Jupyter Notebook](/docs/aws/notebook-server) because it includes a critical SDK fix [here](https://github.com/kubeflow/pipelines/pull/4285).

<img src="/docs/images/aws/kfp-sdk-browser-cookie.png"
  alt="KFP SDK Browser Cookie"
  class="mt-3 mb-3 border border-info rounded">

<img src="/docs/images/aws/kfp-sdk-browser-cookie-detail.png"
  alt="KFP SDK Browser Cookie Detail"
  class="mt-3 mb-3 border border-info rounded">


Once you get cookie, you can easily authenticate `kfp` by passing the `cookies`. Please look at code snippets based on the manifest you use.

To get `<aws_alb_host>`, please run `kubectl get ingress -n istio-system` and get value from `ADDRESS` field.

 - dex {{% config-uri-aws-standard %}}

```bash
import kfp
authservice_session='authservice_session=<cookie>'
client = kfp.Client(host='http://<aws_alb_host>/pipeline', cookies=authservice_session)
client.list_experiments(namespace="<your_namespace>")
```

 - coginito {{% config-uri-aws-cognito %}}

```bash
import kfp
alb_session_cookie='AWSELBAuthSessionCookie-0=<cookie>'
client = kfp.Client(host='https://<aws_alb_host>/pipeline', cookies=alb_session_cookie)
client.list_experiments(namespace="<your_namespace>")
```

## Authenticate Kubeflow Pipeline using SDK outside cluster

- dex {{% config-uri-aws-standard %}}

Please look at this [PR](https://github.com/kubeflow/kfctl/issues/140#issuecomment-578837304) to do programmatic authentication with Dex.


- coginito {{% config-uri-aws-cognito %}}

You can still retrieve session cookie and pass to backend like we do [here]
(#authenticate-kubeflow-pipeline-using-sdk-inside-cluster)

If you are looking for end to end experience, this is working in progress. Once [feat(sdk): Enable AWS ALB authentication in KFP SDK Client](https://github.com/kubeflow/pipelines/pull/4182) PR is merged,
user can pass Coginito user username and password to authenticate KFP via AWS Application Load Balancer.

## S3 Access from Kubeflow Pipelines

Currently, it's still recommended to use aws credentials or [kube2iam](https://github.com/jtblin/kube2iam) to managed S3 access from Kubeflow Pipelines. [IAM Role for Service Accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) requires applications to use latest AWS SDK to support `assume-web-identity-role`, we are still working on it. Track progress in issue [#3405](https://github.com/kubeflow/pipelines/issues/3405)

A Kubernetes Secret is required by Kubeflow Pipelines and applications to access S3. Make sure it has S3 read and write access.

```
apiVersion: v1
kind: Secret
metadata:
  name: aws-secret
  namespace: kubeflow
type: Opaque
data:
  AWS_ACCESS_KEY_ID: <YOUR_BASE64_ACCESS_KEY>
  AWS_SECRET_ACCESS_KEY: <YOUR_BASE64_SECRET_ACCESS>
```

- YOUR_BASE64_ACCESS_KEY: Base64 string of `AWS_ACCESS_KEY_ID`
- YOUR_BASE64_SECRET_ACCESS: Base64 string of `AWS_SECRET_ACCESS_KEY`

> Note: To get base64 string, run `echo -n $AWS_ACCESS_KEY_ID | base64`


## Configure containers to use AWS credentails

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

Kubeflow Pipelines supports different artifact viewers. You can create files in S3 and reference them in output artifacts in your application like beflow.

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
              'source': s3://bucket/confusion_matrics.csv,
              # Convert vocab to string because for bealean values we want "True|False" to match csv data.
              'labels': list(map(str, vocab)),
          },
          {
              'type': 'tensorboard',
              'source': s3://bucket/tb-events,
          }
        ]
    }

with file_io.FileIO('/tmp/mlpipeline-ui-metadata.json', 'w') as f:
    json.dump(metadata, f)

```

In order for `ml-pipeline-ui` to read these artifacts:

1. Create a Kubernetes secret `aws-secret` in `kubeflow` namespace. Follow instructions [here](#s3-access-from-kubeflow-pipelines).

1. Update deployment `ml-pipeline-ui` to use AWS credential environment viariables by running `kubectl edit deployment ml-pipeline-ui -n kubeflow`.

   ```
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
  alt="Kubeflow Pipelines viewer tensorboard"
  class="mt-3 mb-3 border border-info rounded">

## Support TensorBoard in Kubeflow Pipelines

 [TensorBoard](/docs/pipelines/sdk/output-viewer/#tensorboard) needs some extra settings on AWS like below:

1. Create a Kubernetes secret `aws-secret` in the `kubeflow` namespace. Follow instructions [here](#s3-access-from-kubeflow-pipelines).

1. Create a ConfigMap to store the configuration of TensorBoard on your cluster. Replace `<your_region>` with your S3 region.
   ```
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

1. Update the `ml-pipeline-ui` deployment to use the ConfigMap by running `kubectl edit deployment ml-pipeline-ui -n kubeflow`.

   ```
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
