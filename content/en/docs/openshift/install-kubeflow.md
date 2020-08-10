+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow from the command line"
weight = 4
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

This guide describes how to use the `kfctl` CLI to deploy Kubeflow 1.0 on an existing OpenShift 4.x cluster.

## Prerequisites

### OpenShift 4 cluster

* You need to have access to an OpenShift 4 cluster as `cluster-admin` to be able to deploy Kubeflow.
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

Use the following steps to install Kubeflow 1.0 on OpenShift 4.x.

1. Clone the [opendatahub/manifests]
(https://github.com/opendatahub-io/manifests) repository. This repository defaults to the `v1.0-branch-openshift` branch.

    ```
    git clone https://github.com/opendatahub-io/manifests.git
    cd manifests
    ```

1. Build the deployment configuration using the OpenShift KFDef file and local downloaded manifests.

    > Update the manifest repo URI. Copy the KFDef file to the Kubeflow application directory. And finally build the configuration.

    ```
    # update the manifest repo URI
    sed -i 's#uri: .*#uri: '$PWD'#' ./kfdef/kfctl_openshift.yaml

    # set the Kubeflow application diretory for this deployment, for example /opt/openshift-kfdef
    export KF_DIR=<path-to-kfdef>
    mkdir -p ${KF_DIR}
    cp ./kfdef/kfctl_openshift.yaml ${KF_DIR}
    
    # build deployment configuration
    cd ${KF_DIR}
    kfctl build --file=kfctl_openshift.yaml
    ```

1. Apply the generated deployment configuration.

    ```
    kfctl apply --file=kfctl_openshift.yaml
    ```

1. Wait until all the pods are running.

    ```
    $ oc get pods -n kubeflow
    NAME                                                           READY     STATUS             RESTARTS   AGE
    argo-ui-7c584fc474-k5blx                                       1/1       Running            0          3m46s
    centraldashboard-678f74d985-rblnm                              1/1       Running            0          3m41s
    jupyter-web-app-deployment-57977c6965-2qznb                    1/1       Running            0          3m37s
    katib-controller-fddbb4864-fdzf5                               1/1       Running            1          3m4s
    katib-db-6b9b5bc446-6pbtp                                      1/1       Running            0          3m3s
    katib-manager-7797db7f7c-p5ztb                                 1/1       Running            1          3m3s
    katib-ui-5bdbb97475-585rp                                      1/1       Running            0          3m2s
    metadata-db-c88c9bf6f-5ddbz                                    1/1       Running            0          3m30s
    metadata-deployment-969879b6c-swvqf                            1/1       Running            0          3m30s
    metadata-envoy-deployment-69766744b5-75t5l                     1/1       Running            0          3m29s
    metadata-grpc-deployment-578956fc6d-msvj5                      1/1       Running            3          3m29s
    metadata-ui-57f9b8d667-dckm4                                   1/1       Running            0          3m28s
    minio-784784b9bb-bqslk                                         1/1       Running            0          2m56s
    ml-pipeline-687969b966-wx6jd                                   1/1       Running            0          2m59s
    ml-pipeline-ml-pipeline-visualizationserver-57997bdc64-jw6l4   1/1       Running            0          2m37s
    ml-pipeline-persistenceagent-b74f6455b-z9nzw                   1/1       Running            0          2m51s
    ...
    ```

1. The command below looks up the URL of Kubeflow user interface assigned by the OpenShift cluster. You can open the printed URL in your broser to access the Kubeflow user interface.

    ```
    oc get routes -n istio-system istio-ingressgateway -o jsonpath='http://{.spec.host}/'
    ```

## Next steps

* Learn about the [changes made](https://developers.redhat.com/blog/2020/02/10/installing-kubeflow-v0-7-on-openshift-4-2/) to Kubeflow manifests to enable deployment on OpenShift
* See how to [upgrade Kubeflow](/docs/upgrading/upgrade/) and how to 
  [upgrade or reinstall a Kubeflow Pipelines deployment](/docs/pipelines/upgrade/).
* See how to [uninstall](/docs/openshift/uninstall-kubeflow) your Kubeflow deployment 
  using the CLI.
