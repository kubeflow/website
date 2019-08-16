+++
title = "Accessing Kubeflow UIs"
description = "How to access the Kubeflow web UIs"
weight = 1
+++

Kubeflow includes a number of web user interfaces (UIs). This document provides
instructions on how to connect to them.

## Overview of Kubeflow UIs

The Kubeflow UIs include the following:

* A central **Kubeflow** UI for navigation between the Kubeflow applications.
* **Pipelines** for a Kubeflow Pipelines dashboard
* **Notebook Servers** for Jupyter notebooks.
* **Katib** for hyperparameter tuning.
* **Artifact Store** for tracking of artifact metadata.
* **tf-operator** for a TFJob dashboard.

Instructions below indicate how to connect to the Kubeflow central UI. From
there you can navigate to the different services using the left hand navigation
bar. 

The central UI dashboard looks like this:

<img src="/docs/images/central-ui.png"
  alt="Kubeflow central UI"
  class="mt-3 mb-3 border border-info rounded">

## Overview of accessing the Kubeflow UIs

To access the Kubeflow UIs you need to connect to the 
[ISTIO gateway](https://istio.io/docs/concepts/traffic-management/#gateways) that 
provides access to the Kubeflow 
[service mesh](https://istio.io/docs/concepts/what-is-istio/#what-is-a-service-mesh).

How you access the ISTIO gateway varies depending on how you've configured it.

## URL pattern with Google Cloud Platform (GCP)

If you followed the guide to [deploying Kubeflow on GCP](/docs/gke/deploy/), 
the Kubeflow central UI is accessible at a URL of the following pattern:

```
https://<application-name>.endpoints.<project-id>.cloud.goog/
```

The URL brings up the dashboard illustrated above.

If you deploy Kubeflow with Cloud Identity-Aware Proxy (IAP), Kubeflow uses the
[Let's Encrypt](https://letsencrypt.org/) service to provide an SSL certificate
for the Kubeflow UI. For troubleshooting issues with your certificate, see the
guide to
[monitoring your Cloud IAP setup](/docs/gke/deploy/monitor-iap-setup/).

## Using kubectl and port-forwarding

If you didn't configure Kubeflow to integrate with an identity provider and perform 
any authorization then you can port-forward directly to the ISTIO gateway.

Port-forwarding typically does not work if any of the following are true:

  * You've deployed Kubeflow on GCP using the 
    [GCP deployment UI](/docs/gke/deploy/deploy-ui/) or the default settings 
    with the [CLI deployment](/docs/gke/deploy/deploy-cli/). (If you want to
    use port forwarding, you must deploy Kubeflow on an existing Kubernetes 
    cluster using the [`kfctl_k8s_istio` 
    configuration](/docs/started/k8s/kfctl-k8s-istio/).)

  * You've configured the ISTIO ingress to only accept 
    HTTPS traffic on a specific domain or IP address.

  * You've configured the ISTIO ingress to perform an authorization check 
    (for example, using Cloud IAP or [Dex](https://github.com/dexidp/dex)).


You can access Kubeflow via `kubectl` and port-forwarding as follows:

1. Install `kubectl` if you haven't already done so:

  * If you're using Kubeflow on GCP, run the following command on the command
    line: `gcloud components install kubectl`.
  * Alternatively, follow the [`kubectl`
    installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

1. Use the following command to set up port forwarding to the
  [ISTIO gateway](https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/).

    {{% code-webui-port-forward %}}

1. Access the central navigation dashboard at:

    ```
    http://localhost:8080/
    ```

  * Depending on how you've configured Kubeflow, not all UIs work behind 
    port-forwarding to the reverse proxy.

        For some web applications, you need to configure the base URL on which
        the app is serving.
        
        For example, if you deployed Kubeflow with an ingress serving at 
        `https://example.mydomain.com` and configured an application
        to be served at the URL `https://example.mydomain.com/myapp`, then the 
        app may not work when served on
        `https://localhost:8080/myapp` because the paths do not match.

## Next steps

* See how to [access the TFJob dashboard](/docs/components/training/tftraining/).
* [Set up your Jupyter notebooks](/docs/notebooks/setup/) in Kubeflow.
