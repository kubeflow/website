+++
title = "Using Jupyter notebooks in kubeflow"
description = "Why use Jupyter notebooks in Kubeflow"
weight = 30
+++

Why would you use Jupyter networks in Kubeflow?

The benefit of integrating Jupyter notebooks service in Kubefflow is that:

* In an enterprise environment, it integrates well with the rest of the infrastructure with respect to authentication and access control, and
* It allows users to create notebook containers / pods in the cluster rather than locally on their laptops.
This makes it possible for admins to provide standard notebook images for their organization, and add Secrets/Credentials allowing the notebook users to access data from sources with appropriate RBAC.

When you bundle Jupyter notebooks in Kubeflow, you can use the Fairing library, that helps to submit Training jobs using TFJob (that can run single node or distributed on the same K8s cluster, but not inside the notebook pod itself). This makes the docker containerization and the calls to talk to the k8s master for allocating pods for the job, transparent to data scientists.

Overall, Kubeflow hosted notebooks are better integrated with other components while providing extensibility for notebook images.
