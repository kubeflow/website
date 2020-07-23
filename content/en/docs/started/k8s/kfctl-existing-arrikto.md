+++
title = "Multi-user, auth-enabled Kubeflow with kfctl_existing_arrikto"
description = "Migration from kfctl_existing_arrikto.yaml config"
weight = 4
page_hide = true
+++

If you were using the `kfctl_existing_arrikto` configuration in Kubeflow v0.7 or earlier, you should use {{% config-file-istio-dex %}} in Kubeflow {{% kf-latest-version %}}. Follow the instructions in the [guide to `kfctl_istio_dex`](/docs/started/k8s/kfctl-istio-dex/).
