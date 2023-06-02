+++
title = "Component"
description = "Conceptual overview of components in Kubeflow Pipelines"
weight = 20
                    
+++

A *pipeline component* is self-contained set of code that performs one step in
the ML workflow (pipeline), such as data preprocessing, data transformation,
model training, and so on. A component is analogous to a function, in that it
has a name, parameters, return values, and a body.

You can create several types of components in KFP:

* [lightweight Python component](lightweight): a hermetic Python function
* [containerized Python component](containerized): functions can depend on information outside
* [container component](container): a container execution
* [importer component](importer): a component loading a machine learning artifact from a URI


In the pipeline YAML file, a *component* is like a [function signature](function-sig) in a pipeline. 
It defines the name, inputs and outputs of the component. The inputs and outputs
can be parameters and artifacts. Components act as building blocks for the pipeline DAG.

A component also includes one of the two contents: 
* an *executor label* that points to an executor definition, which describes the content and configurations of this component
* a [DAG](dag) specification, allowing the component to contain multiple tasks


## Next steps

* [Hello World Pipeline][hello-world-pipeline]
* Learn more about [authoring components][components]
* Learn more about [authoring pipelines][pipelines]

[components]: /docs/components/pipelines/v2/components
[pipelines]: /docs/components/pipelines/v2/pipelines
[hello-world-pipeline]: /docs/components/pipelines/v2/hello-world
[function-sig]: https://en.wikipedia.org/wiki/Type_signature#Signature
[dag]: /docs/components/pipelines/v2/concepts/task#task-dependency-and-dag
[lightweight]: /docs/components/pipelines/v2/components/lightweight-python-components
[containerized]: /docs/components/pipelines/v2/components/containerized-python-components
[container]: /docs/components/pipelines/v2/components/container-components
[importer]: /docs/components/pipelines/v2/components/importer-components
