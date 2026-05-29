+++
title = "Installing Kubeflow"
description = "Deployment options for Kubeflow"
weight = 20

+++

This guide describes how to install Kubeflow subprojects, or Kubeflow Community Distribution using
Kubeflow manifests.

Read [the introduction guide](/docs/started/introduction) to learn more about Kubeflow,
Kubeflow subprojects and Kubeflow Community Distribution

## Installation Methods

You can install Kubeflow using one of these methods:

- [**Kubeflow Subprojects**](#kubeflow-projects)
- [**Kubeflow Distribution**](#kubeflow-distribution)

## Kubeflow Subprojects

Kubeflow subprojects in the [Kubeflow landscape](/docs/started/architecture/#kubeflow-landscape) can
be deployed as a standalone services, without the need to install the entire Kubeflow
Community Distribution. You might integrate these services as part of your existing AI platform or
use them independently.

These projects are a quick and easy method to get started with the Kubeflow. They provide
flexibility to users who may not require the capabilities of a full Kubeflow Community Distribution.

The following tables list Kubeflow subprojects grouped by their corresponding
[maturity level](https://github.com/kubeflow/community/tree/master/subprojects/status_levels_requirements.md).

### Stable Kubeflow Subprojects

<div class="table-responsive distributions-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Kubeflow Subproject</th>
        <th>AI Lifecycle Stage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/katib">
            Kubeflow Katib
          </a>
        </td>
        <td>
          Model Optimization and AutoML
        </td>
      </tr>
      <tr>
        <td>
         <a href="https://github.com/kubeflow/hub">
            Kubeflow Hub
          </a>
        </td>
        <td>
          Artifact management and catalog
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/pipelines">
            Kubeflow Pipelines
          </a>
        </td>
        <td>
          ML Workflows and Schedules
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/spark-operator">
            Kubeflow Spark Operator
          </a>
        </td>
        <td>
          Data Processing
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/trainer">
            Kubeflow Trainer
          </a>
        </td>
        <td>
          Model Training and LLMs Fine-Tuning
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/sdk">
            Kubeflow SDK
          </a>
        </td>
        <td>
          Unified Pythonic Interface
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Development

<div class="table-responsive distributions-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Kubeflow Subproject</th>
        <th>AI Lifecycle Stage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/notebooks">
            Kubeflow Workspaces
          </a>
        </td>
        <td>
          Interactive Development Environments
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/kale">
            Kubeflow Kale
          </a>
        </td>
        <td>
          JupyterLab Extension for KFP
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/mlflow-integration">
            Kubeflow MLFlow Integration
          </a>
        </td>
        <td>
          Experiment Tracking
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/mcp-server">
            Kubeflow MCP Server
          </a>
        </td>
          AI-Assistant Development with Kubeflow
        <td>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/mcp-apache-spark-history-server">
            Kubeflow MCP Spark History Server
          </a>
        </td>
        <td>
          AI tools to interact with Spark History Server
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Deprecated

<div class="table-responsive distributions-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Kubeflow Subproject</th>
        <th>AI Lifecycle Stage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/notebooks">
            Kubeflow Notebooks v1
          </a>
        </td>
        <td>
          Interactive Development Environment
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/trainer">
            Kubeflow Training Operator v1
          </a>
        </td>
        <td>
          Model Training and LLMs Fine-Tuning
        </td>
      </tr>
    </tbody>
  </table>
</div>

You can find the list of archived projects here in [this document](https://github.com/kubeflow/community/tree/master/subprojects/PROJECTS.md).

## Kubeflow Distribution

You can use one of the following methods to install the
[Kubeflow Distribution](/docs/started/introduction/#what-is-the-kubeflow-ai-reference-platform)
and get the full suite of Kubeflow subprojects bundled together with additional tools.

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

If you want a stable / conservative experience we recommend to use the [latest stable release](https://github.com/kubeflow/manifests/releases):

- [`v1.11 branch`](https://github.com/kubeflow/manifests/tree/v1.11-branch)
- [`v1.11.0 release`](https://github.com/kubeflow/manifests/releases/tag/v1.11.0)

You can also install the master branch of [`kubeflow/manifests`](https://github.com/kubeflow/manifests) by following the instructions [here](https://github.com/kubeflow/manifests?tab=readme-ov-file#installation) and provide us feedback.

### Included Projects

The Kubeflow Community Distribution bundles the following projects:

<div class="table-responsive distributions-table">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Project</th>
        <th>Organization</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/katib">
            Kubeflow Katib
          </a>
        </td>
        <td>
          Kubeflow
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/hub">
            Kubeflow Hub
          </a>
        </td>
        <td>
          Kubeflow
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/pipelines">
            Kubeflow Pipelines
          </a>
        </td>
        <td>
          Kubeflow
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/spark-operator">
            Kubeflow Spark Operator
          </a>
        </td>
        <td>
          Kubeflow
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/trainer">
            Kubeflow Trainer
          </a>
        </td>
        <td>
          Kubeflow
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/sdk">
            Kubeflow SDK
          </a>
        </td>
        <td>
          Kubeflow
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/notebooks">
            Kubeflow Workspaces
          </a>
        </td>
        <td>
          Kubeflow
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/dashboard">
            Kubeflow Dashboard
          </a>
        </td>
        <td>
          Kubeflow
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/dashboard">
            Kubeflow Profile Controller
          </a>
        </td>
        <td>
          Kubeflow
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kserve/kserve">
            KServe
          </a>
        </td>
        <td>
          KServe
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/istio/istio">
            Istio
          </a>
        </td>
        <td>
          Istio
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/dexidp/dex">
            Dex
          </a>
        </td>
        <td>
          Dex
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/cert-manager/cert-manager">
            cert-manager
          </a>
        </td>
        <td>
          Cert Manager
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/oauth2-proxy/oauth2-proxy">
            oauth2-proxy
          </a>
        </td>
        <td>
          oauth2-proxy
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Next steps

- Review our [introduction to Kubeflow](/docs/started/introduction/).
- Explore the [architecture of Kubeflow](/docs/started/architecture).
- Learn more about the [Kubeflow subprojects](/docs/components/).
