+++
title = "Installing Kubeflow"
description = "Deployment options for Kubeflow"
weight = 20

+++

### What is Kubeflow?

Kubeflow is an end-to-end Machine Learning (ML) platform for Kubernetes, it provides components for each stage in the ML lifecycle, from exploration through to training and deployment.
Operators can choose what is best for their users, there is no requirement to deploy every component.

Learn more about Kubeflow on the [Introduction](/docs/started/introduction/) and [Architecture](/docs/started/architecture/) pages.

### How to install Kubeflow?

Anywhere you are running Kubernetes, you should be able to run Kubeflow.
There are two primary ways to install Kubeflow:

1. [__Packaged Distributions__](#packaged-distributions-of-kubeflow) <sup>(recommended)</sup>
2. [__Raw Manifests__](#raw-kubeflow-manifests) <sup>(advanced users)</sup>

<a id="packaged-distributions"></a>
<a id="install-a-packaged-kubeflow-distribution"></a>
## Packaged Distributions of Kubeflow 

Packaged distributions are maintained by various organizations and typically aim to provide a simplified installation and management experience for Kubeflow.

{{% alert title="Conformance and Certification" color="warning" %}}
Packaged distributions are developed and supported by their respective maintainers.
The Kubeflow community <strong>does not endorse or certify</strong> any specific distribution.

In the near future, there are plans to introduce <a href="https://github.com/kubeflow/community/blob/master/proposals/kubeflow-conformance-program-proposal.md">conformance testing for distributions</a>, you may track progress on this initiative by following <a href="https://github.com/kubeflow/kubeflow/issues/6485">kubeflow/kubeflow#6485</a>.
{{% /alert %}}

{{% alert title="Distribution Names" color="info" %}}
Some packaged distributions have names like `Kubeflow on <PLATFORM>`.
Please note, they are __not__ the only way to use Kubeflow on that platform, it is simply the name of a distribution.

There are discussions about renaming these distributions to avoid confusion with others that may be available on the same platform.
{{% /alert %}}

### Active Distributions

The following table lists <strong>active distributions</strong> which are <em>currently maintained</em> by their respective maintainers.

<div class="table-responsive distributions-table-active">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Name</th>
        <th>Maintainer</th>
        <th>Target Platform</th>
        <th>Link</th>
        <th>Kubeflow Version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Kubeflow on AWS</td>
        <td>Amazon Web Services</td>
        <td>
          Amazon Elastic Kubernetes Service (EKS)
        </td>
        <td>
          <a href="https://awslabs.github.io/kubeflow-manifests">Website</a>
        </td>
        <td>
          {{% aws/latest-version %}} <sup>[<a href="https://github.com/awslabs/kubeflow-manifests/releases">Release Notes</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Kubeflow on Azure</td>
        <td>Microsoft Azure</td> 
        <td>
          Azure Kubernetes Service (AKS)
        </td>
        <td>
          <a href="https://azure.github.io/kubeflow-aks/main">Website</a>
        </td>
        <td>
          1.7.0 <sup>[<a href="https://github.com/Azure/kubeflow-aks/releases/tag/v1.7.0">Release Notes</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Kubeflow on Google Cloud</td>
        <td>Google Cloud</td>
        <td>
          Google Kubernetes Engine (GKE)
        </td>
        <td>
          <a href="https://googlecloudplatform.github.io/kubeflow-gke-docs">Website</a>
        </td>
        <td>
          1.8.0 <sup>[<a href="https://googlecloudplatform.github.io/kubeflow-gke-docs/docs/changelog/#180">Release Notes</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Kubeflow on IBM Cloud</td>
        <td>IBM Cloud</td>
        <td>
          IBM Cloud Kubernetes Service (IKS)
        </td>
        <td>
          <a href="https://ibm.github.io/manifests/">Website</a>
        </td>
        <td>
          {{% iks/latest-version %}} <sup>[<a href="https://github.com/IBM/manifests/releases/tag/v{{% iks/latest-version %}}">Release Notes</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Kubeflow on Nutanix</td>
        <td>Nutanix</td>
        <td>
          Nutanix Kubernetes Engine
        </td>
        <td>
          <a href="https://nutanix.github.io/kubeflow-manifests">Website</a>
        </td>
        <td>
          {{% nutanix/latest-version %}}
        </td>
      </tr>
      <tr>
        <td>Charmed Kubeflow</td>
        <td>Canonical</td>
        <td>
          All Certified Kubernetes Distributions <sup>[<a href="https://kubernetes.io/partners/#conformance">1</a>]</sup>
        </td>
        <td>
          <a href="https://charmed-kubeflow.io/">Website</a>
        </td>
        <td>
          1.7.0
        </td>
      </tr>
      <tr>
        <td>deployKF</td>
        <td>Aranui Solutions</td>
        <td>
          All Certified Kubernetes Distributions <sup>[<a href="https://kubernetes.io/partners/#conformance">1</a>]</sup>
        </td>
        <td>
          <a href="https://www.deploykf.org/">Website</a>
        </td>
        <td>
          1.7.0 <sup>[<a href="https://www.deploykf.org/releases/version-matrix/#kubeflow-tools">Version Matrix</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Kubeflow on Oracle Container Engine for Kubernetes</td>
        <td>Oracle</td>
        <td>
          Oracle Container Engine for Kubernetes (OKE)
        </td>
        <td>
          <a href="https://github.com/oracle-devrel/kubeflow-oke">Website</a>
        </td>
        <td>
          1.6.0
        </td>
      </tr>
      <tr>
        <td>Kubeflow on vSphere</td>
        <td>VMware</td>
        <td>VMware vSphere</td>
        <td>
          <a href="https://vmware.github.io/vSphere-machine-learning-extension/">Website</a>
        </td>
        <td>
          1.6.1
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Legacy Distributions

The following table lists <strong>legacy distributions</strong> which have <em>not had a recent release</em> (within the last 6 months), or whose maintainers have indicated that they are <em>no longer actively maintaining the distribution</em>.

<div class="table-responsive distributions-table-legacy">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Name</th>
        <th>Maintainer</th>
        <th>Target Platform</th>
        <th>Link</th>
        <th>Latest Release</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Argoflow</td>
        <td>Argoflow Users</td>
        <td>
          All Certified Kubernetes Distributions <sup>[<a href="https://kubernetes.io/partners/#conformance">1</a>]</sup>
        </td>
        <td>
          <a href="https://github.com/argoflow">Website</a>
        </td>
        <td>
          1.3.0
        </td>
      </tr>
      <tr>
        <td>Kubeflow on OpenShift</td>
        <td>Red Hat</td>
        <td>
          OpenShift
        </td>
        <td>
          <a href="https://github.com/opendatahub-io/manifests">Website</a>
        </td>
        <td>
          1.6.0
        </td>
      </tr>
      <tr>
        <td>Arrikto Enterprise Kubeflow</td>
        <td>Arrikto</td>
        <td>
          ◦ Amazon Elastic Kubernetes Service (EKS)
          <br>
          ◦ Azure Kubernetes Service (AKS)
          <br>
          ◦ Google Kubernetes Engine (GKE)
        </td>
        <td>
          <a href="https://www.arrikto.com/enterprise-kubeflow/">Website</a>
        </td>
        <td>
          1.5.0 <sup>[<a href="https://docs.arrikto.com/Changelog.html">Release Notes</a>]</sup>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<a id="manifests"></a>
<a id="install-the-kubeflow-manifests-manually"></a>
## Raw Kubeflow Manifests

The raw Kubeflow Manifests are aggregated by the [Manifests Working Group](https://github.com/kubeflow/community/tree/master/wg-manifests)
and are intended to be used as the __base of packaged distributions__.

Very advanced users may choose to install the manifests for a specific Kubeflow version by following the instructions in the `README` of the [`kubeflow/manifests`](https://github.com/kubeflow/manifests) repository.

- [__Kubeflow 1.8:__](/docs/releases/kubeflow-1.8/)
   - [`v1.8-branch`](https://github.com/kubeflow/manifests/tree/v1.8-branch#installation) <sup>(development branch)</sup>
   - [`v1.8.0`](https://github.com/kubeflow/manifests/tree/v1.8.0#installation)
- [__Kubeflow 1.7:__](/docs/releases/kubeflow-1.7/)
   - [`v1.7-branch`](https://github.com/kubeflow/manifests/tree/v1.7-branch#installation) <sup>(development branch)</sup>
   - [`v1.7.0`](https://github.com/kubeflow/manifests/tree/v1.7.0#installation)

{{% alert title="Warning" color="warning" %}}
Kubeflow is a complex system with many components and dependencies, using the raw manifests requires a deep understanding of Kubernetes, Istio, and Kubeflow itself.

When using the raw manifests, the Kubeflow community is not able to provide support for environment-specific issues or custom configurations.
If you need support, please consider using a [packaged distribution](#packaged-distributions-of-kubeflow).
{{% /alert %}}

<a id="next-steps"></a>
## Next steps

* Review the Kubeflow <a href="/docs/components/">component documentation</a>
* Explore the <a href="/docs/components/pipelines/sdk/">Kubeflow Pipelines SDK</a>
