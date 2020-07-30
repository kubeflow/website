+++
title = "Central Dashboard"
description = "Overview of the Kubeflow user interfaces (UIs)"
weight = 10
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

{{% stable-status %}}

Your Kubeflow deployment includes a central dashboard that provides quick access
to the Kubeflow components deployed in your cluster. The dashboard includes the
following features:

- Shortcuts to specific actions, a list of recent pipelines and notebooks, and
  metrics, giving you an overview of your jobs and cluster in one view.
- A housing for the UIs of the components running in the cluster, including
  **Pipelines**, **Katib**, **Notebooks**, and more.
- A [registration flow](/docs/components/central-dash/registration-flow/) that
  prompts new users to set up their namespace if necessary. 

## Overview of Kubeflow UIs

The Kubeflow UIs include the following:

* **Home**, a central dashboard for navigation between the Kubeflow components.
* **Pipelines** for a Kubeflow Pipelines dashboard.
* **Notebook Servers** for Jupyter notebooks.
* **Katib** for hyperparameter tuning.
* **Artifact Store** for tracking of artifact metadata.
* **Manage Contributors** for sharing user access across namespaces in the 
  Kubeflow deployment.

The central dashboard looks like this:

<img src="/docs/images/central-ui.png"
  alt="Kubeflow central UI"
  class="mt-3 mb-3 border border-info rounded">

## Accessing the central dashboard

To access the central dashboard, you need to connect to the 
[Istio gateway](https://istio.io/docs/concepts/traffic-management/#gateways) that 
provides access to the Kubeflow 
[service mesh](https://istio.io/docs/concepts/what-is-istio/#what-is-a-service-mesh).

How you access the Istio gateway varies depending on how you've configured it.

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

If you didn't configure Kubeflow to integrate with an identity provider 
then you can port-forward directly to the Istio gateway.

Port-forwarding typically does not work if any of the following are true:

  * You've deployed Kubeflow on GCP using the 
    [GCP deployment UI](/docs/gke/deploy/deploy-ui/) or the default settings 
    with the [CLI deployment](/docs/gke/deploy/deploy-cli/). (If you want to
    use port forwarding, you must deploy Kubeflow on an existing Kubernetes 
    cluster using the [`kfctl_k8s_istio` 
    configuration](/docs/started/k8s/kfctl-k8s-istio/).)

  * You've configured the Istio ingress to only accept 
    HTTPS traffic on a specific domain or IP address.

  * You've configured the Istio ingress to perform an authorization check 
    (for example, using Cloud IAP or [Dex](https://github.com/dexidp/dex)).


You can access Kubeflow via `kubectl` and port-forwarding as follows:

1. Install `kubectl` if you haven't already done so:

    * If you're using Kubeflow on GCP, run the following command on the command
    line: `gcloud components install kubectl`.
    * Alternatively, follow the [`kubectl`
    installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

1. Use the following command to set up port forwarding to the
  [Istio gateway](https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/).

    {{% code-webui-port-forward %}} 

1. Access the central navigation dashboard at:

    ```
    http://localhost:8080/
    ```

    Depending on how you've configured Kubeflow, not all UIs work behind 
    port-forwarding to the reverse proxy.

    For some web applications, you need to configure the base URL on which
    the app is serving.
    
    For example, if you deployed Kubeflow with an ingress serving at 
    `https://example.mydomain.com` and configured an application
    to be served at the URL `https://example.mydomain.com/myapp`, then the 
    app may not work when served on
    `https://localhost:8080/myapp` because the paths do not match.

## Next steps

* Explore the [contributor management 
  option](/docs/components/multi-tenancy/) where you
  can set up a single namespace for a shared deployment or configure 
  multi-tenancy for your Kubeflow deployment.
* [Set up your Jupyter notebooks](/docs/notebooks/setup/) in Kubeflow.
