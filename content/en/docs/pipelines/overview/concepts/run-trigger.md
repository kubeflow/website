+++
title = "Run Trigger"
description = "Conceptual overview of run triggers in Kubeflow Pipelines"
weight = 60
                    
+++

A *run trigger* is a flag that tells the system when a recurring run
configuration spawns a new run. The following types of run trigger are
available:

* Periodic: for an interval-based scheduling of runs (for example: every 2 hours 
  or every 45 minutes).
* Cron: for specifying `cron` semantics for scheduling runs.

## Next steps

* Read an [overview of Kubeflow Pipelines](/docs/pipelines/pipelines-overview/).
* Follow the [pipelines quickstart guide](/docs/pipelines/pipelines-quickstart/) 
  to deploy Kubeflow and run a sample pipeline directly from the Kubeflow 
  Pipelines UI.