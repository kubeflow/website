+++
title = "End-to-end Kubeflow on AWS"
description = "Running Kubeflow using AWS services"
weight = 250
+++

This guide describes how to deploy Kubeflow using AWS services such as EKS and Cognito. It consists of 3 parts, the deployment of the kubernetes infra, the deployment of the kubeflow and finally the deployment of models using KFserving.

The target audience is a member of a SRE team that builds this platform and provides a dashboard to data scientists. In turn, they can run their workflow for training in their dedicated namespace, and serve their models via a public endpoint.

## AWS services used
* Managed kubernetes (EKS) started with eksctl
* Kubernetes nodegroups (in EC2 auto-scaling groups) managed by eksctl
* ALB for istio-ingressgateway in front of all virtual services
* Cognito for user and api authentication
* Certificate manager for SSL certificates
* Route53 to manage the domain


## Prerequisites
Access to an AWS account via command line is required, make sure you're able to execute aws cli commands.
Install the following programs in the system from which you provision the infra (laptop or conf.management tool):
 
* eksctl
* kubectl
* istioctl
* kn
* kfctl

## Deploy the Kubernetes cluster

This step is only required once, when building the infra for the platform.

Create a cluster.yaml file:
```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: aiplatform
  region: eu-west-1

nodeGroups:
  - name: ng
    desiredCapacity: 6
    instanceType: m5.xlarge
```
And spin off the cluster using `eksctl`:
```shell script
eksctl create cluster -f cluster.yaml
```

That starts a cloudformation stack for the EKS master and a stack for each nodegroup, in our case one. You can observe the progress of the creation in the cloudformation page in the console.

The cluster is ready when `kubectl` reports that the nodes are Ready:
```shell script
kubectl get nodes
```
```
NAME                                           STATUS   ROLES    AGE   VERSION
ip-192-168-10-217.eu-west-1.compute.internal   Ready    <none>   18d   v1.14.7-eks-1861c5
ip-192-168-28-92.eu-west-1.compute.internal    Ready    <none>   18d   v1.14.7-eks-1861c5
ip-192-168-51-201.eu-west-1.compute.internal   Ready    <none>   18d   v1.14.7-eks-1861c5
ip-192-168-63-25.eu-west-1.compute.internal    Ready    <none>   18d   v1.14.7-eks-1861c5
ip-192-168-68-104.eu-west-1.compute.internal   Ready    <none>   18d   v1.14.7-eks-1861c5
ip-192-168-77-56.eu-west-1.compute.internal    Ready    <none>   18d   v1.14.7-eks-1861c5
```

If you'd like to change the nodegroup scaling there are two options, either via the EC2 auto-scaling group or using `eksctl`: 
```shell script
eksctl scale nodegroup --cluster=aiplatform --nodes=4 ng
```

### Deploy the kubernetes dashboard

