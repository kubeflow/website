+++
title = "Microk8s for Kubeflow"
description = "Quickly get Kubeflow running locally on native hypervisors"
weight = 10
toc = true
bref = "This document will outline steps that will get your local installation of Kubeflow running on top of Microk8s inside of a native Hypervisor. Multipass is used to create a the native VM. Microk8s is used to provide a simple, single-node Kubernetes cluster."
[menu.docs]
  parent = "started"
  weight = 2
+++

By the end of this document, you'll have a local installation of a Kubernetes cluster along with all the default core components of Kubeflow deployed as services in the pods. You should be able to access JupyterHub notebooks, and the Kubeflow Dashboard.

### Install Multipass
If you do not already have a multipass installed, install a new one.

##### Mac OS X
Install Multipass using the native Mac OS [installer](https://github.com/CanonicalLtd/multipass/releases/download/2018.6.1/multipass-2018.6.1-full-Darwin-signed.zip).

##### Linux

It can be installed with the following command on any [snap-enabled linux](https://snapcraft.io):

```
$ sudo snap install multipass --beta --classic
```

### Start an Ubuntu Virtual Machine

##### Download cloud-init file
This cloud-init file can be used repeatedly, each time a new multipass VM is created
```
wget https://bit.ly/2tOfMUA -O kubeflow.init
```

##### Start your Multipass VM
You can mount a local volume into the VM. The second command adds the local directory.
```
$ multipass launch bionic -n kubeflow -m 8G -d 40G -c 4 --cloud-init kubeflow.init
$ multipass mount . kubeflow:/multipass
```

**Note**: These are the minimum recommended settings on the VM created by Multipass for the Kubeflow deployment. You are free to adjust them **higher** based on your host machine capabilities and workload requirements.

### Install Kubernetes
Log into the VM and install some basic supporting tools. This will install kubernetes, powered by microk8s, and other tools necessary to deploy Kubeflow
```
multipass shell kubeflow                      # log into vm
sudo /kubeflow/install-kubeflow-pre-micro.sh  # install microk8s, etc.
```

### Install Kubeflow
This step assumes you've stored your github token in a file in the host machine. If you
haven't already done this, please put: `export GITHUB_TOKEN=<your token>` into /multipass/github-token.txt

```
source /multipass/github-token.txt   # exports your github token
/kubeflow/install-kubeflow.sh        # waits until all pods are “running”; prints the port
```

This script will print out the port number of JupyterHub.

### Access Kubeflow

You can get the IP address of the VM using `multipass list`. Assuming you've used the same name (kubeflow) above, you can now access the JupyterHub page from your browser at http://<kubeflow vm IP>:<Jupyter Hub PORT>

For JupyterHub, you'll be landing on a login page.

  - Use any username and password to login
  - Pick an available CPU tensorflow image
  - Provide at least 2 CPUs
  - Provide 4Gi for the memory
  - Leave "Extra Resource Limits" alone for now
  - Click Spawn.
  - You should be redirected to a page that waits while the server is starting.

If the page doesn't refresh, please see [troubleshooting](/docs/about/user_guide/#problems-spawning-jupyter-pods).

### Where to go next

Refer to the [user guide](/docs/guides/)
