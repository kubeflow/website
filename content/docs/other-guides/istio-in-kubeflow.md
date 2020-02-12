+++
title = "Istio Usage in Kubeflow"
description = "Managing access to Kubeflow applications and resources via Istio"
weight = 50
+++

Kubeflow v0.6 onwards deploys Istio along with configuration to enable
end-to-end authentication and access control. This setup is the foundation
of multi-tenancy support in Kubeflow. A Kubeflow deployment without Istio is
not possible.

## A gentle introduction to Istio

Most modern applications are built using a distributed microservices
architecture. This ensures that each individual service is simple and has a
well defined responsibility. Complex systems and platforms are generally
built by combinging many such microservices. Each microservice defines its own
APIs and the services interact with each other using these APIs in order to
serve end-user requests.

The term *service mesh* is used to describe the network of microservices that
make up such applications and the interactions between them. As a service mesh
grows in size and complexity, it can become harder to understand and manage.
Its requirements can include discovery, load balancing, failure recovery,
metrics, and monitoring. A service mesh also often has more complex operational
requirements, like A/B testing, canary rollouts, rate limiting, access control,
and end-to-end authentication.

[Istio](https://istio.io/) is a pioneering and highly performant open source
implementation of service mesh by Google. For further details, you can read the
[conceptual overview](https://istio.io/docs/concepts/what-is-istio/) of Istio.

## Kubeflow needs Istio

Kubeflow is a collection of tools, frameworks and services that are deployed
together into a single Kubernetes cluster to enable end-to-end ML workflows.
Most of these components or services are developed independently and help with
different parts of the workflow. Developing a complete ML workflow or an ML
development environment requires combining multiple services and components.
Kubeflow provides the underlying infrastructure that makes it possible to put
such disparate components together.

Kubeflow uses Istio as a uniform way to secure, connect, and monitor microservices. Specifically:

 - Securing service-to-service communication in a Kubeflow deployment with
   strong identity-based authentication and authorization.
 - A policy layer for supporting access controls and quotas.
 - Automatic metrics, logs, and traces for traffic within the deployment
   including cluster ingress and egress.


## Istio in Kubeflow

The following diagram illustrates how user requests interact with services in
Kubeflow. It walks through the process when a user requests to create a new
notebook server via the Notebooks Servers UI accessible through the Kubeflow Central Dashboard.

<!-- Original drawing available from the team drive: 
https://drive.google.com/corp/drive/folders/1BMnjzP3nn1IRopdlts1LTHNQq9fU97s5?zx=8l1zliy05c11
-->
<img src="/docs/images/Istio-in-KF.svg" 
  alt="Select active profile "
  class="mt-3 mb-3 border border-info rounded">

  1. The user request is intercepted by an identification proxy which talks to
     a SSO service provider such as IAM on Cloud Services Provider or Active
     Directory/LDAP on-premises. 
  1. When the user is authenticated, the request is modified by the Istio
     Gateway to include a JWT Header token containing the identity of the user.
     All requests throughout the service mesh carry this token along.
  1. The Istio RBAC policies are applied on the incoming request to validate
     the access to the service and the requested namespace. If either of those
     are inaccessible to the user, an error response is sent back. 
  1. If the request is validated, it is forwarded to the appropriate controller
     (Notebooks Controller in this case).
  1. Notebooks Controller validate authorization with Kubernetes RBAC and create the
     notebook pod in the namespace user requested.

Further actions by the user with the notebook to create training jobs or other
resources in the namespace go through a similar process. Profiles Controller
manages the creation of profiles, creates and applies appropriate Istio
policies. For more details, please see [multi-user
overview](/docs/other-guides/multi-user-overview/).


## Deploying Kubeflow without Istio

Currently it is not possible to deploy Kubeflow without Istio. Kubeflow needs the Istio
Custom Resource Definitions (CRDs) to express the new route to access the
created Notebook from the Gateway. 
