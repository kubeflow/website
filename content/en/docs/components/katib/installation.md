+++
title = "Installation"
description = "How to install Katib"
weight = 20
+++

This guide describes how to install Katib on your Kubernetes cluster.

## Prerequisites

These are minimal requirements to install Katib.

- Kubernetes >= 1.27
- `kubectl` >= 1.27

## Installing Katib

You can skip these steps if you have already
[installed Kubeflow platform](/docs/started/installing-kubeflow/#how-to-install-kubeflow)
using manifests or package distributions. Kubeflow platform includes Katib.

You can install Katib as a standalone component.

Run the following command to install the stable release of Katib: `v0.16.0`

```shell
kubectl apply -k "github.com/kubeflow/katib.git/manifests/v1beta1/installs/katib-standalone?ref=v0.16.0"
```

Run the following command to install the latest changes of Katib:

```shell
kubectl apply -k "github.com/kubeflow/katib.git/manifests/v1beta1/installs/katib-standalone?ref=master"
```

After installing Katib, you can verify that all control plane components are running:

````shell

```shell
$ kubectl get pods -n kubeflow

NAME                                READY   STATUS      RESTARTS   AGE
katib-controller-566595bdd8-8w7sx   1/1     Running     0          82s
katib-db-manager-57cd769cdb-vt7zs   1/1     Running     0          82s
katib-mysql-7894994f88-djp7m        1/1     Running     0          81s
katib-ui-5767cfccdc-v9fcs           1/1     Running     0          80s
````

**Note**. Your Kubernetes cluster must have `StorageClass` for dynamic volume provisioning for Katib DB.
For more information, check the Kubernetes documentation on
[dynamic provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/).
If your cluster doesn't have dynamic volume provisioning, you must manually deploy
[PersistentVolume (PV)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes)
to bind [PVC](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/mysql/pvc.yaml)
for the Katib DB component.

### Katib Control Plane Components

Katib has the following components on the control plane:

- `katib-controller` - the controller to manage Katib Kubernetes CRDs:
  [`Experiment`](/docs/components/katib/reference/architecture/#experiment),
  [`Suggestion`](/docs/components/katib/reference/architecture/#suggestion),
  [`Trial`](/docs/components/katib/reference/architecture/#trial).

  - (Optional) If certificate generator is enabled in
    [Katib Config](/docs/components/katib/katib-config/), Katib controller deployment will create
    self-signed certificate for the Katib webhooks. Learn more about the cert generator in the
    [developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md#katib-cert-generator).

- `katib-ui` - the Katib user interface.

- `katib-db-manager` - the gRPC API server to control Katib DB interface.

- `katib-mysql` - the MySQL DB backend to store Katib Experiments metrics.

## Installing Katib Python SDK

Katib [implements Python SDK](https://pypi.org/project/kubeflow-katib/)
to simplify creation of Katib Experiments for Data Scientists.

Run the following command to install the stable release of Katib SDK:

```shell
pip install -U kubeflow-katib
```

You can also install the Python SDK using the specific GitHub commit, for example:

```shell
pip install git+https://github.com/kubeflow/katib.git@ea46a7f2b73b2d316b6b7619f99eb440ede1909b#subdirectory=sdk/python/v1beta1
```

## Next steps

- Run your first Katib Experiment by following the [Getting Started guide](/docs/components/katib/getting-started/).

- Learn about various options to [install Katib control plane components](/docs/components/katib/user-guides/installation-options/).
