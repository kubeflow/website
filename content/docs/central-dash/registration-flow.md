+++
title = "Registration Flow"
description = "The view that allows you to set up your first namespace in the cluster"
weight = 10
+++

Your Kubeflow deployment comes deployed with Kubeflow Central Dashboard. 

This view will show when the cluster is:
- When in `multi-user` isolation mode:
  - Your user has no profile (workgroup / namespace) role-bindings in which you're `edit` (Owner)
- When in `single-user` isolation mode:
  - The entire cluster has no profile (workgroup / namespace) role-bindings

This guide shows you what this view looks like and how the flow appears.

## Quick guide
Summary of steps:

1. Follow the [Kubeflow getting-started guide](/docs/started/getting-started/) 
  to set up your Kubeflow deployment and open the Kubeflow UI.
1. If the view shows up, you're going to be walked through setting up your workgroup binding

## Visual
![Kubeflow registration flow](/docs/images/registration-flow.gif)
