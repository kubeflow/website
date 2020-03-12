+++
title = "Authentication using OIDC"
description = "Authentication and authorization support through OIDC for Kubeflow in AWS"
weight = 90
+++

This section shows the how to setup Kubeflow with authentication and authorization support through OIDC in Amazon Web Services (AWS). Similar to [Cognito tutorial](/docs/aws/authentication/).

## Enable TLS and Authentication

Right now, certificates for ALB public DNS names are not supported. Instead, you must  prepare a custom domain. You can register your domain in Route53 or any domain provider such as [GoDaddy.com](https://www.godaddy.com/).

[AWS Certificate Manager](https://aws.amazon.com/certificate-manager/) is a service that lets you easily provision, manage, and deploy public and private Secure Sockets Layer/Transport Layer Security (SSL/TLS) certificates for use with AWS services and your internal connected resources.

To get TLS support from the ALB Ingress Controller, you need to follow [this tutorial](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html) to request a certificate in AWS Certificate Manager. After successful validation, you will get a `certificate ARN` to use with the ALB Ingress Controller.

> Note: Even you need to create a `certificate ARN`, we don't necessarily need a custom domain unless you want to use it, you can still use ALB ingress hostname to visit kubeflow central dashboard.

<img src="/docs/images/aws/cognito-certarn.png"
  alt="Cognito Certificate ARN"
  class="mt-3 mb-3 border border-info rounded">

[OIDC](https://openid.net/connect/) allows clients to verify the identity of the End-User based on the authentication performed by an Authorization Server. OIDC allows clients of all types, including Web-based, mobile, and JavaScript clients, to request and receive information about authenticated sessions and end-users. You can use any OIDC compatible solutions including Google, Facebook and Github for authentication. For this tutorial, we take Github Login as an example.

In order to authenticate and manage users for Kubeflow, let's first connect Auth0 app to Github. You can follow instructions [here](https://auth0.com/docs/connections/social/github) or follow below detailed steps:

### 1. Register Your New App on Auth0
You should go to the [Auth0 page](https://manage.auth0.com/) to sign up and login at first.

<img src="/docs/images/aws/auth0-login.png"
  alt="Auth0 Login"
  class="mt-3 mb-3 border border-info rounded">
 
Then you can look at below page and modify the domain name Under `TENANT DOMAIN` to be your preferable domain name and take notes.

<img src="/docs/images/aws/auth0-welcome-page.png"
  alt="Auth0 Welcome Page"
  class="mt-3 mb-3 border border-info rounded">
 
After modification, click **NEXT** button. Then you can set up your personal information there and click **CREATE ACCOUNT** button.

### 2. Add a new Application in Github
To add a new application, log in to [GitHub](https://github.com/) and go to **OAuth Apps** in your [developer settings](https://github.com/settings/developers). Next click [Register a new application](https://github.com/settings/applications/new).

<img src="/docs/images/aws/github-oauth-app-register.png"
  alt="Github Oauth App Register"
  class="mt-3 mb-3 border border-info rounded">

### 3. Register Your New App on Github
On the [Register a new application](https://github.com/settings/applications/new) page fill out the form with the following information. Modify the parameters to reflect your application.

In step 1, you registered new app on Auth0 and there's a `TENANT DOMAIN`. Now it is your Github Homepage URL with prefix of `https://`. For example, if your Auth0 tenant domain was `kftest.auth0.com`, your Github Homepage URL would be `https://kftest.auth0.com` and your redirect URL would be `https://kftest.auth0.com/login/callback`.

<img src="/docs/images/aws/github-oauth-app-register-details.png"
  alt="Github Oauth App Register Details"
  class="mt-3 mb-3 border border-info rounded">

After completing the form click **Register application** to proceed.

### 4. Configure Github and Auth0 app
Once the application is registered, your app's `Client ID` and `Client Secret` will be displayed on the following page:

<img src="/docs/images/aws/github-oauth-app-client-id-secret.png"
  alt="Github Oauth App Client ID Secret"
  class="mt-3 mb-3 border border-info rounded">

Go to your [Auth0 Dashboard](https://manage.auth0.com/dashboard/), after log into Auth0 Dashboard, select **Connections > Social**, then choose Github. Copy the `Client ID` and `Client Secret` from the `Developer Applications` of your app on Github into the fields on this page on Auth0.

<img src="/docs/images/aws/auth0-github-setup.png"
  alt="Auth0 Github Setup"
  class="mt-3 mb-3 border border-info rounded">

Then click **SAVE** button and go to the [Auth0 Dashboard](https://manage.auth0.com/dashboard/), take a note about the `Client ID` and `Client Secret`, which are found on your Auth0 application. 

<img src="/docs/images/aws/auth0-app-client-id-secret.png"
  alt="Auth0 App ClienID and ClientSecret"
  class="mt-3 mb-3 border border-info rounded">

### 5. Deploy Kubeflow

Download [{{% config-file-aws-cognito %}}]({{% config-uri-aws-cognito %}}). Before you `kfctl apply -V -f {{% config-file-aws-cognito %}}`, please update **spec** and **repos** fields in your Kubeflow configuration file at `{{% config-file-aws-cognito %}}`, so that it looks like this:
```
plugins:
- kind: KfAwsPlugin
  metadata:
    name: aws
  spec:
    auth:
      oidc:
        certArn: arn:aws:acm:us-west-2:########:certificate/#######-#####-###-#
        oAuthClientId: Your Auth0 App Client Id
        oAuthClientSecret: Your Auth0 App Client Secret
        oidcAuthorizationEndpoint: https://kftest.auth0.com/authorize
        oidcIssuer: https://kftest.auth0.com/
        oidcTokenEndpoint: https://kftest.auth0.com/oauth/token
        oidcUserInfoEndpoint: https://kftest.auth0.com/userinfo
      region: us-west-2
      enablePodIamPolicy: true
  repos:
  - name: manifests
    uri: https://github.com/kubeflow/manifests/archive/v1.0-branch.tar.gz
```

After you finish the TLS and Authentication configuration, then you can run `kfctl apply -V -f {{% config-file-aws-cognito %}}`.

After a while, your ALB will be ready, you can get ALB hostname by running follow command.

```
kubectl get ingress istio-ingress -n istio-system
NAME            HOSTS   ADDRESS                                                                 PORTS   AGE
istio-ingress   *       322ac077-istiosystem-istio-2af2-786120677.us-west-2.elb.amazonaws.com   80      56s
```

On Auth0 dashboard, click `Applications` on the left navigation bar, modify your ALB Hostname with prefix `https://` and postfix `/oauth2/idpresponse` in `Allowed Callback URLs` as below image:
  
<img src="/docs/images/aws/auth0-callback-url.png"
  alt="Auth0 App Callback URL"
  class="mt-3 mb-3 border border-info rounded">

## Succeed example

After you set up above steps, navigate the application from `https://Your ALB HostName` and you'll see a webpage like below:

<img src="/docs/images/aws/alb-login.png"
  alt="ALB Hostname Login"
  class="mt-3 mb-3 border border-info rounded">

After you login with Github, you should succeed in seeing a kubeflow dashboard webpage.