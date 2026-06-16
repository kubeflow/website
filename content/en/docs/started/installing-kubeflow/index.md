+++
title = "Installing Kubeflow"
description = "Deployment options for Kubeflow"
weight = 20

+++

This guide describes how to install Kubeflow subprojects, Kubeflow Community Distribution, or
vendor-packaged Kubeflow Distributions.

Read [the introduction guide](/docs/started/introduction) to learn more about Kubeflow concepts.

## Installation Methods

You can install Kubeflow using one of these methods:

- [**Kubeflow Subprojects**](#kubeflow-subprojects)
- [**Kubeflow Distribution**](#kubeflow-distributions)

## Kubeflow Subprojects

Kubeflow subprojects in the [Kubeflow landscape](/docs/started/architecture/#kubeflow-landscape) can
be deployed as a standalone services, without the need to install the entire Kubeflow
distribution. You might integrate these services as part of your existing AI platform or
use them independently.

These projects are a quick and easy method to get started with the Kubeflow. They provide
flexibility to users who may not require the capabilities of a full Kubeflow distribution.

The following tables list Kubeflow subprojects grouped by their corresponding maturity levels.
Learn more about maturity levels expectations and requirements in
[this document](https://github.com/kubeflow/community/tree/master/subprojects/maturity_requirements.md)

You can find the list of archived projects in [this document](https://github.com/kubeflow/community/tree/master/subprojects/PROJECTS.md).

### Graduated Projects

These projects are stable and ready for general availability. Breaking changes are only allowed
following the defined feature lifecycle for the project.

<div class="table-responsive">
<div class="table table-bordered">

| Kubeflow Subproject                                                                 | Source Code                                                           |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [Kubeflow Hub](https://www.kubeflow.org/docs/components/hub/)                       | [kubeflow/hub](https://github.com/kubeflow/hub)                       |
| [Kubeflow Katib](https://www.kubeflow.org/docs/components/katib/)                   | [kubeflow/katib](https://github.com/kubeflow/katib)                   |
| [Kubeflow Notebooks](https://www.kubeflow.org/docs/components/notebooks/)           | [kubeflow/notebooks](https://github.com/kubeflow/notebooks)           |
| [Kubeflow Pipelines](https://www.kubeflow.org/docs/components/pipelines/)           | [kubeflow/pipelines](https://github.com/kubeflow/pipelines)           |
| [Kubeflow Spark Operator](https://www.kubeflow.org/docs/components/spark-operator/) | [kubeflow/spark-operator](https://github.com/kubeflow/spark-operator) |
| [Kubeflow Trainer](https://www.kubeflow.org/docs/components/trainer/)               | [kubeflow/trainer](https://github.com/kubeflow/trainer)               |

### Incubating Projects

These projects are actively developed, broadly usable, and on track for Graduation. While most core
functionality is stable, it is still maturing toward a final release.

<div class="table-responsive">
<div class="table table-bordered">

| Kubeflow Subproject                                             | Source Code                                       |
| --------------------------------------------------------------- | ------------------------------------------------- |
| [Kubeflow Kale](https://www.kubeflow.org/docs/components/kale/) | [kubeflow/kale](https://github.com/kubeflow/kale) |
| [Kubeflow SDK](https://sdk.kubeflow.org/en/latest/)             | [kubeflow/sdk](https://github.com/kubeflow/sdk)   |

### Experimental Projects

Not all pieces of these projects are in place, and it may not be ready for wider adoption. User
feedback around the UX of these projects is desired, such as for Custom Resource Definition APIs,
technical implementation details, and planned use-cases for the projects.

<div class="table-responsive">
<div class="table table-bordered">

| Kubeflow Subproject               | Source Code                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Kubeflow MLflow Integration       | [kubeflow/mlflow-integration](https://github.com/kubeflow/mlflow-integration)                           |
| Kubeflow MCP Server               | [kubeflow/mcp-server](https://github.com/kubeflow/mcp-server)                                           |
| Kubeflow MCP Spark History Server | [kubeflow/mcp-apache-spark-history-server](https://github.com/kubeflow/mcp-apache-spark-history-server) |

### Deprecated Projects

Development of this project is halted and no new versions are planned. New issues will likely not
be worked on except for critical security issues. Projects assets that are included in the releases
are expected to exist for at least **two minor releases** or **one year**, whichever happens later.

Currently, Kubeflow doesn't have any deprecated projects.

## Kubeflow Distributions

You can use one of the following methods to install the
[Kubeflow Distributions](/docs/started/introduction/#kubeflow-distribution).

### Packaged Distributions

See the definition for Kubeflow Distributions [in the overview page](../introduction#kubeflow-distribution)

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
          Nutanix Kubernetes Platform
        </td>
        <td>
          <a href="https://nutanix.github.io/kubeflow-manifests">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          QBO GPU Cloud
        </td>
        <td>
          {{< kf-version-notice >}}{{% qbo/latest-version %}}{{< /kf-version-notice >}}
          <sup><a href="https://docs.qbo.io/news/2025/05/09/api-1-5-14-released/">[release notes]</a></sup>
        </td>
        <td>
          QBO Kubernetes Engine (QKE)
        </td>
         <td>
          <a href="https://docs.qbo.io/demos/kubeflow">Website</a>
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

### Kubeflow Community Distribution

See the definition for Kubeflow Community Distribution [in the overview page](../introduction#kubeflow-community-distribution)

If you want a stable / conservative experience we recommend to use the
[latest stable release](https://github.com/kubeflow/community-distribution/releases):

- [`v26.03.1 branch`](https://github.com/kubeflow/community-distribution/tree/release-26.03.1)

You can also install the master branch of
[`kubeflow/community-distribution`](https://github.com/kubeflow/community-distribution)
by following the instructions [here](https://github.com/kubeflow/community-distribution?tab=readme-ov-file#installation)
and provide us feedback.

## Next steps

- Review our [introduction to Kubeflow](/docs/started/introduction/).
- Explore the [architecture of Kubeflow](/docs/started/architecture).
- Learn more about the [Kubeflow subprojects](/docs/components/).
