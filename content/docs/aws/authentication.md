+++
title = "Authentication and TLS Support"
description = "Add TLS and authentication with your custom domain"
weight = 90
+++

This section shows the how to add TLS support and create user pool to authenticate users with your custom domain.


## Traffic Flow
External Traffic → [ Ingress → Istio-ingress-gateway → ambassador ]

When you generate and apply kubernetes resources, an ingress is created to manage external traffic to Kubernetes services. AWS ALB Ingress Controller will provision an Application Load balancer for that ingress. By default, TLS and authentication are not enabled support yet.

Kubeflow community plans to move from [Ambassador](https://www.getambassador.io/) to [Istio](https://istio.io/) to manage internal traffic, see [issue](https://github.com/kubeflow/kubeflow/issues/2261). At current stage, [Ambassador](https://www.getambassador.io/) still plays the role of API gateway. TLS, authentication and authorization either can be done at ALB layer or Istio layer for aws, we plan to have istio here and forward traffic from ingress to istio gateway and then to ambassador at this moment. Once we clear direction with community, we will enable TLS and authentication by default.


## Enable TLS and Authentication

Right now, certificate for ALB domain is not supported. Instead, you need to prepare a custom domain. You can register your domain in Route53 or any domain providers like [Godaddy](https://www.godaddy.com/).

[AWS Certificate Manager](https://aws.amazon.com/certificate-manager/) is a service that lets you easily provision, manage, and deploy public and private Secure Sockets Layer/Transport Layer Security (SSL/TLS) certificates for use with AWS services and your internal connected resources.

To get TLS support from ALB Ingress Controller, you need to follow [tutorial](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html) to request a certificate in AWS Certificate Manager. After validation success, you will get a certificate ARN.

<img src="/docs/images/aws/cognito-certarn.png"
  alt="Cognito Cert Arn"
  class="mt-3 mb-3 border border-info rounded">

[AWS Cognito](https://aws.amazon.com/cognito/) lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily. Amazon Cognito scales to millions of users and supports sign-in with social identity providers, such as Facebook, Google, and Amazon, and enterprise identity providers via SAML 2.0.

<img src="/docs/images/aws/cognito-appclient.png"
  alt="Cognito Application Client Setting"
  class="mt-3 mb-3 border border-info rounded">

<img src="/docs/images/aws/cognito-domain.png"
  alt="Cognito Domain Name"
  class="mt-3 mb-3 border border-info rounded">

In order to authenticate and manage users for kubeflow, let's create a user pool. You can follow instructions here. Once a user pool created, we have UserPoolId, Cognito Domain name and Cognito Pool Arn.

Before you apply k8s, you can go into ${KUBEFLOW_SRC}/${KFAPP}/ks_app,

```
ks param set istio-ingress CognitoUserPoolArn arn:aws:cognito-idp:us-west-2:xxx:userpool/xxx
ks param set istio-ingress CognitoAppClientId xxxxxx
ks param set istio-ingress CognitoUserPoolDomain xxxx
ks param set istio-ingress enableCognito true
ks param set istio-ingress certArn arn:aws:acm:us-west-2:xxx:certificate/xxxe4031c
```

After your finish TLS and Authentication configuration, then you can run `${KUBEFLOW_SRC}/${KFAPP}/scripts/kfctl.sh apply k8s`.

After your ingress dns is ready, you need to create a `CNAME` in your DNS records.

<img src="/docs/images/aws/custom-domain-cname.png"
  alt="Custom Domain CNAME"
  class="mt-3 mb-3 border border-info rounded">

Then you can visit `https://www.shanjiaxin.com`, which is a custom domain we use in this case, it will redirect you to authentication page. We added a user `kubeflow-test-user` in the cognito setting and we can use this user to login service.

<img src="/docs/images/aws/authentication.png"
  alt="Coginito Authentication popup"
  class="mt-3 mb-3 border border-info rounded">

<img src="/docs/images/aws/kubeflow-main-page.png"
  alt="Kubeflow main page"
  class="mt-3 mb-3 border border-info rounded">