To deploy the kubernetes dashboard as described in the [AWS deploy kubernetes web ui](https://docs.aws.amazon.com/eks/latest/userguide/dashboard-tutorial.html), first download and install the metrics server:

To install the metrics server:
```shell script
wget https://api.github.com/repos/kubernetes-sigs/metrics-server/tarball/v0.3.6
tar zxvf v0.3.6
kubectl apply -f kubernetes-sigs-metrics-server-d1f4f6f/deploy/1.8+
```
Validate:
```shell script
kubectl get deployment metrics-server -n kube-system
```
```
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
metrics-server   1/1     1            1           18d
```

To install the dashboard and create a user to access it, first create an `eks-admin` user using the following file:
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: eks-admin
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: eks-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: eks-admin
  namespace: kube-system
```
```shell script
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-rc5/aio/deploy/recommended.yaml
kubectl apply -f eks-admin-service-account.yaml
```

To access the kubernetes dashboard bring it to your localhost with a proxy:

```shell script
kubectl proxy
```

And then visit the dashboard on the [kubernetes dashboard ui](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#!/login)

Exposing the kubernetes dashboard via an istio virtual service is not recommended.

To login get the token using the following command:
```shell script
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep eks-admin | awk '{print $1}')
```

More information on [creating and managing EKS clusters](https://eksctl.io/usage/creating-and-managing-clusters/).

## Deploy Kubeflow

In this section you will prepare the ecosystem required by kubeflow, and you will configure the kfctl.yaml file with the custom information for your environment.

### Cognito and certificates

#### Route53

It is handy to have a domain managed by Route53 to deal with all the DNS records you will have to add (wildcard for istio-ingressgateway, validation for the certificate manager, etc).

In case your `domain.com` zone is not managed by Route53, you need to delegate a subdomain management in a Route53 hosted zone, in our example we have delegated the subdomain platform.domain.com. To do that, create a new hosted zone `platform.domain.com`, copy the NS entries that will be created and in turn create these NS records in the `domain.com` zone.

The records in the hosted zone will be created in the next section of this guide.

#### Certificate Manager

Create two certificates in Certificate Manager for `*.platform.domain.com`, one in N.Virginia and one in the region of your choice. That is because Cognito [requires](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html) a certificate in N.Virginia in order to have a custom domain for a user pool. The second is required by the ingress-gateway in case the platform does not run in N.Virginia, in our example Dublin. For the validation of both certificates, you will be asked to create one record in the hosted zone we created above.

#### Cognito

Create a user pool in Cognito. Type a pool name and choose `Review defaults` and `Create pool`.

Create some users in `Users and groups`, these are the users who will login to the central dashboard.

Add an `App client` with any name and the default options.

In the `App client settings` select `Authorization code grant` flow and `email`, `openid`, `aws.cognito.signin.user.admin` and `profile` scopes.

In the `Domain name` choose `Use your domain`, type `auth.platform.domain.com` and select the `*.platform.domain.com` AWS managed certificate you've created in N.Virginia. When it's created, it will return the `Alias target` cloudfront address for which you need to create a CNAME `auth.platform.domain.com` in the hosted zone.

Take note of the following 5 values:

* The ARN of the certificate from the Certificate Manager of N.Virginia (<certArn>).
* The Pool ARN (<cognitoUserPoolArn>) of the user pool found in Cognito general settings.
* The App client id (<cognitoAppClientId>), found in Cognito App clients.
* The `auth.platform.domain.com` as the <cognitoUserPoolDomain>.
* The name(s) of the created nodegroup(s) using the following command:
    ```shell script
    aws iam list-roles \
      | jq -r ".Roles[] \
      | select(.RoleName \
      | startswith(\"eksctl-$AWS_CLUSTER_NAME\") and contains(\"NodeInstanceRole\")) \
      .RoleName"
    ```

Download and edit the kfctl manifest file:
```shell script
wget https://raw.githubusercontent.com/kubeflow/manifests/v1.0-branch/kfdef/kfctl_aws_cognito.v1.0.0.yaml
```
At the end of the file we can see the `KfAwsPlugin` plugin section. In the spec about the cognito, you need to replace the 4 values you recorded above and the nodegroups names in the roles.  

```yaml
  - kind: KfAwsPlugin
    metadata:
      name: aws
    spec:
      auth:
        cognito:
          certArn: arn:aws:acm:eu-west-1:xxxxx:certificate/xxxxxxxxxxxxx-xxxx
          cognitoAppClientId: xxxxxbxxxxxx
          cognitoUserPoolArn: arn:aws:cognito-idp:eu-west-1:xxxxx:userpool/eu-west-1_xxxxxx
          cognitoUserPoolDomain: auth.platform.domain.com
      region: eu-west-1
      roles:
      - eksctl-aiplatform-aws-nodegroup-ng-NodeInstanceRole-xxxxx
```

Now you can build the manifests and then deploy them:
```shell script
kfctl build -f kfctl_aws_cognito.v1.0.0.yaml -V
kfctl apply -f kfctl_aws_cognito.v1.0.0.yaml -V
```

That shouldn't take a long time. There shouldn't by any errors, and when ready you can validate that you can see the kubeflow namespace.

At this point you will also have an ALB, it takes around 3 minutes to be ready. When ready, copy the DNS name of that load balancer and create 2 CNAME entries to it in Route53:

* `*.platform.domain.com`
* `*.default.platform.domain.com`

And one A record for the root domain `platform.domain.com` to make it valid, which can be a Route53 Alias to the ALB as well. If you're not using Route53, you can point that A record anywhere.

The central dashboard should now be available at https://kubeflow.platform.domain.com the first time will redirect to Cognito for login.

#### Deploy knative

Download the knative manifests from https://github.com/kubeflow/manifests/tree/master/knative

Edit configmap config-domain in file `knative-serving-install/base/config-map.yaml` and use the following config-domain (replace example.com):
```
apiVersion: v1
data:
  platform.domain.com: ""
kind: ConfigMap
metadata:
  labels:
    serving.knative.dev/release: "v0.8.0"
  name: config-domain
  namespace: knative-serving
