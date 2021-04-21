+++
title = "Installing Kubeflow"
description = "Overview of installation choices for Kubeflow"
weight = 20

+++

<a id="introduction"></a>
## Introduction

> TEXT TO WRITE:
> 
> * talk about Kubeflow being a "Kubernetes" platform, with multiple components (not an "app")
>    * link to kubeflow-overview for more details
>    * (TODO) add a link to "Reference"/"Kubeflow Versioning Policies" in overview docs
> * short discussion about how Kubeflow is versioned, 
>    * components in Kubeflow can maintain their own versions, independent of the project-wide versions (like 1.2, 1.3)
> 
> * short discussion about the two "paths" for installing kubeflow "XXXXX" and "YYYYY"

<a id="packaged-distributions"></a>
## Packaged distributions

> TEXT TO WRITE:
> 
> * distributions are separate from the kubeflow community
>    * none are currently endorsed or certified
>    * please reach out to the maintainers to get support
> * the method for installing can vary from distribution to distribution, please consult the docs for your chosen distribution    

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Name</th>
        <th>Maintainers</th></th>
        <th>Platforms</th>
        <th>Links</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Kubeflow on AWS</td>
        <td>AWS</td>
        <td>Amazon Elastic Kubernetes Service (EKS)</td>
        <td><a href="/docs/distributions/aws/">Docs</a></td>
      </tr>
      <tr>
        <td>Kubeflow on Azure</td>
        <td>Azure</td>
        <td>Azure Kubernetes Service (AKS)</td>
        <td><a href="/docs/distributions/azure/">Docs</a></td>
      </tr>
      <tr>
        <td>Kubeflow on GCP</td>
        <td>Google Cloud</td>
        <td>Google Kubernetes Engine (GKE)</td>
        <td><a href="/docs/distributions/gke/">Docs</a></td>
      </tr>
      <tr>
        <td>Kubeflow on IBM Cloud</td>
        <td>IBM Cloud</td>
        <td>IBM Cloud Kubernetes Service</td>
        <td><a href="/docs/distributions/ibm/">Docs</a></td>
      </tr>
      <tr>
        <td>Kubeflow on Openshift</td>
        <td>IBM Cloud</td>
        <td>Openshift</td>
        <td><a href="/docs/distributions/openshift/">Docs</a></td>
      </tr>
      <tr>
        <td>Argoflow</td>
        <td>Argoflow Community</td>
        <td>Conformant Kubernetes</td>
        <td><a href="https://github.com/argoflow/argoflow">GitHub Repo</a></td>
      </tr>
      <tr>
        <td>Charmed Kubeflow</td>
        <td>Canonical</td>
        <td>Conformant Kubernetes</td>
        <td><a href="https://charmed-kubeflow.io/docs">Docs</a></td>
      </tr>
      <tr>
        <td>MicroK8s Kubeflow add-on</td>
        <td>Canonical</td>
        <td>MicroK8S</td>
        <td><a href="https://microk8s.io/docs/addon-kubeflow">Docs</a></td>
      </tr>
      <tr>
        <td>MiniKF</td>
        <td>Arrikto</td>
        <td>Cloud Marketplaces, Vagrant</td>
        <td><a href="/docs/distributions/minikf/">Docs</a>, 
            <a href="https://aws.amazon.com/marketplace/pp/B08MBGH311">AWS Marketplace</a>, 
            <a href="https://console.cloud.google.com/marketplace/product/arrikto-public/minikf">GCP Marketplace</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<a id="directly-use-the-manifests"></a>
## Directly use the manifests

> TEXT TO WRITE:
> 
> * disclaimer that any environment-specific issues are not supported by the Kubeflow community (use a distribution if you want support)
> * discuss purpose/function of the kubeflow/manifests repo
>   * that is, to mirror upstream manifests, and act as a central repository containing the "authoritative" manifests for each kubeflow release, to be used by distributions
> link to kubeflow/manifests readme containing the "roll your own" instructions

Please review the documentation on the [kubeflow/manifests](https://github.com/kubeflow/manifests) repo.

<a id="next-steps"></a>
## Next steps

* Review the [Kubeflow component documentation](/docs/components/)
* Explore the [Kubeflow Pipelines SDK](/docs/components/pipelines/sdk/)
