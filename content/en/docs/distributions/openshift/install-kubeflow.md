+++
title = "Install Kubeflow on OpenShift"
description = "Instructions for deploying Kubeflow on an OpenShift cluster from the command line"
weight = 4
                    
+++

This guide describes how to use the `kfctl` CLI to deploy Kubeflow 1.6 on an existing OpenShift 4.9 cluster.

## Prerequisites

### OpenShift 4 cluster

* You need to have access to an OpenShift 4.9 cluster as `cluster-admin` to be able to deploy Kubeflow.
* You can use [Code Ready Containers](https://code-ready.github.io/crc/) (CRC) to run a local cluster, use [try.openshift.com](https://try.openshift.com) to create a new cluster or use an existing cluster.
* Install [`oc` command-line tool](https://docs.openshift.com/container-platform/4.2/cli_reference/openshift_cli/getting-started-cli.html) to communicate with the cluster.

#### Code Ready Containers

If you are using Code Ready Containers, you need to make sure you have enough resources configured for the VM:

Recommended: 

```
16 GB memory
6 CPU
45 GB disk space
```

Minimal:

```
10 GB memory
6 CPU
30 GB disk space (default for CRC)
```

## Installing Kubeflow

Use the following steps to install Kubeflow 1.6 on OpenShift 4.9.


1. Clone the `manifests` repo in the  [opendatahub-io](https://github.com/opendatahub-io/manifests/tree/v1.6-branch-openshift) org.

```commandline
git clone https://github.com/opendatahub-io/manifests.git --branch v1.6-branch-openshift
```

2. Create `kubeflow` namespaces

```commandline
oc create ns kubeflow
oc create ns kubeflow-user-example-com
```

4. Deploy all Kubeflow components under `openshift` stack using the following command:

```commandline
while ! kustomize build openshift/example/istio | kubectl apply -f -; do echo "Retrying to apply resources"; sleep 10; done
```

5. Wait until all the pods are running.

    ```
    $ oc get pods -n kubeflow
    NAME                                               READY   STATUS              RESTARTS   AGE
    admission-webhook-deployment-6748884cff-wb7kp      1/1     Running             0          42h
    cache-deployer-deployment-799f449d59-5zl2l         1/1     Running             0          42h
    cache-server-67849767c5-7w44j                      1/1     Running             0          42h
    centraldashboard-78f95899fc-8rt8k                  1/1     Running             0          42h
    metadata-envoy-deployment-67fd74f564-tsrxm         1/1     Running             0          42h
    metadata-grpc-deployment-9d547547d-g9cq7           1/1     Running             0          42h
    metadata-writer-7776fc6f6f-4f4hp                   1/1     Running             0          42h
    minio-5cb67d5f6d-l9665                             1/1     Running             0          42h
    ml-pipeline-6d4fbc667b-hhqsw                       1/1     Running             0          42h
    ml-pipeline-persistenceagent-667c448c65-r9sn5      1/1     Running             0          42h
    ml-pipeline-scheduledworkflow-5b9769fc8b-s9nt8     1/1     Running             0          42h
    ml-pipeline-ui-6f9f496b7-9rr4s                     1/1     Running             0          42h
    ml-pipeline-viewer-crd-77ccffd6d4-n4x55            1/1     Running             0          42h
    ml-pipeline-visualizationserver-6c7b448b99-5ttn4   1/1     Running             0          42h
    mysql-7659b8f58c-npr57                             1/1     Running             0          42h
    profiles-deployment-7c8446984b-nvvh7               2/2     Running             0          42h
    workflow-controller-7899f6947-gz7km                1/1     Running             0          42h    
    ...
    ```

6. The command below looks up the URL of the Kubeflow user interface assigned by the OpenShift cluster. You can open the printed URL in your browser to access the Kubeflow user interface.

    ```
    oc get routes -n istio-system istio-ingressgateway -o jsonpath='http://{.spec.host}/'
    ```

