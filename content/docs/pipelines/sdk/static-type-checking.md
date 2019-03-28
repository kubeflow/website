+++
title = "DSL Static Type Checking"
description = "Statically check the component I/O types"
weight = 6
+++

This page describes how to integrate the type information in the pipeline and utilize the 
static type checking for fast development iterations.

## Motivation

A pipeline is a workflow consisting of [components](/docs/pipelines/sdk/build-component#overview-of-pipelines-and-components) and each
component contains inputs and outputs. The DSL compiler supports static type checking to ensure the type consistency among the component
I/Os within the same pipeline. Static type checking helps you to identify component I/O inconsistencies without running the pipeline. 
It also shortens the development cycles by catching the errors early. 
This feature is especially useful in two cases: 

* When the pipeline is huge and manually checking the types is infeasible; 
* When some components are shared ones and the type information is not immediately available.

## Type system  

In Kubeflow pipeline, a type is defined as a type name with an [OpenAPI Schema](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md)
property, which defines the input parameter schema. **Warning**: the pipeline system 
currently does not check the input value against the schema when you submit a pipeline run. However, this feature will come in the near 
future. 

There is a set of [core types](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/types.py) defined in the 
pipeline SDK and you can use these core types or define your custom types. 

In the component YAML, types are specified as a string or a dictionary with the OpenAPI Schema, as illustrated below.
"*component a*" expects an input with Integer type and emits three outputs with the type GCSPath, customized_type and GCRPath. 
Among these types, Integer, GCSPath, and GCRPath are core types that are predefined in the SDK while customized_type is a user-defined
type.  
```yaml
name: component a
description: component desc
inputs:
  - {name: field_l, type: Integer}
outputs:
  - {name: field_m, type: {GCSPath: {openapi_schema_validator: {type: string, pattern: "^gs://.*$" } }}}
  - {name: field_n, type: customized_type}
  - {name: field_o, type: GCRPath} 
implementation:
  container:
    image: gcr.io/ml-pipeline/component-a
    command: [python3, /pipelines/component/src/train.py]
    args: [
      --field-l, {inputValue: field_l},
    ]
    fileOutputs: 
      field_m: /schema.txt
      field_n: /feature.txt
      field_o: /output.txt
```
Similarly, when you write a component with the decorator, you can annotate I/O with types in the function signature, as shown below.

```python
from kfp.dsl import component
from kfp.dsl.types import Integer, GCRPath
@component
def task_factory_a(field_l: Integer()) -> {'field_m': {'GCSPath': {'openapi_schema_validator': '{"type": "string", "pattern": "^gs://.*$"}'}}, 
                                           'field_n': 'customized_type',
                                           'field_o': GCRPath()
                                          }:
    return ContainerOp(
        name = 'operator a',
        image = 'gcr.io/ml-pipeline/component-a',
        command = [
          'python3', '/pipelines/component/src/train.py'
        ],
        arguments = [
            '--field-l', field_l,
        ],
        file_outputs = {
            'field_m': '/schema.txt',
            'field_n': '/feature.txt',
            'field_o': '/output.txt'
        }
    )
```
You can also annotate pipeline inputs with types and the input are checked against the component I/O types as well. For example,
```python
@component
def task_factory_a(field_m: {'GCSPath': {'openapi_schema_validator': '{"type": "string", "pattern": "^gs://.*$"}'}}, field_o: 'Integer'):
    return ContainerOp(
        name = 'operator a',
        image = 'gcr.io/ml-pipeline/component-a',
        arguments = [
            '--field-l', field_m,
            '--field-o', field_o,
        ],
    )

# Pipeline input types are also checked against the component I/O types.
@dsl.pipeline(name='type_check',
    description='')
def pipeline(a: {'GCSPath': {'openapi_schema_validator': '{"type": "string", "pattern": "^gs://.*$"}'}}='good', b: Integer()=12):
    task_factory_a(field_m=a, field_o=b)

try:
    compiler.Compiler().compile(pipeline, 'pipeline.tar.gz', type_check=True)
except InconsistentTypeException as e:
    print(e)
```

## How does the type checking work?

The basic checking criterion is the equality checking. In other words, type checking passes only when the type name strings are equal
and the corresponding OpenAPI Schema properties are equal. Examples of type checking failure are:

* "GCSPath" vs. "GCRPath"
* "Integer" vs. "Float"
* {'GCSPath': {'openapi_schema_validator': '{"type": "string", "pattern": "^gs://.*$"}'}} vs.  
{'GCSPath': {'openapi_schema_validator': '{"type": "string", "pattern": "^gcs://.*$"}'}}

If inconsistent types are detected, it throws an [InconsistentTypeException](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/types.py).


## Type checking configuration

Type checking is enabled by default and it can be disabled in two ways:

If you compile the pipeline programmably:
```python
compiler.Compiler().compile(pipeline_a, 'pipeline_a.tar.gz', type_check=False)
```
If you compile the pipeline using the dsl-compiler tool:
```bash
dsl-compiler --py pipeline.py --output pipeline.zip --disable-type-check
```
### Fine-grained configuration

Sometimes, you might want to enable the type checking but disable certain arguments. For example, 
when the upstream component generates an output with type "*Float*" and the downstream can ingest either 
"*Float*" or "*Integer*", it might fail if you define the type as "*Float_or_Integer*". 
Disabling the type checking per-argument is also supported as shown below.
```python
@dsl.pipeline(name='type_check_a',
    description='')
def pipeline():
    a = task_factory_a(field_l=12)
    # For each of the arguments, you can also ignore the types by calling ignore_type function.
    b = task_factory_b(field_x=a.outputs['field_n'], field_y=a.outputs['field_o'], field_z=a.outputs['field_m'].ignore_type())
compiler.Compiler().compile(pipeline, 'pipeline.tar.gz', type_check=True)
```

### Missing types

DSL compiler passes the type checking if either of the upstream or the downstream components lack the type information for some parameters. 
The effects are the same as that of ignoring the type information. However, 
type checking would still fail if some I/Os lack the type information and some I/O types are incompatible.

## Next steps

* See [type checking sample](https://github.com/kubeflow/pipelines/blob/master/samples/notebooks/DSL%20Static%20Type%20Checking.ipynb).
