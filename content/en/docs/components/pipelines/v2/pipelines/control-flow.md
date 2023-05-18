+++
title = "Control Flow"
description = "Create pipelines with control flow"
weight = 2
+++

{{% kfp-v2-keywords %}}

Although a KFP pipeline decorated with the `@dsl.pipeline` decorator looks like a normal Python function, it is actually an expression of pipeline topology and control flow semantics, constructed using the KFP domain-specific language (DSL). [Pipeline Basics][pipeline-basics] covered how data passing expresses [pipeline topology through task dependencies][data-passing]. This section describes how to use control flow in your pipelines using the KFP DSL. The DSL features three types of control flow, each implemented by a Python context manager:

1. Conditions
2. Looping
3. Exit handling

### Conditions (dsl.Condition)

The [`dsl.Condition`][dsl-condition] context manager enables conditional execution of tasks within its scope based on the output of an upstream task or pipeline input parameter. The context manager takes two arguments: a required `condition` and an optional `name`. The `condition` is a comparative expression where at least one of the two operands is an output from an upstream task or a pipeline input parameter.

In the following pipeline, `conditional_task` only executes if `coin_flip_task` has the output `'heads'`.

```python
from kfp import dsl

@dsl.pipeline
def my_pipeline():
    coin_flip_task = flip_coin()
    with dsl.Condition(coin_flip_task.output == 'heads'):
        conditional_task = my_comp()
```

### Parallel looping (dsl.ParallelFor)

The [`dsl.ParallelFor`][dsl-parallelfor] context manager allows parallel execution of tasks over a static set of items. The context manager takes three arguments: a required `items`, an optional `parallelism`, and an optional `name`. `items` is the static set of items to loop over and `parallelism` is the maximum number of concurrent iterations permitted while executing the `dsl.ParallelFor` group. `parallelism=0` indicates unconstrained parallelism.

