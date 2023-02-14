+++
title = "Pipelines"
description = "Create a pipeline"
weight = 3
+++

A *pipeline* is a description of a multi-task workflow, including how tasks relate to each other to form an computational graph. Pipelines may have inputs which can be passed to tasks within the pipeline.

## Author a pipeline
Unlike components which have three authoring approaches, pipelines have one authoring approach: they are defined using Python pipeline functions decorated with `@dsl.pipeline`. For example:

```python
from kfp import dsl

@dsl.pipeline
def my_pipeline(text: str):
    my_task = my_component(arg1=text)
```

The `@dsl.pipeline` decorator takes three optional arguments.
* `name` is the name of your pipeline. If not provided, the name defaults to a sanitized version of the pipeline function name.
* `description` is a description of the pipeline.
* `pipeline_root` is the remote storage root path from which your pipeline will write and read artifacts (e.g., `gs://my/path`).

A pipeline function is a function that may have inputs, instantiates components as tasks and uses them to form a computational graph, and only uses the KFP domain-specific language objects and syntax within the function scope. Let's walk through each of these parts one-by-one.

First, like a component, a pipeline function may have inputs and outputs. This allows your pipeline to serve as a computational template that can be executed with different input parameters to create a specified set of outputs. See [Component I/O: Pipeline I/O][component-io-pipeline-io] for how to use type annotations in a pipeline.

Second, a pipeline function instantiates components as tasks and uses them to form a computational graph. For information on how to instatiate components as tasks and pass data between them, see [Component I/O: Passing data between tasks][component-io]. For information on task dependencies, see [Tasks][tasks].

Third, a pipeline function only uses domain-specific language (DSL) objects and syntax within the function scope. Because the body of a Python pipeline function must ultimately be compiled to IR YAML, pipeline functions only support a very narrow set of Python language features, as specified by the KFP DSL. In addition to instantiation and data passing between tasks, the only three other features permitted are `dsl.Condition`, `dsl.ParallelFor` and `dsl.ExitHandler`. Use of these three features is covered in the next section. Use of classes, list comprehensions, lambda functions, and other arbitrary Python language features are not permitted within the scope of a Python pipeline function.


## DSL control flow features
A critical difference between components and pipelines is how control flow is authored and executed. Within a Python component, control flow is authored using arbitrary Python language features and the raw Python code is executed at component runtime. Within the scope of a pipeline, control flow acts on tasks, is authored using DSL features, and is executed by the KFP backend through the creation of Kubernetes Pods to execute those tasks.  `dsl.Condition`, `dsl.ParallelFor` and `dsl.ExitHandler` can be used to orchestrate the completion of tasks within a pipeline function body. Each is implemented as a Python context manager.

### dsl.Condition

The [`dsl.Condition`][dsl-reference-docs] context manager allows conditional execution of tasks within its scope based on the output of an upstream task. The context manager takes two arguments: a required `condition` and an optional `name`. The `condition` is a comparative expression where at least one of the two operands is an output from an upstream task.

In the following pipeline, `conditional_task` only executes if `coin_flip_task` has the output `'heads'`.

```python
from kfp import dsl

@dsl.pipeline
def my_pipeline():
    coin_flip_task = flip_coin()
    with dsl.Condition(coin_flip_task.output == 'heads'):
        conditional_task = my_comp()
```

### dsl.ParallelFor

The [`dsl.ParallelFor`][dsl-reference-docs] context manager allows parallelized execution of tasks over a static set of items. The context manager takes two arguments: a required `items`, an optional `parallelism`, and an optional `name`. `items` is the static set of items to loop over, while `parallelism` is the maximum number of concurrent iterations permitted while executing the `dsl.ParallelFor` group. `parallelism=0` indicates unconstrained parallelism.

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

### dsl.ExitHandler
The [`dsl.ExitHandler`][dsl-reference-docs] context manager allows pipeline authors to specify an "exit handler" task which will run after the tasks within its scope finish execution or one of them fails. This is analogous to using `try:` followed by `finally:` in normal Python. The context manager takes two arguments: a required `exit_task` and an optional `name`. The `exit_task` is the "exit handler" task and must be instantiated before the `dsl.ExitHandler` context manager is entered.

In the following pipeline, `clean_up_task` will execute after either both `create_dataset` and `train_and_save_models` finish or one of them fails:

```python
from kfp import dsl

@dsl.pipeline
def my_pipeline():
    clean_up_task = clean_up_resources()
    with dsl.ExitHandler(exit_task=clean_up_task):
        dataset_task = create_datasets()
        train_task = train_and_save_models(dataset=dataset_task.output)
```

The task you use as an exit task may use a special backend-provided input that provides access to pipeline and task status metadata, including pipeline failure or success status. You can use this special input by annotating your exit task with the `dsl.PipelineTaskFinalStatus` annotation. You should not provide any input to this annotation when you instantiate your exit task.

The following pipeline uses `PipelineTaskFinalStatus` to obtain information about the pipeline and task failure, even after `fail_op` fails:

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
Another similiar method to achieve the same process as the exithandler while at the same time allowing tasks to collect output from upstream tasks is the [`ignore_upstream_failure()`][ignore-upstream-failure] configuration from [`pipeline_task`][tasks-configurations]

If called, the pipeline task will run when any specified upstream tasks complete, even if unsuccessful. This method effectively turns the caller task into an exit task if the caller task has upstream dependencies. If the task has no upstream tasks, either via data exchange or an explicit dependency via `.after()`, this method has no effect.

In the following pipeline, `clean_up_task` will execute after `fail_op` regardless of if the task fails or not

```python
from kfp import dsl

@dsl.pipeline()
def my_pipeline(text: str = 'message'):
    task = fail_op(message=text)
    clean_up_task = print_op(
        message=task.output).ignore_upstream_failure()
```

An important thing to note is that the component used for the caller task is required to have a default value for all inputs read from the upstream tasks, this is to make sure the caller tasks never fails regardless of the status of the upstream tasks, since if an upstream tasks fails to produce the inputs it would use the default value. 


[component-io]: /docs/components/pipelines/v2/author-a-pipeline/component-io#passing-data-between-tasks
[components]: /docs/components/pipelines/v2/author-a-pipeline/components
[tasks]: /docs/components/pipelines/v2/author-a-pipeline/tasks
[component-io-pipeline-io]: /docs/components/pipelines/v2/author-a-pipeline/component-io/#pipeline-io
<!-- TODO: make this reference more precise throughout -->
[dsl-reference-docs]: https://kubeflow-pipelines.readthedocs.io/en/master/source/dsl.html
[ignore-upstream-failure]: https://kubeflow-pipelines.readthedocs.io/en/master/source/dsl.html#kfp.dsl.PipelineTask.ignore_upstream_failure
[tasks-configurations]:  https://www.kubeflow.org/docs/components/pipelines/v2/author-a-pipeline/tasks/#task-level-configurations