+++
title = "ML Metadata"
description = "Conceptual overview about Metadata in Kubeflow Pipelines"
weight = 90
                    
+++

**Note:** Kubeflow Pipelines has moved from using [kubeflow/metadata](https://github.com/kubeflow/metadata)
to using [google/ml-metadata](https://github.com/google/ml-metadata) for Metadata dependency.

Kubeflow Pipelines backend stores runtime information of a pipeline run in Metadata store.
Runtime information includes the status of a task, availability of artifacts, custom properties associated
with Execution or Artifact, etc. Learn more at [ML Metadata Get Started](https://github.com/google/ml-metadata/blob/master/g3doc/get_started.md).

You can view the connection between Artifacts and Executions across Pipeline Runs, if 
one Artifact is being used by multiple Executions in different Runs. This connection visualization
is called a *Lineage Graph*.

## Next steps

* Learn about [output Artifact](/docs/components/pipelines/concepts/output-artifact).
