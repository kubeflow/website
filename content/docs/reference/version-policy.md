+++
title = "Kubeflow Versioning Policies"
description = "Versioning policies and production-ready status of Kubeflow applications and other components"
weight = 05
+++

With the launch of Kubeflow v1.0, the Kubeflow community attributes 
*production-ready status* to those applications and deployment platforms that 
meet the required level of stability, supportability, and upgradability.

This page describes the Kubeflow versioning policies and provides a matrix
of Kubeflow applications and deployment platforms, indicating the
production-ready status of each application and platform.

## Kubeflow versioning and application status

Kubeflow version numbers are of the form **vX.Y.Z**, where **X** is the major 
version, **Y** is the minor version, and **Z** is the patch version. The
version policy follows the [Semantic Versioning](https://semver.org/) 
terminology.
The name **vX.Y.Z** refers to the version (git tag) of the kfctl release. If
included, the appendix **rcN**, where **N** is a number, indicates a 
*release candidate*, which is a pre-release version of an upcoming release.

Examples of Kubeflow version numbers:

* `v0.7.0`
* `v0.7.0-rc8`
* `v1.0.0`
* `v1.0.1`

When you deploy Kubeflow to a Kubernetes cluster, your deployment includes a
number of applications. As the deployer of Kubeflow, you can choose which of 
the applications you deploy to your production servers. *TODO: HOW DO THEY CHOOSE?*

Application versioning is independent of Kubeflow versioning. When an 
application moves to v1.0, the Kubeflow community will decide whether to include 
that application in the next release of Kubeflow v1.x (or v2.x, depending on
the upcoming release of Kubeflow).

Kubeflow v1.0 attributes production-ready status to those applications that meet 
certain
[specified criteria](https://github.com/kubeflow/community/blob/master/guidelines/application_requirements.md) 
in terms of stability, upgradability, and the provision of services such as 
logging and monitoring.

To discover the production-ready status of each application, 
see the [application version matrix](#application-versions) below.

<a id="application-versions"></a>
## Kubeflow application versions


TODO Include a matrix of Kubeflow versions and the related app versions. Include what will be beta versus 1.0 product-ready with Kubeflow v1.0.

<a id="platform-versions"></a>
## Kubeflow configurations and deployment platforms

Kubeflow v1.0 also offers a subset of configurations and deployment platforms
that are compatible with Kubeflow v1.0 and that the Kubeflow community considers
mature and stable enough to gain v1.0 status.

TODO Include the mapping of Kubeflow version to config/deployment processes.

## Support levels

The expectations for supportability and the types of support available depend
on the production-ready status of each application or deployment platform.
For more information, see the support details page (*LINK COMING SOON*).
