+++
title = "Installing Kubeflow"
description = "Overview of installation choices for Kubeflow"
weight = 20

+++

Kubeflow is an end-to-end Machine Learning (ML) platform for Kubernetes, it provides components for each stage in the ML lifecycle, from exploration through to training and deployment.
Operators can choose what is best for their users, there is no requirement to deploy every component.
To read more about the components and architecture of Kubeflow, please see the <a href="/docs/started/kubeflow-overview/">Kubeflow Overview</a> page.

There are two pathways to get up and running with Kubeflow, you may either:
1. Use a [packaged distribution](#packaged-distributions)
1. Use the [manifests](#manifests) (advanced)

<a id="packaged-distributions"></a>
## Install a packaged Kubeflow distribution

{{% alert color="warning" %}}
Packaged distributions are developed and supported by their respective maintainers, the Kubeflow community does not currently endorse or certify any distribution.
{{% /alert %}}

<b>See the table below for a list of options and links to documentation:</b>

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Distribution</th>
        <th>Maintainer</th>
        <th>Target Platform</th>
        <th>Kubeflow Version</th>
        <th>Docs</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/argoflow/argoflow">Argoflow</a></td>
        <td>Open Source</td>
        <td>Any Kubernetes</td>
        <td>1.3</td>
        <td>-</td>
      </tr>
      <tr>
        <td><a href="https://www.arrikto.com/enterprise-kubeflow/">Arrikto Enterprise Kubeflow</a></td>
        <td>Arrikto</td>
        <td>EKS, AKS, GKE</td>
        <td>1.4</td>
        <td><a href="/docs/distributions/ekf/">Docs</a></td>
      </tr>
      <tr>
        <td><a href="https://www.arrikto.com/get-started/">Arrikto MiniKF</a></td>
        <td>Arrikto</td>
        <td>AWS Marketplace, GCP Marketplace, Vagrant</td>
        <td>1.4</td>
        <td><a href="/docs/distributions/minikf/">Docs</a></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/gcp-blueprints">Google Cloud distribution of Kubeflow</a></td>
        <td>Google Cloud</td>
        <td>GKE</td>
        <td>1.4</td>
        <td><a href="/docs/distributions/gke/">Docs</a></td>
      </tr>
      <tr>
        <td><a href="https://charmed-kubeflow.io/docs">Kubeflow Charmed Operators</a></td>
        <td>Canonical</td>
        <td>Any Kubernetes</td>
        <td>1.3</td>
        <td><a href="/docs/distributions/charmed/">Docs</a></td>
      </tr>
      <tr>
        <td><a href="https://microk8s.io/docs/addon-kubeflow">MicroK8s Kubeflow Add-on</a></td>
        <td>Canonical</td>
        <td>MicroK8s</td>
        <td>1.3</td>
        <td><a href="/docs/distributions/microk8s/">Docs</a></td>
      </tr>
    </tbody>
  </table>
</div>

<a id="manifests"></a>
## Install the Kubeflow Manifests manually 

{{% alert color="warning" %}}
This method is for advanced users. The Kubeflow community will not support environment-specific issues. If you need support, please consider using a [packaged distribution](#packaged-distributions) of Kubeflow.
{{% /alert %}}

The <a href="https://github.com/kubeflow/community/tree/master/wg-manifests">Manifests Working Group</a> is responsible for aggregating the authoritative manifests of each official Kubeflow component.
While these manifests are intended to be the base of packaged distributions, advanced users may choose to install them directly by following the <a href="https://github.com/kubeflow/manifests#installation">instructions on the `kubeflow/manifests` repo</a>.

<b>There are a number of guides that cover deploying `kubeflow/manifests` onto specific platforms:</b>

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Guide</th>
        <th>Target Platform</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/docs/guides/deploying-manifests-on-aws/">Deploying Manifests on AWS</a></td>
        <td>Amazon Elastic Kubernetes Service (EKS)</td>
      </tr>
      <tr>
        <td><a href="/docs/guides/deploying-manifests-on-azure/">Deploying Manifests on Azure</a></td>
        <td>Azure Kubernetes Service (AKS)</td>
      </tr>
      <tr>
        <td><a href="/docs/guides/deploying-manifests-on-ibm-cloud/">Deploying Manifests on IBM Cloud</a></td>
        <td>IBM Cloud Kubernetes Service (IKS)</td>
      </tr>
      <tr>
        <td><a href="/docs/guides/deploying-manifests-on-nutanix-karbon/">Deploying Manifests on Nutanix Karbon</a></td>
        <td>Nutanix Karbon</td>
      </tr>
      <tr>
        <td><a href="/docs/guides/deploying-manifests-on-openshift/">Deploying Manifests on OpenShift</a></td>
        <td>OpenShift</td>
      </tr>
      <tr>
        <td><a href="/docs/guides/deploying-manifests-with-kubeflow-operator/">Deploying Manifests with Kubeflow Operator</a></td>
        <td>Any Kubernetes</td>
      </tr>
    </tbody>
  </table>
</div>


<a id="next-steps"></a>
## Next steps

* Review the Kubeflow <a href="/docs/components/">component documentation</a>
* Explore the <a href="/docs/components/pipelines/sdk/">Kubeflow Pipelines SDK</a>
