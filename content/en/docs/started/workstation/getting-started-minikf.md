+++
title = "MiniKF"
description = "A fast and easy way to deploy Kubeflow on your laptop"
weight = 35
+++

![MiniKF latest
version](https://www.arrikto.com/wp-content/uploads/2019/06/minikf-latest-version.svg
"MiniKF latest version")

A production-ready, full-fledged, local Kubeflow deployment that
installs in minutes.

MiniKF is a fast and easy way to get started with Kubeflow. With just a
few clicks, you are up for experimentation, and for running complete
Kubeflow Pipelines.

To train at scale, move to a Kubeflow cloud deployment with one click,
without having to rewrite anything.

Please see the [official
announcement](https://medium.com/kubeflow/minikf-the-fastest-and-easiest-way-to-deploy-kubeflow-on-your-laptop-a91fb846d0ba)
and the rationale behind MiniKF.

Join the discussion on the
[#minikf](https://kubeflow.slack.com/messages/CGRKM3N0G/) Slack channel,
ask questions, request features, and get support for MiniKF.

To join the Kubeflow Slack workspace, please [request an
invite](https://kubeflow.slack.com/join/shared_invite/zt-cpr020z4-PfcAue_2nw67~iIDy7maAQ).

### System requirements
For a smooth experience we recommend that your system meets the
following requirements:

- 12GB RAM
- 2 CPUs
- 50GB disk space

### Operating systems
MiniKF runs on all major operating systems:

- Linux
- macOS
- Windows

### Prerequisites
Before installing MiniKF, you need to have Vagrant and VirtualBox
installed on your laptop.

- Install [Vagrant](https://www.vagrantup.com/downloads.html)
- Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

### MiniKF installation
Open a terminal on your laptop, create a new directory, switch into it,
and run the following commands to install MiniKF:

```
vagrant init arrikto/minikf
vagrant up
```

MiniKF will take a few minutes to boot. When this is done, navigate to
http://10.10.10.10 and follow the on-screen instructions to start Kubeflow and
Rok.

### MiniKF upgrade
Here are step-by-step instructions for upgrading from a previous version:

1. Upgrade the MiniKF box to the latest version:
```
vagrant box update
```
2. Ensure you have updated to the latest version:
```
vagrant box list
```
3. Upgrade the `vagrant-persistent-storage` plugin to v0.0.47 or later:
```
vagrant plugin update vagrant-persistent-storage
```
4. Destroy the VM:
```
vagrant destroy
```
5. Remove all local state. This will remove all of your customization in MiniKF
   (notebooks, pipelines, Rok snapshots):
     - [Windows] ```del minikf-user-data.vdi```
     - [Linux/macOS] ```rm minikf-user-data.vdi```
6. Re-create your VM:
```
vagrant up
```

### End-to-end example on MiniKF

Notebooks & Kubeflow Pipelines on the new MiniKF. Run an e2e ML pipeline
following this
[tutorial](https://medium.com/kubeflow/an-end-to-end-ml-pipeline-on-prem-notebooks-kubeflow-pipelines-on-the-new-minikf-33b7d8e9a836).


### Installation video
Here is a demo of installing MiniKF from scratch:

[![MiniKF
installation](https://img.youtube.com/vi/rVak_NIKF88/0.jpg)](https://www.youtube.com/watch?v=rVak_NIKF88
"minikf-installation")

