+++
title = "Introduction"
description = "An introduction to Kubeflow"
weight = 1
+++

## What is Kubeflow

[Kubeflow](https://www.kubeflow.org/) is the foundation of tools for AI Platforms on Kubernetes.

AI platform teams can build on top of Kubeflow by using each subproject independently or deploying the
entire Kubeflow Community Distribution to meet their specific needs. The Kubeflow Community Distribution
is composable, modular, portable, and scalable, backed by an ecosystem of Kubernetes-native
projects that cover every stage of the [AI lifecycle](https://www.kubeflow.org/docs/started/architecture/#kubeflow-landscape-in-the-ai-lifecycle).

Whether you’re an AI practitioner, a platform administrator, or a team of developers, Kubeflow
offers modular, scalable, and extensible tools to support your AI use cases.

## Kubeflow Subprojects

Kubeflow is composed of multiple open source projects that address different aspects
of the AI lifecycle. These projects are designed to be usable both independently and as part of the
Kubeflow Distribution. This provides flexibility for users who may not need the full
end-to-end AI platform capabilities but want to leverage specific functionalities, such as model
training or model serving.

You can find list of Kubeflow subprojects in [the installation page](/docs/started/installing-kubeflow/#kubeflow-subprojects).

If you are interested to become Kubeflow subproject,
[this process guidelines](https://github.com/kubeflow/community/tree/master/subprojects).

## Kubeflow Ecosystem

Kubeflow has always fostered a strong community-driven culture and actively supports projects
that build on, integrate with, or complement Kubeflow sub-projects. As part of this effort,
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

## The Kubeflow Mission

Our goal is to make scaling AI models and deploying them to
production as simple as possible, by letting Kubernetes do what it's great at:

- Easy, repeatable, portable deployments on a diverse infrastructure
  (for example, experimenting on a laptop, then moving to an on-premises
  cluster or to the cloud).
- Deploying and managing loosely-coupled microservices.
- Scaling based on demand.

Because AI practitioners use a diverse set of tools, one of the key goals is to
customize the stack based on user requirements (within reason) and let the
system take care of the "boring stuff". While we have started with a narrow set
of technologies, we are working with many different projects to include
additional tooling.

Ultimately, we want to have a set of simple manifests that give you an easy to
use AI stack _anywhere_ Kubernetes is already running, and that can self
configure based on the cluster it deploys into.

## History

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
