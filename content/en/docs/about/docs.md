+++
title =  "Docs"
description = "Information on the Kubeflow docs and how to contribute to them"
weight = 6
aliases = ["/docs/docs/"]
+++

Welcome to the Kubeflow documentation!

## Introduction

The Kubeflow docs are published at 
[www.kubeflow.org](https://www.kubeflow.org/).

The source for the docs is in the 
[kubeflow/website repo](https://github.com/kubeflow/website/) on GitHub.
We use [Hugo](https://gohugo.io/) to format and generate our website, and
[Netlify](https://www.netlify.com/) to manage the deployment of the site.

## Versioning

www.kubeflow.org points to the **master** branch of the docs. You can access
other versions by clicking the version dropdown at top right of the website
menu bar:

<img src="/docs/images/version-dropdown.png" 
  alt="Version dropdown"
  style="width:30%;"
  class="mt-3 mb-3 border border-info rounded">

We create a new branch of the docs for each stable release of Kubeflow. 
For example, the docs for the v0.2 stable release are on published on the
[v0.2 website](https://v0-2.kubeflow.org/docs/about/kubeflow/), which
corresponds to the
[v0.2-branch](https://github.com/kubeflow/website/tree/v0.2-branch) on
GitHub.

## Contributing to the docs

We welcome updates to the docs! Please help us make them better. Small fixes,
typos, bug fixes, plugging gaps&mdash;all are useful. 

* For help with getting started, take a look at the 
  [README](https://github.com/kubeflow/website/blob/master/README.md).
* For guidance on writing effective documentation, see the 
  [style guide](/docs/about/style-guide/).
