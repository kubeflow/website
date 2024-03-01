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

### How to install Kubeflow?

Anywhere you are running Kubernetes, you should be able to run Kubeflow.
There are two primary ways to install Kubeflow:

1. [**Packaged Distributions**](#packaged-distributions-of-kubeflow)
1. [**Raw Manifests**](#raw-kubeflow-manifests) <sup>(advanced users)</sup>

<a id="packaged-distributions"></a>
<a id="install-a-packaged-kubeflow-distribution"></a>

## Packaged Distributions of Kubeflow

Packaged distributions are maintained by various organizations and typically aim to provide
a simplified installation and management experience for Kubeflow.

{{% alert title="Note" color="warning" %}}
Packaged distributions are developed and supported by their respective maintainers.
The Kubeflow community <strong>does not endorse or certify</strong> any specific distribution.

In the near future, there are plans to introduce <a href="https://github.com/kubeflow/community/blob/master/proposals/kubeflow-conformance-program-proposal.md">conformance testing for distributions</a>, you may track progress on this initiative by following <a href="https://github.com/kubeflow/kubeflow/issues/6485">kubeflow/kubeflow#6485</a>.
{{% /alert %}}

Some distributions can be deployed on all certified Kubernetes
distributions <sup>[<a href="https://kubernetes.io/partners/#conformance">1</a>], some of them
can be deployed only in specific Kubernetes environment (e.g. EKS or GKE).

The following table lists distributions which are <em>maintained</em> by their respective maintainers.

<div class="table-responsive distributions-table-active">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Target Platform</th>
        <th>Maintainer / Distribution Name</th>
        <th>Kubeflow Version</th>
        <th>Link</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          All Certified Kubernetes Distributions
        </td>
        <td>
          Canonical / Charmed Kubeflow
        </td>
        <td>
          {{% canonical/latest-version %}}
        </td>
        <td>
          <a href="https://charmed-kubeflow.io/">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          All Certified Kubernetes Distributions
        </td>
        <td>
          Aranui Solutions / deployKF
        </td>
        <td>
          {{% deploykf/latest-version %}} <sup>[<a href="https://www.deploykf.org/releases/version-matrix/#kubeflow-tools">Version Matrix</a>]</sup>
        </td>
        <td>
          <a href="https://www.deploykf.org/">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          All Certified Kubernetes Distributions
        </td>
        <td>
          Argoflow Users
        </td>
        <td>
          1.3.0
        </td>
        <td>
          <a href="https://github.com/argoflow">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Google Kubernetes Engine (GKE)
        </td>
        <td>
          Google Cloud
        </td>
        <td>
          {{% gke/latest-version %}} <sup>[<a href="https://googlecloudplatform.github.io/kubeflow-gke-docs/docs/changelog/">Release Notes</a>]</sup>
        </td>
        <td>
          <a href="https://googlecloudplatform.github.io/kubeflow-gke-docs">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          IBM Cloud Kubernetes Service (IKS)
        </td>
        <td>
          IBM Cloud
        </td>
        <td>
          {{% iks/latest-version %}} <sup>[<a href="https://github.com/IBM/manifests/releases/tag/v{{% iks/latest-version %}}">Release Notes</a>]</sup>
        </td>
        <td>
          <a href="https://ibm.github.io/manifests/">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Nutanix Kubernetes Engine
        </td>
        <td>
          Nutanix
        </td>
        <td>
          {{% nutanix/latest-version %}}
        </td>
        <td>
          <a href="https://nutanix.github.io/kubeflow-manifests">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Amazon Elastic Kubernetes Service (EKS)
        </td>
        <td>
          Amazon Web Services
        </td>
        <td>
          {{% aws/latest-version %}} <sup>[<a href="https://github.com/awslabs/kubeflow-manifests/releases">Release Notes</a>]</sup>
        </td>
        <td>
          <a href="https://awslabs.github.io/kubeflow-manifests">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Azure Kubernetes Service (AKS)
        </td>
        <td>
          Microsoft Azure
        </td> 
        <td>
          {{% azure/latest-version %}} <sup>[<a href="https://github.com/Azure/kubeflow-aks/releases/tag/v{{% azure/latest-version %}}">Release Notes</a>]</sup>
        </td>
        <td>
          <a href="https://azure.github.io/kubeflow-aks/main">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          VMware vSphere
        </td>
        <td>
          VMware
        </td>
        <td>
          {{% vmware/latest-version %}}
        </td>
        <td>
          <a href="https://vmware.github.io/vSphere-machine-learning-extension/">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          OpenShift
        </td>
        <td>
          Red Hat
        </td>
        <td>
          {{% redhat/latest-version %}}
        </td>
        <td>
          <a href="https://github.com/opendatahub-io/manifests">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          Oracle Container Engine for Kubernetes (OKE)
        </td>
        <td>
          Oracle
        </td>
        <td>
          {{% oracle/latest-version %}}
        </td>
        <td>
          <a href="https://github.com/oracle-devrel/kubeflow-oke">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          ◦ Amazon Elastic Kubernetes Service (EKS)
          <br>
          ◦ Azure Kubernetes Service (AKS)
          <br>
          ◦ Google Kubernetes Engine (GKE)
        </td>
        <td>
          Arrikto
        </td>
        <td>
          1.5.0 <sup>[<a href="https://docs.arrikto.com/Changelog.html">Release Notes</a>]</sup>
        </td>
        <td>
          <a href="https://www.arrikto.com/enterprise-kubeflow/">Website</a>
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
Kubeflow is a complex system with many components and dependencies.
Using the raw manifests requires a deep understanding of Kubernetes, Istio, and Kubeflow itself.

When using the raw manifests, the Kubeflow community is not able to provide support for environment-specific issues or custom configurations.
If you need support, please consider using a [packaged distribution](#packaged-distributions-of-kubeflow).
{{% /alert %}}

<a id="next-steps"></a>

## Next steps

- Review the Kubeflow <a href="/docs/components/">component documentation</a>
- Explore the <a href="/docs/components/pipelines/sdk/">Kubeflow Pipelines SDK</a>
