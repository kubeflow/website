+++
title = "Installing Kubeflow"
description = "Overview of options for installing Kubeflow"
weight = 20

+++

<a id="introduction"></a>
## Introduction
Kubeflow is a platform and set of components for Machine Learning (ML) built on Kubernetes. Kubeflow supports ML workflows from data preparation through training and deployment. It enables a scalable pipeline structure that helps ensure containerized steps with defined dependencies. Kubeflow extends Kubernetes’ ability to run independent and configurable systems with a curated set of compatible tools and frameworks specific for ML. 

There are two options for getting up and running with Kubeflow. You may either install Kubeflow on your own or use one of many Kubeflow distributions.

## Install Kubeflow on Your Own
The Kubeflow Manifests working group maintains up-to-date manifests for each official Kubeflow component and enables you to install all components or customize an installation to include just the components you need. To install Kubeflow, see the Kubeflow Manifists Working Group's [installation instructions](https://github.com/kubeflow/manifests#installation).

## Use a Kubeflow Distribution 
Pre-packaged Kubeflow distributions are available on a number of platforms. See the table below for a list of options and links to documentation.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Documentation</th>
        <th>Maintainer</th>
        <th>Deployment Target</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/docs/distributions/aws/">Kubeflow on AWS</a></td>
        <td>AWS</td>
        <td>EKS clusters</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/azure/">Kubeflow on Azure</a></td>
        <td>Azure</td>
        <td>AKS clusters</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/gke/">Kubeflow on GCP</a></td>
        <td>GCP</td>
        <td>GKE clusters</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/ibm/">Kubeflow on IBM Cloud</a></td>
        <td>IBM Cloud</td>
        <td>IKS clusters</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/openshift/">Kubeflow on Openshift</a></td>
        <td>IBM Cloud</td>
        <td>Openshift clusters</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/microk8s/">MicroK8S Kubeflow add-on</a></td>
        <td>Canonical</td>
        <td>MicroK8S clusters</td>
      </tr>
      <tr>
        <td><a href="https://github.com/argoflow/argoflow">Argoflow</a></td>
        <td>Argoflow Committers</td>
        <td>Any K8S cluster with Argo CD</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/charmed/">Kubeflow Charmed Operators</a></td>
        <td>Canonical</td>
        <td>Any K8S cluster with Juju</td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/minikf/">MiniKF</a></td>
        <td>Arrikto</td>
        <td>AWS Marketplace, 
            GCP Marketplace, 
            Vagrant
        </td>
      </tr>
      <tr>
        <td><a href="/docs/distributions/minikf/">Enterprise Kubeflow</a></td>
        <td>Arrikto</td>
        <td>AWS EKS clusters, 
            GCP GKE clusters,
            Azure AKS clusters
        </td>
      </tr>
    </tbody>
  </table>
</div>

<a id="next-steps"></a>
## Next steps

* Review the [Kubeflow component documentation](/docs/components/)
* Explore the [Kubeflow Pipelines SDK](/docs/components/pipelines/sdk/)