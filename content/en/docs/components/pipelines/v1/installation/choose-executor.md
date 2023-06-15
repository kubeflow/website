+++
title = "Choosing an Argo Workflows Executor"
description = "How to choose an Argo Workflows Executor"
weight = 80
+++

An Argo workflow executor is a process that conforms to a specific interface that allows Argo to perform certain actions like monitoring pod logs, collecting artifacts, managing container lifecycles, etc.

Kubeflow Pipelines runs on [Argo Workflows](https://argoproj.github.io/workflows/) as the workflow engine, so Kubeflow Pipelines users need to choose a workflow executor.

## Choosing the Workflow Executor

1. [Emissary executor](#emissary-executor) has been Kubeflow Pipelines' default executor since Feburay 2022 when KFP 1.8 went GA. 
   We recommend Emissary executor unless you have known compatibility issues with Emissary, in which case please submit your
   feedback in [the Emissary Executor feedback Github issue](https://github.com/kubeflow/pipelines/issues/6249).

1. [Docker executor](#docker-executor) is avaiable as a legacy choice. In case you do have compatibilty issues with Emissary executor,
   and your cluster is running on an older version of Kubernetes (<1.20), you can configure to use Docker executor.

Note that Argo Workflows support other workflow executors, but the Kubeflow Pipelines
team only recommend choosing between emissary executor and docker executor.

### Emissary Executor

Emissary executor is the **default** workflow executor for Kubeflow Pipelines v1.8+. It was first released in Argo Workflows v3.1 (June 2021).
The Kubeflow Pipelines team believe that its architectural and portability
improvements can make it the default executor that most people should use going forward.

* Container Runtime: any
* Reliability: not yet well-tested and not yet popular, but the Kubeflow Pipelines
  team supports it.
* Security: more secure
  * No `privileged` access.
  * Cannot escape the privileges of the pod's service account.
* Migration: `command` must be specified in [Kubeflow Pipelines component specification](https://www.kubeflow.org/docs/components/pipelines/reference/component-spec/).

  Note, the same migration requirement is required by [Kubeflow Pipelines v2 compatible mode](https://www.kubeflow.org/docs/components/pipelines/sdk-v2/v2-compatibility/), refer to
  [known caveats & breaking changes](https://github.com/kubeflow/pipelines/issues/6133).

#### Migrate to Emissary Executor

Prerequisite: emissary executor is only available in Kubeflow Pipelines backend version 1.7+.
To upgrade, refer to [upgrading Kubeflow Pipelines](/docs/components/pipelines/upgrade/).

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

##### Migrate pipeline components to run on emissary executor

Some pipeline components require manual updates to run on emissary executor.
For [Kubeflow Pipelines component specification](https://www.kubeflow.org/docs/components/pipelines/reference/component-spec/) YAML,
the `command` field must be specified.

Step by step component migration tutorial:

1. There is a hello world component:

    ```yaml
    name: hello-world
    implementation:
      container:
        image: hello-world
    ```

1. We can run the container without command/args:

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

1. The updated component can run on emissary executor now.

Note: Kubeflow Pipelines SDK compiler always specifies a command for
[python function based components](https://www.kubeflow.org/docs/components/pipelines/sdk/python-function-components/).
Therefore, these components will continue to work on emissary executor without
modifications.

### Docker Executor

Docker executor used to be the default workflow executor before Kubeflow Pipelines v1.8.

{{% alert title="Warning" color="warning" %}}
Docker executor depends on docker container runtime, which is deprecated on Kubernetes 1.20+.
{{% /alert %}}

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

## References

* [Argo Workflow Executors documentation](https://argoproj.github.io/argo-workflows/workflow-executors/)
* KFP docker executor doesn't support Kubernetes 1.19 or above [kubeflow/pipelines#5714](https://github.com/kubeflow/pipelines/issues/5714)
* Feature request - default to emissary executor [kubeflow/pipelines#5718](https://github.com/kubeflow/pipelines/issues/5718)
