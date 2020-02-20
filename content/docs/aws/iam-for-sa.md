+++
title = "Authenticating Kubeflow to AWS"
description = "Setup up IAM Role for Service Account to get fine-grained control on AWS service authentication"
weight = 50
+++

## IAM Roles for Service Account.

> Note: This feature requires you use an EKS cluster. For self-managed AWS Kubernetes cluster, To start benefiting from IRSA, follow the instructions in the Amazon EKS Pod Identity Webhook GitHub repo to set up the webhook

[IAM Roles for Service Account](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) feature provides fine-grained roles at the pod level rather than the node level. In order to use IAM roles for service account feature, please set `enablePodIamPolicy` to true in aws plugin.

```
plugins:
  - kind: KfAwsPlugin
    metadata:
      name: aws
    spec:
      region: us-west-2
      enablePodIamPolicy: true
```

 [OIDC federation access](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html) allows you to assume IAM roles via the Secure Token Service (STS), enabling authentication with an OIDC provider, receiving a JSON Web Token (JWT), which in turn can be used to assume an IAM role. Kubernetes, on the other hand, can issue so-called projected service account tokens, which happen to be valid OIDC JWTs for pods. Our setup equips each pod with a cryptographically-signed token that can be verified by STS against the OIDC provider of your choice to establish the pod’s identity. Additionally, we’ve updated AWS SDKs with a new credential provider that calls sts:AssumeRoleWithWebIdentity, exchanging the Kubernetes-issued OIDC token for AWS role credentials.


`kfctl` will setup OIDC Identity Provider for your EKS cluster and create two IAM Roles, `kf-admin-${AWS_CLUSTER_NAME}` and `kf-user-${AWS_CLUSTER_NAME}`.

- `kf-admin-${AWS_CLUSTER_NAME}` - kfctl attach alb, optional fsx, cloud-watch required policies to the role and role will be used by kubeflow control plane components like `alb-ingress-controller`, `pipeline`, `fluend-cloud-watch` and `fsx for lustre CSI driver`, etc.

- `kf-user-${AWS_CLUSTER_NAME}` - This is designed to be used by end user. Cluster amdin can use this role in profile and every user's service account `default-viewer` will have this role attached. By default, no policies is attached to this role, user can attach policies by their own.


Here is an example profile spec:

```yaml
apiVersion: kubeflow.org/v1beta1
kind: Profile
spec:
  plugins:
  - kind: AwsIamForServiceAccount
    spec:
      awsIamRole: arn:aws:iam::${AWS_ACCOUNT_ID}:role/${AWS_IAM_ROLE}
```

Profile controller will add annotation `eks.amazonaws.com/role-arn: arn:aws:iam::${AWS_ACCOUNT_ID}:role/kf-user-${AWS_CLUSTER_NAME}` to user's `default-viewer` service account.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: default-viewer
  namespace: userA
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::${AWS_ACCOUNT_ID}:role/${AWS_IAM_ROLE}
```

At the same time, profile controller add `"oidc.eks.us-west-2.amazonaws.com/id/${OIDC_WEB_IDENTITY_PROVIDER}:sub": "system:serviceaccount:${user_namespace}:defult-viewer"` to trust relationship of IAM role `${AWS_CLUSTER_NAME}`.

This is trust relationships of role `${AWS_IAM_ROLE}`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::348134392524:oidc-provider/oidc.eks.us-west-2.amazonaws.com/id/${OIDC_WEB_IDENTITY_PROVIDER}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.eks.us-west-2.amazonaws.com/id/${OIDC_WEB_IDENTITY_PROVIDER}:aud": "sts.amazonaws.com",
          "oidc.eks.us-west-2.amazonaws.com/id/${OIDC_WEB_IDENTITY_PROVIDER}:sub": "system:serviceaccount:userA:defult-viewer",
          "oidc.eks.us-west-2.amazonaws.com/id/${OIDC_WEB_IDENTITY_PROVIDER}:sub": "system:serviceaccount:userB:defult-viewer",
        }
      }
    }
  ]
}
```