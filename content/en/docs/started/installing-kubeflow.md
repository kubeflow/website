+++
title = "Installing Kubeflow"
description = "Overview of installation choices for Kubeflow"
weight = 20

+++

<a id="introduction"></a>
## Introduction

Kubeflow is an end-to-end Machine Learning (ML) platform for Kubernetes, it provides components for each stage in the ML lifecycle, from exploration through to training and deployment.
Kubeflow is modular, allowing operators to choose what is best for their users, there is no requirement to deploy every component.
To read more about the components and architecture of Kubeflow, please see the <a href="/docs/started/kubeflow-overview/">Kubeflow Overview</a> page.

There are two options for getting up and running with Kubeflow, you may either:
1. Use a [packaged distribution](#packaged-distributions)
1. Use the [manifests](#manifests) (advanced)

<a id="packaged-distributions"></a>
## Packaged distributions

{{% alert title="Info" color="success" %}}
Packaged distributions of Kubeflow are developed and supported by their respective maintainers.
The open-source Kubeflow community does not currently endorse or certify any packaged distribution.
{{% /alert %}}

<b>See the table below for a list of options and links to documentation:</b>

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Name</th>
        <th>Maintainer</th>
        <th>Platform</th>
        <th>Link - Docs</th>
        <th>Link - External Website</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Kubeflow on AWS</td>
        <td>AWS</td>
        <td>Amazon Elastic Kubernetes Service (EKS)</td>
        <td><a href="/docs/distributions/aws/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Kubeflow on Azure</td>
        <td>Azure</td>
        <td>Azure Kubernetes Service (AKS)</td>
        <td><a href="/docs/distributions/azure/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Kubeflow on GCP</td>
        <td>Google Cloud</td>
        <td>Google Kubernetes Engine (GKE)</td>
        <td><a href="/docs/distributions/gke/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Kubeflow on IBM Cloud</td>
        <td>IBM Cloud</td>
        <td>IBM Cloud Kubernetes Service (IKS) </td>
        <td><a href="/docs/distributions/ibm/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Kubeflow on Openshift</td>
        <td>IBM Cloud</td>
        <td>Openshift</td>
        <td><a href="/docs/distributions/openshift/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Argoflow</td>
        <td>Argoflow Community</td>
        <td>Conformant Kubernetes</td>
        <td>N/A</td>
        <td><a href="https://github.com/argoflow/argoflow">External Website</a></td>
      </tr>
      <tr>
        <td>Charmed Kubeflow</td>
        <td>Canonical</td>
        <td>Conformant Kubernetes</td>
        <td><a href="/docs/distributions/charmed/">Docs</a></td>
        <td><a href="https://charmed-kubeflow.io/docs">External Website</a></td>
      </tr>
      <tr>
        <td>MicroK8s Kubeflow add-on</td>
        <td>Canonical</td>
        <td>MicroK8S</td>
        <td><a href="/docs/distributions/microk8s/">Docs</a></td>
        <td><a href="https://microk8s.io/docs/addon-kubeflow">External Website</a></td>
      </tr>
      <tr>
        <td>MiniKF</td>
        <td>Arrikto</td>
        <td>Cloud Marketplaces, Vagrant</td>
        <td><a href="/docs/distributions/minikf/">Docs</a></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

<a id="manifests"></a>
## Manifests

{{% alert title="Warning" color="warning" %}}
Installing kubeflow from the manifests is intended for advanced users, the Kubeflow community will not support environment-specific issues.

If you need support, please consider using a packaged distribution of Kubeflow.
{{% /alert %}}

The <a href="https://github.com/kubeflow/community/tree/master/wg-manifests">Manifests Working Group</a> is responsible for aggregating the authoritative manifests of each official Kubeflow component.
While these manifests are intended to be the base of packaged distributions, advanced users may choose to install them directly by following <a href="https://github.com/kubeflow/manifests">these instructions</a>. 

<a id="next-steps"></a>
## Next steps

* Review the <a href="/docs/components/">Kubeflow component documentation</a>
* Explore the <a href="/docs/components/pipelines/sdk/">Kubeflow Pipelines SDK</a>
