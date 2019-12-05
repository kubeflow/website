+++
title = "Kubeflow Versioning Policies"
description = "Versioning policies and status of Kubeflow applications and other components"
weight = 05
+++

This page describes the Kubeflow versioning policies and provides a version 
matrix for Kubeflow applications and other components.

## Kubeflow versioning

Kubeflow version numbers are of the form **vX.Y.Z**, where **X** is the major 
version, **Y** is the minor version, and **Z** is the patch version. The
versioning policy follows the [Semantic Versioning](https://semver.org/) 
terminology.

The version name **vX.Y.Z** refers to the version (git tag) of the 
[kfctl release](https://github.com/kubeflow/kubeflow/releases). 
If the version number includes an appendix **-rcN**, where **N** is a
number, the appendix indicates a *release candidate*, which is a pre-release 
version of an upcoming release.

Examples of Kubeflow version numbers:

* `v0.7.0`
* `v0.7.0-rc8`
* `v1.0.0`
* `v1.0.1`

<a id="app-versioning"></a>
## Application versioning and stable status

Starting from the release of Kubeflow v1.0, the Kubeflow community 
attributes *stable status* to those applications and components that 
meet a defined level of stability, supportability, and upgradability.

When you deploy Kubeflow to a Kubernetes cluster, your deployment includes a
number of applications. Application versioning is independent of Kubeflow 
versioning. An application moves to version 1.0 when the application meets 
certain 
[criteria](https://github.com/kubeflow/community/blob/master/guidelines/application_requirements.md) 
in terms of stability, upgradability, and the provision of services such as 
logging and monitoring. 

When an application moves to version 1.0, the Kubeflow community will 
decide whether to mark that version of the application as *stable* in the next 
major or minor release of Kubeflow.

<a id="application-matrix"></a>
## Kubeflow application matrix

The following table shows the **status** (stable, beta, or experimental) of the 
applications that you can deploy to your Kubernetes cluster when you deploy 
Kubeflow. The applications are specified in the 
[manifest](https://github.com/kubeflow/manifests/tree/master/kfdef) that you 
use to deploy Kubeflow. The kfctl deployment tool deploys the applications 
strictly according to the manifest. kfctl does not decide whether to deploy or
not deploy an application based on the application status.

You can use the information below to decide which of the applications you should
deploy to your production system, and adjust the manifest accordingly.

Application status indicators for Kubeflow:

* **Stable** means that the application complies with the 
  [criteria](https://github.com/kubeflow/community/blob/master/guidelines/application_requirements.md)
  to reach application version 1.0, and that the Kubeflow community has deemed 
  the application stable for this release of Kubeflow.
* **Beta** means that the application is working towards a version 1.0 release
  and its maintainers have communicated a timeline for satisfying the criteria
  for the stable status.
* **Experimental** means that the application is in the early phases of 
  development and/or integration into Kubeflow.

The **application version** in the table reflects the application version in
the manifest at the time when Kubeflow {{% kf-latest-version %}} was
released. This is therefore the default version of the application that you
receive when you deploy Kubeflow {{% kf-latest-version %}}. Some applications 
may release later versions that you can choose to install into your Kubeflow
deployment. If you need a later version of a specific application, refer to the
documentation for that application.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Application</th>
        <th>Status in Kubeflow {{% kf-latest-version %}}</th>
        <th>Application version in Kubeflow {{% kf-latest-version %}}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/centraldashboard">Central 
        dashboard - Kubeflow UI</a> (<a href="/docs/other-guides/accessing-uis/">docs</a>)</td>
        <td>Stable</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/chainer-operator">Chainer 
        operator</a> (<a href="/docs/components/training/chainer/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/katib">Hyperparameter tuning
        - Katib</a> 
          (<a href="/docs/components/hyperparameter-tuning/hyperparameter/">docs</a>)</td>
        <td>Beta</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kfserving">KFServing</a>
          (<a href="/docs/components/serving/kfserving/">docs</a>)</td>
        <td>Beta</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/metadata">Metadata</a>
          (<a href="/docs/components/misc/metadata//">docs</a>)</td>
        <td>Beta</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/mpi-operator">MPI operator</a>
          (<a href="/docs/components/training/mpi/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/mxnet-operator">MXNet operator</a>
          (<a href="/docs/components/training/mxnet/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/jupyter-web-app">Notebook 
        web app</a> (<a href="/docs/notebooks/">docs</a>)</td>
        <td>Stable</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/notebook-controller">Notebook
        controller</a> (<a href="/docs/notebooks/">docs</a>)</td>
        <td>Stable</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/pipelines">Pipelines</a>
          (<a href="/docs/pipelines/pipelines-quickstart/">docs</a>)</td>
        <td>Beta</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/profile-controller">Profile 
        Controller for multi-user isolation</a> (<a href="/docs/other-guides/multi-user-overview/">docs</a>)</td>
        <td>Stable</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/pytorch-operator">PyTorch operator</a> (<a href="/docs/components/training/pytorch/">docs</a>)</td>
        <td>Stable</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td>PyTorch serving 
          (<a href="/docs/components/serving/pytorchserving/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/batch-predict">TensorFlow 
          batch prediction</a>
          (<a href="/docs/components/serving/tfbatchpredict/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td>TensorFlow serving (<a href="/docs/components/serving/tfserving_new/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/tf-operator">TFJob operator</a>
          (<a href="/docs/components/training/tftraining/">docs</a>)</td>
        <td>Stable</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/xgboost-operator">XGBoost operator</a></td>
        <td>Experimental</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

<a id="sdk-matrix"></a>
## Kubeflow SDKs and CLIs

Alongside Kubeflow {{% kf-latest-version %}}, you may want to use 
one of the following Kubeflow SDKs and command-line interfaces 
(CLIs).

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>SDK / CLI</th>
        <th>Status with Kubeflow {{% kf-latest-version %}}</th>
        <th>SDK/CLI version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/kubeflow/fairing">Fairing</a> (<a href="/docs/fairing/reference/">docs</a>)</td>
        <td>Beta</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kfctl">kfctl</a> (<a href="/docs/other-guides/kustomize/">docs</a>)</td>
        <td>Stable</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://kubeflow-pipelines.readthedocs.io/en/latest/">Kubeflow Pipelines SDK</a> (<a href="/docs/pipelines/sdk/">docs</a>)</td>
        <td>Beta</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

## Support levels

The expectations for supportability and the types of support available depend
on the stable status of each application or other component.
For more information, see the support details page.
