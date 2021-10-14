+++
title = "Dockerfile Locations"
description = "Where to find the Dockerfiles for all of Kubeflow's images"
weight = 10
                    
+++

| Image Name        | Dockerfile Location |
| ------------- |---------------|
| kubeflow/training-operator     | <https://github.com/kubeflow/training-operator/blob/master/build/images/training-operator/Dockerfile> |
| ml-pipeline/persistenceagent      | <https://github.com/kubeflow/pipelines/tree/master/backend> |
| ml-pipeline/scheduledworkflow | <https://github.com/kubeflow/pipelines/tree/master/backend> |
| ml-pipeline/frontend | <https://github.com/kubeflow/pipelines/blob/master/frontend/Dockerfile> |
| kubeflowkatib/katib-controller    | <https://github.com/kubeflow/katib/tree/master/cmd/katib-controller/v1beta1/Dockerfile> |
| kubeflowkatib/katib-ui    | <https://github.com/kubeflow/katib/tree/master/cmd/ui/v1beta1/Dockerfile> |
| kubeflowkatib/katib-db-manager |     <https://github.com/kubeflow/katib/tree/master/cmd/db-manager/v1beta1/Dockerfile> |
| kubeflowkatib/katib-cert-generator |     <https://github.com/kubeflow/katib/blob/master/cmd/cert-generator/v1beta1/Dockerfile> |
| kubeflowkatib/suggestion-skopt | <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/skopt/v1beta1/Dockerfile> |
| kubeflowkatib/suggestion-chocolate |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/chocolate/v1beta1/Dockerfile> |
| kubeflowkatib/suggestion-hyperopt |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/hyperopt/v1beta1/Dockerfile> |
| kubeflowkatib/suggestion-hyperband |     <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/hyperband/v1beta1/Dockerfile> |
| kubeflowkatib/suggestion-enas |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/nas/enas/v1beta1/Dockerfile> |
| kubeflowkatib/suggestion-darts |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/nas/darts/v1beta1/Dockerfile> |
| kubeflowkatib/suggestion-goptuna |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/goptuna/v1beta1/Dockerfile> |
| kubeflowkatib/suggestion-optuna |    <https://github.com/kubeflow/katib/blob/master/cmd/suggestion/optuna/v1beta1/Dockerfile> |
| kubeflowkatib/earlystopping-medianstop |    <https://github.com/kubeflow/katib/blob/master/cmd/earlystopping/medianstop/v1beta1/Dockerfile> |
| kubeflowkatib/file-metrics-collector |    <https://github.com/kubeflow/katib/blob/master/cmd/metricscollector/v1beta1/file-metricscollector/Dockerfile> |
| kubeflowkatib/tfevent-metrics-collector |    <https://github.com/kubeflow/katib/blob/master/cmd/metricscollector/v1beta1/tfevent-metricscollector/Dockerfile> |
| kubeflowkatib/mxnet-mnist |    <https://github.com/kubeflow/katib/blob/master/examples/v1beta1/mxnet-mnist/Dockerfile> |
| kubeflowkatib/pytorch-mnist |    <https://github.com/kubeflow/katib/blob/master/examples/v1beta1/pytorch-mnist/Dockerfile> |
| kubeflowkatib/enas-cnn-cifar10-gpu |    <https://github.com/kubeflow/katib/blob/master/examples/v1beta1/nas/enas-cnn-cifar10/Dockerfile.gpu> |
| kubeflowkatib/enas-cnn-cifar10-cpu |    <https://github.com/kubeflow/katib/blob/master/examples/v1beta1/nas/enas-cnn-cifar10/Dockerfile.cpu> |
| kubeflowkatib/darts-cnn-cifar10 |    <https://github.com/kubeflow/katib/blob/master/examples/v1beta1/nas/darts-cnn-cifar10/Dockerfile> |
| kubeflow/mpi-horovod-mnist |    <https://github.com/kubeflow/mpi-operator/blob/master/examples/horovod/Dockerfile.cpu> |
| datawire/ambassador    | <https://github.com/datawire/ambassador/blob/master/builder/Dockerfile> |
| jupyter-tensorflow-full |    <https://github.com/kubeflow/kubeflow/blob/master/components/example-notebook-servers/jupyter-tensorflow-full/cpu.Dockerfile> |
| jupyter |    <https://github.com/kubeflow/kubeflow/blob/master/components/example-notebook-servers/jupyter/Dockerfile> |
| profile-controller    | <https://github.com/kubeflow/kubeflow/tree/master/components/profile-controller> |
| notebook-controller |    <https://github.com/kubeflow/kubeflow/tree/master/components/notebook-controller> |
