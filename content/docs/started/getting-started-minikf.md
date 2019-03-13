+++
title = "MiniKF"
description = "A fast and easy way to deploy Kubeflow on your laptop"
weight = 2
+++

A production-ready, full-fledged, local Kubeflow deployment that
installs in minutes.

MiniKF is a fast and easy way to get started with Kubeflow. With just a
few clicks, you are up for experimentation, and for running complete
Kubeflow Pipelines.

To train at scale, move to a Kubeflow cloud deployment with one click,
without having to rewrite anything.

See
[here](https://medium.com/kubeflow/minikf-the-fastest-and-easiest-way-to-deploy-kubeflow-on-your-laptop-a91fb846d0ba)
for the official announcement and why we started MiniKF.

Join the discussion on the
[#minikf](https://kubeflow.slack.com/messages/CGRKM3N0G/) Slack channel,
ask questions, request features, and get support for MiniKF.

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

This will take a few minutes to complete. Once the installation is
completed successfully, follow the on-screen instructions.

### Kubeflow dashboard
You can access the Kubeflow dashboard by opening a browser and going to:

```
http://10.10.10.10
```

### How to log in
Use these credentials to log in to all services, e.g., JupyterHub, Rok:

```
username: user
password: 12341234
```
