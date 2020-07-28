+++
title = "Multi-user, auth-enabled Kubeflow with kfctl_existing_arrikto"
description = "Migration from kfctl_existing_arrikto.yaml config"
weight = 4
page_hide = true
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


If you were using the `kfctl_existing_arrikto` configuration in Kubeflow v0.7 or earlier, you should use {{% config-file-istio-dex %}} in Kubeflow {{% kf-latest-version %}}. Follow the instructions in the [guide to `kfctl_istio_dex`](/docs/started/k8s/kfctl-istio-dex/).
