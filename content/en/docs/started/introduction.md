+++
title = "Introduction"
description = "An introduction to Kubeflow"
weight = 1
+++

## What is Kubeflow

[Kubeflow](https://www.kubeflow.org/) is _the_ Cloud Native AI platform

Kubeflow is composed of modular, open source projects that form the Kubernetes-native stack
for data & AI workloads. Whether you are an AI practitioner, a platform administrator, or a
decision-maker, Kubeflow offers modular, scalable, and extensible tools to support your
data, AI/ML, and HPC use-cases.

## Kubeflow Mission

Kubeflow's mission is to bridge the Data, AI, and Cloud Native ecosystems. We enable teams to
deliver more models, agents, and AI applications into production with well-lit paths across
[the AI lifecycle](/docs/started/architecture/#kubeflow-landscape-in-the-ai-lifecycle). By bringing
together the skills and expertise of an open global community, our goal is to be the standard for
data & AI workloads on Kubernetes.

The Kubeflow Community and Subprojects embrace the following core principles:

- **Simple**: Run workloads at any scale without becoming a Kubernetes expert
- **Portable**: Use the same code on a local laptop, on-premises, or in any cloud
- **Scalable**: Manage hyperscale training jobs and high-throughput AI agents
- **Composable**: Mix and match tools across the AI lifecycle

## Kubeflow Subprojects

Kubeflow subprojects are designed to be usable both independently and as part of the
Kubeflow Distribution. This provides flexibility for users who may not need the full
end-to-end AI platform capabilities but want to leverage specific functionalities, such as
data processing, model training, or agentic workloads.

You can find list of Kubeflow subprojects in [the installation page](/docs/started/installing-kubeflow/#kubeflow-subprojects).

If you are interested to become Kubeflow subproject,
[this process guidelines](https://github.com/kubeflow/community/tree/master/subprojects).

## Kubeflow Ecosystem

Kubeflow has always fostered a strong community-driven culture and actively supports projects
that build on, integrate with, or complement Kubeflow subprojects. As part of this effort,
the Kubeflow community established the Kubeflow Ecosystem to highlight projects that are valuable
to the broader community and demonstrate maturity, sustainability, and excellence within their respective domains.

You can find the list of Kubeflow Ecosystem projects [in this page](/docs/ecosystem/).

If you are interested in joining the Kubeflow Ecosystem, please refer to
[this process guidelines](https://github.com/kubeflow/community/tree/master/ecosystem).

## Kubeflow Distribution

The Kubeflow Distribution is a vendor-provided and supported deployment of Kubeflow subprojects and
integrations designed to run on specific infrastructure or platform environments. Distributions may
include additional tooling, integrations, operational features, and commercial support tailored
to the vendor ecosystem.

The Kubeflow Distribution can be
installed via [Packaged Distributions](/docs/started/installing-kubeflow/#packaged-distributions)
or [Kubeflow Community Distribution](/docs/started/installing-kubeflow/#kubeflow-community-distribution).

### Kubeflow Community Distribution

Kubeflow Community Distribution (KCD) is community-maintained reference for deploying Kubeflow
subprojects and ecosystem integrations in a vendor neutral package.

The development of the KCD is directed by the neutral [Kubeflow Distribution Committee (KDC)](/docs/about/governance/#4-kubeflow-distribution-committee)
which is made up of representatives for each Kubeflow subproject and KCD maintainers.

## Kubeflow Video Introduction

Watch the following video which provides an introduction to Kubeflow.

{{< youtube id="cTZArDgbIWw" title="Introduction to Kubeflow">}}

## Kubeflow History

Kubeflow started as an open sourcing of the way Google ran [TensorFlow](https://www.tensorflow.org/)
internally, based on a pipeline called [TensorFlow Extended](https://www.tensorflow.org/tfx/).
It began as just a simpler way to run TensorFlow jobs on Kubernetes, but has since expanded to be
a foundation of tools for running AI workloads on Kubernetes.

The [Kubeflow logo represents](https://github.com/kubeflow/kubeflow/issues/187#issuecomment-375194419) the letters `K` and `F` inside the heptagon of the Kubernetes logo, which represent two communities: `Kubernetes` (cloud-native) and `flow` (Machine Learning). In this context, `flow` is not only indicating `TensorFlow`, but also all ML frameworks which make use of Dataflow Graph as the normal form for model/algorithm implementation.

## Kubeflow Community

Kubeflow is a community-led project maintained by the Kubeflow Working Groups under the guidance
of the Kubeflow Outreach Committee, Kubeflow Distribution Committee, and Kubeflow Steering Committee.

We encourage you to learn about the [Kubeflow Community](https://www.kubeflow.org/docs/about/community/)
and how to [contribute](https://www.kubeflow.org/docs/about/contributing/) to the project!

## Next Steps

- Follow [the installation guide](/docs/started/installing-kubeflow) to deploy Kubeflow subprojects or
  Kubeflow Community Distribution.