{{% oss-be-unsupported feature_name="Setting `parallelism`" gh_issue_link=https://github.com/kubeflow/pipelines/issues/8718 %}}

In the following pipeline, `train_model` will train a model for 1, 5, 10, and 25 epochs, with no more than two training tasks running at one time:

```python
from kfp import dsl

@dsl.pipeline
def my_pipeline():
    with dsl.ParallelFor(
        items=[1, 5, 10, 25],
        parallelism=2
    ) as epochs:
        train_model(epochs=epochs)
```

{{% oss-be-unsupported feature_name="`dsl.Collected`" gh_issue_link=https://github.com/kubeflow/pipelines/issues/6161 %}}

Use [`dsl.Collected`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.Collected) with `dsl.ParallelFor` to gather outputs from a parallel loop of tasks:

```python
from kfp import dsl

@dsl.pipeline
def my_pipeline():
    with dsl.ParallelFor(
        items=[1, 5, 10, 25],
    ) as epochs:
        train_model_task = train_model(epochs=epochs)
    max_accuracy(models=dsl.Collected(train_model_task.outputs['model']))
```

Downstream tasks might consume `dsl.Collected` outputs via an input annotated with a `List` of parameters or a `List` of artifacts. For example, `max_accuracy` in the preceding example has the input `models` with type `Input[List[Model]]`, as shown by the following component definition:

```python
from kfp import dsl
from kfp.dsl import Model, Input

@dsl.component
def select_best(models: Input[List[Model]]) -> float:
    return max(score_model(model) for model in models)
```

You can use `dsl.Collected` to collect outputs from nested loops in a *nested list* of parameters. For example, output parameters from two nested `dsl.ParallelFor` groups are collected in a multilevel nested list of parameters, where each nested list contains the output parameters from one of the `dsl.ParallelFor` groups. The number of nested levels is based on the number of nested `dsl.ParallelFor` contexts.

By comparison, *artifacts* created in nested loops are collected in a *flat* list.

You can also return a `dsl.Collected` from a pipeline. Use a `List` of parameters or a `List` of artifacts in the return annotation, as shown in the following example:

```python
from kfp import dsl
from kfp.dsl import Model

@dsl.pipeline
def my_pipeline() -> List[Model]:
    with dsl.ParallelFor(
        items=[1, 5, 10, 25],
    ) as epochs:
        train_model_task = train_model(epochs=epochs)
    return dsl.Collected(train_model_task.outputs['model'])
```

### Exit handling (dsl.ExitHandler)

The [`dsl.ExitHandler`][dsl-exithandler] context manager allows pipeline authors to specify an exit task which will run after the tasks within the context manager's scope finish execution, even if one of those tasks fails. This is analogous to using a `try:` block followed by a `finally:` block in normal Python, where the exit task is in the `finally:` block. The context manager takes two arguments: a required `exit_task` and an optional `name`. `exit_task` accepts an instantiated [`PipelineTask`][dsl-pipelinetask].

In the following pipeline, `clean_up_task` will execute after both `create_dataset` and `train_and_save_models` finish or either of them fail:

```python
from kfp import dsl

@dsl.pipeline
def my_pipeline():
    clean_up_task = clean_up_resources()
    with dsl.ExitHandler(exit_task=clean_up_task):
        dataset_task = create_datasets()
        train_task = train_and_save_models(dataset=dataset_task.output)
```

The task you use as an exit task may use a special input that provides access to pipeline and task status metadata, including pipeline failure or success status. You can use this special input by annotating your exit task with the [`dsl.PipelineTaskFinalStatus`][dsl-pipelinetaskfinalstatus] annotation. The argument for this parameter will be provided by the backend automatically at runtime. You should not provide any input to this annotation when you instantiate your exit task.

The following pipeline uses `dsl.PipelineTaskFinalStatus` to obtain information about the pipeline and task failure, even after `fail_op` fails:

```python
from kfp import dsl
from kfp.dsl import PipelineTaskFinalStatus


@dsl.component
def exit_op(user_input: str, status: PipelineTaskFinalStatus):
    """Prints pipeline run status."""
    print(user_input)
    print('Pipeline status: ', status.state)
    print('Job resource name: ', status.pipeline_job_resource_name)
    print('Pipeline task name: ', status.pipeline_task_name)
    print('Error code: ', status.error_code)
    print('Error message: ', status.error_message)

@dsl.component
def fail_op():
    import sys
    sys.exit(1)

@dsl.pipeline
def my_pipeline():
    print_op()
    print_status_task = exit_op(user_input='Task execution status:')
    with dsl.ExitHandler(exit_task=print_status_task):
        fail_op()
```

#### Ignore upstream failure

The [`.ignore_upstream_failure()`][ignore-upstream-failure] task method on [`PipelineTask`][dsl-pipelinetask] enables another approach to author pipelines with exit handling behavior. Calling this method on a task causes the task to ignore failures of any specified upstream tasks (as established by data exchange or by use of [`.after()`][dsl-pipelinetask-after]). If the task has no upstream tasks, this method has no effect.

In the following pipeline definition, `clean_up_task` is executed after `fail_op`, regardless of whether `fail_op` succeeds:

```python
from kfp import dsl

@dsl.pipeline()
def my_pipeline(text: str = 'message'):
    task = fail_op(message=text)
    clean_up_task = print_op(
        message=task.output).ignore_upstream_failure()
```

Note that the component used for the caller task (`print_op` in the example above) requires a default value for all inputs it consumes from an upstream task. The default value is applied if the upstream task fails to produce the outputs that are passed to the caller task. Specifying default values ensures that the caller task always succeeds, regardless of the status of the upstream task.

[data-passing]: /docs/components/pipelines/v2/pipelines/pipeline-basics#data-passing-and-task-dependencies
[pipeline-basics]: /docs/components/pipelines/v2/pipelines/pipeline-basics
[dsl-condition]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.Condition
[dsl-exithandler]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.ExitHandler
[dsl-parallelfor]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.ParallelFor
[dsl-pipelinetaskfinalstatus]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.PipelineTaskFinalStatus
[ignore-upstream-failure]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.PipelineTask.ignore_upstream_failure
[dsl-pipelinetask]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.PipelineTask
[dsl-pipelinetask-after]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.PipelineTask.after
