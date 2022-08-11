+++
title = "Tasks"
description = "Understand and use KFP tasks"
weight = 4
+++

<!-- TODO: replace (/) with cross-section links -->

## Summary
A *task* is an execution of a [component](content/en/docs/components/pipelines/author-a-pipeline/components) with a set of inputs. It can be thought of as an instantiation of a component template. A pipeline is composed of individual tasks that may or may not pass data betwen one another.

One component can be used to instantiate multiple tasks within a single pipeline. Tasks can also be created and executed dynamically using pipeline control flow features such as loops, conditions, and exit handlers.

Because tasks represent a runtime execution of a component, you may set additional runtime configuration on a task, such as environment variables, hardware resource requirements, and various other task-level configurations.

## Task dependencies
### Independent tasks
Tasks may or may not depend on one another. Two tasks are independent of one another if no outputs of one are inputs to the other and neither task calls `.after()` on the other. When two tasks are independent, they execute concurrently at pipeline runtime. In the following example, `my_task1` and `my_task2` have no dependency and will execute at the same time.

```python
from kfp import dsl

@dsl.pipeline()
def my_pipeline():
    my_task1 = concat_comp(prefix='hello, ', text='world')
    my_task2 = concat_comp(prefix='hi, ', text='universe')
```

### Implicitly dependent tasks
When the output of one task is the input to another, an implicit dependency is created between the two tasks. When this is the case, the upstream task will execute first so that its output can be passed to the downstream task. In the following example, the argument to the `prefix` parameter on `my_tasks2` is the output from `my_task1`. This means `my_task2` implicitly depends and will execute after `my_task1`.

```python
from kfp import dsl

@dsl.pipeline()
def my_pipeline():
    my_task1 = concat_comp(prefix='hello, ', text='world')
    my_task2 = concat_comp(prefix=my_task1.output, text='!')
```

For more information on passing inputs and outputs between components, see [Data Passing](/).


### Explicitly dependent tasks
Sometimes you want to order execution of two tasks but not pass data between the tasks. When this is the case, you can call the intended second task's `.after()` on the intended first task create an explicit dependency. In the following example, `my_task2` explicitly depends on `my_task1`, so `my_task1` will execute before `my_task2`:

```python
from kfp import dsl

@dsl.pipeline()
def my_pipeline():
    my_task1 = concat_comp(prefix='hello, ', text='world')
    my_task2 = concat_comp(prefix='hi, ', text='universe').after(my_task1)
```


## Task-level configurations
The KFP SDK exposes several platform-agnostic task-level configurations for use during authoring. Platform-agnostic configurations are those that are expected to exhibit similar execution behavior on all KFP-conformant backends, such as the open source KFP backend or the Vertex Pipelines backend. The remainder of this section refers only to platform-agnostic task-level configurations.

All task-level configurations are set using a method on the task. Take the following environment variable example:

```python
from kfp import dsl

@dsl.component
def print_env_var():
    import os
    print(os.environ.get('MY_ENV_VAR'))

@dsl.pipeline()
def my_pipeline():
    task = print_env_var()
    task.set_env_variable('MY_ENV_VAR', 'hello')
```

When executed, the `print_env_var` component should print `'hello'`.

Task-level configuration methods can also be chained:

```python
print_env_var().set_env_variable('MY_ENV_VAR', 'hello').set_env_variable('OTHER_VAR', 'world')
```

The KFP SDK provides the following task methods for setting task-level configurations:
* `.add_node_selector_constraint`
* `.set_caching_options`
* `.set_cpu_limit`
* `.set_display_name`
* `.set_env_variable`
* `.set_gpu_limit`
* `.set_memory_limit`
* `.set_retry`

For detailed information on how to use the above methods, see the [`kfp.dsl.PipelineTask` reference documentation](https://kubeflow-pipelines.readthedocs.io/en/master/source/dsl.html).

### Caching
KFP provides task-level output caching to reduce redundant computation by skipping the execution of tasks that were completed in a previous pipeline run. Caching is enabled by default, but can be disabled by calling `.set_caching_options(False)` on a task.

The cache key is determined by the task's component specification (image, command, arguments, input/output interface) and the task's provided inputs (the name and URI of artifacts and the name and value of parameters). Cache hit status is not determined until task runtime since input values may be unknown until pipeline runtime.

When a task's cache hits and its execution is skipped, it will be displayed on the KFP UI:
<!-- TODO: add photo of cache on UI -->