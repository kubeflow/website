+++
title = "Get Support"
description = "Where to get support for Kubeflow"
weight = 80
+++

This page describes the Kubeflow resources and support options available when you encounter a problem, have a question, or want to make a suggestion about Kubeflow.

<a id="application-status"></a>
## Component Status

When you deploy Kubeflow to a Kubernetes cluster, your deployment includes multiple components. Note that component versioning is independent from Kubeflow versioning. Each component should meet certain criteria regarding stability, upgradability, logging, monitoring, and security (such as adherence to PodSecurity standards, network policies, and integration tests for authentication and authorization).

Application status indicators for Kubeflow:

* **Stable**: The application complies with most of the criteria and is considered stable for this release.
* **Beta**: The application is progressing toward meeting all criteria.
* **Alpha**: The application is in early development or integration stages.

<a id="levels-of-support"></a>
## Levels of Support

The following table describes the level of support that you can expect based on the status of an application:

The Kubeflow community offers best-effort support for stable components. See the section on community support below for a definition of best-effort support and the community channels where you can report and discuss the problem. You can also consider requesting  support from a commercial company or freelancer listed below.

<a id="community-support"></a>
## Support from the Kubeflow community

Kubeflow has an active and helpful community of users and contributors. 
The Kubeflow community offers support on a best-effort basis for stable and beta
applications. If you need commercial support, please check the sections below.
**Best-effort support** means that there's no formal agreement or
commitment to solve a problem but the community appreciates the
importance of addressing the problem as soon as possible. The community commits
to helping you diagnose and address the problem if all of the following requirements are satisfied:

* The cause falls within the technical framework that Kubeflow controls. For
  example, the Kubeflow community may not be able to help if the problem is 
  caused by a specific network configuration within your organization.
* Community members can reproduce the problem.
* The reporter can assist with troubleshooting.

You can ask questions and make suggestions in the following places:

* **Slack** for online chat and messaging, see [Slack workspace and channels](/docs/about/community/#kubeflow-slack-channels).
* **Github discussions** TODO
* **Kubeflow discuss** for email-based group discussion. Join the
  [kubeflow-discuss](/docs/about/community/#kubeflow-mailing-list)
  group.
* **Kubeflow documentation** for overviews and how-to guides. In particular,
  refer to the following documents when troubleshooting a problem:

  * [Kubeflow installation and setup](/docs/started/installing-kubeflow/)
  * [Kubeflow components](/docs/components/)

* **Kubeflow issue trackers** for known issues, questions, and feature requests.
  Search the open issues to see if someone else has already logged the problem 
  that you're encountering and learn about any workarounds to date. If no one
  has logged your problem, create a new issue to describe the problem.

    Each Kubeflow application has its own issue tracker within the [Kubeflow
    organization on GitHub](https://github.com/kubeflow). To get you started,
    here are the primary issue trackers:

  * [Kubeflow Pipelines](https://github.com/kubeflow/pipelines/issues)
  * [Katib AutoML](https://github.com/kubeflow/katib/issues)
  * [Trainer](https://github.com/kubeflow/training-operator/issues)
  * [Notebooks](https://github.com/kubeflow/notebooks/issues)
  * [Dashboard](https://github.com/kubeflow/dashboard/issues)
  * [Kserve](https://github.com/kserve/kserve/issues)
  * [Platform / Manifests](https://github.com/kubeflow/manifests/issues)
  * [Examples](https://github.com/kubeflow/examples/issues)
  * [Website](https://github.com/kubeflow/website/issues)

<a id="provider-support"></a>
## Support from commercial providers in the Kubeflow Ecosystem

Below is a table of organizations that contribute to Kubeflow and offer commercial support:

| Provider               | Support Link                                                   |
|------------------------|----------------------------------------------------------------|
| Canonical              | [Ubuntu Kubeflow](https://ubuntu.com/kubeflow#get-in-touch)    |
| Aranui Solutions       | [Aranui Solutions](https://...)                                |
| Freelance/Consulting   | Julius von Kohout on the Slack channel                         |
| Red Hat                | [Red Hat](https://...)                                         |
| Other Providers        | ...                                                            |

<a id="cloud-support"></a>
If you are using the a managed offer from a cloud provider for Kubeflow, then the cloud
provider may be able to help you diagnose and solve a problem.

## Getting Involved

You can participate in Kubeflow by contributing code, documentation, or by joining community meetings. For more information, see the [Kubeflow Community page](/docs/about/community/).

## Stay Updated

Keep up with Kubeflow news:
* The [Kubeflow Blog](https://blog.kubeflow.org/) for release announcements, events, and tutorials.
* [Kubeflow on Twitter](https://twitter.com/kubeflow) for technical tips.
* Release notes for detailed updates on each Kubeflow application.  
