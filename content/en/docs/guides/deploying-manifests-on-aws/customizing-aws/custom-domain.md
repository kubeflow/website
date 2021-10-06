+++
title = "Custom Domain"
description = "Using a custom domain for your Kubeflow deployment on AWS"
weight = 30
+++

## Prerequisite

Before you configure a custom domain, please review [this section](/docs/distributions/aws/authentication) to understand ALB with Cognito or OIDC optional configurations.

## Using Custom Domain

In the Cognito App client setting page, set `https://{YOUR_DOMAIN_NAME}/oauth2/idpresponse` in the callback URLs. The remaining steps are the same as documented [here](/docs/distributions/aws/authentication).

<img src="/docs/images/aws/cognito-appclient.png"
  alt="Cognito Application Client Setting"
  class="mt-3 mb-3 border border-info rounded">

After your ingress DNS is ready, you can get the hostname by running follow command.

```
kubectl get ingress istio-ingress -n istio-system
NAME            HOSTS   ADDRESS                                                       PORTS   AGE
istio-ingress   *       123-istiosystem-istio-2af2-4567.us-west-2.elb.amazonaws.com   80      1h
```

Go to your domain vendor, create a `CNAME` in your DNS records and configure it to direct to this host name.

<img src="/docs/images/aws/custom-domain-cname.png"
  alt="Custom Domain CNAME"
  class="mt-3 mb-3 border border-info rounded">

Then you can visit your custom domain (`https://www.shanjiaxin.com` in the example below), and it will redirect you to an authentication page. A user can be added in AWS Cognito configuration settings, and you can use this user for the login service.

<img src="/docs/images/aws/kubeflow-main-page.png"
  alt="Kubeflow main page"
  class="mt-3 mb-3 border border-info rounded">
