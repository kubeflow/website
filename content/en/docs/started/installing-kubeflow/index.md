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

The following tables list Kubeflow subprojects grouped by their corresponding
[maturity level](https://github.com/kubeflow/community/tree/master/subprojects/maturity_requirements.md).

You can find the list of archived projects in [this document](https://github.com/kubeflow/community/tree/master/subprojects/PROJECTS.md).

### Graduated Projects

<div class="table-responsive distributions-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Kubeflow Subproject</th>
        <th>Source Code</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://www.kubeflow.org/docs/components/hub/">
            Kubeflow Hub
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/hub">kubeflow/hub</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://www.kubeflow.org/docs/components/katib/">
            Kubeflow Katib
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/katib">kubeflow/katib</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://www.kubeflow.org/docs/components/notebooks/">
            Kubeflow Notebooks
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/notebooks">kubeflow/notebooks</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://www.kubeflow.org/docs/components/pipelines/">
            Kubeflow Pipelines
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/pipelines">kubeflow/pipelines</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://sdk.kubeflow.org/en/latest/">
            Kubeflow SDK
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/sdk">kubeflow/sdk</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://www.kubeflow.org/docs/components/spark-operator/">
            Kubeflow Spark Operator
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/spark-operator">kubeflow/spark-operator</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://www.kubeflow.org/docs/components/trainer/">
            Kubeflow Trainer
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/trainer">kubeflow/trainer</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Incubating Projects

<div class="table-responsive distributions-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Kubeflow Subproject</th>
        <th>Source Code</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://www.kubeflow.org/docs/components/kale/">
            Kubeflow Kale
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/kale">kubeflow/kale</a>
        </td>
      </tr>
      <tr>
        <td>
          Kubeflow MLflow Integration
        </td>
        <td>
          <a href="https://github.com/kubeflow/mlflow-integration">kubeflow/mlflow-integration</a>
        </td>
      </tr>
      <tr>
        <td>
          Kubeflow MCP Server
        </td>
        <td>
          <a href="https://github.com/kubeflow/mcp-server">kubeflow/mcp-server</a>
        </td>
      </tr>
      <tr>
        <td>
          Kubeflow MCP Spark History Server
        </td>
        <td>
          <a href="https://github.com/kubeflow/mcp-apache-spark-history-server">kubeflow/mcp-apache-spark-history-server</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Deprecated Projects

<div class="table-responsive distributions-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Kubeflow Subproject</th>
        <th>Source Code</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://www.kubeflow.org/docs/components/pipelines/legacy-v1/">
            Kubeflow Pipelines v1
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/pipelines">kubeflow/pipelines</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://www.kubeflow.org/docs/components/trainer/legacy-v1/">
            Kubeflow Training Operator v1
          </a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/trainer">kubeflow/trainer</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

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
          <sup><a href="https://documentation.ubuntu.com/charmed-kubeflow/latest/reference/release-notes/">[release notes]</a></sup>
        </td>
        <td>
          Multiple
        </td>
        <td>
          <a href="https://ubuntu.com/kubeflow">Website</a>
        </td>
      </tr>
      <tr>
        <td>
          prokube.ai
            <br><small>prokube MLOps</small>
        </td>
        <td>
          {{< kf-version-notice >}}{{% prokube/latest-version %}}{{< /kf-version-notice >}}
        </td>
        <td>
          Multiple Kubernetes distributions
        </td>
        <td>
          <a href="https://prokube.ai">Website</a>
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
          <a href="https://www.redhat.com/en/products/ai/openshift-ai">Website</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Kubeflow Community Distribution

See the definition for Kubeflow Community Distribution [in the overview page](../introduction#kubeflow-community-distribution)

If you want a stable / conservative experience we recommend to use the
[latest stable release](https://github.com/kubeflow/community-distribution/releases):

- [`v26.03 branch`](https://github.com/kubeflow/community-distribution/tree/release-26.03)
- [`v1.11 branch`](https://github.com/kubeflow/community-distribution/tree/v1.11-branch)
- [`v1.11.0 release`](https://github.com/kubeflow/community-distribution/releases/tag/v1.11.0)

You can also install the master branch of
[`kubeflow/community-distribution`](https://github.com/kubeflow/community-distribution)
by following the instructions [here](https://github.com/kubeflow/community-distribution?tab=readme-ov-file#installation)
and provide us feedback.

## Next steps

- Review our [introduction to Kubeflow](/docs/started/introduction/).
- Explore the [architecture of Kubeflow](/docs/started/architecture).
- Learn more about the [Kubeflow subprojects](/docs/components/).
