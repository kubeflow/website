+++
title = "Component"
description = "Conceptual overview of components in Kubeflow Pipelines"
weight = 20
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


A *pipeline component* is self-contained set of code that performs one step in
the ML workflow (pipeline), such as data preprocessing, data transformation,
model training, and so on. A component is analogous to a function, in that it
has a name, parameters, return values, and a body.

## Component code

The code for each component includes the following:

* **Client code:** The code that talks to endpoints to submit jobs. For example, 
  code to talk to the Google Dataproc API to submit a Spark job.

* **Runtime code:** The code that does the actual job and usually runs in the 
  cluster. For example, Spark code that transforms raw data into preprocessed 
  data.

Note the naming convention for client code and runtime code&mdash;for a task 
named "mytask":

* The `mytask.py` program contains the client code.
* The `mytask` directory contains all the runtime code.

## Component definition

A component specification in YAML format describes the component for the
Kubeflow Pipelines system. A component definition has the following parts:

* **Metadata:** name, description, etc.
* **Interface:** input/output specifications (name, type, description, default 
  value, etc).
* **Implementation:** A specification of how to run the component given a 
  set of argument values for the component's inputs. The implementation section 
  also describes how to get the output values from the component once the
  component has finished running.

For the complete definition of a component, see the
[component specification](/docs/pipelines/reference/component-spec/).

## Containerizing components

You must package your component as a 
[Docker image](https://docs.docker.com/get-started/). Components represent a 
specific program or entry point inside a container.

Each component in a pipeline executes independently. The components do not run
in the same process and cannot directly share in-memory data. You must serialize
(to strings or files) all the data pieces that you pass between the components
so that the data can travel over the distributed network. You must then
deserialize the data for use in the downstream component.

## Next steps

* Read an [overview of Kubeflow Pipelines](/docs/pipelines/pipelines-overview/).
* Follow the [pipelines quickstart guide](/docs/pipelines/pipelines-quickstart/) 
  to deploy Kubeflow and run a sample pipeline directly from the Kubeflow 
  Pipelines UI.
* Build your own 
  [component and pipeline](/docs/pipelines/sdk/build-component/).
* Build a [reusable component](/docs/pipelines/sdk/component-development/) for
  sharing in multiple pipelines.