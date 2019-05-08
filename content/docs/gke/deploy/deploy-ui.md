+++
title = "Deploy using UI"
description = "Instructions for using the UI to deploy Kubeflow on Google Cloud Platform (GCP)"
weight = 3
+++

This page provides instructions for using the Kubeflow deployment web app to
deploy Kubeflow on GCP. If you prefer to use the
command line, see [deployment using the CLI](/docs/gke/deploy/deploy-cli).

1. Open [https://deploy.kubeflow.cloud/](https://deploy.kubeflow.cloud/#/deploy)
  in your web browser.
2. Sign in using a GCP account that has administrator privileges for your GCP project. <!-- when i click on this link, there is no sign in page that gets loaded. Isn't this statement confusing for the user? -->
3. Complete the form, following the instructions on the left side of the form. In particular, ensure that you enter the same deployment name as you used when creating the OAuth client ID. <!-- is OAuth client ID created before doing this? then we can link to that step here-->
Here's a partial screenshot of the deployment UI, showing all the fields in the 
form: <img src="/docs/images/Kubeflow form.PNG" 
  alt="Kubeflow deployment UI"
  class="mt-3 mb-3 border border-info rounded">
4. The field **Choose how to connect to a kubeflow service:*** has three options:
  - [Login with GCP Iap](#Login_with_GCP_IAPSection)
  - [Login with Username Password](#Login_with_UsernamePassword_Section)
  - [Setup Endpoint later](#Setup_endpoint_later_Section)
5. Click **Create Deployment**. Kubeflow will be available at the following URI:
```
https://<deployment_name>.endpoints.<project>.cloud.goog/
```
  It can take 10-15 minutes for the URI to become available. You can watch
  for updates in the information box on the deployment UI. If the deployment
  takes longer than expected, try accessing the above URI anyway.

Note: 
**Create Permanent Storage** and **Share Anonymous Usage Reports**, at the bottom of the form, are optional.
**Create Permanent Storage** creates a physical storage <!--in ?? --> which will be available to you even after your Kubeflow project is completed or deleted.

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
  
  <!--Sub-sections, these will be not be part of this page  -->
## Login with GCP Iap {:#Login_with_GCP_IAPSection}
If you select this option, you see the form:
<img src="/docs/images/Login with GCP IAP option.png" 
  alt="Login with GCP IAP option"
  class="mt-3 mb-3 border border-info rounded">
- If you haven’t already done so, create an [OAuth Client](https://www.kubeflow.org/docs/gke/deploy/oauth-setup/) and enter the client ID and secret in the field.
- The default GKE zone is us-central-1a. Use the dropdown to select the zone you want.
- The Kubeflow version cannot be changed currently.

Note: The three buttons at the bottom of the form are:
- **Create Deployment**: Click this to deploy your Kubeflow project.
- **Kubeflow Service Endpoint**: <!-- need info on this--> 
- **View YAML**: Click this to display the deployment YAML details in a new popup box, as shown below:
```
{"appAddress":"https://deploy.kubeflow.cloud","defaultApp":{"components":[{"name":"ambassador","prototype":"ambassador"},{"name":"argo","prototype":"argo"},{"name":"centraldashboard","prototype":"centraldashboard"},{"name":"cert-manager","prototype":"cert-manager"},{"name":"cloud-endpoints","prototype":"cloud-endpoints"},{"name":"gcp-credentials-admission-webhook","prototype":"gcp-credentials-admission-webhook"},{"name":"gpu-driver","prototype":"gpu-driver"},{"name":"iap-ingress","prototype":"iap-ingress"},{"name":"jupyter-web-app","prototype":"jupyter-web-app"},{"name":"katib","prototype":"katib"},{"name":"metacontroller","prototype":"metacontroller"},{"name":"notebook-controller","prototype":"notebook-controller"},{"name":"pipeline","prototype":"pipeline"},{"name":"pytorch-operator","prototype":"pytorch-operator"},{"name":"tf-job-operator","prototype":"tf-job-operator"},{"name":"spartakus","prototype":"spartakus"}],"parameters":[{"component":"cloud-endpoints","name":"secretName","value":"admin-gcp-sa"},{"component":"cert-manager","name":"acmeEmail","value":"user@email.com"},{"component":"iap-ingress","name":"ipName","value":"kubeflow-ip"},{"component":"iap-ingress","name":"hostname","value":"kubeflow.endpoints..cloud.goog"},{"component":"ambassador","name":"platform","value":"gke"},{"component":"spartakus","name":"usageId","value":"73733067"},{"component":"spartakus","name":"reportUsage","value":"true"}],"registries":[{"name":"kubeflow","repo":"https://github.com/kubeflow/kubeflow","version":"v0.5.0","path":"kubeflow"}]}}

```

## Login with Username Password  {:#Login_with_UsernamePassword_Section}
If you select this option, you see the form: 
<img src="/docs/images/Login with username password option.png" 
  alt="Login with username password option"
  class="mt-3 mb-3 border border-info rounded">
1. Fill in the details to create a new user name and password.
2. The default GKE zone is us-central-1a. Use the dropdown to select the zone you want.
3. The Kubeflow version cannot be changed currently.

Note: The three buttons at the bottom of the form are:
- **Create Deployment**: Click this to deploy your Kubeflow project.
- **Kubeflow Service Endpoint**: <!-- need info on this--> 
- **View YAML**: Click this to display the deployment YAML details in a new popup box, as shown below:
```
{"appAddress":"https://deploy.kubeflow.cloud","defaultApp":{"components":[{"name":"ambassador","prototype":"ambassador"},{"name":"argo","prototype":"argo"},{"name":"centraldashboard","prototype":"centraldashboard"},{"name":"cert-manager","prototype":"cert-manager"},{"name":"cloud-endpoints","prototype":"cloud-endpoints"},{"name":"gcp-credentials-admission-webhook","prototype":"gcp-credentials-admission-webhook"},{"name":"gpu-driver","prototype":"gpu-driver"},{"name":"iap-ingress","prototype":"iap-ingress"},{"name":"jupyter-web-app","prototype":"jupyter-web-app"},{"name":"katib","prototype":"katib"},{"name":"metacontroller","prototype":"metacontroller"},{"name":"notebook-controller","prototype":"notebook-controller"},{"name":"pipeline","prototype":"pipeline"},{"name":"pytorch-operator","prototype":"pytorch-operator"},{"name":"tf-job-operator","prototype":"tf-job-operator"},{"name":"spartakus","prototype":"spartakus"}],"parameters":[{"component":"cloud-endpoints","name":"secretName","value":"admin-gcp-sa"},{"component":"cert-manager","name":"acmeEmail","value":"user@email.com"},{"component":"iap-ingress","name":"ipName","value":"kubeflow-ip"},{"component":"iap-ingress","name":"hostname","value":"kubeflow.endpoints..cloud.goog"},{"component":"ambassador","name":"platform","value":"gke"},{"component":"spartakus","name":"usageId","value":"73733067"},{"component":"spartakus","name":"reportUsage","value":"true"}],"registries":[{"name":"kubeflow","repo":"https://github.com/kubeflow/kubeflow","version":"v0.5.0","path":"kubeflow"}]}}

```

## Setup Endpoint later {:#Setup_endpoint_later_Section}
If you select this option, you see the form: 
<img src="/docs/images/Setup endpoint later option.png" 
  alt="Setup endpoint later option"
  class="mt-3 mb-3 border border-info rounded">
We recommend this option when you want to [Deploy using CLI](https://www.kubeflow.org/docs/gke/deploy/deploy-cli/). If you want to deploy Kubeflow using the web interface, use the options [Login with GCP IAP[({:#Login_with_GCP_IAPSection}) and [Login with Username Password]({:#Login_with_UsernamePassword_Section}).
- The default GKE zone is us-central-1a. Use the dropdown to select the zone you want.
- The Kubeflow version cannot be changed currently.

Note: The three buttons at the bottom of the form are: 
![Setup endpoint later buttons](docs/images/Setup endpoint later buttons.png "Setup endpoint later buttons")
- **Create Deployment**: Click this to deploy your Kubeflow project.
- **Port Forward**: <!-- need info on this-->
- **View YAML**: Click this to display the deployment YAML details in a new popup box, as shown below:
```
{"appAddress":"https://deploy.kubeflow.cloud","defaultApp":{"components":[{"name":"ambassador","prototype":"ambassador"},{"name":"argo","prototype":"argo"},{"name":"centraldashboard","prototype":"centraldashboard"},{"name":"cert-manager","prototype":"cert-manager"},{"name":"cloud-endpoints","prototype":"cloud-endpoints"},{"name":"gcp-credentials-admission-webhook","prototype":"gcp-credentials-admission-webhook"},{"name":"gpu-driver","prototype":"gpu-driver"},{"name":"iap-ingress","prototype":"iap-ingress"},{"name":"jupyter-web-app","prototype":"jupyter-web-app"},{"name":"katib","prototype":"katib"},{"name":"metacontroller","prototype":"metacontroller"},{"name":"notebook-controller","prototype":"notebook-controller"},{"name":"pipeline","prototype":"pipeline"},{"name":"pytorch-operator","prototype":"pytorch-operator"},{"name":"tf-job-operator","prototype":"tf-job-operator"},{"name":"spartakus","prototype":"spartakus"}],"parameters":[{"component":"cloud-endpoints","name":"secretName","value":"admin-gcp-sa"},{"component":"cert-manager","name":"acmeEmail","value":"user@email.com"},{"component":"iap-ingress","name":"ipName","value":"kubeflow-ip"},{"component":"iap-ingress","name":"hostname","value":"kubeflow.endpoints..cloud.goog"},{"component":"ambassador","name":"platform","value":"gke"},{"component":"spartakus","name":"usageId","value":"73733067"},{"component":"spartakus","name":"reportUsage","value":"true"}],"registries":[{"name":"kubeflow","repo":"https://github.com/kubeflow/kubeflow","version":"v0.5.0","path":"kubeflow"}]}}

```
