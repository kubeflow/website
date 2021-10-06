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
        <th>Name</th>
        <th>Maintainer</th>
        <th>Platform</th>
        <th>Version</th>
        <th>Docs</th>
        <th>Website</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Kubeflow on AWS</td>
        <td>Amazon Web Services (AWS)</td>
        <td>Amazon Elastic Kubernetes Service (EKS)</td>
        <td>1.2</td>
        <td><a href="/docs/distributions/aws/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Kubeflow on Azure</td>
        <td>Microsoft Azure</td>
        <td>Azure Kubernetes Service (AKS)</td>
        <td>1.2</td>
        <td><a href="/docs/distributions/azure/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Kubeflow on Google Cloud</td>
        <td>Google Cloud</td>
        <td>Google Kubernetes Engine (GKE)</td>
        <td>1.3</td>
        <td><a href="/docs/distributions/gke/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Kubeflow on IBM Cloud</td>
        <td>IBM Cloud</td>
        <td>IBM Cloud Kubernetes Service (IKS) </td>
        <td>1.3</td>
        <td><a href="/docs/distributions/ibm/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Kubeflow on Nutanix</td>
        <td>Nutanix</td>
        <td>Nutanix Karbon</td>
        <td>1.4</td>
        <td><a href="/docs/distributions/nutanix/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Kubeflow on OpenShift</td>
        <td>IBM Cloud</td>
        <td>OpenShift</td>
        <td>1.3</td>
        <td><a href="/docs/distributions/openshift/">Docs</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Argoflow</td>
        <td>Argoflow Community</td>
        <td>Conformant Kubernetes</td>
        <td>1.3</td>
        <td>N/A</td>
        <td><a href="https://github.com/argoflow/argoflow">External Website</a></td>
      </tr>
      <tr>
        <td>Arrikto MiniKF</td>
        <td>Arrikto</td>
        <td>AWS Marketplace, GCP Marketplace, Vagrant</td>
        <td>1.3</td>
        <td><a href="/docs/distributions/minikf/">Docs</a></td>
        <td><a href="https://www.arrikto.com/get-started/">External Website</a></td>
      </tr>
      <tr>
        <td>Arrikto Enterprise Kubeflow</td>
        <td>Arrikto</td>
        <td>EKS, 
            AKS,
            GKE 
        </td>
        <td>1.3</td>
        <td>
          <a href="/docs/distributions/ekf/">Docs</a>
        </td>
        <td>
          <a href="https://www.arrikto.com/enterprise-kubeflow/">External Website</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Charmed Operators</td>
        <td>Canonical</td>
        <td>Conformant Kubernetes</td>
        <td>1.3</td>
        <td><a href="/docs/distributions/charmed/">Docs</a></td>
        <td><a href="https://charmed-kubeflow.io/docs">External Website</a></td>
      </tr>
      <tr>
        <td>MicroK8s Kubeflow Add-on</td>
        <td>Canonical</td>
        <td>MicroK8s</td>
        <td>1.3</td>
        <td><a href="/docs/distributions/microk8s/">Docs</a></td>
        <td><a href="https://microk8s.io/docs/addon-kubeflow">External Website</a></td>
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
While these manifests are intended to be the base of packaged distributions, advanced users may choose to install them directly by following <a href="https://github.com/kubeflow/manifests#installation">these instructions</a>.

<a id="next-steps"></a>
## Next steps

* Review the Kubeflow <a href="/docs/components/">component documentation</a>
* Explore the <a href="/docs/components/pipelines/sdk/">Kubeflow Pipelines SDK</a>