```
Build and apply knative:
```shell script
cd knative/knative-serving-crds/base
kustomize build . | kubectl apply -f -
cd -
cd knative/knative-serving-install/base
kustomize build . | kubectl apply -f -
cd -
```
That will create a knative-serving namespace with all 6 pods running:
```
NAME                                READY   STATUS    RESTARTS   AGE
activator-7746448cf9-ggk98          2/2     Running   2          18d
autoscaler-548ccfcc57-zsfpw         2/2     Running   2          18d
autoscaler-hpa-669647f4f4-mx5q7     1/1     Running   0          18d
controller-655b8c8fb8-g89x7         1/1     Running   0          18d
networking-istio-75ff868647-k95mz   1/1     Running   0          18d
webhook-5846486ff4-4ltjq            1/1     Running   0          18d
```
#### Deploy kfserving
Install KFserving using the manifest file:
```shell script
kubectl apply -f https://raw.githubusercontent.com/kubeflow/kfserving/master/install/0.2.2/kfserving.yaml
```
That will create a `kfserving-system` namespace with one pod running.

## Deploy models

Deploy a Tensorflow, a PyTorch and a Scikit-learn model using KFserving:

```shell script
kubectl apply -f https://raw.githubusercontent.com/kubeflow/kfserving/master/docs/samples/tensorflow/tensorflow.yaml
kubectl apply -f https://raw.githubusercontent.com/kubeflow/kfserving/master/docs/samples/pytorch/pytorch.yaml
kubectl apply -f https://raw.githubusercontent.com/kubeflow/kfserving/master/docs/samples/sklearn/sklearn.yaml
```

Validate that all three inference services are available:

```shell script
kubectl get inferenceservice
```
or alternatively through the knative cli:
```shell script
kn service list
```
```
NAME                                   URL                                                                       LATEST                                       AGE     CONDITIONS   READY     REASON
pytorch-cifar10-predictor-default      http://pytorch-cifar10-predictor-default.default.platform.domain.com      pytorch-cifar10-predictor-default-vfz8r      18d     3 OK / 3     True      
sklearn-iris-predictor-default         http://sklearn-iris-predictor-default.default.platform.domain.com         sklearn-iris-predictor-default-pbx2x         6d22h   3 OK / 3     True      
tensorflow-flowers-predictor-default   http://tensorflow-flowers-predictor-default.default.platform.domain.com   tensorflow-flowers-predictor-default-6zp4q   18d     3 OK / 3     True  
```

That simple action will load a model from google storage and serve it through the same istio ingress-gateway. It is possible to test an inference request by posting to any endpoint one of its example datapoints, by using the cookie from the browser that visited the central dashboard:

```http request
POST https://sklearn-iris-predictor-default.default.platform.domain.com/v1/models/sklearn-iris:predict HTTP/1.1
Host: sklearn-iris-predictor-default.default.platform.domain.com
Content-Type: application/json
Cookie: AWSELBAuthSessionCookie-0=TBLc8+Mz0hSZp...

{
  "instances": [
    [6.8,  2.8,  4.8,  1.4],
    [6.0,  3.4,  4.5,  1.6]
  ]
}
```
that request will run the inference and return the classes for the two data points:
```
{"predictions": [1, 1]}
```

### Store models in S3 bucket

Copy the models in s3:

```shell script
gsutil -m cp -r gs://kfserving-samples/models/tensorflow/flowers s3://domain.com-models/flowers

```

Create a kubernetes secret to access the S3 bucket by creating a `kfserving-s3-secret.yaml` file:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
  annotations:
    serving.kubeflow.org/s3-endpoint: s3.eu-west-1.amazonaws.com
    serving.kubeflow.org/s3-usehttps: "1"
    serving.kubeflow.org/s3-verifyssl: "1"
    serving.kubeflow.org/s3-region: eu-west-1
type: Opaque
data:
  # echo -ne "AKIAxxx" | base64
  awsAccessKeyID: QUtJQVhxxxVXVjQ=
  awsSecretAccessKey: QzR0UnxxxVNOd0NQQQ==
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: sa
secrets:
  - name: mysecret
```

And change the inference service accordingly by creating a `tensorflow.yaml` file:

```yaml
apiVersion: "serving.kubeflow.org/v1alpha2"
kind: "InferenceService"
metadata:
  name: "tensorflow-flowers"
spec:
  default:
    predictor:
      serviceAccountName: sa
      tensorflow:
        storageUri: "s3://domain.com-models/flowers"
```

Apply the changes:
```shell script
kubectl apply -f kfserving-s3-secret.yaml
kubectl apply -f tensorflow.yaml
```

## Summary and access

Overview of the installed components, endpoints and the tools used:

<img src="../reference_architecture.svg" alt="KFServing">
