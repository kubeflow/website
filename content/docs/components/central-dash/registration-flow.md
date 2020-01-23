+++
title = "Registration Flow"
description = "The view that allows you to set up your first namespace in the cluster"
weight = 10
+++

Your Kubeflow deployment comes deployed with Kubeflow Central Dashboard. 

This view will show when the cluster is:

- When in `multi-user` isolation mode:
  - Your user has no profile (workgroup / namespace) role-bindings in which you're `admin` (Owner)
- When in `single-user` isolation mode:
  - The entire cluster has no profile (workgroup / namespace) role-bindings

This guide shows you what this view looks like and how the flow appears.

## Quick guide
Summary of steps:

1. Follow the [Kubeflow getting-started guide](/docs/started/getting-started/) 
  to set up your Kubeflow deployment and open the Kubeflow UI.
1. If the registration flow view shows up (because the conditions above are satisfied), follow the guide below, else your network should be good to use as is

## Steps
- On page load the Registration View opens up
  - This view will walk you through creating the first workgroup binding for your user or cluster (depending on `isolation-mode`)
- Since you don't have an owned namespace, we will create one
  - IE. the user does not have `admin` profile/workgroup binding for a namespace
- A default name for your new namespace is auto-filled in the input box (the default name is your LDAP)
  - LDAP for an email like `kubeflow-user@google.com` would be `kubeflow-user`
  - If there are errors on this step, like invalid name or namespace already exists, you will see an error and the input box will turn red, you can then try again
- Once you successfully create the namespace, you should be greeted the Kubeflow Dashboard overview page

## Visual
![Kubeflow registration flow](/docs/images/registration-flow.gif)
