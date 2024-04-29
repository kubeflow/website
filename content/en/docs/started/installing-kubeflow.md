+++
title = "Installing Kubeflow"
description = "Deployment options for Kubeflow"
weight = 20

+++

## What is Kubeflow?

Kubeflow is an end-to-end Machine Learning (ML) platform for Kubernetes, it provides components for each stage in the ML lifecycle, from exploration through to training and deployment.
Operators can choose what is best for their users, there is no requirement to deploy every component.

Learn more about Kubeflow in the [Introduction](/docs/started/introduction/) and
[Architecture](/docs/started/architecture/) pages.

## How to install Kubeflow?

Anywhere you are running Kubernetes, you should be able to run Kubeflow.
There are two primary ways to install Kubeflow:

1. [**Packaged Distributions**](#packaged-distributions-of-kubeflow)
1. [**Standalone Components**](#standalone-components)
1. [**Raw Manifests**](#raw-kubeflow-manifests) <sup>(advanced users)</sup>

<a id="packaged-distributions"></a>
<a id="install-a-packaged-kubeflow-distribution"></a>

## Packaged Distributions of Kubeflow

Packaged distributions are maintained by various organizations and typically aim to provide
a simplified installation and management experience for Kubeflow. Some distributions can be
deployed on [all certified Kubernetes distributions](https://kubernetes.io/partners/#conformance),
while others target a specific platform (e.g. EKS or GKE).

{{% alert title="Note" color="dark" %}}
Packaged distributions are developed and supported by their respective maintainers.
The Kubeflow community <strong>does not endorse or certify</strong> any specific distribution.

In the near future, there are plans to introduce <a href="https://github.com/kubeflow/community/blob/master/proposals/kubeflow-conformance-program-proposal.md">conformance testing for distributions</a>, you may track progress on this initiative by following <a href="https://github.com/kubeflow/kubeflow/issues/6485"><code>kubeflow/kubeflow#6485</code></a>.
{{% /alert %}}

The following table lists packaged distributions of Kubeflow and their respective maintainers:

<div class="table-responsive distributions-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Maintainer
          <br><small>Distribution Name</small>
        </th>
        <th>Kubeflow Version</th>
        <th>Target Platform</th>
        <th>Link</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          Amazon Web Services
        </td>
        <td>
          {{% aws/latest-version %}} <sup>[<a href="https://github.com/awslabs/kubeflow-manifests/releases">Release Notes</a>]</sup>
        </td>
        <td>
          Amazon Elastic Kubernetes Service (EKS)
        </td>
        <td>
          <a href="https://awslabs.github.io/kubeflow-manifests">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Aranui Solutions
            <br><small>deployKF</small>
        </td>
        <td>
          {{% deploykf/latest-version %}} <sup>[<a href="https://www.deploykf.org/releases/version-matrix/#kubeflow-tools">Version Matrix</a>]</sup>
        </td>
        <td>
          All Certified Kubernetes Distributions
        </td>
        <td>
          <a href="https://www.deploykf.org/">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Canonical
            <br><small>Charmed Kubeflow</small>
        </td>
        <td>
          {{% canonical/latest-version %}} <sup>[<a href="https://charmed-kubeflow.io/docs/release-notes">Release Notes</a>]</sup>
        </td>
        <td>
          All Certified Kubernetes Distributions
        </td>
        <td>
          <a href="https://charmed-kubeflow.io/">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Google Cloud
        </td>
        <td>
          {{% gke/latest-version %}} <sup>[<a href="https://googlecloudplatform.github.io/kubeflow-gke-docs/docs/changelog/">Release Notes</a>]</sup>
        </td>
        <td>
          Google Kubernetes Engine (GKE)
        </td>
        <td>
          <a href="https://googlecloudplatform.github.io/kubeflow-gke-docs">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          IBM Cloud
        </td>
        <td>
          {{% iks/latest-version %}} <sup>[<a href="https://github.com/IBM/manifests/releases/tag/v{{% iks/latest-version %}}">Release Notes</a>]</sup>
        </td>
        <td>
          IBM Cloud Kubernetes Service (IKS)
        </td>
        <td>
          <a href="https://ibm.github.io/manifests/">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Microsoft Azure
        </td>
        <td>
          {{% azure/latest-version %}} <sup>[<a href="https://github.com/Azure/kubeflow-aks/releases/tag/v{{% azure/latest-version %}}">Release Notes</a>]</sup>
        </td>
        <td>
          Azure Kubernetes Service (AKS)
        </td>
        <td>
          <a href="https://azure.github.io/kubeflow-aks/main">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Nutanix
        </td>
        <td>
          {{% nutanix/latest-version %}}
        </td>
        <td>
          Nutanix Kubernetes Engine
        </td>
        <td>
          <a href="https://nutanix.github.io/kubeflow-manifests">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          QBO
        </td>
        <td>
          {{% qbo/latest-version %}} <sup>[<a href="https://github.com/alexeadem/qbo-ce/blob/main/CHANGELOG.md">Release Notes</a>]</sup>
        </td>
        <td>
          QBO Kubernetes Engine (QKE)
        </td>
         <td>
          <a href="https://docs.qbo.io/#/qke?id=kubeflow">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Red Hat
            <br><small>Open Data Hub</small>
        </td>
        <td>
          {{% redhat/latest-version %}}
        </td>
        <td>
          OpenShift
        </td>
        <td>
          <a href="https://github.com/opendatahub-io/manifests">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          VMware
        </td>
        <td>
          {{% vmware/latest-version %}}
        </td>
        <td>
          VMware vSphere
        </td>
        <td>
          <a href="https://vmware.github.io/vSphere-machine-learning-extension/">Website</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Standalone Components

Some components in the [Kubeflow Ecosystem](/docs/started/architecture/#conceptual-overview) may be deployed as standalone services, without the need to install the full platform.

{{% alert title="Note" color="dark" %}}
Some features may be __limited or unavailable__ when using standalone components.
For example, standalone Kubeflow Pipelines does not include multi-user support, and is limited to a single Namespace.

A few [packaged distributions](#packaged-distributions-of-kubeflow) allow you to choose which components are installed, while still providing the full version of those components.
{{% /alert %}}

The following table lists each component of Kubeflow and whether it supports standalone deployment:

<div class="table-responsive components-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Kubeflow Component</th>
        <th>Source Code</th>
        <th>Supports Standalone</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="/docs/components/central-dash/">
            Kubeflow Central Dashboard
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow">
            <code>kubeflow/kubeflow</code>
          </a>
        </td>
        <td>
          <span class="badge badge-warning">No</span>
        </td>
      </tr>
      <tr>
        <td>
          <a href="/docs/components/notebooks/">
            Kubeflow Notebooks
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow">
            <code>kubeflow/kubeflow</code>
          </a>
        </td>
        <td>
          <span class="badge badge-warning">No</span>
        </td>
      </tr>
      <tr>
        <td>
          <a href="/docs/components/pipelines/">
            Kubeflow Pipelines
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/pipelines">
            <code>kubeflow/pipelines</code>
          </a>
        </td>
        <td>
          <span class="badge badge-success">Yes</span> | <a href="/docs/components/pipelines/v1/installation/standalone-deployment/">Installation Guide</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="/docs/components/katib/">
            Kubeflow Katib
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/katib">
            <code>kubeflow/katib</code>
          </a>
        </td>
        <td>
          <span class="badge badge-warning">No</span>
        </td>
      </tr>
      <tr>
        <td>
          <a href="/docs/components/training/">
            Kubeflow Training Operator
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/training-operator">
            <code>kubeflow/training-operator</code>
          </a>
        </td>
        <td>
          <span class="badge badge-success">Yes</span>
          |
          <a href="/docs/components/training/installation/">Installation Guide</a>
        </td>
      </tr>
      <tr>
        <td>
          Kubeflow MPI Operator
        </td>
        <td>
          <a href="https://github.com/kubeflow/mpi-operator">
            <code>kubeflow/mpi-operator</code>
          </a>
        </td>
        <td>
          <span class="badge badge-success">Yes</span>
          |
          <a href="/docs/components/training/user-guides/mpi/#installation">Installation Guide</a>
        </td>
      </tr>
      <tr>
        <td>
          Kubeflow Spark Operator
        </td>
        <td>
          <a href="https://github.com/kubeflow/spark-operator">
            <code>kubeflow/spark-operator</code>
          </a>
        </td>
        <td>
          <span class="badge badge-success">Yes</span> 
          | 
          <a href="https://github.com/kubeflow/spark-operator/blob/master/docs/quick-start-guide.md">Installation Guide</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### External Add-Ons

There are a number of [External Add-Ons](/docs/external-add-ons/) which are commonly deployed alongside the Kubeflow ecosystem.
These tools are __maintained by external organizations__ and are not part of the core Kubeflow project.
However, some are included in the [Raw Kubeflow Manifests](#raw-kubeflow-manifests) (under the `contrib` folder), so are available in most [packaged distributions](#packaged-distributions-of-kubeflow).

The following table lists some popular add-ons and whether they are included in the raw manifests:

<div class="table-responsive components-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>External Add-On</th>
        <th>Source Code</th>
        <th>In Kubeflow Manifests</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://kserve.github.io/website/latest/">
            KServe
          </a>
        </td>
        <td>
          <a href="https://github.com/kserve/kserve">
            <code>kserve/kserve</code>
          </a>
        </td>
        <td>
          <span class="badge badge-success">Yes</span>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://feast.dev/">
            Feast
          </a>
        </td>
        <td>
          <a href="https://github.com/feast-dev/feast">
            <code>feast-dev/feast</code>
          </a>
        </td>
        <td>
          <span class="badge badge-warning">No</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Raw Kubeflow Manifests

The raw Kubeflow Manifests are aggregated by the [Manifests Working Group](https://github.com/kubeflow/community/tree/master/wg-manifests)
and are intended to be used as the **base of packaged distributions**.

Advanced users may choose to install the manifests for a specific Kubeflow version by following the
instructions in the `README` of the [`kubeflow/manifests`](https://github.com/kubeflow/manifests) repository.

- [**Kubeflow 1.8:**](/docs/releases/kubeflow-1.8/)
  - [`v1.8-branch`](https://github.com/kubeflow/manifests/tree/v1.8-branch#installation) <sup>(development branch)</sup>
  - [`v1.8.0`](https://github.com/kubeflow/manifests/tree/v1.8.0#installation)
- [**Kubeflow 1.7:**](/docs/releases/kubeflow-1.7/)
  - [`v1.7-branch`](https://github.com/kubeflow/manifests/tree/v1.7-branch#installation) <sup>(development branch)</sup>
  - [`v1.7.0`](https://github.com/kubeflow/manifests/tree/v1.7.0#installation)

{{% alert title="Warning" color="warning" %}}
Kubeflow is a __complex system__ with many components and dependencies.
Using the raw manifests requires a deep understanding of Kubernetes, Istio, and Kubeflow itself.

When using the raw manifests, the Kubeflow community is not able to provide support for environment-specific issues or custom configurations.
If you need support, please consider using a [packaged distribution](#packaged-distributions-of-kubeflow).
Nevertheless, we welcome contributions and bug reports very much.
{{% /alert %}}

## Next steps

- Review the Kubeflow <a href="/docs/components/">component documentation</a>
- Explore the <a href="/docs/components/pipelines/sdk/">Kubeflow Pipelines SDK</a>
