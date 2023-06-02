+++
title = "Run and Recurring Run"
description = "Conceptual overview of runs and recurring runs in Kubeflow Pipelines"
weight = 50
                    
+++

## Run

A *run* is a single execution of a pipeline. Runs comprise an immutable log of
all experiments that you attempt, and are designed to be self-contained to allow
for reproducibility. You can track the progress of a run by looking at its
details page on the Kubeflow Pipelines UI, where you can see the runtime graph,
output artifacts, and logs for each step in the run.  

## Recurring run

<a id=recurring-run></a>
A *recurring run*, formerly known as *job* in V1 [backend APIs](v1-api), is a repeatable run of
a pipeline. The configuration for a recurring run includes a copy of a pipeline
with all parameter values specified and a 
[run trigger](#run-trigger).
Recurring run is a subresource of [Experiment](experiment). It periodically
starts a new copy of the run configuration according to the *run trigger* set by the user. 

* You can enable/disable the recurring run manually. 
* You can specify the maximum number of concurrent runs, to limit the number of runs launched in parallel. This can be helpful if the pipeline is expected to run for a long period of time and is triggered to run frequently.
* If the *catchup* flag is true, the scheduler will catch up on (backfill) each missed interval when the recurring run is paused for a while and re-enabled afterwards. Defaults to true.
* You can set the [service account](???) this recurring run uses.


## Run trigger

A *run trigger* is a flag that tells the system when a recurring run
configuration spawns a new run. The following types of run trigger are
available:

* Periodic: for an interval-based scheduling of runs (for example: every 2 hours 
  or every 45 minutes). The minimum interval for a periodic run is 1 minute.
* Cron: for specifying `cron` semantics for scheduling runs. We use CRON expression format specified [here](run-trigger-format).

You can also specify the start time and end time of the recurring run.


## Next steps

* Read an [overview of Kubeflow Pipelines](/docs/components/pipelines/introduction.md).
* Follow the [pipelines quickstart guide](/docs/components/pipelines/overview/quickstart/) 
  to deploy Kubeflow and run a sample pipeline directly from the Kubeflow 
  Pipelines UI.

[v1-api]: https://github.com/kubeflow/pipelines/tree/0587a3fd352f8e4743c226fd7dcd6a3f28adf09c/backend/api/v1beta1
[experiment]: /docs/components/pipelines/v2/concepts/experiment
[run-trigger-format]: https://pkg.go.dev/github.com/robfig/cron#hdr-CRON_Expression_Format
