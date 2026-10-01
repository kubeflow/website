+++
title = "Use Kubernetes Dynamic Resource Allocation"
description = "Request DRA-managed resources for Kubeflow Pipelines tasks."
weight = 106
+++

{{% kfp-v2-keywords %}}

[Kubernetes Dynamic Resource Allocation (DRA)][kubernetes-dra] lets a cluster
allocate hardware resources, such as GPUs and other accelerators, through
resource claims. Kubeflow Pipelines (KFP) supports adding DRA claims to a task
with the `kfp-kubernetes` extension library.

Use DRA when your cluster administrator manages devices through a DRA driver.
For the device-plugin approach to accelerator scheduling, use the KFP SDK task
methods such as `.set_accelerator_type()` and `.set_accelerator_limit()`
instead.

## Prerequisites

Before authoring a pipeline that uses DRA, make sure that:

* You use compatible versions of the KFP SDK and backend that include DRA
  support.
* Your cluster runs Kubernetes 1.31 or later with the
  `DynamicResourceAllocation` feature enabled. DRA is generally available and
  enabled by default starting in Kubernetes 1.34.
* A compatible DRA driver is installed and configured on the cluster.
* A cluster administrator has created the required `ResourceClaimTemplate` in
  the namespace where the pipeline task runs.

KFP does not create or manage `ResourceClaim` or `ResourceClaimTemplate`
objects. You must coordinate the claim-template name and configuration with
your cluster administrator.

Install the Kubernetes extension library alongside the KFP SDK:

```sh
pip install kfp[kubernetes]
```

## Add a resource claim to a task

Use `kubernetes.add_resource_claim()` when the claim template is known while
you author the pipeline. The following pipeline asks Kubernetes to create a
claim from the `gpu-claim-template` template for the `run_workload` task:

```python
from kfp import dsl
from kfp import kubernetes


@dsl.container_component
def run_workload():
    return dsl.ContainerSpec(
        image='python:3.11',
        command=['sh', '-c'],
        args=['echo "DRA resource claim attached"'],
    )


@dsl.pipeline
def training_pipeline():
    workload_task = run_workload()
    kubernetes.add_resource_claim(
        workload_task,
        resource_claim_template_name='gpu-claim-template',
    )
```

At runtime, KFP adds the claim to the task Pod specification and adds a
reference to that claim to the task's `main` container. Kubernetes then creates
the claim from the named template and schedules the Pod after the requested
resource is available.

The template must be in the task's namespace. To add more than one claim to a
task, call `add_resource_claim()` once for each template.

A DRA claim allocates the resource; it does not install device libraries or
make a workload compatible with the resource. For a GPU training workload, use
a container image and framework configuration that are compatible with the DRA
driver and GPU resource configured by your administrator.

## Configure a claim at run time

Use `kubernetes.add_resource_claim_json()` when a pipeline input selects the
claim configuration. This lets one compiled pipeline use different claim
templates in different environments.

```python
from typing import Dict

from kfp import dsl
from kfp import kubernetes


@dsl.component
def train_model():
    print('Training model')


@dsl.pipeline
def training_pipeline(resource_claim: Dict[str, str]):
    train_task = train_model()
    kubernetes.add_resource_claim_json(
        train_task,
        resource_claim_json=resource_claim,
    )
```

When starting the run, supply a claim configuration with the
`resourceClaimTemplateName` key:

```python
from kfp import Client
from kfp import kubernetes

client = Client()
client.create_run_from_pipeline_func(
    training_pipeline,
    arguments={
        'resource_claim': kubernetes.ResourceClaimConfig(
            resource_claim_template_name='gpu-claim-template',
        ),
    },
)
```

`ResourceClaimConfig` validates that the template name is non-empty and avoids
misspelling the JSON key. You can also pass a `ResourceClaimConfig`, or a list
of `ResourceClaimConfig` values, directly to `add_resource_claim_json()` when
the configuration is available while authoring the pipeline.

## Pass claims to a component that launches external work

Component authors can declare a task-configuration passthrough when their
component needs the resolved claims to configure an external workload. Set
`apply_to_task=True` to receive the claims in `TaskConfig` and apply them to
the component task Pod:

```python
from kfp import dsl


@dsl.component(
    task_config_passthroughs=[
        dsl.TaskConfigPassthrough(
            field=dsl.TaskConfigField.KUBERNETES_RESOURCE_CLAIMS,
            apply_to_task=True,
        ),
    ],
)
def launch_training(task_config: dsl.TaskConfig):
    for claim in task_config.resource_claims:
        print(claim)
    # Forward task_config.resource_claims to the external workload.
```

Pipeline authors attach claims to this task as usual with
`kubernetes.add_resource_claim()` or `kubernetes.add_resource_claim_json()`.

## Limitations and troubleshooting

DRA claims are Kubernetes-specific and are not portable to other KFP backends.
They have no effect when you execute a pipeline locally, because local runners
do not create Kubernetes Pods.

If the DRA driver, claim template, or cluster configuration is missing or
invalid, the task Pod may remain pending or fail to schedule. A pipeline
compiled with an SDK that supports DRA must also run against a compatible KFP
backend; an older backend can reject the new platform configuration.

[kubernetes-dra]: https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/
