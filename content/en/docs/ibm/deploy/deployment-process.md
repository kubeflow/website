+++
title = "Kubeflow Deployment Process"
description = "How kubeflow installation works"
weight = 5
+++

## Understanding the Kubeflow deployment process

The deployment process is controlled by the following commands:

* **build** - (Optional) Creates configuration files defining the various
  resources in your deployment. You only need to run `kfctl build` if you want
  to edit the resources before running `kfctl apply`.
* **apply** - Creates or updates the resources.
* **delete** - Deletes the resources.

### App layout

Your Kubeflow application directory **${KF_DIR}** contains the following files and 
directories:

* **${CONFIG_FILE}** is a YAML file that defines configurations related to your 
  Kubeflow deployment.

  * This file is a copy of the GitHub-based configuration YAML file that
    you used when deploying Kubeflow. For example, {{% config-uri-ibm %}}.
  * When you run `kfctl apply` or `kfctl build`, kfctl creates
    a local version of the configuration file, `${CONFIG_FILE}`,
    which you can further customize if necessary.

* **kustomize** is a directory that contains the kustomize packages for Kubeflow applications.
    * The directory is created when you run `kfctl build` or `kfctl apply`.
    * You can customize the Kubernetes resources (modify the manifests and run `kfctl apply` again).

## Kubeflow installation

**Note**: kfctl is currently available for Linux and macOS users only. If you use Windows, you can install kfctl on Windows Subsystem for Linux (WSL). Refer to the official [instructions](https://docs.microsoft.com/en-us/windows/wsl/install-win10) for setting up WSL.

Run the following commands to set up and deploy Kubeflow:

1. Download the latest kfctl {{% kf-latest-version %}} release from the
  [Kubeflow releases 
  page](https://github.com/kubeflow/kfctl/releases/tag/{{% kf-latest-version %}}).
  
  **Note**: You're strongly recommended to install **kfctl v1.2** or above because kfctl v1.2 addresses several critical bugs that can break the Kubeflow deployment.

2. Extract the archived TAR file:

      ```shell
      tar -xvf kfctl_{{% kf-latest-version %}}_<platform>.tar.gz
      ```
3. Make kfctl binary easier to use (optional). If you don’t add the binary to your path, you must use the full path to the kfctl binary each time you run it.

      ```shell
      export PATH=$PATH:<path to where kfctl was unpacked>
      ```
 
 ## Next Steps

 1. Go here for installing [Kubeflow on IKS](/docs/ibm/deploy/install-kubeflow-on-iks)
 2. Go here for installing [Kubeflow on IBM OpenShift](/docs/ibm/deploy/install-kubeflow-on-ibm-openshift)
