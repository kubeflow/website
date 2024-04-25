+++
title = "Katib Installation Options"
description = "Overview of the ways to install Katib control plane"
weight = 60
+++

Katib offers a few installation options to install control plane. This page describes the options
and the features available with each option. Check
[the installation guide](/docs/components/katib/installation/#katib-control-plane-components) to
understand the Katib control plane components.

## The Default Katib Standalone Installation

Follow [the installation guide](/docs/components/katib/installation/#installing-katib) to install
the default version of Katib control plane.

### Katib with Controller Leader Election

Run the following command to deploy Katib with
[Controller Leader Election](https://kubernetes.io/blog/2016/01/simple-leader-election-with-kubernetes/) support:

```shell
kubectl apply -k "github.com/kubeflow/katib.git/manifests/v1beta1/installs/katib-leader-election?ref=master"
```

This installation is almost the same as Katib Standalone installation, although you can make
`katib-controller` Highly Available (HA) using leader election. If you plan to use Katib in an
environment where high Service Level Agreements (SLAs) and Service Level Objectives (SLOs)
are required, such as a production environment, consider choosing this installation.

### Katib with PostgreSQL Database

Run the following command to deploy Katib with PostgreSQL database (DB) instead of MySQL:

```shell
kubectl apply -k "github.com/kubeflow/katib.git/manifests/v1beta1/installs/katib-standalone-postgres?ref=master"
```

### Katib with External DB

Run the following command to deploy Katib with custom DB backend:

```shell
kubectl apply -k "github.com/kubeflow/katib.git/manifests/v1beta1/installs/katib-external-db?ref=master"
```

This installation allows to use custom instance of MySQL DB instead `katib-mysql`.
You have to modify the appropriate environment variables for `katib-db-manager` in the
[secrets.env](https://github.com/kubeflow/katib/blob/ea46a7f2b73b2d316b6b7619f99eb440ede1909b/manifests/v1beta1/installs/katib-external-db/secrets.env)
with your MySQL DB values. Learn more about `katib-db-manager` environment variables in
[this guide](/docs/components/katib/env-variables/#katib-db-manager).

### Katib with Cert Manager

Run the following command to deploy Katib with [Cert Manager](https://cert-manager.io/docs/releases/)
requirement:

```shell
kubectl apply -k "github.com/kubeflow/katib.git/manifests/v1beta1/installs/katib-cert-manager?ref=master"
```

This installation uses Cert Manager instead of Katib certificate generator to provision Katib
webhooks certificates. You have to deploy Cert Manager on your Kubernetes cluster before
deploying Katib using this installation.

### Katib on OpenShift

Run the following command to deploy Katib on [OpenShift](https://docs.openshift.com/) v4.4+:

```
kubectl apply -k "github.com/kubeflow/katib.git/manifests/v1beta1/installs/katib-openshift?ref=master"
```

This installation uses OpenShift service controller instead of Katib certificate generator to
provision Katib webhooks certificates.

After installing Training Operator, you can verify that controller is running as follows:
