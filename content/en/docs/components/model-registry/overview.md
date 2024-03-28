+++
title = "Overview"
description = "An overview for Kubeflow Model Registry"
weight = 10
                    
+++

{{% alpha-status
  feedbacklink="https://github.com/kubeflow/model-registry" %}}

## What is Model Registry ?

A model registry is an important component in the life cycle of AI/ML models, an integral component for any MLOps platform and for ML workflows.

A model registry provides a central index for ML model developers to index and manage models, versions, and ML artifacts metadata.
It fills a gap between model experimentation and production activities.
It provides a central interface for all stakeholders in the ML lifecycle to collaborate on ML models.

<img src="/docs/components/model-registry/images/index-mr-loop.png"
  alt="Model Registry MLOps loop"
  class="mt-3 mb-3">

DevOps, Data Scientists, and developers need to collaborate with other users in the ML workflow to get models into production.
Data scientists need an efficient way to share model versions, artifacts and metadata with other users that need to access to those models as part of the MLOps workflow.

<!--
## Architecture

tbd, take from Proposal
-->

## Next steps

Follow the [getting-started guide](/docs/components/model-registry/getting-started/)
to set up Model Registry and run some examples.
