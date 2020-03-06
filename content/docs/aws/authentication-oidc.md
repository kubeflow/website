+++
title = "Authentication and Authorization through OIDC"
description = "Authentication and authorization support through OIDC for Kubeflow in AWS"
weight = 90
+++

This section shows the how to setup Kubeflow with authentication and authorization support through OIDC in Amazon Web Services (AWS). Similar to [Cognito tutorial](https://www.kubeflow.org/docs/aws/authentication/).

## Enable TLS and Authentication
[OIDC](https://openid.net/connect/) allows clients to verify the identity of the End-User based on the authentication performed by an Authorization Server. OIDC allows clients of all types, including Web-based, mobile, and JavaScript clients, to request and receive information about authenticated sessions and end-users. For this tutorial, we take Github Login as an example.

In order to authenticate and manage users for Kubeflow, let's first connect Auth0 app to Github. You can follow instructions [here](https://auth0.com/docs/connections/social/github).

The details of instruction are listed below:

### 1. Add a new Application in Github
To add a new application, log in to [GitHub](https://github.com/) and go to **OAuth Apps** in your [developer settings](https://github.com/settings/developers). Next click [Register a new application](https://github.com/settings/applications/new).

<img src="/docs/images/aws/github-oauth-app-register.png"
  alt="Github Oauth App Register"
  class="mt-3 mb-3 border border-info rounded">

### 2. Register Your New App
On the [Register a new application](https://github.com/settings/applications/new) page fill out the form with the following information. Modify the parameters to reflect your application.

If your Auth0 domain name is not shown above and you are not using our custom domains feature, your domain name is your tenant name, plus `.auth0.com`. For example, if your tenant name were `kftest`, your Auth0 domain name would be `kftest.auth0.com` and your redirect URI would be `https://kftest.auth0.com/login/callback`.

<img src="/docs/images/aws/github-oauth-app-register-details.png"
  alt="Github Oauth App Register Details"
  class="mt-3 mb-3 border border-info rounded">

After completing the form click **Register application** to proceed.

### 3. Get your GitHub app's Client ID and Client Secret
Once the application is registered, your app's `Client ID` and `Client Secret` will be displayed on the following page:

<img src="/docs/images/aws/github-oauth-app-client-id-secret.png"
  alt="Github Oauth App Client ID Secret"
  class="mt-3 mb-3 border border-info rounded">
  
### 4. Copy your GitHub app's Client ID and Client Secret

Go to your [Auth0 Dashboard](https://manage.auth0.com/dashboard/), if you haven't sign in with Auth0 yet, you can login at first.

<img src="/docs/images/aws/auth0-login.png"
  alt="Auth0 Login"
  class="mt-3 mb-3 border border-info rounded">
 
Then you can look at below page and modify the domain name Under `TENANT DOMAIN` to be the domain name you set up in Step 2.

<img src="/docs/images/aws/auth0-welcome-page.png"
  alt="Auth0 Welcome Page"
  class="mt-3 mb-3 border border-info rounded">
 
After modification, click **NEXT** button. Then you can set up your personal information there and click **CREATE ACCOUNT** button.
 
After log into Auth0 Dashboard, select **Connections > Social**, then choose Github. Copy the `Client ID` and `Client Secret` from the `Developer Applications` of your app on Github into the fields on this page on Auth0.

<img src="/docs/images/aws/auth0-github-setup.png"
  alt="Auth0 Welcome Page"
  class="mt-3 mb-3 border border-info rounded">

Then click **SAVE** button.

### 5. Set up Auth0 Callback URLs
If you have already installed kubeflow by following [this tutorial](https://www.kubeflow.org/docs/aws/deploy/install-kubeflow/) before, run below command and you can copy ALB Hostname:
```
kubectl get ingress istio-ingress -n istio-system
NAME            HOSTS   ADDRESS                                                                 PORTS   AGE
istio-ingress   *       322ac077-istiosystem-istio-2af2-786120677.us-west-2.elb.amazonaws.com   80      56s
```

On Auth0 dashboard, click `Applications` on the left navigation bar, modify your ALB Hostname with prefix `https://` and postfix `/oauth2/idpresponse` in `Allowed Callback URLs` as below image:
  
<img src="/docs/images/aws/auth0-callback-url.png"
  alt="Auth0 App Callback URL"
  class="mt-3 mb-3 border border-info rounded">

## Set up ALB with Auth0

The general tutorial is [here](https://medium.com/@sandrinodm/securing-your-applications-with-aws-alb-built-in-authentication-and-auth0-310ad84c8595) you can follow.

The details of instructions are listed below:

### ALB Setup
Go to [EC2 page](https://us-west-2.console.aws.amazon.com/ec2/v2/home) and click `Load Balancers` on the left navigation bar, and find corresponding Load Balancer for kubeflow. Then you'll add a rule for the HTTPS listener.

<img src="/docs/images/aws/alb-listener-rule.png"
  alt="ALB Listener Rule Modification"
  class="mt-3 mb-3 border border-info rounded">

In the rule you can add an `Authenticate` step before the `Forward to` step, requiring all requests to be authenticated first. 
Note that the `Client ID` and `Client Secret` are found on your Auth0 application. 

<img src="/docs/images/aws/auth0-app-client-id-secret.png"
  alt="Auth0 App ClienID and ClientSecret"
  class="mt-3 mb-3 border border-info rounded">

Configuring it will require you to fill in the following settings:

```
Issuer: https://your-domain/
Authorization Endpoint: https://your-domain/authorize
Token Endpoint: https://your-domain/oauth/token
User Info Endpoint: https://your-domain/userinfo
Client ID and Client Secret of your Auth0 Application
Scope: openid profile scope will give you the full user profile
```

An example is provided as below:

<img src="/docs/images/aws/alb-listener-rule-auth.png"
  alt="ALB Listener Rule Auth Step"
  class="mt-3 mb-3 border border-info rounded">


## Succeed example

After you set up above steps, navigate the application from `https://Your ALB HostName` and you'll see a webpage like below:

<img src="/docs/images/aws/alb-login.png"
  alt="ALB Hostname Login"
  class="mt-3 mb-3 border border-info rounded">

After you login with Github, you should succeed in seeing a kubeflow dashboard webpage below:

<img src="/docs/images/aws/kubeflow-main-page.png.png"
  alt="Kubeflow Dashboard Page"
  class="mt-3 mb-3 border border-info rounded">