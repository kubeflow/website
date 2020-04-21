+++
title = "AWS IAM Role for Service Account"
description = "Setup up IAM Role for Service Account to get fine-grained access control to AWS services"
weight = 50
+++

## Fine grain control AWS access at pod level

With [IAM Roles for Service Account](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) on Amazon EKS clusters, you can associate an IAM role with a Kubernetes service account. This service account can then provide AWS permissions to the containers in any pod that uses that service account. With this feature, you no longer need to provide extended permissions to the worker node IAM role so that pods on that node can call AWS APIs.

[OIDC federation access](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html) allows you to assume IAM roles via the Secure Token Service (STS), enabling authentication with an OIDC provider, receiving a JSON Web Token (JWT), which in turn can be used to assume an IAM role. Kubernetes, on the other hand, can issue so-called projected service account tokens, which happen to be valid OIDC JWTs for pods. Our setup equips each pod with a cryptographically-signed token that can be verified by STS against the OIDC provider of your choice to establish the pod’s identity. Additionally, we’ve updated AWS SDKs with a new credential provider that calls `sts:AssumeRoleWithWebIdentity`, exchanging the Kubernetes-issued OIDC token for AWS role credentials.

## Enable IAM role for service account

> Note: This feature requires you use an EKS cluster. For self-managed AWS Kubernetes cluster, To start benefiting from IRSA, follow the instructions in the [Amazon EKS Pod Identity Webhook Github repo](https://github.com/aws/amazon-eks-pod-identity-webhook) to set up the webhook.

In order to use IAM roles for service account feature, please set `enablePodIamPolicy` to `true` in aws plugin in manifest [kfctl_aws.yaml](kfctl_aws.yaml) or [kfctl_aws_cognito.yaml](https://github.com/kubeflow/manifests/blob/master/kfdef/kfctl_aws_cognito.yaml)

```yaml
plugins:
  - kind: KfAwsPlugin
    metadata:
      name: aws
    spec:
      region: us-west-2
      enablePodIamPolicy: true
```

`kfctl` will setup OIDC Identity Provider for your EKS cluster and create two IAM roles, `kf-admin-${AWS_CLUSTER_NAME}` and `kf-user-${AWS_CLUSTER_NAME}`.

- `kf-admin-${AWS_CLUSTER_NAME}` - kfctl attach alb, optional fsx, cloud-watch required policies to the role and role will be used by kubeflow control plane components like `alb-ingress-controller`, `pipeline`, `fluend-cloud-watch` and `fsx for lustre CSI driver`, etc.

- `kf-user-${AWS_CLUSTER_NAME}` - This is designed to be used by end user. Cluster admin can use this role in profile and every user's service account `default-editor` will have this role attached. By default, no policies is attached to this role, user can attach policies by their own.

Here is an example of profile:

```yaml
apiVersion: kubeflow.org/v1beta1
kind: Profile
spec:
  plugins:
  - kind: AwsIamForServiceAccount
    spec:
      awsIamRole: arn:aws:iam::${AWS_ACCOUNT_ID}:role/${AWS_IAM_ROLE}
```

Profile controller will add annotation `eks.amazonaws.com/role-arn: arn:aws:iam::${AWS_ACCOUNT_ID}:role/kf-user-${AWS_CLUSTER_NAME}` to user's `default-editor` service account.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: default-editor
  namespace: userA
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::${AWS_ACCOUNT_ID}:role/${AWS_IAM_ROLE}
```

At the same time, profile controller add `"oidc.eks.us-west-2.amazonaws.com/id/${OIDC_WEB_IDENTITY_PROVIDER}:sub": "system:serviceaccount:${user_namespace}:default-editor"` to trust relationship of IAM role `${AWS_CLUSTER_NAME}`.

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
          "oidc.eks.us-west-2.amazonaws.com/id/${OIDC_WEB_IDENTITY_PROVIDER}:sub": [
            "system:serviceaccount:userA:default-editor",
            "system:serviceaccount:userB:default-editor",
          ]
        }
      }
    }
  ]
}
```