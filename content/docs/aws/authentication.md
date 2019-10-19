+++
title = "Authentication and TLS Support"
description = "Add TLS and authentication with your custom domain"
weight = 90
+++

This section shows the how to add TLS support and create a user pool to authenticate users with your custom domain in Amazon Web Services (AWS).


## Traffic Flow
External Traffic → [ Ingress → Istio ingress gateway → Istio virtual services ]

When you generate and apply kubernetes resources, an ingress is created to manage external traffic to Kubernetes services. The AWS Appliction Load Balancer(ALB) Ingress Controller will provision an Application Load balancer for that ingress. By default, TLS and authentication are not enabled at creation time.

In Kubeflow 0.6 release, community already move from [Ambassador](https://www.getambassador.io/) to [Istio](https://istio.io/) to manage internal traffic. In AWS solution, TLS, authentication,can be done at the ALB and and authorization can be done at Istio layer.


## Enable TLS and Authentication

Right now, certificates for ALB public DNS names are not supported. Instead, you must  prepare a custom domain. You can register your domain in Route53 or any domain provider such as [GoDaddy.com](https://www.godaddy.com/).

[AWS Certificate Manager](https://aws.amazon.com/certificate-manager/) is a service that lets you easily provision, manage, and deploy public and private Secure Sockets Layer/Transport Layer Security (SSL/TLS) certificates for use with AWS services and your internal connected resources.

To get TLS support from the ALB Ingress Controller, you need to follow [this tutorial](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html) to request a certificate in AWS Certificate Manager. After successful validation, you will get a certificate ARN to use with the ALB Ingress Controller.

<img src="/docs/images/aws/cognito-certarn.png"
  alt="Cognito Certificate ARN"
  class="mt-3 mb-3 border border-info rounded">

[AWS Cognito](https://aws.amazon.com/cognito/) lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily. Amazon Cognito scales to millions of users and supports sign-in with social identity providers, such as Facebook, Google, and Amazon, and enterprise identity providers via SAML 2.0.

<img src="/docs/images/aws/cognito-appclient.png"
  alt="Cognito Application Client Setting"
  class="mt-3 mb-3 border border-info rounded">

<img src="/docs/images/aws/cognito-domain.png"
  alt="Cognito Domain Name"
  class="mt-3 mb-3 border border-info rounded">

In order to authenticate and manage users for Kubeflow, let's create a user pool. You can follow these instructions here. Once a user pool created, we will have a `UserPoolId`, a Cognito Domain name, and a Cognito Pool Arn.

Before you `generate all -V`, please update Cognito spec in your Kubeflow
configuration file at `${CONFIG}`, so that it looks like this:

```
plugins:
    - name: aws
      spec:
        auth:
          cognito:
            cognitoUserPoolArn: arn:aws:cognito-idp:us-west-2:xxxxx:userpool/us-west-2_xxxxxx
            cognitoAppClientId: xxxxxbxxxxxx
            cognitoUserPoolDomain: your-user-pool
            certArn: arn:aws:acm:us-west-2:xxxxx:certificate/xxxxxxxxxxxxx-xxxx
        roles:
          - eksctl-kubeflow-aws-nodegroup-ng-a2-NodeInstanceRole-xxxxx
        region: us-west-2
```

After you finish the TLS and Authentication configuration, then you can run `kfctl apply -V -f ${CONFIG}`.

After your ingress DNS is ready, you need to create a `CNAME` in your DNS records.

<img src="/docs/images/aws/custom-domain-cname.png"
  alt="Custom Domain CNAME"
  class="mt-3 mb-3 border border-info rounded">

Then you can visit `https://www.shanjiaxin.com`, which is a custom domain we use in this case, it will redirect you to an authentication page. We added a user `kubeflow-test-user` in the Cognito setting and we can use this user for the login service.

<img src="/docs/images/aws/authentication.png"
  alt="Cognito Authentication pop-up"
  class="mt-3 mb-3 border border-info rounded">

<img src="/docs/images/aws/kubeflow-main-page.png"
  alt="Kubeflow main page"
  class="mt-3 mb-3 border border-info rounded">