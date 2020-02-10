+++
title = "Istio usage in Kubeflow"
description = "Managing access to Kubeflow applications and resources via Istio"
weight = 50
+++

{{% stable-status %}}


## A gentle introduction to Istio

Most modern applications are built using a distributed microservices
architecture. This ensures that each individual service is simple and has a
well defined responsibility. Complex systems and platforms are generally
built by composing many such microservices. Each microservice defines it's own
APIs and the services interact with each other using these APIs in order to
serve end-user requests.

The term *service mesh* is used to describe the network of microservices that
make up such applications and the interactions between them. As a service mesh
grows in size and complexity, it can become harder to understand and manage.
Its requirements can include discovery, load balancing, failure recovery,
metrics, and monitoring. A service mesh also often has more complex operational
requirements, like A/B testing, canary rollouts, rate limiting, access control,
and end-to-end authentication.

[Istio](https://istio.io/) is a pioneering and highly performant open-source
implementation of service mesh by Google. Please consider reading through the
[conceptual overview](https://istio.io/docs/concepts/what-is-istio/) of Istio
for further details.

## Kubeflow needs Istio

Kubeflow is a collection of tools, frameworks and services that are deployed
together into a single Kubernetes cluster to enable end-to-end ML workflows.
Most of these components or services are developed independently and help with
different parts of the workflow. Developing a complete ML Workflow or an ML
development environment requires combining multiple services and components.
Kubeflow provides the underlying infrastructure and middleware setup that makes
it possible to be able to put such disparate components together.

Kubeflow uses Istio as a uniform way to secure, connect, and monitor microservices. Specifically:

 - Securing service-to-service communication in a Kubeflow deployment with
   strong identity-based authentication and authorization.
 - A policy layer for supporting access controls and quotas.
 - Automatic metrics, logs, and traces for traffic within the deployment
   including cluster ingress and egress.


## Istio in Kubeflow


## Can Kubeflow be installed without Istio?

