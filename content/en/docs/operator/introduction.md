+++
title = "Introduction"
description = "Kubeflow Operator introduction"
weight = 4
+++

This guide describes the Kubeflow Operator and the current supported releases of Kubeflow Operator.

## Kubeflow Operator

Kubeflow Operator helps deploy, monitor and manage the lifecycle of Kubeflow. Built using the [Operator Framework](https://coreos.com/blog/introducing-operator-framework) which offers an open source toolkit to build, test, package operators and manage the lifecycle of operators.

The operator is currently in incubation phase and is based on this [design doc](https://docs.google.com/document/d/1vNBZOM-gDMpwTbhx0EDU6lDpyUjc7vhT3bdOWWCRjdk/edit#). It is built on top of _KfDef_ CR, and uses _kfctl_ as the nucleus for Controller. Current roadmap for this Operator is listed [here](https://github.com/kubeflow/kfctl/issues/193). The Operator is also [published on OperatorHub](https://operatorhub.io/operator/kubeflow).

Applications and components to be deployed as part of Kubeflow platform are defined in the KfDef configuration manifest. Each application has a [kustomize](https://github.com/kubernetes-sigs/kustomize) configuration with all its resource manifests. KfDef `spec` includes the `applications` field.  Application are specified in the `kustomizeConfig` field. `parameters` and `overlays` may be used to provide custom setting for the application. `repoRef` field specifies the path to retrieve the application's kustomize configuration.

KfDef `spec` may also include a `plugins` field for certain cloud platforms, including AWS and GCP. It is used by the platforms to preprocess certain tasks before Kubeflow deployment.

An example of KfDef is as follow:

```yaml
apiVersion: kfdef.apps.kubeflow.org/v1
kind: KfDef
metadata:
  namespace: kubeflow
spec:
  applications:
  # Install Istio
  - kustomizeConfig:
      repoRef:
        name: manifests
        path: stacks/ibm/application/istio-stack
    name: istio-stack
  # Install Kubeflow applications.
  - kustomizeConfig:
      repoRef:
        name: manifests
        path: stacks/ibm
    name: kubeflow-apps
  # Other applications
  - kustomizeConfig:
      repoRef:
        name: manifests
        path: stacks/ibm/application/spark-operator
    name: spark-operator
  # Model Serving applications
  - kustomizeConfig:
      repoRef:
        name: manifests
        path: knative/installs/generic
    name: knative
  - kustomizeConfig:
      repoRef:
        name: manifests
        path: kfserving/installs/generic
    name: kfserving
  repos:
  - name: manifests
    uri: https://github.com/kubeflow/manifests/archive/master.tar.gz
  version: master
  ```

More KfDef examples may be found in Kubeflow [manifests](https://github.com/kubeflow/manifests/tree/master/kfdef) repo. Users can pick one there and make some modification to fit their requirements. [OpenDataHub](https://github.com/opendatahub-io) project also maintains a KfDef [manifest](https://github.com/opendatahub-io/manifests/blob/v1.0-branch-openshift/kfdef/kfctl_openshift.yaml) for Kubeflow deployment on OpenShift Container Platforms.

The operator watches on all KfDef configuration instances in the cluster as custom resources (CR) and manage them. It handles reconcile requests to all the _KfDef_ instances. To understand more on the operator controller behavior, refer to this [controller-runtime link](https://github.com/kubernetes-sigs/controller-runtime/blob/master/pkg/doc.go).

Kubeflow Operator shares the same packages and functions as the `kfctl` CLI, which is the command line approach to deploy Kubeflow. Therefore, the deployment flow is similar except that the `ownerReferences` metadata is added for each application's Kubernetes object. The KfDef CR is the parent of all these objects. Kubeflow Operator does better in tearing down the Kubeflow deployment than the CLI approach. When the KfDef CR is deleted, Kubernetes garbage collection mechanism then takes over the responsibility to remove all and only the resources deployed through this KfDef configuration.

One of the many good reasons to use an operator is to monitor the resources. The Kubeflow Operator also watches all child resources of the KfDef CR. Should any of these resources be deleted, the operator would try to apply the resource manifest and bring the object up again.

The operator responds to following events:

* When a _KfDef_ instance is created or updated, the operator's _reconciler_ will be notified of the event and invoke the `Apply` functions provided by the [`kfctl` package](https://github.com/kubeflow/kfctl/tree/master/pkg) to deploy Kubeflow. The Kubeflow resources specified with the manifests will be owned by the _KfDef_ instance with their `ownerReferences` set.

* When a _KfDef_ instance is deleted, since the owner is deleted, all the secondary resources owned by it will be deleted through the [garbage colleciton](https://kubernetes.io/docs/concepts/cluster-administration/kubelet-garbage-collection/). In the mean time, the _reconciler_ will be notified of the event and remove the finalizers.

* When any resource deployed as part of a _KfDef_ instance is deleted, the operator's _reconciler_ will be notified of the event and invoke the `Apply` functions provided by the [`kfctl` package](https://github.com/kubeflow/kfctl/tree/master/pkg) to re-deploy the Kubeflow. The deleted resource will be recreated with the same manifest as specified when the _KfDef_ instance is created.

Deploying Kubeflow with the Kubeflow Operator includes two steps: [installing the Kubeflow Operator](/docs/operator/install-operator) followed by [deploying](/docs/operator/deploy/operator) the KfDef custom resource.

## Current Tested Operators and Pre-built Images

Kubeflow Operator controller logic is based on the [`kfctl` package](https://github.com/kubeflow/kfctl/tree/master/pkg), so for each major release of `kfctl`, an operator image is built and tested with that version of [`manifests`](github.com/kubeflow/manifests) to deploy a _KfDef_ instance. Following table shows what releases have been tested.

|branch tag|operator image|manifests version|kfdef example|note|
|---|---|---|---|---|
|[v1.0](https://github.com/kubeflow/kfctl/tree/v1.0)|[aipipeline/kubeflow-operator:v1.0.0](https://hub.docker.com/layers/aipipeline/kubeflow-operator/v1.0.0/images/sha256-63d00b29a61ff5bc9b0527c8a515cd4cb55de474c45d8e0f65742908ede4d88f?context=repo)|[1.0.0](https://github.com/kubeflow/manifests/tree/f56bb47d7dc5378497ad1e38ea99f7b5ebe7a950)|[kfctl_k8s_istio.v1.0.0.yaml](https://github.com/kubeflow/manifests/blob/f56bb47d7dc5378497ad1e38ea99f7b5ebe7a950/kfdef/kfctl_k8s_istio.v1.0.0.yaml)||
|[v1.0.1](https://github.com/kubeflow/kfctl/tree/v1.0.1)|[aipipeline/kubeflow-operator:v1.0.1](https://hub.docker.com/layers/aipipeline/kubeflow-operator/v1.0.1/images/sha256-828024b773040271e4b547ce9219046f705fb7123e05503d5a2d1428dfbcfb6e?context=repo)|[1.0.1](https://github.com/kubeflow/manifests/tree/v1.0.1)|[kfctl_k8s_istio.v1.0.1.yaml](https://github.com/kubeflow/manifests/blob/v1.0.1/kfdef/kfctl_k8s_istio.v1.0.1.yaml)||
|[v1.0.2](https://github.com/kubeflow/kfctl/tree/v1.0.2)|[aipipeline/kubeflow-operator:v1.0.2](https://hub.docker.com/layers/aipipeline/kubeflow-operator/v1.0.2/images/sha256-18d2ca6f19c1204d5654dfc4cc08032c168e89a95dee68572b9e2aaedada4bda?context=repo)|[1.0.2](https://github.com/kubeflow/manifests/tree/v1.0.2)|[kfctl_k8s_istio.v1.0.2.yaml](https://github.com/kubeflow/manifests/blob/v1.0.2/kfdef/kfctl_k8s_istio.v1.0.2.yaml)||
|[v1.1.0](https://github.com/kubeflow/kfctl/tree/v1.1.0)|[aipipeline/kubeflow-operator:v1.1.0](https://hub.docker.com/layers/aipipeline/kubeflow-operator/v1.0.0/images/sha256-63d00b29a61ff5bc9b0527c8a515cd4cb55de474c45d8e0f65742908ede4d88f?context=explore)|[1.1.0](https://github.com/kubeflow/manifests/tree/v1.1.0)|[kfctl_ibm.v1.1.0.yaml](https://github.com/kubeflow/manifests/blob/v1.1.0/kfdef/kfctl_ibm.yaml)||
|[master](https://github.com/kubeflow/kfctl)|[aipipeline/kubeflow-operator:master](https://hub.docker.com/layers/aipipeline/kubeflow-operator/master/images/sha256-e81020c426a12237c7cf84316dbbd0efda76e732233ddd57ef33543381dfb8a1?context=repo)|[master](https://github.com/kubeflow/manifests)|[kfctl_ibm.yaml](https://github.com/kubeflow/manifests/blob/master/kfdef/kfctl_ibm.yaml)|as of 07/29/2020|

> Note: if building a customized operator for a specific version of Kubeflow is desired, you can run `git checkout` to that specific branch tag. Keep in mind to use the matching version of manifests.
