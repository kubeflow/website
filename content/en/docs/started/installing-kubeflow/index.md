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

Some components in the [Kubeflow ecosystem](/docs/started/architecture/#kubeflow-ecosystem) may be
deployed as standalone services, without the need to install the full Kubeflow Platform. You might
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
         <a href="/docs/components/trainer/legacy-v1/user-guides/mpi/#installation">
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
          <a href="/docs/components/pipelines/operator-guides/installation/">
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
          <a href="/docs/components/spark-operator/getting-started#installation">
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
          <a href="/docs/components/trainer/getting-started">
            Kubeflow Trainer
          </a>
        </td>
        <td>
          Model Training and LLMs Fine-Tuning
        </td>
        <td>
          <a href="https://github.com/kubeflow/trainer">
            <code>kubeflow/trainer</code>
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
a simplified installation and management experience for your **Kubeflow Platform**. 
Some can be deployed on multiple [Kubernetes distributions](https://kubernetes.io/partners/#conformance),
while others target a specific platform (e.g. EKS or GKE).

{{% alert title="" color="info" %}}
Packaged distributions are developed and supported by their respective maintainers.
The Kubeflow community <strong>does not endorse or certify</strong> any specific distribution.
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
          Aranui Solutions
            <br><small>deployKF</small>
        </td>
        <td>
          {{< kf-version-notice >}}{{% deploykf/latest-version %}}{{< /kf-version-notice >}}
          <sup><a href="https://www.deploykf.org/releases/tool-versions/#kubeflow-ecosystem">[version matrix]</a></sup>
        </td>
        <td>
          Multiple
          <sup><a href="https://www.deploykf.org/guides/getting-started/#kubernetes-cluster">[list]</a></sup>
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
          {{< kf-version-notice >}}{{% canonical/latest-version %}}{{< /kf-version-notice >}}
          <sup><a href="https://charmed-kubeflow.io/docs/release-notes">[release notes]</a></sup>
        </td>
        <td>
          Multiple
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
          {{< kf-version-notice >}}{{% gke/latest-version %}}{{< /kf-version-notice >}}
          <sup><a href="https://googlecloudplatform.github.io/kubeflow-gke-docs/docs/changelog/">[release notes]</a></sup>
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
          {{< kf-version-notice >}}{{% iks/latest-version %}}{{< /kf-version-notice >}}
          <sup><a href="https://github.com/IBM/manifests/releases">[release notes]</a></sup>
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
          {{< kf-version-notice >}}{{% azure/latest-version %}}{{< /kf-version-notice >}}
          <sup><a href="https://github.com/Azure/kubeflow-aks/releases">[release notes]</a></sup>
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
          {{< kf-version-notice >}}{{% nutanix/latest-version %}}{{< /kf-version-notice >}}
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
          {{< kf-version-notice >}}{{% qbo/latest-version %}}{{< /kf-version-notice >}}
          <sup><a href="https://github.com/alexeadem/qbo-ce/blob/main/CHANGELOG.md">[release notes]</a></sup>
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
          {{< kf-version-notice >}}{{% redhat/latest-version %}}{{< /kf-version-notice >}}
        </td>
        <td>
          OpenShift
        </td>
        <td>
          <a href="https://github.com/opendatahub-io/manifests">Website</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Kubeflow Manifests

The Kubeflow manifests are a collection of community maintained manifests to install Kubeflow in popular Kubernetes clusters such as Kind (locally), Minikube (locally), Rancher, EKS, AKS, GKE.
They are aggregated by the Manifests Working Group and are intended to be
used by users with Kubernetes knowledge and as the base of packaged distributions.

Kubeflow Manifests contain all Kubeflow Components, Kubeflow Central Dashboard, and other Kubeflow
applications that comprise the **Kubeflow Platform**. This installation is helpful when you want to
try out the end-to-end Kubeflow Platform capabilities.
 
If you want a stable / conservative experience we recommend to use the [latest stable release](https://github.com/kubeflow/manifests/releases): 
- [**Kubeflow 1.10:**](/docs/releases/kubeflow-1.10/)
  - [`v1.10.0`](https://github.com/kubeflow/manifests/tree/v1.10.0#installation)

You can also install the master branch of [`kubeflow/manifests`](https://github.com/kubeflow/manifests) by following the instructions [here](https://github.com/kubeflow/manifests?tab=readme-ov-file#installation) and provide us feedback.

## Next steps

- Review our [introduction to Kubeflow](/docs/started/introduction/).
- Explore the [architecture of Kubeflow](/docs/started/architecture).
- Learn more about the [components of Kubeflow](/docs/components/).
