+++
title = "Installing Kubeflow"
description = "Overview of installation choices for Kubeflow"
weight = 20

+++

<a id="introduction"></a>
## Introduction

... short discussion about Kubeflow being a "Kubernetes" platform, with multiple components (not an "app"), 
... link to kubeflow-overview for more details
... (TODO) add a link to "Reference"/"Kubeflow Versioning Policies" in overview docs

... short discussion about how Kubeflow is versioned, 
... that is, components in Kubeflow can maintain their own versions, independent of the project-wide versions (like 1.2, 1.3)

<a id="roll-your-own"></a>
## Path 1: roll your own

... disclaimer that any environment-specific issues are not supported by the Kubeflow community (use a distribution if you want support)

... small discussion of the purpose/function of the kubeflow/manifests repo, 
... that is, to mirror upstream manifests, and act as a central repository containing the "authoritative" manifests for each kubeflow release, to be used by distributions

... link to kubeflow/manifests readme containing the "roll your own" instructions

<a id="use-a-distribution"></a>
## Path 2: use a distribution

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Distribution</th>
        <th>Maintainers</th>
        <th>Deployment Target</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/docs/distributions/aws/">Kubeflow on AWS</a></td>
        <td><a href="https://aws.amazon.com/">AWS</a></td>
        <td><a href="https://aws.amazon.com/eks/">EKS</a> clusters</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/azure/">Kubeflow on Azure</a></td>
        <td><a href="https://azure.microsoft.com/">Azure</a></td>
        <td><a href="https://docs.microsoft.com/azure/aks/">AKS</a> clusters</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/gke/">Kubeflow on GCP</a></td>
        <td><a href="https://cloud.google.com/">GCP</a></td>
        <td><a href="https://cloud.google.com/kubernetes-engine">GKE</a> clusters</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/ibm/">Kubeflow on IBM Cloud</a></td>
        <td><a href="https://www.ibm.com/cloud/">IBM Cloud</a></td>
        <td><a href="https://www.ibm.com/cloud/kubernetes-service">IKS</a> clusters</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/openshift/">Kubeflow on Openshift</a></td>
        <td><a href="https://www.ibm.com/cloud/">IBM Cloud</a></td>
        <td><a href="https://www.openshift.com/">Openshift</a> clusters</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/microk8s/">Kubeflow on MicroK8S</a></td>
        <td><a href="https://canonical.com/">Canonical</a></td>
        <td><a href="https://microk8s.io/">MicroK8S</a> clusters</td>
      </tr>
      <tr>
        <td><a href="https://github.com/argoflow/argoflow">Argoflow</a></td>
        <td>Argoflow Committers</td>
        <td>Any K8S cluster with <a href="https://github.com/argoproj/argo-cd/">Argo CD</a></td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/charmed/">Charmed Operators</a></td>
        <td><a href="https://canonical.com/">Canonical</a></td>
        <td>Any K8S cluster with <a href="https://juju.is/docs/kubernetes">Juju</a></td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/minikf/">MiniKF</a></td>
        <td><a href="https://www.arrikto.com/">Arrikto</a></td>
        <td><a href="https://aws.amazon.com/marketplace/pp/B08MBGH311">AWS Marketplace</a>, 
            <a href="https://console.cloud.google.com/marketplace/product/arrikto-public/minikf">GCP Marketplace</a>, 
            <a href="https://www.vagrantup.com/">Vagrant</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<a id="next-steps"></a>
## Next steps

* Review the [Kubeflow component documentation](/docs/components/)
* Explore the [Kubeflow Pipelines SDK](/docs/components/pipelines/sdk/)
