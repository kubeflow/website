+++
title = "Accessing Kubeflow UIs"
description = "How to access the Kubeflow web UIs"
weight = 15
+++

Kubeflow includes a number of web user interfaces (UIs). This document provides 
instructions on how to connect to them.

## Accessing Kubeflow web UIs

Kubeflow comes with a number of web UIs, including:

* Central UI for navigation
* Jupyter notebooks
* TFJob Dashboard
* Katib Dashboard
* Pipelines Dashboard

To make it easy to connect to these UIs Kubeflow provides a left hand navigation
bar for navigating between the different applications.

Instructions below indicate how to connect to the Kubeflow landing page. From
there you can easily navigate to the different services using the left hand navigation
bar. The landing page looks like this:

<img src="/docs/images/central-ui.png" 
  alt="Kubeflow UI"
  class="mt-3 mb-3 border border-info rounded">


## Google Cloud Platform (Kubernetes Engine)

If you followed the guide to [deploying Kubeflow on Google Cloud Platform 
(GCP)](/docs/gke/deploy/), Kubeflow 
is deployed with Cloud Identity-Aware Proxy (Cloud IAP) or basic authentication, 
and the Kubeflow landing page is accessible at a URL of the following pattern:

```
https://<name>.endpoints.<project>.cloud.goog/
```

This URL brings up the landing page illustrated above.

When deployed with Cloud IAP, Kubeflow uses the 
[Let's Encrypt](https://letsencrypt.org/) service to provide an SSL certificate 
for the Kubeflow UI. For troubleshooting issues with your certificate, see the 
guide to 
[monitoring your Cloud IAP setup](/docs/gke/deploy/monitor-iap-setup/).

## Using Kubectl and port-forwarding

If you're not using the Cloud IAP option or if you haven't yet set up your 
Kubeflow endpoint, you can access Kubeflow via `kubectl` and port-forwarding.

1. Install `kubectl` if you haven't already done so:

  * If you're using Kubeflow on GCP, run the following command on the command 
    line: `gcloud components install kubectl`. 
  * Alternatively, follow the [`kubectl` 
    installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

1. Use the following command to set up port forwarding to the
  [Ambassador](https://www.getambassador.io/) service that provides the reverse proxy.

    {{% code-webui-port-forward %}}

1. Access the central navigation dashboard at:

    ```
    http://localhost:8080/
    ```

  * This will only work if you haven't enabled basic auth or Cloud IAP. If 
    authentication is enabled requests will be rejected
    because you are not connecting over HTTPS and attaching proper credentials.

  * Depending on how you've configured Kubeflow, not all UIs will work behind port-forwarding to the reverse proxy.

    * Some web applications need to be configured to know the base URL they are serving on.
    * So if you deployed Kubeflow with an ingress serving at `https://acme.mydomain.com` and configured an application
      to be served at the URL `https://acme.mydomain.com/myapp` then the app may not work when served on
      `https://localhost:8080/myapp` because the paths do not match. 

## Next steps

See how to [set up your Jupyter notebooks](/docs/notebooks/setup/) in
Kubeflow.