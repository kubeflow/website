+++
title = "Using the Kubeflow Pipelines Benchmark Scripts"
description = "How to use the Kubeflow Pipelines Benchmark Scripts"
weight = 10
+++

This guide explains the Kubeflow Pipelines [benchmark scripts](https://github.com/kubeflow/pipelines/tree/master/tools/benchmarks)
and demonstrates how to use them to collect basic performance data of a given
Kubeflow Pipelines instance.

## Overview

The Kubeflow Pipelines benchmark scripts simulate typical workloads and record
performance metrics, such as server latencies and pipeline run durations. To simulate a typical workload, the benchmark script uploads a pipeline
manifest file to a Kubeflow Pipelines instance as a pipeline or
a pipeline version, and creates multiple runs simultaneously.

You can specify the pipelines manifest used in the benchmark script, or you can
use one of the preloaded samples pipelines. For example, the preloaded samples
in Kubeflow pipelines can be used.
Moreover, it is also a good practice to use a pipeline manifest that is representative of your particular use case. For example, if your Kubeflow Pipelines cluster is mainly used for pipelines of image recognition tasks, then it would be desirable to use an image recognition pipeline in the benchmark scripts.

After a proper pipeline is chosen, the benchmark scripts will run it multiple
times simultaneously as mentioned before. Among all the operations that the Kubeflow
Pipelines can perform, running a pipeline is arguably the most unpredictable and
costly one. Other operations, such as creating a pipeline (version) or creating an
experiment, usually induce a predictable and moderate cost. For example, creating a
pipeline version will introduce a new row in the pipeline versions table and a new
file in minio server. The new file's size depends on the pipeline version's
manifest. If we exclude the rare case of an extremely large manifest and assume
an average sized manifest for each created pipeline version, the total cost of
creating a pipeline version grows linearly with the number of pipeline versions.
However, on the other hand, the cost of running a pipeline or a pipeline version
involves much more uncertainty and sometimes quite a high cost. A pipeline or a
pipeline version can have arbitrary components and hence running a pipeline or a
pipeline version can incur arbitrary time and space complexities. For example, a step
in a pipeline can use a customized container image which performs a super
expensive training task. In addition, the runs in a Kubeflow Pipelines instance
also consume more DB space than pipelines, pipeline versions, experiments, etc.
Therefore, in order to understand the performance and scalability pain points in
a Kubeflow Pipelines instance, it is more effective to focus on the run operation
in workloads.

## Prerequisites for running benchmark scripts

To use the provided benchmark scripts, you need the following:

1. A Jupyter notebook environment
1. A Kubeflow Pipelines instance
1. A pipeline manifest

To run the benchmark script, your Jupyter notebook environment must have access to the Kubeflow Pipelines API on your Kubeflow Pipelines cluster. For example, you must be able to call the CREATE, GET, DELETE, and LIST methods of the pipeline, pipeline version, run, job, and experiment services from your Jupyter notebook environment.

One way of setting up everything and running a benchmark script is shown below
as an example.

## Running the benchmark scripts

In this example, a Kubeflow Pipelines instance is hosted on cloud and a
Jupyter notebook instance is hosted on a local machine. The cloud cluster where
the Kubeflow Pipelines instance resides has two node pools: one is for
running the Kubeflow Pipelines servers, such as ml-pipeline and ml-pipeline-ui,
and the other is for running the pipelines.

This example uses the [run_service_api.ipynb](https://github.com/jingzhang36/pipelines/blob/different_tools/tools/benchmarks/run_service_api.ipynb) benchmark script
and the pipeline manifest file [taxi_updated_pool.yaml](https://storage.googleapis.com/jingzhangjz-project-pipelines/benchmarks/taxi_updated_pool.yaml).

* Follow the [instructions](https://www.kubeflow.org/docs/pipelines/installation/standalone-deployment/)
to create a new Kubernetes cluster with a cloud service, for example, Google Cloud, and
then deploy a Kubeflow Pipelines instance to that cluster.
* Add a node pool to the cluster created in the previous step. The new node
pool needs to have a different name than the default node pool in the cluster.
The node configuration in this new node pool can be the same as that of the
default node pool. In this example, please use 'pool-1' as the name of the new
node pool in order to use the prepared pipeline manifest file [taxi_updated_pool.yaml](https://storage.googleapis.com/jingzhangjz-project-pipelines/benchmarks/taxi_updated_pool.yaml).
* Forward local port 3001 from the local machine to the frontend server of the
Kubeflow Pipelines instance created in the first step. It is also OK to
forward directly to the API server.
```
kubectl port-forward deployment/ml-pipeline-ui 3001:3000 -n kubeflow
```
* [Start a local Jupyter notebook instance](https://jupyter.org/install.html).
* Open [run_service_api.ipynb](https://github.com/jingzhang36/pipelines/blob/different_tools/tools/benchmarks/run_service_api.ipynb)
in the local Jupyter notebook. This benchmark script (a) creates a new pipeline;
(b) uses the default pipeline version of this pipeline to create multiple runs;
(c) records the number of successful runs; (d) records the duration of each of
the successful runs; (e) records the latency of CREATE, GET, DELETE; (f) cleans
up the pipeline and its default pipeline version, the experiment and the runs.
You'll need to fill in proper values for host, pipeline_file_url, num_runs,
run_status_polling_interval_sec in the benchmark script.
> **host** is the url address of the API server in the Kubeflow Pipelines
instance. In this example, due to the port forwarding mentioned in the
previous local port forwarding, the host can be set to 'http://127.0.0.1:3001'.
>
> **pipeline_file_url** is the url address of a pipeline manifest file. As
mentioned before, [taxi_updated_pool.yaml](https://storage.googleapis.com/jingzhangjz-project-pipelines/benchmarks/taxi_updated_pool.yaml)
is used. This example pipeline makes use of [nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
to explicitly schedule the runs of this pipeline onto the node pool 'pool-1'.
To use this example pipeline in the benchmark script, please set
**pipeline_file_url** to 'https://storage.googleapis.com/jingzhangjz-project-pipelines/benchmarks/taxi_updated_pool.yaml'.
> - **NOTE**: please do not use the value 'https://storage.cloud.google.com/jingzhangjz-project-pipelines/benchmarks/taxi_updated_pool.yaml',
although it points to the same file. That is because the address starting with
'storage.cloud.google.com' will incur a redirect and doesn't work well with
Kubeflow Pipelines.
>
> **num_runs** specifies how many runs will be created in the benchmark script,
and is a direct indicator of the simulated workload.
> - **NOTE**: please be aware that running the benchmark script on a cloud
service will incur possible charges due to the consumption of cloud resources.
Therefore, please stay within your cloud resource budget if any.
>
> **run_status_polling_interval_sec** sets the time interval between two
adjacent pollings of the run status. When a run reaches the success status, the
run duration is recorded. Only the durations of succeeded runs are recorded.

After the values of the above parameters are properly set, you can run the
benchmark script in the notebook. The following snapshot shows the
results of running the benchmark script [run_service_api.ipynb](https://github.com/jingzhang36/pipelines/blob/different_tools/tools/benchmarks/run_service_api.ipynb)
with **num_runs** being 50 on a Kubernetes cluster with two node pools, while
each node pool has three nodes of machine type 'n1-standard-8'.

<img src="/docs/images/benchmark-snapshot-1.png"
alt="Benchmark Sample Output Plots"
class="mt-3 mb-3 border border-info rounded">

## Interpreting the results

In the above example output, there are two types of plots. One is the
distribution plot, for latency and duration measurement; the other is the count
plot, for counting succeeded and failed runs. The reading of those plots is in
general straightforward.

In a count plot, the x-axis represents the possible run status: success or fail;
and the y-axis shows how many runs fall into certain status respectively.

In a distribution plot, both histogram plot and rug plot are shown. In addition,
it is also possible to show KDE (Kernel Density Estimate) plot. If a KDE plot is
desirable, use 'kde=True' in the distplot() method.

## Limitations and future work

When the benchmark script is tuned to generate a moderate workload, for example, 50
runs in the above example, the latency and run duration measurements can be
made properly. However, it is also interesting to see how a Kubeflow Pipelines
instance behaves or breaks under some extremely heavy workloads, or in
other words, to probe the Kubeflow Pipelines instance. The example benchmark
script can be used for that purpose as well. In that case, the measurement plots
of the benchmark script are no longer the expected output. Instead, the errors
and error logs provide information on the performance and scalability of the
Kubeflow Pipelines deployment. With them, bugs and pain points can be discovered and then fixed. Moreover, when probing the
Kubeflow Pipelines instance with extreme workloads, it will be really helpful
to add internal monitoring to the server code to track server performance.
For example, in the future, it would be desirable to use [Prometheus](https://prometheus.io/)
to track and visualize metrics for Kubeflow Pipelines servers.

The internal performance monitoring inside the servers is complementary to the
performance measurement from the client-side. When the example benchmark script
measures the latencies from the client-side, the resulting measurements depend
on both the Kubeflow Pipelines instance and the network transmission. On the
other hand, the internal monitoring focuses on the actual processing cost inside
the server given certain requests. Therefore, having both the client-side
measurements and server side monitoring are useful in profiling accurately the
performance and scalability of Kubeflow Pipelines.

## Contact

If you run into any issues with the benchmark script and have any suggestions in
profiling the performance and scalability of Kubeflow Pipelines, [open an
issue](https://github.com/kubeflow/pipelines/issues/new) with us.