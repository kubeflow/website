+++
title = "Installing Kubeflow"
description = "Deployment options for Kubeflow"
weight = 20

+++

This guide describes how to install standalone Kubeflow components or Kubeflow Platform using package
distributions or Kubeflow manifests.

Read [the introduction guide](/docs/started/introduction) to learn more about Kubeflow, standalone
Kubeflow components and Kubeflow Platform.

## Installation Methods

You can install Kubeflow using one of these methods:

- [**Standalone Kubeflow Components**](#standalone-kubeflow-components)
- [**Kubeflow Platform**](#kubeflow-platform)

## Standalone Kubeflow Components

Some components in the [Kubeflow ecosystem](/docs/started/architecture/#conceptual-overview) may be
deployed as standalone services, without the need to install the full Kubeflow platform. You might
integrate these services as part of your existing AI/ML platform or use them independently.

These components are a quick and easy method to get started with the Kubeflow ecosystem. They
provide flexibility to users who may not require the capabilities of a full Kubeflow Platform.

The following table lists Kubeflow components that may be deployed in a standalone mode. It also
lists their associated GitHub repository and
corresponding [ML lifecycle stage](/docs/started/architecture/#kubeflow-components-in-the-ml-lifecycle).

<div class="table-responsive distributions-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Component</th>
        <th>ML Lifecycle Stage</th>
        <th>Source Code</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
         <a href="https://kserve.github.io/website/master/admin/serverless/serverless">
            KServe
          </a>
        </td>
        <td>
          Model Serving
        </td>
        <td>
          <a href="https://github.com/kserve/kserve">
            <code>kserve/kserve</code>
          </a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="/docs/components/katib/installation/#installing-katib">
            Kubeflow Katib
          </a>
        </td>
        <td>
          Model Optimization and AutoML
        </td>
        <td>
          <a href="https://github.com/kubeflow/katib">
            <code>kubeflow/katib</code>
          </a>
        </td>
      </tr>
      <tr>
        <td>
         <a href="/docs/components/model-registry/installation/#installing-model-registry">
            Kubeflow Model Registry
          </a>
        </td>
        <td>
          Model Registry
        </td>
        <td>
          <a href="https://github.com/kubeflow/model-registry">
            <code>kubeflow/model-registry</code>
          </a>
        </td>
      </tr>
      <tr>
        <td>
         <a href="/docs/components/training/user-guides/mpi/#installation">
            Kubeflow MPI Operator
          </a>
        </td>
        <td>
          All-Reduce Model Training
        </td>
        <td>
          <a href="https://github.com/kubeflow/mpi-operator">
            <code>kubeflow/mpi-operator</code>
          </a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="/docs/components/pipelines/v2/installation/quickstart/">
            Kubeflow Pipelines
          </a>
        </td>
        <td>
          ML Workflows and Schedules
        </td>
        <td>
          <a href="https://github.com/kubeflow/pipelines">
            <code>kubeflow/pipelines</code>
          </a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/spark-operator/tree/master?tab=readme-ov-file#installation">
            Kubeflow Spark Operator
          </a>
        </td>
        <td>
          Data Preparation
        </td>
        <td>
          <a href="https://github.com/kubeflow/spark-operator">
            <code>kubeflow/spark-operator</code>
          </a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="/docs/components/training/installation/#installing-training-operator">
            Kubeflow Training Operator
          </a>
        </td>
        <td>
          Model Training and Fine-Tuning
        </td>
        <td>
          <a href="https://github.com/kubeflow/training-operator">
            <code>kubeflow/training-operator</code>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Kubeflow Platform

You can use one of the following methods to install the [Kubeflow Platform](/docs/started/introduction/#what-is-kubeflow-platform)
and get the full suite of Kubeflow components bundled together with additional tools.

### Packaged Distributions

Packaged distributions are maintained by various organizations and typically aim to provide
a simplified installation and management experience for your **Kubeflow Platform**. Some distributions
can be deployed on [all certified Kubernetes distributions](https://kubernetes.io/partners/#conformance),
while others target a specific platform (e.g. EKS or GKE).

{{% alert title="Note" color="warning" %}}
Packaged distributions are developed and supported by their respective maintainers.
The Kubeflow community <strong>does not endorse or certify</strong> any specific distribution.

In the near future, there are plans to introduce <a href="https://github.com/kubeflow/community/blob/master/proposals/kubeflow-conformance-program-proposal.md">conformance testing for distributions</a>, you may track progress on this initiative by following <a href="https://github.com/kubeflow/kubeflow/issues/6485">kubeflow/kubeflow#6485</a>.
{{% /alert %}}

The following table lists distributions which are <em>maintained</em> by their respective maintainers:

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
          {{% deploykf/latest-version %}} <sup>[<a href="https://www.deploykf.org/releases/tool-versions/#kubeflow-ecosystem">Version Matrix</a>]</sup>
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

### Kubeflow Manifests

The Kubeflow Manifests are aggregated by the Manifests Working Group and are intended to be
used by users with Kubernetes knowledge and as the base of packaged distributions.

Kubeflow Manifests contain all Kubeflow Components, Kubeflow Central Dashboard, and other Kubeflow
applications that comprise the **Kubeflow Platform**. This installation is helpful when you want to
try out the end-to-end Kubeflow Platform capabilities.

Users may choose to install the manifests for a specific Kubeflow version by following the
instructions in the `README` of the [`kubeflow/manifests`](https://github.com/kubeflow/manifests) repository.

- [**Kubeflow 1.8.1:**](/docs/releases/kubeflow-1.8/)
  - [`v1.8-branch`](https://github.com/kubeflow/manifests/tree/v1.8-branch#installation) <sup>(development branch)</sup>
  - [`v1.8.1`](https://github.com/kubeflow/manifests/tree/v1.8.1#installation)
- [**Kubeflow 1.7:**](/docs/releases/kubeflow-1.7/)
  - [`v1.7-branch`](https://github.com/kubeflow/manifests/tree/v1.7-branch#installation) <sup>(development branch)</sup>
  - [`v1.7.0`](https://github.com/kubeflow/manifests/tree/v1.7.0#installation)

{{% alert title="Warning" color="warning" %}}
Using the Kubeflow manifests requires some understanding of Kubernetes.
The Kubeflow community support for Kubeflow manifests is best-effort for environment-specific issues or custom configurations.
Nevertheless, we welcome contributions and bug reports very much.
{{% /alert %}}

## Next steps

- Review our [introduction to Kubeflow](/docs/started/introduction/).
- Explore the [architecture of Kubeflow](/docs/started/architecture).
- Learn more about the [components of Kubeflow](/docs/components/).
