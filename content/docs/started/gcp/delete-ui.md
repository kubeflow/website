+++
title = "Delete using Cloud Console"
description = "Instructions for deleting Kubeflow using the Cloud Console"
weight = 5
+++

Instructins for deleting Kubeflow using the Google Cloud Console.

To delete your Kubeflow deployment and reclaim all related resources, using the
GCP Console:

1. Open the [Deployment Manager in the GCP
   Console](https://console.cloud.google.com/dm/deployments) for your project.
   Deployment Manager lists all the available deployments
   in your project. Make sure that the selected project is the same as the one
   you used for your Kubeflow deployment. 
   <img src="/docs/images/deployments.png"
   alt="Deployment Manager in GCP Console"
   class="mt-3 mb-3 border border-info rounded">

1. Select your Kubeflow deployment with the deployment name you used at the
   time of creation and click the **Delete** button at the top.
   <img src="/docs/images/delete-deployment.png"
   alt="Deleting Kubeflow deployment in GCP Console"
   class="mt-3 mb-3 border border-info rounded">

This action should delete any running nodes in your deployment, delete service
accounts that were created for the deployment, and reclaim all resources.

