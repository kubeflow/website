+++
title = "Kubeflow Pipelines on AWS"
description = "Get started with Kubeflow Pipelines on Amazon EKS"
weight = 20
+++

For more information about Kubeflow Pipelines, see [Connecting to the Kubeflow Pipelines using the SDK client](https://www.kubeflow.org/docs/components/pipelines/sdk/connect-api/). 

## Authenticate Kubeflow Pipelines using SDK inside cluster

Refer to the following guide to connect to Kubeflow Pipelines from [inside your cluster](https://www.kubeflow.org/docs/components/pipelines/sdk/connect-api/#connect-to-kubeflow-pipelines-from-the-same-cluster).

## Authenticate Kubeflow Pipelines using SDK outside cluster

Refer to the following guide to connect to Kubeflow Pipelines from [outside your cluster](https://www.kubeflow.org/docs/components/pipelines/sdk/connect-api/#connect-to-kubeflow-pipelines-from-outside-your-cluster).

Refer to the following steps to use `kfp` to pass a cookie from your browser after you log into Kubeflow. The following example uses a Chrome browser.

> Note: It is necessary to use the latest container images listed in [AWS-Optimized Kubeflow Notebooks](/docs/distributions/aws/notebook-server) because they include a critical [SDK fix](https://github.com/kubeflow/pipelines/pull/4285).

<img src="/docs/images/aws/kfp-sdk-browser-cookie.png"
  alt="KFP SDK Browser Cookie"
  class="mt-3 mb-3 border border-info rounded">

<img src="/docs/images/aws/kfp-sdk-browser-cookie-detail.png"
  alt="KFP SDK Browser Cookie Detail"
  class="mt-3 mb-3 border border-info rounded">

Once you get a cookie, authenticate `kfp` by passing the cookie from your browser. Use the session based on the appropriate manifest for your deployment, as done in the following examples. 

### **Dex** 

If you want to use port forwarding to access Kubeflow, run the following command and use `http://localhost:8080/pipeline` as the host.

```bash
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
```

Pass the cookie from your browser: 
```bash
# This is the "Domain" in your cookies. Eg: "localhost:8080" or "<ingress_alb_address>.elb.amazonaws.com"
kubeflow_gateway_endpoint="<YOUR_KUBEFLOW_GATEWAY_ENDPOINT>"

authservice_session_cookie="<YOUR_COOKIE>"

namespace="<YOUR_NAMESPACE>"

client = kfp.Client(host=f"http://{kubeflow_gateway_endpoint}/pipeline", cookies=f"authservice_session={authservice_session_cookie}")
client.list_experiments(namespace=namespace)
```

If you want to set up application load balancing (ALB) with Dex, see [Connect to Your Kubeflow Cluster](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/vanilla#connect-to-your-kubeflow-cluster) and use the ALB address as the Kubeflow Endpoint. 

To do programmatic authentication with Dex, refer to the following comments under [issue #140](https://github.com/kubeflow/kfctl/issues/140) in the `kfctl` repository: [#140 (comment)](https://github.com/kubeflow/kfctl/issues/140#issuecomment-578837304) and [#140 (comment)](https://github.com/kubeflow/kfctl/issues/140#issuecomment-719894529).

### **Cognito**

```bash
# This is the "Domain" in your cookies. eg: kubeflow.<platform.example.com>
kubeflow_gateway_endpoint="<YOUR_KUBEFLOW_HTTPS_GATEWAY_ENDPOINT>"

alb_session_cookie0="<YOUR_COOKIE_0>"
alb_session_cookie1="<YOUR_COOKIE_1>"

namespace="<YOUR_NAMESPACE>"

client = kfp.Client(host=f"https://{kubeflow_gateway_endpoint}/pipeline", cookies=f"AWSELBAuthSessionCookie-0={alb_session_cookie0};AWSELBAuthSessionCookie-1={alb_session_cookie1}")
client.list_experiments(namespace=namespace)
```

## S3 Access from Kubeflow Pipelines

It is recommended to use AWS credentials to manage S3 access for Kubeflow Pipelines. [IAM Role for Service Accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) requires applications to use the latest AWS SDK to support the `assume-web-identity-role`. This requirement is in development, and progress can be tracked in the [open GitHub issue](https://github.com/kubeflow/pipelines/issues/3405).

A Kubernetes Secret is required by Kubeflow Pipelines and applications to access S3. Be sure that the Kubernetes Secret has S3 read and write access.

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

> Note: To get a Base64 string, run `echo -n $AWS_ACCESS_KEY_ID | base64`

### Configure containers to use AWS credentials

In order for `ml-pipeline-ui` to read these artifacts:

1. Create a Kubernetes secret `aws-secret` in the `kubeflow` namespace. Follow instructions [here](#s3-access-from-kubeflow-pipelines).

2. Update deployment `ml-pipeline-ui` to use AWS credential environment variables by running `kubectl edit deployment ml-pipeline-ui -n kubeflow`.

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

### Example Pipeline 

If you write any files to S3 in your application, use `use_aws_secret` to attach an AWS secret to access S3.

```python
from kfp.aws import use_aws_secret

def s3_op():
    import boto3
    s3 = boto3.client("s3", region_name="<region>")
    s3.create_bucket(
        Bucket="<test>", CreateBucketConfiguration={"LocationConstraint": "<region>"}
    )

s3_op = create_component_from_func(
    s3_op, base_image="python", packages_to_install=["boto3"]
)

@dsl.pipeline(
    name="S3 KFP Component",
    description="Tests S3 Access from KFP",
)
def s3_pipeline():
    s3_op().set_display_name("S3 KFP Component").apply(
        use_aws_secret("aws-secret", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY")
    )

kfp_client = kfp.Client()
namespace = "kubeflow-user-example-com"
run_id = kfp_client.create_run_from_pipeline_func(
    s3_pipeline, namespace=namespace, arguments={}
).run_id
```

## Support S3 Artifact Store

Support for S3 Artifact Store is in active development. You can track the [open issue](https://github.com/awslabs/kubeflow-manifests/issues/117) to stay up-to-date on progress.

## Support TensorBoard in Kubeflow Pipelines

Support for TensorBoard in Kubeflow Pipelines is in active development. You can track the [open issue](https://github.com/awslabs/kubeflow-manifests/issues/118) to stay up-to-date on progress.


