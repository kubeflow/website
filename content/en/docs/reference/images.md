+++
title = "Dockerfile Locations"
description = "Where to find the Dockerfiles for all of Kubeflow's images"
weight = 10
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

| Image Name        | Dockerfile Location |
| ------------- |---------------|
| tf_operator      | <https://github.com/kubeflow/tf-operator/tree/master/build/images/tf_operator> |
| ml-pipeline/persistenceagent      | <https://github.com/kubeflow/pipelines/tree/master/backend> |
| ml-pipeline/scheduledworkflow | <https://github.com/kubeflow/pipelines/tree/master/backend> |
| ml-pipeline/frontend | <https://github.com/kubeflow/pipelines/blob/master/frontend/Dockerfile> |
| katib/katib-controller    | <https://github.com/kubeflow/katib/tree/master/cmd/katib-controller/v1alpha3/Dockerfile> |
| katib/katib-ui    | <https://github.com/kubeflow/katib/tree/master/cmd/ui/v1alpha3/Dockerfile> |
| katib/katib-db-manager |     <https://github.com/kubeflow/katib/tree/master/cmd/db-manager/v1alpha3/Dockerfile> |
| katib/suggestion-skopt | <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/skopt/v1alpha3/Dockerfile> |
| katib/suggestion-chocolate |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/chocolate/v1alpha3/Dockerfile> |
| katib/suggestion-hyperopt |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/hyperopt/v1alpha3/Dockerfile> |
| katib/suggestion-hyperband |     <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/hyperband/v1alpha3/Dockerfile> |
| katib/suggestion-nasrl |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/nas/enas/v1alpha3/Dockerfile> |
| katib/file-metricscollector |    <https://github.com/kubeflow/katib/blob/master/cmd/metricscollector/v1alpha3/file-metricscollector/Dockerfile> |
| katib/tfevent-metricscollector |    <https://github.com/kubeflow/katib/blob/master/cmd/metricscollector/v1alpha3/tfevent-metricscollector/Dockerfile> |
| datawire/ambassador    | <https://github.com/datawire/ambassador/blob/master/builder/Dockerfile> |
| tensorflow-1.13.1-notebook-cpu |    <https://github.com/kubeflow/kubeflow/blob/master/components/tensorflow-notebook-image/Dockerfile> |
|jupyter-web-app |    <https://github.com/kubeflow/kubeflow/blob/master/components/jupyter-web-app/Dockerfile> |
| profile-controller    | <https://github.com/kubeflow/kubeflow/tree/master/components/profile-controller> |
| notebook-controller |    <https://github.com/kubeflow/kubeflow/tree/master/components/notebook-controller> |
