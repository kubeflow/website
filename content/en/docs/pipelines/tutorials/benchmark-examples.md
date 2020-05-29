+++
title = "Using the Kubeflow Pipelines Benchmark Scripts"
description = "How to use the Kubeflow Pipelines Benchmark Scripts"
weight = 10
+++

This guide explains the Kubeflow Pipelines [benchmark scripts](https://github.com/kubeflow/pipelines/tree/master/tools/benchmarks)
and demonstrates how to use them to collect basic performance data of a given
Kubeflow Pipelines deployemnt.

## Background and Overview

The Kubeflow Pipelines benchmark scripts simulate typical workloads, apply them
to the Kubeflow Pipelines deployment, and record the server latencies and
pipeline run durations under the workloads.

To simulate a typical workload, the benchmark script will use a pipeline
manifest file, upload it to the Kubeflow Pipelines deployment as a pipeline or
a pipeline version, and then run the uploaded pipeline or pipeline version
multiple times simulatenuously. Users can specify the pipelines manifest used in
the benchmark script. E.g., the preloaded samples in Kubeflow pipelines can be
used. Moreover, it is also a good practice to use a representative pipeline
manifest in light of the particular Kubeflow Pipelines use case. E.g., if a
Kubeflow Piplines deployment is mainly used for pipelines of image recognition
tasks, then it would be desirable to use an image recognition pipeline in the
benchmark scripts.

When a proper pipeline is chosen, the benchmark scripts will run it multiple
times simultaneously on a given Kubeflow Pipelines deployment, and collects the
server latencies and run durations. Among all the operations that the Kubeflow
Pipelines can perform, running a pipeline is arguably the most unpredictable and
costly one. Other operations, e.g., creating a pipeline (version) or creating an
experiment, usually induce a predicatable and moderate cost. E.g., creating a
pipeline version will introduce a new row in the pipeline versions table, a new
file in minio server. The new file's size depends on the pipeline version's
manifest. If we exclude the rare case of an extremely large manifest and assume
an average sized manifest for each created pipeline version, the total cost of
creating a pipeline version grows linearly with the number of pipeline versions.
However, on the other hand, the cost of running a pipeline or a pipeline version
involves much more uncertainty and sometimes quite high a cost. A pipeline or a
pipeline version can have arbitrary components and hence running a pipeline or a
pipeline version can incur arbitrary time and space complexities. E.g., the step
in a pipeline can use a customized container imange which performs a super
expensive training task. In addition, the runs in a Kubeflow Pipelines deployment
also consume more DB space than pipelines, pipeline versions, experiments, etc.

Therefore, when the performance and scalibility of Kubeflow Pipelines are in
question, the simulated benchmark workloads are intended to focus on the
operation of running a pipeline or a pipeline version in order to targe the pain
point of Kubeflow Pipelines and reveal more useful information.

## Prerequisites for Running Benchmark Scripts

To use the provided benchmark scripts, you will need:

1. A Jupyter notebook instance
1. A Kubeflow Pipelines deployment
1. A benchmark script
1. A pipeline manifest

The Jupyter notebook instance and the Kubeflow Pipelines deployment needed for
running a benchmark can be hosted either on cloud or on a local machine, as long
as the Jupyter notebook instance has proper accesses to the Kubeflow Pipelines
deployment, e.g., be able to CREAT, GET, DELETE and LIST the pipeline, pipeline
version, run, job and experiment in the Kubeflow Pipelines deployment.

One way of setting up everything and runnning a benchmark script is shown below
as an example.

## An Example of Running Benchmark Scripts

In this example, a Kubeflow Pipelines deployment is hosted on cloud and a
Jupyter notebook instance is hosted on a local machine. The cloud cluster where
the Kubeflow Pipelines deployment resides have two node pools: one is for
running the Kubeflow Pipelines servers, e.g., ml-pipeline and ml-pipeline-ui,
and the other is for running the pipelines.

Moreover, in this example, the benchmark script [run_service_api.ipynb](https://github.com/jingzhang36/pipelines/blob/different_tools/tools/benchmarks/run_service_api.ipynb)
and the public accessible pipeline manifest file [taxi_updated_pool.yaml](https://storage.googleapis.com/jingzhangjz-project-pipelines/benchmarks/taxi_updated_pool.yaml)
will be used.

* Follow the [instructions](https://www.kubeflow.org/docs/pipelines/installation/standalone-deployment/)
to create a new Kubernetes cluster with a cloud service, e.g., Google Cloud, and
then deploy a Kubeflow Pipelines instance to that cluster.
* Add a node pool to the cluster created in the previous step. The new node
pool needs to have a different name than the default node pool in the cluster.
The node configuration in this new node pool can be the same as that of the
default node pool. In this example, please use 'pool-1' as the name of the new
node pool in order to use the prepared pipeline manifest file [taxi_updated_pool.yaml](https://storage.googleapis.com/jingzhangjz-project-pipelines/benchmarks/taxi_updated_pool.yaml).
* Forward local port 3001 from the local machine to the frontend server of the
Kubreflow Pipelines deployment created in the first step. It is also OK to
forward directly to the API server.
```
kubectl port-forward deployment/ml-pipeline-ui 3001:3000 -n kubeflow
```
* [Start a local Jupyter notebook instance](https://jupyter.org/install.html).
* Open [run_service_api.ipynb](https://github.com/jingzhang36/pipelines/blob/different_tools/tools/benchmarks/run_service_api.ipynb)
in the local Jupyter notebook. This benchmark script (a) creates a new pipeline;
(b) uses the default pipeline version of this pipeline to create multiple runs;
(c) records the number of successful runs; (d) records the duration of each of
the successful runs; (e) records the latency of CREAT, GET, DELETE; (f) cleans
up the pipeline and its default pipeline version, the experiment and the runs.
You'll need to fill in proper values for host, pipeline_file_url, num_runs,
run_status_polling_interval_sec in the benchmark script.
> **host** is the url address of the API server in the Kubeflow Pipelines
deployment. In this example, due to the port forwarding mentioned in the
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
'storage.cloud.google.com' will incure a redirect and doesn't work well with
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

## Interpretation of Results

In the above example output, there are two types of plots. One is the
distribution plot, for latency and duration measurement; the other is the count
plot, for couting succeeded and failed runs. The reading of those plots is in
general straightfoward.

In a count plot, the x-axis repsresents the possible run status: success or fail;
and the y-axis shows how many runs fall into certain status respectively.

In a distribution plot, both histogram plot and rug plot are shown. In addtion,
it is also possible to show KDE (Kernel Density Estimate) plot. If a KDE plot is
desirable, please use 'kde=True' in the distplot() method.

## Limitations And Future Work

When the benchmark script is tuned to generate a moderate workload, e.g., 50
runs in the above example, the latency and run duration measurements can be
made properly. However, it is also interesting to see how the Kubeflow Pipelines
deployment will behave or break under some extremely heavy workloads, or in
other words, to probe the Kubeflow Pipelines deployment. The example benchmark
script can be used for that purpose as well. In that case, the measurement plots
of the benchmark script are no longer the expected output, but instead, the
potential errors and error logs are expected to provide information on the
performance and scalibity of the Kubeflow Pipelines deployment. With them, bugs
and pain points can be discovered and then fixed. Moreover, when probing the
Kubeflow Pipelines deployment with extreme workloads, it will be really helpful
to add internal monitoring to the server code to track server performance. E.g.,
in the future, it would be desirable to use [Prometheus](https://prometheus.io/)
to the Kubeflow Pipelines servers.

The internal peformance monitoring inside the servers is complementary to the
performance measurement from the client side. When the example benchmark script
measures the latencies from the client side, the resulting measurements depend
on both the Kubeflow Pipelines deployment and the network transmission. On the
other hand, the internal monitoring focuses on the actual processing cost inside
the server given certain requests. Therefore, having both the client side
measurements and server side monitoring are useful in profiling accurately the
peformance and scalibility of Kubeflow Pipelines.

## Contact

If you run into any issues with the benchmark script and have any suggestions in
profiling the peformance and scalibility of Kubeflow Pipelines, please [open an
issue](https://github.com/kubeflow/pipelines/issues/new) with us.