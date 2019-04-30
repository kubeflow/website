+++
title = "Deploy using UI"
description = "Instructions for using the UI to deploy Kubeflow on Google Cloud Platform (GCP)"
weight = 3
+++

This page provides instructions for using the Kubeflow deployment web app to
deploy Kubeflow on GCP. If you prefer to use the
command line, see the guide to 
[deployment using the CLI](/docs/gke/deploy/deploy-cli).

1. Open [https://deploy.kubeflow.cloud/](https://deploy.kubeflow.cloud/#/deploy)
  in your web browser.
1. Sign in using a GCP account that has administrator privileges for your 
  GCP project.
1. Complete the form, following the instructions on the left side of the form.
  In particular, ensure that you enter the same **deployment name** as you used
  when creating the OAuth client ID.
1. Check **Skip IAP** box if you want to use basic auth.
1. Click **Create Deployment**.

Here's a partial screenshot of the deployment UI, showing all the fields in the 
form:

<img src="/docs/images/kubeflow-deployment.png" 
  alt="Kubeflow deployment UI"
  class="mt-3 mb-3 border border-info rounded">

Kubeflow will be available at the following URI:

```
https://<deployment_name>.endpoints.<project>.cloud.goog/
```

It can take 10-15 minutes for the URI to become available. You can watch
for updates in the information box on the deployment UI. If the deployment
takes longer than expected, try accessing the above URI anyway.

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