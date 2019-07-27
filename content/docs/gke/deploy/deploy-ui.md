+++
title = "Deploy using UI"
description = "Instructions for using the UI to deploy Kubeflow on Google Cloud Platform (GCP)"
weight = 3
+++

This page provides instructions for using the Kubeflow deployment web app to
deploy Kubeflow on GCP. The deployment web app currently supports
**Kubeflow {{% kf-deployment-ui-version %}}**.

For more control over your deployment, see the guide to 
[deployment using the CLI](/docs/gke/deploy/deploy-cli).
The CLI supports Kubeflow {{% kf-latest-version %}} and later versions.

## Overview of the deployment user interface (UI)

Here's a partial screenshot of the deployment UI:

<img src="/docs/images/kubeflow-deployment.png" 
  alt="Kubeflow deployment UI"
  class="mt-3 mb-3 border border-info rounded">

Follow these steps to open the deployment UI and deploy Kubeflow on GCP:

1. Open [https://deploy.kubeflow.cloud/](https://deploy.kubeflow.cloud/#/deploy)
  in your web browser. You should see a form like the one in the above
  screenshot.
1. Sign in to your browser using an account that has the 
  [`owner` role](https://cloud.google.com/iam/docs/understanding-roles) 
  for your GCP project.
1. Complete the following fields on the form:

    * **Project:** Enter your GCP project name.
    * **Deployment name:** Enter a short name that you can use to recognize this 
      deployment of Kubeflow. If you plan to use [Cloud Identity-Aware Proxy
      (Cloud IAP)](https://cloud.google.com/iap/docs/) for access control (see
      the next option below), make sure you use the same deployment name 
      on the deployment UI and when [creating the OAuth 
      client ID](/docs/gke/deploy/oauth-setup/).
      The maximum length for the deployment name is 25 characters.
    * **Choose how to connect to Kubeflow:** You can choose one of the
      following options:

      * **Login with GCP Iap:** Choose this option if you want to use [Cloud 
        Identity-Aware Proxy (Cloud
        IAP)](https://cloud.google.com/iap/docs/) for access control.
        Cloud IAP is the best option for production deployments or deployments 
        with access to sensitive data. See more details [below](#cloud-iap).
      * **Login with Username Password:** Choose this option if you want to
        allow users to access Kubeflow with a username and password, that is,
        with basic authentication. See more details [below](#basic-auth).
      * **Setup Endpoint later:** Choose this option if you want to skip
        the authentication process and set up the URI for the Kubeflow UI later.
        See more details [below](#later-auth).

    * **GKE zone:** Enter the 
      [GCP zone](https://cloud.google.com/compute/docs/regions-zones/) in which 
      to create your deployment. The default is `us-central-1a`.
    * **Kubeflow version:** Choose one of the available versions of Kubeflow.
      You can see all the versions on the 
      [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/).
      If you need a version that does not show on the deployment UI, you need to
      [deploy Kubeflow using the CLI](/docs/gke/deploy/deploy-cli).
    * **Create Permanent Storage:** Check this option if you plan to use 
      [Kubeflow Pipelines](/docs/pipelines/pipelines-overview/) and you need 
      persistent storage for your pipeline data. The default is not to add
      persistent storage. For more information, see the guide to
      [upgrading and reinstalling Kubeflow Pipelines](/docs/pipelines/upgrade/).
    * **Share Anonymous Usage Report:** Check this option to allow Kubeflow to
      report usage data using [Spartakus](https://github.com/kubernetes-incubator/spartakus). Spartakus does not report any personal information. The 
      default is to enable the reporting of usage data.

1. Click **Create Deployment**.

1. Watch for the deployment updates in the information box at the bottom of the 
  deployment UI.

<a id="cloud-iap"></a>
## Authenticating with Cloud IAP

This section contains details about using [Cloud 
IAP](https://cloud.google.com/iap/docs/) to control access to Kubeflow. 
Cloud IAP is the best option for production deployments or deployments with 
access to sensitive data.

1. Follow the guide to [setting up OAuth 
  credentials](/docs/gke/deploy/oauth-setup/).

1. Choose the **Login with GCP Iap** option on the Kubeflow deployment UI.

1. Enter your **OAuth client ID** and **OAuth client secret** into the
  corresponding fields on the deployment UI.

1. Complete the rest of the form as described above.

Kubeflow will be available at the following URI:

```
https://<deployment_name>.endpoints.<project>.cloud.goog/
```

It can take 10-15 minutes for the URI to become available. You can watch
for updates in the information box on the deployment UI. If the deployment
takes longer than expected, click **Kubeflow Service Endpoint** to try
accessing your Kubeflow URI.

<a id="basic-auth"></a>
## Authenticating with username and password

This section contains details about using basic authentication (username and
password) to control access to Kubeflow. 

1. Choose the **Login with Username Password** option on the Kubeflow deployment UI.

1. Enter a **username** and a **password** for use when accessing the UI for
  your Kubeflow deployment.

1. Complete the rest of the form as described above.

1. Click **Kubeflow Service Endpoint** to access your Kubeflow URI.

<a id="later-auth"></a>
## Setting up your endpoint later

You can choose to deploy Kubeflow without creating an endpoint for the Kubeflow
service.

1. Choose the **Setup Endpoint later** option on the Kubeflow deployment UI.
1. Click **Port Forward** to set up port forwarding and access your Kubeflow 
  cluster at `http://localhost:8080/`. For more information about port 
  forwarding, see the guide to 
  [accessing the Kubeflow UIs](/docs/other-guides/accessing-uis/).
1. Finish the setup later by inserting your OAuth client into the
  Kubeflow cluster. Read more about 
  [customizing Kubeflow](/docs/gke/customizing-gke/) and
  [securing your clusters](/docs/gke/private-clusters/).

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
