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
1. If the registration flow view shows up (because the conditions above are satisfied):
   - Then the view will walk you through creating the first workgroup binding for your user or cluster (depending on `isolation-mode`)

## Visual
![Kubeflow registration flow](/docs/images/registration-flow.gif)

#### Transcription

- The page is reloaded
- Registration View opens up, since the user `kubeflow-user@kubeflow.org` does not have an owned namespace
  - IE. the user does not have `admin` profile/workgroup binding for a namespace
- `kubeflow-user` is auto-filled in the namespace input box (which will create a new namespace for this user)
  - This namespace seems to exist and an error is presented
- Types in `kubeflow-user-test` and presses `enter` which works and navigates the user to the central-dashboard main view
- A toast shows on the bottom left that says `"Welcome, kubeflow-user!"`
