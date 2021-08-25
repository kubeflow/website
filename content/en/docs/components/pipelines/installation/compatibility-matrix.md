+++
title = "Compatibility Matrix"
description = "Kubeflow Pipelines compatibility matrix with related software"
weight = 50
+++

## Kubeflow Pipelines Backend and TFX compatibility

| Kubeflow Pipelines Backend & [TFX](https://www.tensorflow.org/tfx) Version | <=0.30.0 | 1.0.0 | 1.2.0 |
|  ----  | ----  | ---- | --- |
| <=1.6  | Compatible | Not fully compatible[1] | Not fully compatible[1]️ |
| >=1.7  | Not fully compatible[1] | Not fully compatible[1] | Compatible |

[1] Kubeflow Pipelines UI integration with TFDV, TFMA visualizations and ML Metadata does not work properly. Because of [a bug in TFX 1.0.0](https://github.com/kubeflow/pipelines/issues/6138#issuecomment-899917056), TFX 1.0.0 does not work with any Kubeflow Pipelines backend versions. Besides UI integration, any version of TFX runs on Kubeflow Pipelines.
