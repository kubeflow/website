+++
title = "Developer Setup"
description = "Documentation for Kubeflow Development"
weight = 50
+++


## Introduction  

Kubeflow has several projects in GitHub, many of which produce one or more artifacts, like container
images, that are used in the standard Kubeflow deployment. What's a standard deployment? As of v0.6, it is defined in an app.yaml file that you can generate locally or through `kfctl`. We'll walk through both mechanisms for completeness. The app.yaml file is your window into which containers are necessary for several use cases:

- Complete local deployment of all components
- Integration testing of the entire Kubeflow platform
- Rapid Kubeflow deployment once all containers are built. This is the same as an air-gapped deployment after the containers are built locally (ie no need to be connected to the Internet).

## Architecture Introduction

The Kubeflow architecture is loosely coupled - there are core components and multiple extensions to the core. An example of an extension are the model training frameworks, like Tensorflow and PyTorch. A user may elect to deploy one or several of these frameworks. By default, both are deployed as part of the default app.yaml file.

### Logical Components

This diagram highlights the key logical components of Kubeflow

![Logical Diagram][logical_diagram]

### High Level Deployment Overview

The high level deployment diagram describes the major component areas of Kubeflow.

![Deployment Diagram - High Level][deployment_diagram_hl]

### Detailed Deployment Overview

This low level diagram shows the major component within the component areas described in the high level diagram.

![Deployment Diagram - Detailed][deployment_diagram_ll]

## Developer Setup

This section focuses on setting up your workstation so that you can achieve the use cases listed above. To simplify the instructions, it is assumed you have a linux system, which you can easily access on all modern desktop operating systems - Windows, Mac, and Linux distributions.

The general process:

1. Access your linux system
2. Ensure you have required tools
3. Download the source code (git repositories)
4. Build containers locally
5. Launch Kubeflow using local containers

### 1. Access Linux

The instructions below rely on common linux constructs. The good news is that [accessing a linux system](#linux-options-a) has never been easier. Beyond the linux requirement, you'll find that Kubeflow can be resource intensive - building or downloading the containers will take many gigabytes of disk space. Further, depending on how many of the components you run, the platform will require sufficient memory and compute just to run the platform, and more to run training jobs or serving models.

The [system requirements](#system-requirements-a) section below has the minimum suggested cpu, memory, and disk space for building and deploying the standard Kubeflow setup.

The remaining instructions below assume you have opened a command line terminal in your Linux system.

### 2. Tool requirements

Ensure you have the following tools installed:
- git
- docker (this may be optional in the future with Knative build)

You can verify you have these tools:
```
# Each of these commands should return the path to the binary.
# If the path isn't returned, then install

which git     
which docker
which wget
```

### 3. Download source

There are a number of GitHub repositories that you will need to download in order to build the complete set of containers. The following script has a curated list of repositories.

The default is to download all repositories using `https://github.com/`. GitHub may rate limit you, in which case you may prefer to use `git@github.com:`. Both examples are shown.

<!-- NB: this script should move to kubeflow repo .. probably kubeflow/kfctl -->

```
git clone https://github.com/canonical-labs/kubeflow-tools kubeflow-tools

# for https protocol use this command
./kubeflow-tools/developer/download-all-repo.sh

# for git protocol use this command (git protocol uses your github id)
PROTOCOL="git@github.com:" ./kubeflow-tools/developer/download-all-repo.sh
```

### 4. Building source

<!-- future direction: ideally have some scripts ..
```
developer/build-all.sh
developer/push-all.sh <<registry_url>>
```
-->

This includes a few steps:

1. Generate the list of containers
2. Build some, or all, containers
3. Push containers to an accessible registry

#### 4.1 Generating container list

There are at least two mechanisms for generating the containers used in the default setup - use the code in kfctl to generate the list, or download kfctl and use `kfctl init` to generate the list. The instructions in this section will use the `kfctl init` method. We will cover the local code generated method in the future.

If you used the download-all-repo.sh script, then you have downloaded the master branch of each repository. The latest `kfctl` should work will with the master branch. As of this writing, v0.6.1 is the latest version, but [this link](https://github.com/kubeflow/kubeflow/releases) shows all releases of kfctl.

<!-- TODO: update the link to https://github.com/kubeflow/kfctl/releases once it is ready -->

__Download kfctl__
```
wget -O kfctl-v0.6.1.tar.gz https://github.com/kubeflow/kubeflow/releases/download/v0.6.1/kfctl_v0.6.1_linux.tar.gz
tar -xvf kfctl-v0.6.1.tar.gz

# Optional: move the binary somewhere that is accessible in any directory
sudo cp kfctl /usr/local/bin  
```

__Generate app.yaml__
```
# You can use a name other than 'standard'
kfctl init standard
```

At this point you will have a file, standard/app.yaml, that holds all of the components in a standard deployment. We will use this yaml file to help build the containers you want to have locally.

#### 4.2 Building containers

#### 4.3 Pushing containers

### 5. Launch Kubeflow

<!-- future direction: ideally have a script ..
```
developer/run-all.sh <<registry_url>>
```
-->

## Reference

<a name="system-requirements-a"></a> <!-- keep anchor above heading -->
### System Requirements

This section will be updated to reflect the resources consumed to download, build, and run Kubeflow. A suggested starting place is to ensure you have the following:

- CPU: 2 cores minimum, 4 cores preferred
- MEMORY: 8 GB minimum, 16 GB preferred
- DISK: 50 GB minimum, 100 GB preferred

[logical_diagram]: images/logical_elements.png "Logical elements of Kubeflow for a developer"
[deployment_diagram_hl]: images/deployment_high_level.png "High Level Deployment Diagram - Developer System"
[deployment_diagram_ll]: images/deployment_low_level.png "Detailed Deployment Diagram - Developer System"

<a name="linux-options-a"></a> <!-- keep anchor above heading -->
### Linux Options

The instructions in this section will focus on local linux options for a developer workstation. Local doesn't necessarily mean it is on hardware you have direct access to - it could be a virtual machine on a public cloud. Cloud workstations is beyond scope for these docs for now; we may add instructions in the future.

TODO: add simple instructions for Windows, Mac, and Linux.
