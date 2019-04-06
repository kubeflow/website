+++
title = "Component"
description = "Conceptual overview of components in Kubeflow Pipelines"
weight = 20
+++

A *pipeline component* is self-contained set of code that performs one step in
the ML workflow (pipeline), such as data preprocessing, data transformation,
model training, and so on. A component is analogous to a function, in that it
has a name, parameters, return values, and a body.

You must package your component as a 
[Docker image](https://docs.docker.com/get-started/). Components represent a 
specific program or entry point inside a container.

Each component in a pipeline executes independently. The components do not run
in the same process and cannot directly share in-memory data. You must serialize
(to strings or files) all the data pieces that you pass between the components
so that the data can travel over the distributed network. You must then
deserialize the data for use in the downstream component.

Each component has the following parts:

* **Metadata:** name, description, etc.
* **Interface:** input/output specifications (name, type, description, default 
  value, etc).
* **Implementation:** A specification of how to run the component given a 
  set of argument values for the component's inputs. The implementation section 
  also describes how to get the output values from the component once the
  component has finished running.

## Next steps

* Read an [overview of Kubeflow Pipelines](/docs/pipelines/pipelines-overview/).
* Follow the [pipelines quickstart guide](/docs/pipelines/pipelines-quickstart/) 
  to deploy Kubeflow and run a sample pipeline directly from the Kubeflow 
  Pipelines UI.
* Build your own 
  [component and pipeline](/docs/pipelines/sdk/build-component/).