+++
title = "Argo Workflow Executors"
description = "How to choose and configure the Argo Workflow Executor?"
weight = 40
+++

An Argo workflow executor is a process that conforms to a specific interface that allows Argo to perform certain actions like monitoring pod logs, collecting artifacts, managing container lifecycles, etc..

Kubeflow Pipelines runs on [Argo Workflows](https://argoproj.github.io/workflows/) as the workflow engine, so Kubeflow Pipelines users need to choose a workflow executor.

## Choosing the Workflow Executor

1. Do you value stability and backward compatibility a lot? For example, you
   are running Kubeflow Pipelines in a production cluster or you maintain production
   pipelines that you don't want to break or migrate.

   If yes, use [docker executor](#docker-executor) and configure your Kubernetes nodes to use docker runtime.

1. For everyone else, we recommend trying out the new [emissary executor](#emissary-executor).

Note, Argo Workflows support other workflow executors, but the Kubeflow Pipelines
team only recommend choosing between docker executor and emissary executor.

### Docker Executor

Docker executor is the **default**.

* Container Runtime: docker only. However, [Kubernetes is deprecating Docker as a container runtime after v1.20](https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/).
  On Google Kubernetes Engine (GKE) 1.19+, container runtime already defaults to containerd.
* Reliability: most well-tested and most popular argo workflows executor
* Security: least secure
  * It requires `privileged` access to `docker.sock` of the host to be mounted which.
  Often rejected by Open Policy Agent (OPA) or your Pod Security Policy (PSP).
  GKE autopilot mode also rejects it, because [No privileged Pods](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview#no_privileged_pods).
  * It can escape the privileges of the pod's service account.

#### Prepare a GKE cluster for Docker Executor

For GKE, the node image decides which container runtime is used. To use docker
container runtime, you need to [specify a node image](https://cloud.google.com/kubernetes-engine/docs/how-to/node-images) with Docker.

You must use one of the following node images:

* Container-Optimized OS with Docker (cos)
* Ubuntu with Docker (ubuntu)

If your nodes are not using docker as container runtime, when you run pipelines
you will always find error messages like:

> This step is in Error state with this message: failed to save outputs: Error response from daemon: No such container: XXXXXX

### Emissary Executor

{{% alpha-status feedbacklink="https://github.com/kubeflow/pipelines/issues/6249" %}}

Emissary executor is new. It's first released in Argo Workflows v3.1 (June 2021).
However, the Kubeflow Pipelines team believe that its architectural, portability
improvements can make it the default executor that most people should use in the
future.

Therefore, the team makes a commitment to actively collect feedback and fix bugs
for the emissary executor, so that we can stablize it faster. So far, Kubeflow
Pipelines test infra has been running stably with the emissary executor.

* Container Runtime: any
* Reliability: not yet well-tested and not yet popular, but the Kubeflow Pipelines
  team supports it.
* Security: more secure
  * No `privileged` access.
  * Cannot escape the privileges of the pod's service account.
* Migration: `command` must be specified in [Kubeflow Pipelines component specification](https://www.kubeflow.org/docs/components/pipelines/reference/component-spec/).

  Note, the same migration requirement is required by [Kubeflow Pipelines v2 compatible mode](https://www.kubeflow.org/docs/components/pipelines/sdk/v2/v2-compatibility/), refer to
  [known caveats & breaking changes](https://github.com/kubeflow/pipelines/issues/6133).

#### Migrate to Emissary Executor

Prerequisite: emissary executor is only available in Kubeflow Pipelines backend version 1.7+.

##### Configure an existing Kubeflow Pipelines cluster to use emissary executor

1. Install [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl).
1. Connect to your cluster via kubectl.
1. Switch to the namespace you installed Kubeflow Pipelines:

    ```bash
    kubectl config set-context --current --namespace <your-kfp-namespace>
    ```

    Note, usually it's `kubeflow` or `default`.

1. Confirm current workflow executor:

    ```bash
    kubectl describe configmap workflow-controller-configmap | grep -A 2 containerRuntimeExecutor
    ```

    You'll see output like the following when using docker executor:

    ```text
    containerRuntimeExecutor:
    ----
    docker
    ```

1. Configure workflow executor to emissary:

    ```bash
    kubectl patch configmap workflow-controller-configmap --patch '{"data":{"containerRuntimeExecutor":"emissary"}}'
    ```

1. Confirm workflow executor is changed successfully:

    ```bash
    kubectl describe configmap workflow-controller-configmap | grep -A 2 containerRuntimeExecutor
    ```

    You'll see output like the following:

    ```text
    containerRuntimeExecutor:
    ----
    emissary
    ```

##### Deploy a new Kubeflow Pipelines cluster with emissary executor

For [AI Platform Pipelines](https://cloud.google.com/ai-platform/pipelines/docs), check the "Use emissary executor" checkbox during installation.

For [Kubeflow Pipelines Standalone](https://www.kubeflow.org/docs/components/pipelines/installation/standalone-deployment/), install `env/platform-agnostic-emissary`:

```bash
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-emissary?ref=$PIPELINE_VERSION"
```

When in doubt, you can always deploy your Kubeflow Pipelines cluster first and
configure workflow executor after installation using the instructions for
existing clusters.

##### Migrate pipeline components

`command` must be specified in [Kubeflow Pipelines component specification](https://www.kubeflow.org/docs/components/pipelines/reference/component-spec/).
This is only for component spec YAML.

Example migration:

1. I have a hello world component:

    ```yaml
    name: hello-world
    implementation:
      container:
        image: hello-world
    ```

1. Normally, I can run the container without command/args:

    ```bash
    $ docker run hello-world
    Hello from Docker!
    ...
    ```

1. Find out what the default ENTRYPOINT and CMD is in the image:

    ```bash
    $ docker image inspect -f '{{.Config.Entrypoint}} {{.Config.Cmd}}' hello-world
    [] [/hello]
    ```

    So ENTRYPOINT is not specified, and CMD is ["/hello"].
    Note, ENTRYPOINT roughly means `command` and CMD roughly
    means `arguments`. `command` and `arguments` are concatenated as the user
    command.

1. Update the component YAML:

    ```yaml
    name: hello-world
    implementation:
      container:
        image: hello-world
        command: ["/hello"]
    ```

1. The updated component can be used on emissary executor now.

Note, Kubeflow Pipelines SDK compiler always specifies a command for
[Python function based components](https://www.kubeflow.org/docs/components/pipelines/sdk/python-function-components/).
Therefore, python function based components will continue to work on emissary
executor without modifications.

## References

* [Argo Workflow Executors documentation](https://argoproj.github.io/argo-workflows/workflow-executors/)
* KFP docker executor doesn't support Kubernetes 1.19 or above [kubeflow/pipelines#5714](https://github.com/kubeflow/pipelines/issues/5714)
* feature request - default to emissary executor [kubeflow/pipelines#5718](https://github.com/kubeflow/pipelines/issues/5718)

<!--
1. TL; DR, recommend emissary, use docker if stable is important
1. Choosing the workflow executor is an important decision you need to make, because there's no one single executor we can recommend as default.
1. find out current executor
1. docker executor
    * link to GKE configuration for using docker container runtime, required by docker executor
1. emissary executor
    * how to migrate to emissary executor
        * requirements: upgrade to KFP 1.7.0-rc.3+, because emissary is new.
        * how to configure
            * in kfp standalone
            * in ai platform pipelines
            * after installation
        * how to migrate components and pipelines to emissary
    * other known caveats about emissary
1. refer to argo doc for full details: <https://argoproj.github.io/argo-workflows/workflow-executors/>

Separate doc/issues:

1. instructions for installing KFP emissary in GKE autopilot
1. Add FAQ pointing to this documentation
-->
