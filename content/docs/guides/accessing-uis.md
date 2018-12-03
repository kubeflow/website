+++
title = "Accessing Kubeflow UIs"
description = "How to access the Kubeflow web UIs"
weight = 15
+++

Kubeflow includes a number of web UIs. This document provides instructions on
how to connect to them.

## Accessing Kubeflow Web UIs

Kubeflow comes with a number of web UIs e.g.

* Argo UI
* Central UI for navigation
* JupyterHub
* Katib
* TFJobs Dashboard

To make it easy to connect to these UIs Kubeflow provides a reverse proxy through
which all UIs are accessible.

Instructions below indicate how to connect to the Kubeflow navigation UI. From
there you can easily navigate to the different services. The UI looks like this:

![Central UI](/docs/images/central-ui.png)


## Google Cloud Platform (Kubernetes Engine)

If you followed the [guide for Kubernetes Engine](/docs/started/getting-started-gke), Kubeflow will be deployed with
IAP and the web UIs will be accessible at

```
https://<name>.endpoints.<project>.cloud.goog/
```

This will bring up a central navigation window that allows you to navigate to the
different services.

## Using Kubectl and port-forwarding

You can use the following command to setup port forwarding to one of the 
[Ambassador](https://www.getambassador.io/) pods that provides the reverse proxy.

```
export NAMESPACE=kubeflow
kubectl port-forward -n ${NAMESPACE}  `kubectl get pods -n ${NAMESPACE} --selector=service=ambassador -o jsonpath='{.items[0].metadata.name}'` 8080:80
```

You can then access the central navigation dashboard at

```
http://localhost:8080/
```

From here you can easily navigate to the different services.