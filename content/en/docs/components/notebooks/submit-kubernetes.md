+++
title = "Submit Kubernetes Resources"
description = "Submitting Kubernetes resources from a Notebook"
weight = 40
                    
+++

## Notebook Pod ServiceAccount

Kubeflow assigns the `default-editor` Kubernetes ServiceAccount to the Notebook Pods.
The Kubernetes `default-editor` ServiceAccount is bound to the `kubeflow-edit` ClusterRole, which has namespace-scoped permissions to many Kubernetes resources.

You can get the full list of RBAC for `ClusterRole/kubeflow-edit` using:
```
kubectl describe clusterrole kubeflow-edit
```

## Kubectl in Notebook Pod

Because every Notebook Pod has the highly-privileged `default-editor` Kubernetes ServiceAccount bound to it, you can run `kubectl` inside it without providing additional authentication.

For example, the following command will create the resources defined in `test.yaml`:

```shell
kubectl create -f "test.yaml" --namespace "MY_PROFILE_NAMESPACE"
```

## Next steps

- See the Kubeflow Notebook [quickstart guide](/docs/components/notebooks/quickstart-guide/).
- Explore the other [components of Kubeflow](/docs/components/).
