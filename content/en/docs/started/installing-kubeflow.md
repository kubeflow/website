+++
title = "Installing Kubeflow"
description = "Deployment options for Kubeflow"
weight = 20

+++

Kubeflow is an end-to-end Machine Learning (ML) platform for Kubernetes, it provides components for each stage in the ML lifecycle, from exploration through to training and deployment.
Operators can choose what is best for their users, there is no requirement to deploy every component.
To read more about the components and architecture of Kubeflow, please see the <a href="/docs/started/architecture/">Kubeflow Architecture</a> page.

### How to install Kubeflow?

There are two pathways to get up and running with Kubeflow, you may either:

1. [Use a packaged distribution](#packaged-distributions-of-kubeflow)
2. [Use the raw manifests](#raw-kubeflow-manifests) <sup>(for advanced users)</sup>

<a id="packaged-distributions"></a>
<a id="install-a-packaged-kubeflow-distribution"></a>
## Packaged Distributions of Kubeflow 

{{% alert title="Note" color="warning" %}}
Packaged distributions are developed and supported by their respective maintainers, <b>the Kubeflow community does not endorse or certify any specific distribution</b>.

In the near future, there are plans to introduce <a href="https://github.com/kubeflow/community/blob/master/proposals/kubeflow-conformance-program-proposal.md">conformance testing for distributions</a>, you may track progress on this initiative by following <a href="https://github.com/kubeflow/kubeflow/issues/6485">kubeflow/kubeflow#6485</a>.
{{% /alert %}}

### Active Distributions

The following table lists <b>active distributions</b> that have <b>had a recent release</b> (within the last 6 months).

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
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
        <td>Kubeflow on AWS</td>
        <td>Amazon Web Services</td>
        <td>
          Amazon Elastic Kubernetes Service (EKS)
        </td>
        <td>
          <u><a href="https://awslabs.github.io/kubeflow-manifests">Website</a></u>
        </td>
        <td>
          2022-10-14
          <br>
          <sup>[<a href="https://github.com/awslabs/kubeflow-manifests/releases/tag/v1.6.1-aws-b1.0.0">GitHub Release</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Kubeflow on Google Cloud</td>
        <td>Google Cloud</td>
        <td>
          Google Kubernetes Engine (GKE)
        </td>
        <td>
          <u><a href="https://github.com/GoogleCloudPlatform/kubeflow-distribution">Website</a></u>
          <br>
          <sub><u><a href="/docs/distributions/gke/">Legacy Docs</a></u></sub>
        </td>
        <td>
          2022-10-17
          <br>
          <sup>[<a href="https://github.com/GoogleCloudPlatform/kubeflow-distribution/releases/tag/v1.6.1">GitHub Release</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Kubeflow on IBM Cloud</td>
        <td>IBM Cloud</td>
        <td>
          IBM Cloud Kubernetes Service (IKS)
        </td>
        <td>
          <u><a href="https://github.com/IBM/manifests/tree/{{% iks/latest-branch %}}">Website</a></u>
          <br>
          <sub><u><a href="/docs/distributions/ibm/">Legacy Docs</a></u></sub>
        </td>
        <td>
          2022-10-10
          <br>
          <sup>[<a href="https://github.com/IBM/manifests/releases/tag/v1.6.1">GitHub Release</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Kubeflow on Nutanix</td>
        <td>Nutanix</td>
        <td>
          Nutanix Kubernetes Engine
        </td>
        <td>
          <u><a href="https://github.com/nutanix/karbon-platform-services/tree/master/automation/infrastructure/terraform/kcs/install_kubeflow">Website</a></u>
          <br>
          <sub><u><a href="/docs/distributions/nutanix/">Legacy Docs</a></u></sub>
        </td>
        <td>
          2022-08-30
          <br>
          <sup>[<a href="https://github.com/nutanix/karbon-platform-services/issues/94#issuecomment-1230618653">GitHub Comment</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Open Data Hub</td>
        <td>Red Hat</td>
        <td>
          OpenShift
        </td>
        <td>
          <u><a href="https://opendatahub.io/docs/kubeflow.html">Website</a></u>
          <br>
          <sub><u><a href="/docs/distributions/openshift/">Legacy Docs</a></u></sub>
        </td>
        <td>
          2022-10-26
          <br>
          <sup>[<a href="https://github.com/opendatahub-io/odh-manifests/releases/tag/v1.4.0">GitHub Release</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Arrikto Kubeflow as a Service</td>
        <td rowspan="2">Arrikto</td>
        <td>
          N/A <sup>(fully managed)</sup>
        </td>
        <td>
          <u><a href="https://www.arrikto.com/kubeflow-as-a-service/">Website</a></u>
        </td>
        <td>
          Unknown
        </td>
      </tr>
      <tr>
        <td>Arrikto Enterprise Kubeflow</td>
        <td>
          ◦ Amazon Elastic Kubernetes Service (EKS)
          <br>
          ◦ Azure Kubernetes Service (AKS)
          <br>
          ◦ Google Kubernetes Engine (GKE)
        </td>
        <td>
          <u><a href="https://www.arrikto.com/enterprise-kubeflow/">Website</a></u>
        </td>
        <td>
          2022-10-24
          <br>
          <sup>[<a href="https://docs.arrikto.com/Changelog.html#version-2-0-aurora">Changelog</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Charmed Kubeflow</td>
        <td>Canonical</td>
        <td>
          All Conformant Kubernetes
        </td>
        <td>
          <u><a href="https://charmed-kubeflow.io/">Website</a></u>
        </td>
        <td>
          2022-09-08
          <br>
          <sup>[<a href="https://ubuntu.com/blog/charmed-kubeflow-1-6-available">Blog Post</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Kubeflow on Oracle Cloud Infrastructure</td>
        <td>Oracle</td>
        <td>
          Oracle Container Engine for Kubernetes (OKE)
        </td>
        <td>
          <u><a href="https://github.com/oracle-devrel/kubeflow-oke">Website</a></u>
        </td>
        <td>
          Unknown
        </td>
      </tr>
      <tr>
        <td>Kubeflow on vSphere</td>
        <td>VMware</td>
        <td>VMware vSphere</td>
        <td>
          <u><a href="https://vmware.github.io/ml-ops-platform-for-vsphere/">Website</a></u>
        </td>
        <td>
          Unknown
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Legacy Distributions

The following table lists <b>legacy distributions</b> which have <b>not had a recent release</b> (within the last 6 months).

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
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
          All Conformant Kubernetes
        </td>
        <td>
          <u><a href="https://github.com/argoflow">Website</a></u>
        </td>
        <td>
          2021-06-02
          <br>
          <sup>[<a href="https://github.com/argoflow/argoflow/releases/tag/v0.1.0">GitHub Release</a>]</sup>
        </td>
      </tr>
      <tr>
        <td>Kubeflow on Azure</td>
        <td>N/A <sup>(not maintained)</sup></td>
        <td>
          Azure Kubernetes Service (AKS)
        </td>
        <td>
          <s>Website</s>
          <br>
          <sub><u><a href="/docs/distributions/azure/">Legacy Docs</a></u></sub>
        </td>
        <td>
          2020-11-14
          <br>
          <sup>[<a href="https://github.com/kubeflow/manifests/pull/1642">Pull Request</a>]</sup>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<a id="manifests"></a>
<a id="install-the-kubeflow-manifests-manually"></a>
## Raw Kubeflow Manifests

{{% alert title="Warning" color="warning" %}}
This method is for advanced users.

The Kubeflow community is not able to provide support for environment-specific issues when using the raw manifests.
If you need support, please consider using a [packaged distribution](#packaged-distributions-of-kubeflow).
{{% /alert %}}

The raw <a href="https://github.com/kubeflow/manifests">Kubeflow manifests</a> are aggregated by the <a href="https://github.com/kubeflow/community/tree/master/wg-manifests">Manifests Working Group</a> 
and are intended to be used as the base of packaged distributions,
<b>advanced users may choose to install the manifests directly</b> by following <a href="https://github.com/kubeflow/manifests#installation">these instructions</a>.

<a id="next-steps"></a>
## Next steps

* Review the Kubeflow <a href="/docs/components/">component documentation</a>
* Explore the <a href="/docs/components/pipelines/sdk/">Kubeflow Pipelines SDK</a>
