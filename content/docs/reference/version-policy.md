+++
title = "Kubeflow Versioning Policies"
description = "Versioning policies and production-ready status of Kubeflow applications and other components"
weight = 05
+++

With the launch of Kubeflow v1.0, the Kubeflow community attributes 
*production-ready status* to those applications and deployment platforms that 
meet the required level of stability, supportability, and upgradability.

This page describes the Kubeflow versioning policies and provides a version matrix for Kubeflow applications and deployment platforms.

## Kubeflow versioning

Kubeflow version numbers are of the form **vX.Y.Z**, where **X** is the major 
version, **Y** is the minor version, and **Z** is the patch version. The
version policy follows the [Semantic Versioning](https://semver.org/) 
terminology.

The version name **vX.Y.Z** refers to the version (git tag) of the 
[kfctl release](https://github.com/kubeflow/kubeflow/releases). 
If the version number includes an appendix **rcN**, where **N** is a
number, the appendix indicates a *release candidate*, which is a pre-release 
version of an upcoming release.

Examples of Kubeflow version numbers:

* `v0.7.0`
* `v0.7.0-rc8`
* `v1.0.0`
* `v1.0.1`

## Application versioning

When you deploy Kubeflow to a Kubernetes cluster, your deployment includes a
number of applications. Application versioning is independent of Kubeflow 
versioning. An application moves to version **1.0** when the application meets 
certain 
[criteria](https://github.com/kubeflow/community/blob/master/guidelines/application_requirements.md) 
in terms of stability, upgradability, and the provision of services such as 
logging and monitoring. An application version number of 1.0 or greater 
indicates that the Kubeflow community attributes production-ready status to the 
application.

When an application moves to version 1.0, the Kubeflow community will decide 
whether to include that version of the application in the next major or minor
release of Kubeflow.

<a id="application-versions"></a>
## Version matrix for Kubeflow applications

The following table shows the version of the applications that
are deployed to your Kubernetes cluster when you deploy Kubeflow. You can use
this information to decide which of the applications you should deploy to
your production servers.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Application</th>
        <th>Version in Kubeflow v1.0</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Central Dashboard (Kubeflow UI)</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td>Jupyter UI</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td>Notebook Controller</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td>Profile Controller</td>
        <td>1.0</td>
      </tr>
    </tbody>
  </table>
</div>

<a id="platform-versions"></a>
## Version matrix for Kubeflow configurations and deployment platforms

Kubeflow v1.0 also offers a subset of configurations and deployment platforms
that are compatible with Kubeflow v1.0 and that the Kubeflow community considers
mature and stable enough to gain v1.0 status.

TODO Include the mapping of Kubeflow version to config/deployment processes.

## Support levels

The expectations for supportability and the types of support available depend
on the production-ready status of each application or deployment platform.
For more information, see the support details page (*LINK COMING SOON*).
