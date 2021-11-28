+++
title = "ML Metadata"
description = "Conceptual overview about Metadata in Kubeflow Pipelines"
weight = 90
                    
+++

**Note:** Kubeflow Pipelines has been migrated from [kubeflow/metadata](https://github.com/kubeflow/metadata)
to [google/ml-metadata](https://github.com/google/ml-metadata) for Metadata dependency.

Kubeflow Pipelines output information of *Executions*, *Artifact* of a pipeline run,
which can be the status of a task, availability of artifacts, custom properties associated
with Execution or Artifact, etc. 

You can view the connection between Artifacts and Executions across Pipeline Runs, if 
one Artifact is being used by multiple Executions in different Runs. This connection visualization
is called *Lineage Graph*.

## Next steps

* Learn about [output Aritfact](/docs/components/pipelines/concepts/output-artifact).
