+++
title = "Get Support"
description = "Where to get support for Kubeflow"
weight = 80
+++

This page describes the Kubeflow resources and support options available when you encounter a problem, have a question, or want to make a suggestion about Kubeflow.

<a id="application-status"></a>

## Component Status

Please make yourself familiar with the [structure of Kubeflow](https://www.kubeflow.org/docs/started/introduction/#what-is-kubeflow) first.
When you deploy Kubeflow to a Kubernetes cluster, your deployment includes multiple projects. Note that project versioning is independent from Kubeflow Platform version. Each project should meet certain [criteria](https://github.com/kubeflow/community/blob/master/guidelines/application_requirements.md) regarding stability, upgradability, logging, monitoring, and security (PodSecurityStandards restricted, network policies, and integration tests for authentication and authorization).

Component status indicators:

- **Stable**: The application complies with most of the criteria and is considered stable for this release.
- **Beta**: The application is progressing towards meeting most criteria.
- **Alpha**: The application is in an early development or integration stage.

<a id="levels-of-support"></a>

## Levels of Support

1. The Kubeflow community provides best-effort support for stable components.
2. You can also request commercial support from a company or freelancer listed below.

<a id="community-support"></a>

## Support from the Kubeflow community

Kubeflow has an active and helpful community of users and contributors.
The Kubeflow community provides support on a best-effort basis for stable and beta
applications. If you need commercial support, please check the sections below.

**Best-effort support** means that there's no formal agreement or
commitment to solve a problem but the community appreciates the
importance of addressing the problem as soon as possible. The community commits
to helping you diagnose and address the problem if all of the following requirements are satisfied:

- The cause falls within the technical framework that Kubeflow controls. For
  example, the Kubeflow community may not be able to help if the problem is
  caused by a specific network configuration within your organization.
- Community members can reproduce the problem.
- The reporter can assist with troubleshooting.

You can ask questions and make suggestions in the following places:

- **Slack** for online chat and messaging, see [Slack workspace and channels](/docs/about/community/#kubeflow-slack-channels).
- **GitHub discussions** per repository, e.g. [here](https://github.com/kubeflow/manifests/discussions)
- **Kubeflow discuss** for email-based group discussion. Join the
  [kubeflow-discuss](/docs/about/community/#kubeflow-mailing-list)
  group.
- **Kubeflow documentation** for overviews and how-to guides. In particular,
  refer to the following documents when troubleshooting a problem:

  - [Kubeflow installation and setup](/docs/started/installing-kubeflow/)
  - [Kubeflow components](/docs/components/)

- **Kubeflow issue trackers** for known issues, questions, and feature requests.
  Search the open issues to see if someone else has already logged the problem
  that you are encountering and learn about any workarounds. If no one
  has logged your problem, create a new issue to describe the problem.

  Each Kubeflow component has its own issue tracker within the [Kubeflow
  organization on GitHub](https://github.com/kubeflow). To get you started,
  here are the primary issue trackers:

  - [Kubeflow Spark Operator](https://github.com/kubeflow/spark-operator/issues)
  - [Kubeflow Pipelines](https://github.com/kubeflow/pipelines/issues)
  - [Kubeflow Katib](https://github.com/kubeflow/katib/issues)
  - [Kubeflow Trainer](https://github.com/kubeflow/trainer/issues)
  - [Kubeflow Notebooks](https://github.com/kubeflow/notebooks/issues)
  - [Kubeflow Model Registry](https://github.com/kubeflow/model-registry/issues)
  - [Kubeflow Dashboard](https://github.com/kubeflow/dashboard/issues)
  - [Kubeflow Kserve](https://github.com/kserve/kserve/issues)
  - [Kubeflow Platform / Manifests](https://github.com/kubeflow/manifests/issues)
  - [Kubeflow Website](https://github.com/kubeflow/website/issues)

<a id="provider-support"></a>

## Support from commercial providers in the Kubeflow Ecosystem

We want to promote commercial companies and idividuals that contribute back to the open source project.
Below is a table of organizations that contribute to Kubeflow and offer commercial support:

| Provider                     | Support Link                                                                                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aranui Solutions             | [Aranui Solutions](https://www.aranui.solutions/services)                                                                                                       |
| Canonical                    | [Ubuntu Kubeflow](https://ubuntu.com/kubeflow#get-in-touch)                                                                                                     |
| Freelancer Julius von Kohout | [LinkedIn](https://de.linkedin.com/in/juliusvonkohout/), [Slack](https://cloud-native.slack.com/team/U06LW431SJF), [GitHub](https://github.com/juliusvonkohout) |
| Red Hat                      | [Red Hat](https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-ai)                                                                        |
| Other Providers              | Please reach out to the Kubeflow Steering Committee with proof of significant contributions to the Kubeflow open source project                                 |

<a id="cloud-support"></a>
If you are using a managed offer from a cloud provider for Kubeflow, then the cloud
provider may be able to help you diagnose and solve a problem.

## Getting Involved

You can participate in Kubeflow by contributing funding, code, documentation, use cases or by joining community meetings. For more information, see the [Kubeflow Community page](/docs/about/community/).

## Stay Updated

Keep up with Kubeflow news:

- The [community page](https://www.kubeflow.org/docs/about/community/) with Slack channels, regular meetings and other guidelines.
- The [Kubeflow Blog](https://blog.kubeflow.org/) for release announcements, events, and tutorials.
- [Kubeflow on Twitter](https://twitter.com/kubeflow) for technical tips.
- Release notes for detailed updates on each Kubeflow application.
