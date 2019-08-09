+++
title = "Dockerfile Locations"
description = "Where to find the Dockerfiles for all of Kubeflow's images"
weight = 10
+++

| Image Name        | Dockerfile Location |
| ------------- |---------------|
| tf_operator      | <https://github.com/kubeflow/tf-operator/tree/master/build/images/tf_operator> |
| ml-pipeline/persistenceagent      | <https://github.com/kubeflow/pipelines/tree/master/backend> |
| ml-pipeline/scheduledworkflow | <https://github.com/kubeflow/pipelines/tree/master/backend> |
| ml-pipeline/frontend | <https://github.com/kubeflow/pipelines/blob/master/frontend/Dockerfile> |
| metrics-collector |    <https://github.com/kubeflow/katib/tree/master/cmd/metricscollector>
| katib/katib-controller    | <https://github.com/kubeflow/katib/tree/master/cmd/katib-controller/v1alpha2/Dockerfile> |
| katib/katib-ui    | <https://github.com/kubeflow/katib/tree/master/cmd/ui/v1alpha2/Dockerfile> |
| katib/katib-manager |     <https://github.com/kubeflow/katib/tree/master/cmd/manager/v1alpha2/Dockerfile> |
| katib/katib-manager-rest    | <https://github.com/kubeflow/katib/blob/master/cmd/manager-rest/v1alpha2/Dockerfile> |
| katib/katib-suggestion-bayesianoptimization    | <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/bayesianoptimization/v1alpha2/Dockerfile> |
| katib/katib-suggestion-grid |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/grid/v1alpha2/Dockerfile> |
| katib/katib-suggestion-hyperband |     <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/hyperband/v1alpha2/Dockerfile> |
| katib/katib-suggestion-random |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/random/v1alpha2/Dockerfile> |
| katib/katib-suggestion-nasrl |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/nasrl/v1alpha2/Dockerfile> |
| jupyterhub-k8s |    <https://github.com/kubeflow/kubeflow/blob/master/components/jupyterhub/docker/Dockerfile> |
| datawire/ambassador    | <https://github.com/datawire/ambassador/blob/master/Dockerfile> |
| tensorflow-1.13.1-notebook-cpu |    <https://github.com/kubeflow/kubeflow/blob/master/components/tensorflow-notebook-image/Dockerfile> |
|jupyter-web-app |    <https://github.com/kubeflow/kubeflow/blob/master/components/jupyter-web-app/Dockerfile> |
| profile-controller    | <https://github.com/kubeflow/kubeflow/tree/master/components/profile-controller> |
| notebook-controller |    <https://github.com/kubeflow/kubeflow/tree/master/components/notebook-controller> |
