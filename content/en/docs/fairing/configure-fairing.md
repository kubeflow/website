+++
title = "Configure Kubeflow Fairing"
description = "Configuring your Kubeflow Fairing development environment with access to Kubeflow"
weight = 20
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


In order to use Kubeflow Fairing to train or deploy a machine learning
model on Kubeflow, you must configure your development environment with access
to your container image registry and your Kubeflow cluster. This guide
describes how to configure Kubeflow Fairing to run training jobs on Kubeflow.

Additional configuration steps are required to access Kubeflow when it is hosted on a cloud
environment. Use the following guides to configure Kubeflow Fairing with access
to your hosted Kubeflow environment.

*  To use Kubeflow Fairing to train and deploy on Kubeflow on Google Kubernetes
   Engine, follow the guide to [configuring Kubeflow Fairing with access to
   Google Cloud Platform][conf-gcp].  

## Prerequisites

Before you configure Kubeflow Fairing, you must have a Kubeflow environment
and Kubeflow Fairing installed in your development environment.

*  If you do not have a Kubeflow cluster, follow the [getting started
   with Kubeflow][kubeflow-install] guide to set one up.
*  If you have not installed Kubeflow Fairing, follow the [installing
   Kubeflow Fairing][fairing-install] guide.

## Using Kubeflow Fairing with Kubeflow notebooks

The standard Kubeflow notebook images include Kubeflow Fairing and come
preconfigured to run training jobs on your Kubeflow cluster. No additional
configuration is required.

If you built your Kubeflow notebook server from a custom Jupyter Docker image,
follow the instruction in this guide to configure your notebooks environment
with access to your Kubeflow environment.

## Configure Docker with access to your container image registry

Authorize Docker to access your container image registry by following the
instructions in the [`docker login` reference guide][docker-login].

## Configure access to your Kubeflow cluster

Use the following instructions to configure `kubeconfig` with access to your
Kubeflow cluster. 

1.  Kubeflow Fairing uses `kubeconfig` to access your Kubeflow cluster. This 
    guide uses `kubectl` to set up your `kubeconfig`. To check if you have 
    `kubectl` installed, run the following command:

    ```bash
    which kubectl
    ```

    The response should be something like this:

    ```bash
    /usr/bin/kubectl
    ```

    If you do not have `kubectl` installed, follow the instructions in the
    guide to [installing and setting up kubectl][kubectl-install].

1.  Follow the [guide to configuring access to Kubernetes
    clusters][kubectl-access], to update your `kubeconfig` with appropriate
    credentials and endpoint information to access your Kubeflow cluster. 

## Next steps

*  Follow the [samples and tutorials][tutorials] to learn more about how to run
   training jobs remotely with Kubeflow Fairing. 

[kubeflow-install]: /docs/started/getting-started/
[kubectl-access]: https://kubernetes.io/docs/reference/access-authn-authz/authentication/
[kubectl-install]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[conf-gcp]: /docs/fairing/gcp/configure-gcp/
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[fairing-install]: /docs/fairing/install-fairing/
[tutorials]: /docs/fairing/tutorials/other-tutorials/
