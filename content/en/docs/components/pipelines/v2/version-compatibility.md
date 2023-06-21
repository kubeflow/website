+++
title = "Version Compatibility"
description = "Version compatibility between KFP Runtime and KFP SDK"
weight = 80
+++

{{% kfp-v2-keywords %}}

The following table presents a comprehensive overview of the version compatibility between Kubeflow Pipelines (KFP) Runtime and KFP SDK.

| KFP Runtime | KFP SDK | Notes |
|---|---|---|
| v2.0.* | v2.0.* | Active development. Support for certain features may be staged between the Runtime and the SDK. |
| v2.0.* | v1.8.* | Backward compatibility maintained. No v2 features support. |
| v1.8.* | v1.8.* | Maintenance mode. Full compatibility for features available from SDK v1 namespace. Deprecated support for features from SDK v2 namespace. |
| v1.7.* | * | Not recommended due to the age of the release. |
| * | v1.7.* | Not recommended due to the age of the release. |

Please note that while we aim to sure backward compatibility when possible, it is always recommended to use the latest version of both KFP Runtime and KFP SDK to take advantage of the full range of features and improvements.

For more detailed information on feature support, please refer to the version-specific user documentation:

* [Kubeflow Pipelines v1][kfp-v1-doc]
* [Kubeflow Pipelines v2][kfp-v2-doc]

[kfp-v1-doc]: /docs/components/pipelines/v1
[kfp-v2-doc]: /docs/components/pipelines/v2
