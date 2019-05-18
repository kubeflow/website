+++
title = "Component Specification"
description = "Definition of a Kubeflow Pipelines component"
weight = 10
+++

This specification describes the container component data model for Kubeflow
Pipelines. The data model is serialized to a file in YAML format for sharing.

Below are the main parts of the component definition:

* **Metadata:** Name, description, and other metadata.
* **Interface (inputs and outputs):** Name, type, default value.
* **Implementation:** How to run the component, given the input arguments.

## Example of a component specification

A component specification takes the form of a YAML file, `component.yaml`. Below
is an example:

```
name: xgboost4j - Train classifier
description: Trains a boosted tree ensemble classifier using xgboost4j

inputs:
- {name: Training data URI}
- {name: Rounds, type: Integer, default: '30', help: Number of training rounds}

outputs:
- {name: Trained model, type: XGBoost model, help: Trained XGBoost model}

implementation:
  container:
    image: gcr.io/ml-pipeline/xgboost-classifier-train@sha256:b3a64d57
    command: [
      /ml/train.py,
      --train-uri, {inputValue: Training data URI},
      --rounds,    {inputValue: Rounds},
      --out-model, {outputPath: Trained model},
    ]
```

See some examples of real-world 
[component specifications](https://github.com/kubeflow/pipelines/search?q=filename%3Acomponent.yaml&unscoped_q=filename%3Acomponent.yaml).

## Detailed specification (ComponentSpec)

This section describes the 
[ComponentSpec](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/components/_structures.py).

### Metadata

* `name`: Human-readable name of the component.
* `description`: Description of the component.
* `metadata`: Standard object's metadata:

    * `annotations`: An unstructured key value map
        stored with a resource. External tools can set this property to store and
        retrieve arbitrary metadata. Annotations are not queryable and should be
        preserved when modifying objects. See more information in the
        [Kubernetes user guide](http://kubernetes.io/docs/user-guide/annotations).

    * `labels`: A map of string keys and values that can be used to
        organize and categorize (scope and select) objects. May match selectors
        of replication controllers and services. See more information in the
        [Kubernetes user guide](http://kubernetes.io/docs/user-guide/labels).

### Interface

* `inputs` and `outputs`:
    Specifies the list of inputs/outputs and their properties. Each input or
    output has the following properties:

    * `name`: Human-readable name of the input/output. Name must be
        unique inside the inputs or outputs section, but an output may have the
        same name as an input.
    * `description`: Human-readable description of the input/output.
    * `default`: Specifies the default value for an input. Only
        valid for inputs.
    * `type`: Specifies the type of input/output. The types are used
        as hints for pipeline authors and can be used by the pipeline system/UI
        to validate arguments and connections between components. Basic types
        are **String**, **Integer**, **Float**, and **Bool**. See the full list
        of [types](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/types.py)
        defined by the Kubeflow Pipelines SDK.

### Implementation

* `implementation`: Specifies how to execute the component instance.
    There are two implementation types,  `container` and `graph`. (The latter is
    not in scope for this document.) In future we may introduce more 
    implementation types like `daemon` or `K8sResource`.

    * `container`:
        Describes the Docker container that implements the component. A portable 
        subset of the Kubernetes
        [Container v1 spec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.12/#container-v1-core).

        * `image`: Name of the Docker image.
        * `command`: Entrypoint array. The Docker image's
            ENTRYPOINT is used if this is not provided. Each item is either a
            string or a placeholder. The most common placeholders are
            `{inputValue: Input name}` and `{outputPath: Output name}`.
        * `args`: Arguments to the entrypoint. The Docker
            image's CMD is used if this is not provided. Each item is either a
            string or a placeholder. The most common placeholders are
            `{inputValue: Input name}` and `{outputPath: Output name}`.
        * `env`: Map of environment variables to set in the container.
        * `fileOutputs`: Legacy property that is only needed in
            cases where the container always stores the output data in some
            hard-coded non-configurable local location. This property specifies
            a map between some outputs and local file paths where the program
            writes the output data files. Only needed for components that have
            hard-coded output paths. Such containers need to be fixed by
            modifying the program or adding a wrapper script that copies the
            output to a configurable location. Otherwise the component may be
            incompatible with future storage systems.

You can set all other Kubernetes container properties when you
use the component inside a pipeline.

## Using placeholders for command-line arguments

### Consuming input by value (parameter)

The placeholder is replaced by the value of the input argument:

* In `component.yaml`:
  
  ```
  command: [program.py, --rounds, {inputValue: Rounds}]
  ```

* In the pipeline code:

  ```
  task1 = component1(rounds=150)
  ```

* Resulting command-line code (showing the value of the input argument that
  has replaced the placeholder):

  ```
  program.py --rounds 150
  ```

### Outputs

Output paths are filled in by the pipeline system. The `outputPath` placeholder
is replaced by a path. (The path can point to a mounted output volume, for
example.) The parent directories of the path may or may not not exist. Your
program must handle both cases without error.

* In `component.yaml`:

  ```
  command: [program.py, --out-model, {outputPath: trained_model}]
  ```

* In the pipeline code:

  ```
  task1 = component1()
  ```

* Resulting command-line code (the placeholder is replaced by the 
  generated path):

  ```
  program.py --out-model /outputs/trained_model/data
  ```