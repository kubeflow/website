+++
title = "Deploy using UI"
description = "Instructions for using the UI to deploy Kubeflow on Google Cloud Platform (GCP)"
weight = 3
+++

This page provides instructions for using the Kubeflow deployment web app to
deploy Kubeflow on GCP. If you prefer to use the
command line, see the guide to [deployment using the CLI](/docs/gke/deploy/deploy-cli).

<ol>
<li> Open [https://deploy.kubeflow.cloud/](https://deploy.kubeflow.cloud/#/deploy)
  in your web browser.
  </li> 
<li> Sign in using a GCP account that has administrator privileges for your GCP project. <!-- no sign in page gets loaded when link is clicked? -->
  </li> 
<li> Complete the form, following the instructions on the left side of the form. In particular, ensure that you enter the same deployment name as you used when creating the OAuth client ID. <!-- OAuth client ID created before this step? link it here?-->

Here's a partial screenshot of the deployment UI, showing all the fields in the 
form: </br> 
<img src="https://github.com/jay-saldanha/website/blob/master/content/docs/images/kubeflow-deployment.PNG" 
  alt="Kubeflow deployment UI"
  class="mt-3 mb-3 border border-info rounded">
 </li>  
<li> The field **Choose how to connect to a kubeflow service:*** has three options:</br>
  
  - <A href="#Login with GCP Iap">Login with GCP Iap</A>
  - <A href="#Login with Username Password">Login with Username Password</A>
  - <A href="#Setup Endpoint later">Setup Endpoint later</A>
 </li> 
<li> Click **Create Deployment**. Kubeflow will be available at the following URI:</br>
`https://<deployment_name>.endpoints.<project>.cloud.goog/`
  
  </br>It can take 10-15 minutes for the URI to become available. You can watch
  for updates in the information box on the deployment UI. If the deployment
  takes longer than expected, try accessing the above URI anyway.
  </li> 
</ol>
Note: 
**Create Permanent Storage** and **Share Anonymous Usage Reports**, at the bottom of the form, are optional.
**Create Permanent Storage** creates a physical storage <!--where is this created--> which will be available to you even after your Kubeflow project is completed or deleted.

## Next steps

* Run a full ML workflow on Kubeflow, using the
  [end-to-end MNIST tutorial](/docs/gke/gcp-e2e/) or the
  [GitHub issue summarization 
  example](https://github.com/kubeflow/examples/tree/master/github_issue_summarization).
* See how to delete your Kubeflow deployment using the 
  [CLI](/docs/gke/deploy/delete-cli) 
   or the [GCP Console](/docs/gke/deploy/delete-ui).
* See how to [customize](/docs/gke/customizing-gke) your Kubeflow 
  deployment.
* See how to [upgrade Kubeflow](/docs/other-guides/upgrade/) and how to 
  [upgrade or reinstall a Kubeflow Pipelines 
  deployment](/docs/pipelines/upgrade/).
* [Troubleshoot](/docs/gke/troubleshooting-gke) any issues you may
  find.
  
<!--Sub-sections -->
<H2 id="Login with GCP Iap">Login with GCP Iap</H2>
If you select this option, you see the form:

<img src="https://github.com/jay-saldanha/website/blob/master/content/docs/images/kubeflow-deployment.PNG" 
  alt="Login with GCP IAP option"
  class="mt-3 mb-3 border border-info rounded">
  
- If you haven’t already done so, create an [OAuth Client](https://www.kubeflow.org/docs/gke/deploy/oauth-setup/) and enter the client ID and secret in the field.
- The default GKE zone is us-central-1a. Use the dropdown to select the zone you want.
- The Kubeflow version cannot be changed currently.

Note: The three buttons at the bottom of the form are:</br>
- **Create Deployment**: Click this to deploy your Kubeflow project.
- **Kubeflow Service Endpoint**: Click this to get to the URI of your newly created Kubeflow service.
- **View YAML**: Click this to display the deployment YAML details in a new popup box, as shown below:

```YAML
appAddress: 'https://deploy.kubeflow.cloud'
defaultApp:
  components:
    -
      name: ambassador
      prototype: ambassador
    -
      name: argo
      prototype: argo
    -
      name: centraldashboard
      prototype: centraldashboard
    -
      name: cert-manager
      prototype: cert-manager
    -
      name: cloud-endpoints
      prototype: cloud-endpoints
    -
      name: gcp-credentials-admission-webhook
      prototype: gcp-credentials-admission-webhook
    -
      name: gpu-driver
      prototype: gpu-driver
    -
      name: iap-ingress
      prototype: iap-ingress
    -
      name: jupyter-web-app
      prototype: jupyter-web-app
    -
      name: katib
      prototype: katib
    -
      name: metacontroller
      prototype: metacontroller
    -
      name: notebook-controller
      prototype: notebook-controller
    -
      name: pipeline
      prototype: pipeline
    -
      name: pytorch-operator
      prototype: pytorch-operator
    -
      name: tf-job-operator
      prototype: tf-job-operator
    -
      name: spartakus
      prototype: spartakus
  parameters:
    -
      component: cloud-endpoints
      name: secretName
      value: admin-gcp-sa
    -
      component: cert-manager
      name: acmeEmail
      value: user@email.com
    -
      component: iap-ingress
      name: ipName
      value: kubeflow-ip
    -
      component: iap-ingress
      name: hostname
      value: kubeflow.endpoints..cloud.goog
    -
      component: ambassador
      name: platform
      value: gke
    -
      component: spartakus
      name: usageId
      value: '90204578'
    -
      component: spartakus
      name: reportUsage
      value: 'true'
  registries:
    -
      name: kubeflow
      repo: 'https://github.com/kubeflow/kubeflow'
      version: v0.5.0
      path: kubeflow

```
<H2 id="Login with Username Password">Login with Username Password</H2>
</br>If you select this option, you see the form: 

<img src="https://github.com/jay-saldanha/website/blob/master/content/docs/images/login-username-password.PNG" 
  alt="Login with username password option"
  class="mt-3 mb-3 border border-info rounded">
  
- Fill in the details to create a new user name and password.
- The default GKE zone is us-central-1a. Use the dropdown to select the zone you want.
- The Kubeflow version cannot be changed currently.

Note: The three buttons at the bottom of the form are:
- **Create Deployment**: Click this to deploy your Kubeflow project.
- **Kubeflow Service Endpoint**: Click this to get to the URI of your newly created Kubeflow service.
- **View YAML**: Click this to display the deployment YAML details in a new popup box, as shown below:

``` YAML
appAddress: 'https://deploy.kubeflow.cloud'
defaultApp:
  components:
    -
      name: ambassador
      prototype: ambassador
    -
      name: argo
      prototype: argo
    -
      name: centraldashboard
      prototype: centraldashboard
    -
      name: cert-manager
      prototype: cert-manager
    -
      name: cloud-endpoints
      prototype: cloud-endpoints
    -
      name: gcp-credentials-admission-webhook
      prototype: gcp-credentials-admission-webhook
    -
      name: gpu-driver
      prototype: gpu-driver
    -
      name: iap-ingress
      prototype: iap-ingress
    -
      name: jupyter-web-app
      prototype: jupyter-web-app
    -
      name: katib
      prototype: katib
    -
      name: metacontroller
      prototype: metacontroller
    -
      name: notebook-controller
      prototype: notebook-controller
    -
      name: pipeline
      prototype: pipeline
    -
      name: pytorch-operator
      prototype: pytorch-operator
    -
      name: tf-job-operator
      prototype: tf-job-operator
    -
      name: spartakus
      prototype: spartakus
  parameters:
    -
      component: cloud-endpoints
      name: secretName
      value: admin-gcp-sa
    -
      component: cert-manager
      name: acmeEmail
      value: user@email.com
    -
      component: iap-ingress
      name: ipName
      value: kubeflow-ip
    -
      component: iap-ingress
      name: hostname
      value: kubeflow.endpoints..cloud.goog
    -
      component: ambassador
      name: platform
      value: gke
    -
      component: spartakus
      name: usageId
      value: '90204578'
    -
      component: spartakus
      name: reportUsage
      value: 'true'
  registries:
    -
      name: kubeflow
      repo: 'https://github.com/kubeflow/kubeflow'
      version: v0.5.0
      path: kubeflow
```
<H2 id="Setup Endpoint later">Setup Endpoint later</H2>

If you select this option, you see the form: 

<img src="https://github.com/jay-saldanha/website/blob/master/content/docs/images/setup-endpoint-later.PNG" 
  alt="Setup endpoint later option"
  class="mt-3 mb-3 border border-info rounded">

</br>We recommend this option when you want to [Deploy using CLI](https://www.kubeflow.org/docs/gke/deploy/deploy-cli/). If you want to deploy Kubeflow using the web interface, use the options <A href="#Login with GCP Iap">Login with GCP Iap</A> and <A href="#Login with Username Password">Login with Username Password</A>.
- The default GKE zone is us-central-1a. Use the dropdown to select the zone you want.
- The Kubeflow version cannot be changed currently.
 
Note: The three buttons at the bottom of the form are: 

- **Create Deployment**: Click this to deploy your Kubeflow project.
- **Port Forward**:  Click this to access Google Kubernetes Engine (GKE) for running the newly created kubeflow cluster.
- **View YAML**: Click this to display the deployment YAML details in a new popup box, as shown below:<!--LMK if there is more PII in YAML code that i should remove-->

``` YAML
appAddress: 'https://deploy.kubeflow.cloud'
defaultApp:
  components:
    -
      name: ambassador
      prototype: ambassador
    -
      name: argo
      prototype: argo
    -
      name: centraldashboard
      prototype: centraldashboard
    -
      name: cert-manager
      prototype: cert-manager
    -
      name: cloud-endpoints
      prototype: cloud-endpoints
    -
      name: gcp-credentials-admission-webhook
      prototype: gcp-credentials-admission-webhook
    -
      name: gpu-driver
      prototype: gpu-driver
    -
      name: iap-ingress
      prototype: iap-ingress
    -
      name: jupyter-web-app
      prototype: jupyter-web-app
    -
      name: katib
      prototype: katib
    -
      name: metacontroller
      prototype: metacontroller
    -
      name: notebook-controller
      prototype: notebook-controller
    -
      name: pipeline
      prototype: pipeline
    -
      name: pytorch-operator
      prototype: pytorch-operator
    -
      name: tf-job-operator
      prototype: tf-job-operator
    -
      name: spartakus
      prototype: spartakus
  parameters:
    -
      component: cloud-endpoints
      name: secretName
      value: admin-gcp-sa
    -
      component: cert-manager
      name: acmeEmail
      value: user@email.com
    -
      component: iap-ingress
      name: ipName
      value: kubeflow-ip
    -
      component: iap-ingress
      name: hostname
      value: kubeflow.endpoints..cloud.goog
    -
      component: ambassador
      name: platform
      value: gke
    -
      component: spartakus
      name: usageId
      value: '90204578'
    -
      component: spartakus
      name: reportUsage
      value: 'true'
  registries:
    -
      name: kubeflow
      repo: 'https://github.com/kubeflow/kubeflow'
      version: v0.5.0
      path: kubeflow
```
 
