+++
title = "Kubeflow"
description = "Quickly get running with your ML Workflow"
weight = 10
bref = "The Kubeflow project is dedicated to making deployments of machine learning (ML) workflows on Kubernetes simple, portable and scalable. Our goal is not to recreate other services, but to provide a straightforward way to deploy best-of-breed open-source systems for ML to diverse infrastructures. Anywhere you are running Kubernetes, you should be able to run Kubeflow"
aliases = ["/docs/", "/docs/about/"]
[menu.docs]
  parent = "about"
  weight = 1
+++

## The Kubeflow Mission

Our goal is to make scaling machine learning (ML) models and deploying them to production as simple as possible, by letting Kubernetes do what it's great at:

  * Easy, repeatable, portable deployments on a diverse infrastructure (laptop <-> ML rig <-> training cluster <-> production cluster)
  * Deploying and managing loosely-coupled microservices
  * Scaling based on demand

Because ML practitioners use a diverse set of tools, one of the key goals is to customize the stack based on user requirements (within reason) and let the system take care of the "boring stuff". While we have started with a narrow set of technologies, we are working with many different projects to include additional tooling.

Ultimately, we want to have a set of simple manifests that give you an easy to use ML stack _anywhere_ Kubernetes is already running, and can self configure based on the cluster it deploys into.
