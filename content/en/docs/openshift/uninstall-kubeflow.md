+++
title = "Uninstall Kubeflow"
description = "Instructions for uninstalling Kubeflow from your OpenShift cluster"
weight = 10
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

## Uninstall a Kubeflow Instance
To delete a Kubeflow installation please follow these steps:

```
kfctl delete --file=./kfdef/kfctl_openshift.yaml
rm -rf kfdef/kustomize/
oc delete mutatingwebhookconfigurations admission-webhook-mutating-webhook-configuration
oc delete mutatingwebhookconfigurations inferenceservice.serving.kubeflow.org
oc delete mutatingwebhookconfigurations katib-mutating-webhook-config
oc delete mutatingwebhookconfigurations mutating-webhook-configurations
```
