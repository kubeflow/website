+++
title = "Kubeflow Pipelines SDK for Tekton"
description = "How to run Kubeflow Pipelines with Tekton"
weight = 140
                    
+++

By default Kubeflow Pipelines get compiled into [Argo Workflow Templates](https://github.com/argoproj/argo/blob/master/docs/workflow-concepts.md)
in order to be run on by the Argo Workflow Engine on a Kubernetes cluster.
If you wan to run your pipelines on a [Tekton](https://tekton.dev/) backend instead, you can use the [KFP-Tekton SDK](https://github.com/kubeflow/kfp-tekton/sdk)
to compile your Kubeflow Pipeline DSL Python scripts into a
[Tekton `PipelineRun`](https://tekton.dev/docs/pipelines/pipelineruns/).

## Extensions to the Kubeflow Pipelines SDK

In addition to the functionality provided by the Kubeflow Pipelines
[SDK](/docs/pipelines/sdk/sdk-overview/) the `kfp-tekton`
SDK provides a `TektonCompiler` and a `TektonClient`:

* `TektonCompiler`:

  * `kfp_tekton.compiler.TektonCompiler.compile` compiles Python DSL code into a 
    YAML file containing a Tekton `PipelineRun` which can be deployed directly to
    a Tekton enabled Kubernetes cluster or uploaded to the Kubeflow Pipelines
    dashboard with the Tekton backend.
   
* `TektonClient`:

  * `kfp_tekton.TektonClient.create_run_from_pipeline_func` compiles DSL pipeline
    function and runs the pipeline on a Kubernetes cluster with KFP and Tekton

## Set up the Python environment

You need **Python 3.5** or later to use the Kubeflow Pipelines SDK for Tekton.
We recommend to create a Python virtual environment first using
[Miniconda](https://conda.io/miniconda.html) or a virtual environment
manager such as `virtualenv` or the Python 3 `venv` module:

    python3 -m venv .venv-kfp-tekton
    source .venv-kfp-tekton/bin/activate

## Install the KFP-Tekton SDK
    
You can install the latest release of the `kfp-tekton` compiler from
[PyPi](https://pypi.org/project/kfp-tekton/):
    
    pip3 install kfp-tekton --upgrade

## Additional requirements

In order to run the compiled pipelines on a Kubernetes cluster you need to install the
[Kubeflow Pipelines with Tekton backend](https://github.com/kubeflow/kfp-tekton/tree/master/tekton_kfp_guide.md).
Alternatively you can install Tekton [`v0.14.0`](https://github.com/tektoncd/pipeline/releases/tag/v0.14.0)
or [later](https://github.com/tektoncd/pipeline/releases/latest) along with the
Tekton CLI [`0.11.0`](https://github.com/tektoncd/cli/releases/tag/v0.11.0).

## Compiling Kubeflow Pipelines DSL Scripts

The `kfp-tekton` Python package comes with the `dsl-compile-tekton` command line
executable, which should be available in your terminal shell environment after
installing the `kfp-tekton` Python package.

If you cloned the `kfp-tekton` project, you can find example pipelines in the
`samples` folder or under `sdk/python/tests/compiler/testdata` folder.

    dsl-compile-tekton \
        --py sdk/python/tests/compiler/testdata/parallel_join.py \
        --output pipeline.yaml


**Note**: If the KFP DSL script contains a `__main__` method calling the
`kfp_tekton.compiler.TektonCompiler.compile()` function:

```Python
if __name__ == "__main__":
    from kfp_tekton.compiler import TektonCompiler
    TektonCompiler().compile(pipeline_func, "pipeline.yaml")
```

The pipeline can then be compiled by running the DSL script with `python3`
directly from the command line, producing a Tekton YAML file `pipeline.yaml`
in the same directory:

    python3 pipeline.py

## Tekton workspace configuration for big data passing

When [big data files](https://github.com/kubeflow/kfp-tekton/blob/master/samples/big_data_passing/big_data_passing_description.ipynb)
are defined in a pipeline, Tekton will create a workspace to share these big data
files among tasks that run in the same pipeline. By default, the workspace is a
Read Write Many PVC with 2Gi storage, but you can change these configuration
using the environment variables below:

    export DEFAULT_ACCESSMODES=ReadWriteMany
    export DEFAULT_STORAGE_SIZE=2Gi

## Running the Compiled Pipeline on a Tekton Cluster

After compiling the `sdk/python/tests/compiler/testdata/parallel_join.py` DSL script
in the step above, the generated Tekton YAML needs to be deployed to a Kubernetes
cluster with `kubectl`. The Tekton server will automatically start a pipeline run.

    kubectl apply -f pipeline.yaml

Follow the logs using the `tkn` CLI.
    
    tkn pipelinerun logs --last --follow

Once the Tekton Pipeline is running, the logs should start streaming:
      
    Waiting for logs to be available...
    
    [gcs-download : main] With which he yoketh your rebellious necks Razeth your cities and subverts your towns And in a moment makes them desolate

    [gcs-download-2 : main] I find thou art no less than fame hath bruited And more than may be gatherd by thy shape Let my presumption not provoke thy wrath

    [echo : main] Text 1: With which he yoketh your rebellious necks Razeth your cities and subverts your towns And in a moment makes them desolate
    [echo : main]
    [echo : main] Text 2: I find thou art no less than fame hath bruited And more than may be gatherd by thy shape Let my presumption not provoke thy wrath
    [echo : main]

## Next steps

* [Installing Kubeflow Pipelines with Tekton Backend](https://github.com/kubeflow/kfp-tekton/blob/master/guides/kfp_tekton_install.md)
* [KFP-Tekton Compiler Features](https://github.com/kubeflow/kfp-tekton/blob/master/sdk/FEATURES.md)
* [Kubeflow Pipelines for Tekton on GitHub](https://github.com/kubeflow/kfp-tekton)
