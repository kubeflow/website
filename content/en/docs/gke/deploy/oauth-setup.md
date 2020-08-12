+++
title = "Set up OAuth for Cloud IAP"
description = "Creating an OAuth client for Cloud IAP on Google Cloud Platform (GCP)"
weight = 2
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

If you want to use 
[Cloud Identity-Aware Proxy (Cloud IAP)](https://cloud.google.com/iap/docs/) 
when deploying Kubeflow on GCP,
then you must follow these instructions to create an OAuth client for use
with Kubeflow.

You can skip the instructions on this page if you want to use basic 
authentication (username and password) with Kubeflow instead of Cloud IAP.
Cloud IAP is recommended for production deployments or deployments with access 
to sensitive data.

Follow the steps below to create an OAuth client ID that identifies Cloud IAP 
when requesting access to a user's email account. Kubeflow uses the email 
address to verify the user's identity.

1. Set up your OAuth [consent screen](https://console.cloud.google.com/apis/credentials/consent):
   * In the **Application name** box, enter the name of your application.
     The example below uses the name "Kubeflow".
   * Under **Support email**, select the email address that you want to display 
     as a public contact. You must use either your email address or a Google 
     Group that you own.
   * If you see **Authorized domains**, enter

        ```
        <project>.cloud.goog
        ```
        * where \<project\> is your Google Cloud Platform (GCP) project ID.
        * If you are using your own domain, such as **acme.com**, you should add 
          that as well
        * The **Authorized domains** option appears only for certain project 
          configurations. If you don't see the option, then there's nothing you 
          need to set.        
   * Click **Save**.
   * Here's an example of the completed form:   
    <img src="/docs/images/consent-screen.png" 
      alt="OAuth consent screen"
      class="mt-3 mb-3 p-3 border border-info rounded">

1. On the [credentials screen](https://console.cloud.google.com/apis/credentials):
   * Click **Create credentials**, and then click **OAuth client ID**.
   * Under **Application type**, select **Web application**.
   * In the **Name** box enter any name for your OAuth client ID. This is *not*
     the name of your application nor the name of your Kubeflow deployment. It's
     just a way to help you identify the OAuth client ID.

1. Click **Create**. A dialog box appears, like the one below:

     <img src="/docs/images/new-oauth.png" 
      alt="OAuth consent screen"
      class="mt-3 mb-3 p-3 border border-info rounded">

1. Copy the **client ID** shown in the dialog box, because you need the client
  ID in the next step.

1. On the **Create credentials** screen, find your newly created OAuth 
  credential and click the pencil icon to edit it:
   
    <img src="/docs/images/oauth-edit.png" 
     alt="OAuth consent screen"
     class="mt-3 mb-3 p-3 border border-info rounded">

1. In the **Authorized redirect URIs** box, enter the following (if it's not 
  already present in the list of authorized redirect URIs):

    ```
    https://iap.googleapis.com/v1/oauth/clientIds/<CLIENT_ID>:handleRedirect
    ```
    * `<CLIENT_ID>` is the OAuth client ID that you copied from the dialog box in
      step four. It looks like `XXX.apps.googleusercontent.com`.
    * Note that the URI is not dependent on the Kubeflow deployment or endpoint. 
      Multiple Kubeflow deployments can share the same OAuth client without the 
      need to modify the redirect URIs.
    

1. Press **Enter/Return** to add the URI. Check that the URI now appears as
  a confirmed item under **Authorized redirect URIs**. (The URI should no longer be
  editable.)

    Here's an example of the completed form:
    <img src="/docs/images/oauth-credential.png" 
      alt="OAuth credentials"
      class="mt-3 mb-3 p-3 border border-info rounded">

1. Click **Save**.

1. Make note that you can find your OAuth client credentials in the credentials
  section of the GCP Console. You need to retrieve the **client ID** and 
  **client secret** later when you're ready to enable Cloud IAP.

## Next steps

* [Set up your management cluster](/docs/gke/deploy/management-setup/).
