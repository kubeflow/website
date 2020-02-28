+++
title = "Custom Domain"
description = "Use a custom domain for Kubeflow on AWS"
weight = 90
+++

## Prerequisite

Before you configure custom domain, you must have read [this section](/docs/aws/authentication) to understand ALB with Cognito or OIDC setup.

## Using Custom Domain

In the Cognito App client setting page, use `https://{YOUR_DOMAIN_NAME}/oauth2/idresponse` in the callback URLs. The rest steps are exact same as the steps in [this section](/docs/aws/authentication)

<img src="/docs/images/aws/cognito-appclient.png"
  alt="Cognito Application Client Setting"
  class="mt-3 mb-3 border border-info rounded">

After your ingress DNS is ready, you can get ALB hostname by running follow command.

```
kubectl get ingress istio-ingress -n istio-system
NAME            HOSTS   ADDRESS                                                                  PORTS   AGE
istio-ingress   *       a743484b-istiosystem-istio-2af2-1092604728.us-west-2.elb.amazonaws.com   80      4h9m
```

Go to your domain vendor, create a `CNAME` in your DNS records and point to this ALB host name.

<img src="/docs/images/aws/custom-domain-cname.png"
  alt="Custom Domain CNAME"
  class="mt-3 mb-3 border border-info rounded">

Then you can visit `https://www.shanjiaxin.com`, which is a custom domain we use in this case, it will redirect you to an authentication page. We added a user `kubeflow-test-user` in the Cognito setting and we can use this user for the login service.

<img src="/docs/images/aws/kubeflow-main-page.png"
  alt="Kubeflow main page"
  class="mt-3 mb-3 border border-info rounded">
