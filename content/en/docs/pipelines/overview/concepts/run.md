+++
title = "Run and Recurring Run"
description = "Conceptual overview of runs in Kubeflow Pipelines"
weight = 50
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

A *run* is a single execution of a pipeline. Runs comprise an immutable log of
all experiments that you attempt, and are designed to be self-contained to allow
for reproducibility. You can track the progress of a run by looking at its
details page on the Kubeflow Pipelines UI, where you can see the runtime graph,
output artifacts, and logs for each step in the run.

<a id=recurring-run></a>
A *recurring run*, or job in the Kubeflow Pipelines [backend APIs](https://github.com/kubeflow/pipelines/tree/06e4dc660498ce10793d566ca50b8d0425b39981/backend/api/go_http_client/job_client), is a repeatable run of
a pipeline. The configuration for a recurring run includes a copy of a pipeline
with all parameter values specified and a 
[run trigger](/docs/pipelines/concepts/run-trigger/).
You can start a recurring run inside any experiment, and it will periodically
start a new copy of the run configuration. You can enable/disable the recurring
run from the Kubeflow Pipelines UI. You can also specify the maximum number of
concurrent runs, to limit the number of runs launched in parallel. This can be
helpful if the pipeline is expected to run for a long period of time and is
triggered to run frequently.

## Next steps

* Read an [overview of Kubeflow Pipelines](/docs/pipelines/pipelines-overview/).
* Follow the [pipelines quickstart guide](/docs/pipelines/pipelines-quickstart/) 
  to deploy Kubeflow and run a sample pipeline directly from the Kubeflow 
  Pipelines UI.
