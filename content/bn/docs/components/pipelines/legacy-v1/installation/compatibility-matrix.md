+++
title = "Compatibility Matrix"
description = "Kubeflow Pipelines compatibility matrix with TensorFlow Extended (TFX)"
weight = 100
+++
{{% alert title="Old Version" color="warning" %}}
This page is about __Kubeflow Pipelines V1__, please see the [V2 documentation](/docs/components/pipelines) for the latest information.

Note, while the V2 backend is able to run pipelines submitted by the V1 SDK, we strongly recommend [migrating to the V2 SDK](/docs/components/pipelines/user-guides/migration).
For reference, the final release of the V1 SDK was [`kfp==1.8.22`](https://pypi.org/project/kfp/1.8.22/), and its reference documentation is [available here](https://kubeflow-pipelines.readthedocs.io/en/1.8.22/).
{{% /alert %}}

## Kubeflow Pipelines Backend and TFX compatibility

Pipelines written in any version of [TensorFlow Extended (TFX)](https://www.tensorflow.org/tfx) will execute on any version of Kubeflow Pipelines (KFP) backend. However, some UI features may not be functioning properly if the TFX and Kubeflow Pipelines Backend versions are not compatible.

The following table shows UI feature compatibility for TFX and Kubeflow Pipelines Backend versions:

| [TFX] \ [KFP Backend] | [KFP Backend] <= 1.5                              | [KFP Backend] >= 1.7                           |
| --------------------- | ------------------------------------------------- | ---------------------------------------------- |
| [TFX] <= 0.28.0       | Fully Compatible  ✅                              | Metadata UI not compatible<sup>[2](#fn2)</sup> |
| [TFX] 0.29.0, 0.30.0  | Visualizations not compatible<sup>[1](#fn1)</sup> | Metadata UI not compatible<sup>[2](#fn2)</sup> |
| [TFX] 1.0.0           | Metadata UI not compatible<sup>[2](#fn2)</sup>    | Metadata UI not compatible<sup>[2](#fn2)</sup> |
| [TFX] >= 1.2.0        | Metadata UI not compatible<sup>[2](#fn2)</sup>    | Fully Compatible  ✅                           |

Detailed explanations:

<a name="fn1">1.</a> **Visualizations not compatible**: Kubeflow Pipelines UI and TFDV, TFMA visualizations is not compatible. Visualizations throw an error in Kubeflow Pipelines UI.

<a name="fn2">2.</a> **Metadata UI not compatible**: Kubeflow Pipelines UI and TFX recorded ML Metadata is not compatible. ML Metadata tab in run details page shows error message "Corresponding ML Metadata not found". As a result, visualizations based on ML Metadata do not show up in visualizations tab either.

<!--
Issues that caused the incompatibilities:
* TFX 1.0.0+
	* https://github.com/kubeflow/pipelines/issues/6138#issuecomment-898190223
	* https://github.com/kubeflow/pipelines/issues/6138#issuecomment-899917056
* TFX 0.29.0 https://github.com/tensorflow/tfx/issues/3933
-->

[TFX]: https://github.com/tensorflow/tfx/releases
[KFP Backend]: https://github.com/kubeflow/pipelines/releases
