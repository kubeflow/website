+++
title = "DSL Recursion"
description = "Author a recursive function in DSL."
weight = 7
+++

This page describes how to write recursive functions in DSL.

## Motivation
Recursion is a feature that is supported by almost all languages to express complex semantics in a succinct way. 
In machine learning workflows, recursions are especially important to enable features such as multiple rounds of training, 
iterative model analysis, and hypertuning. The recursion support also covers the loop feature since it enables the same code 
block to be executed and exited based on dynamic conditions.

## How to write a recursive function?

### Decorator

Decorate the recursive function with [kfp.dsl.graph_component](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_component.py)
as illustrated below. No arguments to the decorator is required.
```python
import kfp.dsl as dsl
@dsl.graph_component
def graph_component_a(input_x):
  with dsl.Condition(input_x == 'value_x'):
    op_a = task_factory_a(input_x)
    op_b = task_factory_b().after(op_a)
    graph_component_a(op_b.output)
    
@dsl.pipeline(
  name='pipeline',
  description='shows how to use the recursion.'
)
def pipeline():
  op_a = task_factory_a()
  op_b = task_factory_b()
  graph_op_a = graph_component_a(op_a.output)
  graph_op_a.after(op_b)
  task_factory_c(op_a.output).after(graph_op_a)
```

### Function signature
Define the function signature as normal python functions. The input parameters are [PipelineParams](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline_param.py).

### Function body
Similar to the pipeline function body, you can instantiate components, create [conditions](https://github.com/kubeflow/pipelines/blob/f8b0f5bf0cc0b5aceb8aedfd21e93156e363ea48/sdk/python/kfp/dsl/_ops_group.py#L110),
use the input parameters from the function signature, and specify dependencies explicitly among components. 
In the example above, one condition is created inside the recursive function and 
two components *op_a* and *op_b* are created inside the condition.   

### Call the recursive function in the pipeline function
You can pass pipeline/component output to the recursive function and specify the dependencies explicitly with *after()* function, similar to
the [ContainerOp](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_container_op.py). In the example above, the output of *op_a* 
defined in the pipeline is passed to the recursive function and the *task_factory_c* component is specified to depend on the *graph_op_a*. 
The recursive function can also be explicitly specified to depend on the ContainerOps. For example, *graph_op_a* depends on *op_b* in the pipeline.

### More examples
Here is another example where the recursive function call is at the end of the function body, similar to [do-while](https://en.wikipedia.org/wiki/Do_while_loop) loops.
```python
import kfp.dsl as dsl
@dsl.graph_component
def graph_component_a(input_x):
  op_a = task_factory_a(input_x)
  op_b = task_factory_b().after(op_a)
  with dsl.Condition(op_b.output == 'value_x'):
    graph_component_a(op_b.output)
 
@dsl.pipeline(
  name='pipeline',
  description='shows how to use the recursion.'
)
def pipeline():
  op_a = task_factory_a()
  op_b = task_factory_b()
  graph_op_a = graph_component_a(op_a.output)
  graph_op_a.after(op_b)
  task_factory_c(op_a.output).after(graph_op_a)
```

## Limitation

* Type checking is not working for the recursive function. In other words, The type information that is annotated to the recursive 
function signature will not be checked.
* Since the output of the recursive function cannot be dynamically resolved, output from the recursive functions can be 
accessed in the downstream ContainerOps.
* A known [issue](https://github.com/kubeflow/pipelines/issues/1065) that the recursion fails to work when there are 
multiple recursive function calls in the function body.

## Next steps

* See [recursion sample](https://github.com/kubeflow/pipelines/blob/master/samples/basic/recursion.py)