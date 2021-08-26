+++
title = "Compatibility Matrix"
description = "Kubeflow Pipelines compatibility matrix with TFX"
weight = 50
+++

## Kubeflow Pipelines Backend and TFX compatibility

Pipelines written in any version of TFX will execute on any version of KFP (Kubeflow Pipelines) backend. However, some UI features may not be functioning properly if the TFX and Kubeflow Pipelines Backend version is not compatible.

| [TFX] \ [KFP Backend] | <= 1.5                        | >= 1.7                     |
|  -------------------- | ----------------------------- | -------------------------- |
| <= 0.28.0             | Fully Compatible  ✅          | Metadata UI not compatible |
| 0.29.0, 0.30.0        | Visualizations not compatible | Metadata UI not compatible |
| 1.0.0                 | Metadata UI not compatible    | Metadata UI not compatible |
| >= 1.2.0              | Metadata UI not compatible    | Fully Compatible  ✅       |

Detailed explanations:

* **Visualizations not compatible**: Kubeflow Pipelines UI and TFDV, TFMA visualizations is not compatible. Visualizations throw an error in Kubeflow Pipelines UI.
* **Metadata UI not compatible**: Kubeflow Pipelines UI and TFX recorded ML Metadata is not compatible. ML Metadata tab in run details page shows error message "Corresponding ML Metadata not found". As a result, visualizations based on ML Metadata do not show up in visualizations tab either.

<!--
Issues that caused the incompatibilities:
* TFX 1.0.0+
	* https://github.com/kubeflow/pipelines/issues/6138#issuecomment-898190223
	* https://github.com/kubeflow/pipelines/issues/6138#issuecomment-899917056
* TFX 0.29.0 https://github.com/tensorflow/tfx/issues/3933
-->

[TFX]: https://github.com/tensorflow/tfx/releases
[KFP Backend]: https://github.com/kubeflow/pipelines/releases
