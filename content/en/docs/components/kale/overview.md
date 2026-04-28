+++
title = "Overview"
description = "An overview for Kubeflow Kale"
weight = 10
+++

## What is Kubeflow Kale?

Kale (Kubeflow Automated pipeLines Engine) turns annotated Jupyter notebooks
into production-ready [Kubeflow Pipelines](https://www.kubeflow.org/docs/components/pipelines/)
without requiring you to write a single line of KFP SDK code.

Tag cells in your notebook, let Kale figure out the data dependencies between
them, and compile the whole thing into a KFP v2 pipeline you can run on any
Kubeflow cluster.

## Why Kale?

- **No SDK boilerplate:** Annotate cells, compile, run. Kale generates the KFP v2 DSL for you — no need to learn components, artifacts, or Python decorators.
- **Automatic data passing:** Variables flow between steps as if you were still in a single notebook. Kale's type-aware marshalling handles numpy, pandas, scikit-learn, PyTorch, Keras, TensorFlow, XGBoost and more.
- **JupyterLab integration:** Tag cells visually, define step dependencies, and submit pipelines from the Kale side panel inside JupyterLab 4.
- **KFP v2 native:** Compiles to the modern KFP v2 pipeline DSL with full artifact support. Runs on any compliant Kubeflow Pipelines backend.

## Kale in the Kubeflow Ecosystem

Kale is part of the Kubeflow **ML Experience Working Group**, alongside the
[Kubeflow SDK](https://sdk.kubeflow.org/).
It lives at the notebook layer — where data scientists prototype — and bridges
the gap to the pipeline layer, where production workloads run.

If KFP is the "how" of running ML pipelines on Kubernetes, Kale is the "what
you meant": take the notebook you already have, and turn it into a pipeline
without rewriting anything.

## Next Steps

- Compile and run your first notebook on Kubeflow Pipelines with the [quickstart guide](https://kubeflow-kale.readthedocs.io/en/latest/getting-started/quickstart.html).
- Understand cell annotations, data marshalling, and how Kale compiles to KFP in the [core concepts](https://kubeflow-kale.readthedocs.io/en/latest/concepts/index.html).
