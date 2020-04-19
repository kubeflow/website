+++
title = "Registration Flow"
description = "Setting up your namespace in Kubeflow"
weight = 10
+++

This guide is for Kubeflow users who are logging in to Kubeflow for the first
time. The user may be the person who deployed Kubeflow, or another person who
has permission to access the Kubeflow cluster and use Kubeflow.

## Introduction to namespaces

Depending on the setup of your Kubeflow cluster, you may need to create a
*namespace* when you first log in to Kubeflow. Namespaces are sometimes called
*profiles* or *workgroups*.

Kubeflow prompts you to create a namespace under the following circumstances:

* For Kubeflow deployments that support multi-user isolation: Your username
  does not yet have an associated namespace with role bindings that give you
  administrative (owner) access to the namespace.
* For Kubeflow deployments that support single-user isolation: The Kubeflow
  cluster has no namespace role bindings.

If Kubeflow doesn't prompt you to create a namespace, then your Kubeflow
administrator may have created a namespace for you. You should be able to see
the Kubeflow central dashboard and start using Kubeflow.

## Prerequisites

Your Kubeflow administrator must perform the following steps:

* Deploy Kubeflow to a Kubernetes cluster, by following the [Kubeflow
  getting-started guide](/docs/started/getting-started/).
* Give you access to the Kubernetes cluster. See the [guide to
  multi-tenancy](/docs/components/multi-tenancy/getting-started/#onboarding-a-new-user).

## Creating your namespace

If you don't yet have a suitable namespace associated with your username,
Kubeflow shows the following screen when you first log in:

<img src="/docs/images/auto-profile1.png" 
  alt="Profile creation step 1"
  class="mt-3 mb-3 border border-info rounded">

Click **Start Setup** and follow the instructions on the screen to set up your
namespace. The default name for your namespace is your username.

After creating the namespace, you should see the Kubeflow central dashboard,
with your namespace available in the dropdown list at the top of the screen:

<img src="/docs/images/central-ui.png"
  alt="Kubeflow central UI"
  class="mt-3 mb-3 border border-info rounded">

## Next steps

* [Set up a Jupyter notebook](/docs/notebooks/setup/) in Kubeflow.
* Read more about [multi-tenancy in Kubeflow](/docs/components/multi-tenancy/).
