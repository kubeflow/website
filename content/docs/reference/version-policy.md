+++
title = "Kubeflow Versioning Policies"
description = "Versioning policies and production-ready status of Kubeflow applications and other components"
weight = 05
+++

With the launch of Kubeflow v1.0, the Kubeflow community attributes 
*production-ready status* to those applications and deployment platforms that 
meet a defined level of stability, supportability, and upgradability.

This page describes the Kubeflow versioning policies and provides a version matrix for Kubeflow applications and deployment platforms.

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
## Application versioning and production-ready status

When you deploy Kubeflow to a Kubernetes cluster, your deployment includes a
number of applications. Application versioning is independent of Kubeflow 
versioning. An application moves to version **1.0** when the application meets 
certain 
[criteria](https://github.com/kubeflow/community/blob/master/guidelines/application_requirements.md) 
in terms of stability, upgradability, and the provision of services such as 
logging and monitoring. 

An application version number of 1.0 or greater indicates that the Kubeflow 
community attributes **production-ready** status to the application.

When an application moves to version 1.0, the Kubeflow community will decide 
whether to include that version of the application in the next major or minor
release of Kubeflow.

<a id="application-matrix"></a>
## Kubeflow v1.0 application matrix

The following table shows the production-ready status of the applications that
may be deployed to your Kubernetes cluster when you deploy Kubeflow. 
The applications are specified in the 
[manifest](https://github.com/kubeflow/manifests/tree/master/kfdef) that you 
use to deploy Kubeflow. You can use the information below to decide which of 
the applications you should deploy to your production system.

* **Production-ready** means that the application has reached application 
  version 1.0 or later, and complies with the criteria defined <a href="#app-versioning">above</a> to reach version 1.0.
* **Beta** means that the application is working towards a version 1.0 release
  and is expected to meet the criteria soon.
* **Alpha** means that the application is in the early phases of development
  and/or integration into Kubeflow.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Application</th>
        <th>Production readiness in Kubeflow v1.0</th>
        <th>App version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/centraldashboard">Central 
        dashboard (Kubeflow UI)</a> (<a href="/docs/other-guides/accessing-uis/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/jupyter-web-app">Notebook 
        web app</a> (<a href="/docs/notebooks/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/notebook-controller">Notebook
        controller</a> (<a href="/docs/notebooks/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/katib">Katib</a> 
          (<a href="/docs/components/hyperparameter-tuning/hyperparameter/">docs</a>)</td>
        <td>Beta</td>
        <td>TODO</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kfserving">KFServing</a>
          (<a href="/docs/components/serving/kfserving/">docs</a>)</td>
        <td>Beta</td>
        <td>TODO</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/pipelines">Pipelines</a>
          (<a href="/docs/pipelines/pipelines-quickstart/">docs</a>)</td>
        <td>Beta</td>
        <td>TODO</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/profile-controller">Profile 
        Controller</a> (<a href="/docs/other-guides/multi-user-overview/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/tf-operator">TFJob</a>
          (<a href="/docs/components/training/tftraining/">docs</a>)</td>
        <td>Production-ready</td>
        <td>2.0</td>
      </tr>
    </tbody>
  </table>
</div>

<a id="platform-matrix"></a>
## Kubeflow v1.0 configurations and deployment platforms

Kubeflow v1.0 also offers a subset of configurations and deployment platforms
that are compatible with Kubeflow v1.0 and that the Kubeflow community considers
mature and stable enough to gain v1.0 status.

TODO Include the mapping of Kubeflow version to config/deployment processes.

## Support levels

The expectations for supportability and the types of support available depend
on the production-ready status of each application or deployment platform.
For more information, see the support details page (*TODO: LINK COMING SOON*).
