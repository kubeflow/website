+++
title = "Installing Kubeflow"
description = "Deployment options for Kubeflow"
weight = 20

+++

## What is Kubeflow ?

Kubeflow is a community and ecosystem of open-source projects to address each stage in the
machine learning (ML) lifecycle. It makes ML on Kubernetes simple, portable, and scalable.
Its goal is to facilitate the orchestration of Kubernetes workloads for ML and to empower users to
deploy best-in-class open-source systems for ML to diverse cloud infrastructures.
Whether you’re a researcher, data scientist, ML engineer, or a team of developers, Kubeflow offers
modular and scalable tools that cater to all aspects of the ML lifecycle: from building ML models to
deploying them to production for AI applications.

## What are Kubeflow Standalone Components?

Kubeflow is composed of multiple, independent open-source projects which address different aspects
of a ML lifecycle. These standalone components are designed to be usable both within the Kubeflow
platform and independently. These components can be installed on their own on a Kubernetes cluster,
providing flexibility to users who may not require the full capabilities of Kubeflow Platform but
wish to leverage specific functionalities in the ML lifecycle.

## What is Kubeflow Platform ?

The Kubeflow Platform refers to the full suite of Kubeflow components bundled together with
additional integration and management tools. Installing Kubeflow as a platform means deploying a
comprehensive ML toolkit that integrates these components into a cohesive system, optimized for
managing the end-to-end ML lifecycle. These includes not only the standalone components but also:

- Central Dashboard for easy navigation and management.
- Multi-user capabilities and access management.
- Additional tooling and services for data management, visualization, and more.

This integrated environment ensures that all the different pieces work together seamlessly,
providing a more robust and streamlined user experience.

Kubeflow Platform can be installed via Raw Manifests or Package Distributions.

## Installing Kubeflow

- [**Install Kubeflow Components Standalone**](#install-kubeflow-components-standalone)
- [**Install Kubeflow Platform from Packaged Distributions**](#install-kubeflow-platform-from-packages-distributions)
- [**Install Kubeflow Platform from Raw Manifests**](#install-kubeflow-platform-from-raw-manifests)

### Install Kubeflow Components Standalone

Kubeflow components can be deployed as standalone applications. You can integrate those components
to your existing AI/ML platform. For example, for Model Training you can install Training Operator
or for Model Serving you can install KServe.

Follow the appropriate guides to install required Kubeflow components in standalone mode:

- Install [Kubeflow Pipelines](/docs/components/pipelines/v2/installation/quickstart/)
- Install [Kubeflow Training Operator](/docs/components/training/installation/#installing-training-operator)
- Install [Kubeflow MPI Operator](/docs/components/training/user-guides/mpi/#installation)
- Install [Kubeflow Katib] (TODO: Add link after #3723)
- Install [KServe](https://kserve.github.io/website/0.10/admin/serverless/serverless/)
- Install Kubeflow Model Registry (TODO: Add link after #3698)

## Install Kubeflow Platform from Packages Distributions

Packaged distributions are maintained by various organizations and typically aim to provide
a simplified installation and management experience for **Kubeflow Platform**. Some distributions
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

### Install Kubeflow Platform from Raw Manifests

The raw Kubeflow Manifests are aggregated by the
[Manifests Working Group](https://github.com/kubeflow/community/tree/master/wg-manifests)
and are intended to be used as the **base of packaged distributions**.

Kubeflow Manifests contain all Kubeflow Components, Kubeflow Central Dashboard, and other Kubeflow
applications which makes **Kubeflow Platform**. This installation is helpful when you want to try
out the end-to-end Kubeflow Platform capabilities.

Users may choose to install the manifests for a specific Kubeflow version by following the
instructions in the `README` of the [`kubeflow/manifests`](https://github.com/kubeflow/manifests) repository.

- [**Kubeflow 1.8:**](/docs/releases/kubeflow-1.8/)
  - [`v1.8-branch`](https://github.com/kubeflow/manifests/tree/v1.8-branch#installation) <sup>(development branch)</sup>
  - [`v1.8.0`](https://github.com/kubeflow/manifests/tree/v1.8.0#installation)
- [**Kubeflow 1.7:**](/docs/releases/kubeflow-1.7/)
  - [`v1.7-branch`](https://github.com/kubeflow/manifests/tree/v1.7-branch#installation) <sup>(development branch)</sup>
  - [`v1.7.0`](https://github.com/kubeflow/manifests/tree/v1.7.0#installation)

{{% alert title="Warning" color="warning" %}}
Kubeflow is a complex system with many components and dependencies.
Using the raw manifests requires a deep understanding of Kubernetes, Istio, and Kubeflow itself.

When using the raw manifests, the Kubeflow community is not able to provide support for environment-specific issues or custom configurations.
If you need support, please consider using a [packaged distribution](#packaged-distributions-of-kubeflow).
Nevertheless, we welcome contributions and bug reports very much.
{{% /alert %}}

## Next steps

- Check [the Kubeflow introduction page](/docs/started/introduction/).
- Explore the [Kubeflow architecture](/docs/started/architecture) and how Kubeflow components fit
  into the AI/ML lifecycle.
- Review [the Kubeflow components documentation](/docs/components/).
