+++
title = "Minikube for Kubeflow"
description = "Quickly get Kubeflow running locally"
weight = 10
toc = true
bref = "This document will outline steps that will get your local installation of Kubeflow running on top of Mikikube. Minikube runs a simple, single-node Kubernetes cluster inside a virtual machine (VM)."
[menu.docs]
  parent = "started"
  weight = 2
+++

By the end of this document, you'll have a local installation of Minikube kubernetes clsuter along with all the default core components of
Kubeflow deployed as services in the pods. You should be able to access JupyterHub notebooks, and the Kubeflow Dashboard.

### Install a Hypervisor
If you do not already have a hypervisor installed, install a new one.

##### Mac OS X
Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads) or [VMware Fusion](https://www.vmware.com/products/fusion).

##### Ubuntu
Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads) or [KVM](http://www.linux-kvm.org/).

The KVM2 driver is intended to replace KVM driver. The KVM2 driver is maintained by the minikube team, and is built, tested and released with minikube.
For installing KVM:

```
# Install libvirt and qemu-kvm on your system, e.g.
# Debian/Ubuntu (for older Debian/Ubuntu versions, you may have to use libvirt-bin instead of libvirt-clients and libvirt-daemon-system)
$ sudo apt install libvirt-clients libvirt-daemon-system qemu-kvm

# Add yourself to the libvirt group so you don't need to sudo
# NOTE: For older Debian/Ubuntu versions change the group to `libvirtd`
$ sudo usermod -a -G libvirt $(whoami)

# Update your current session for the group change to take effect
# NOTE: For older Debian/Ubuntu versions change the group to `libvirtd`
$ newgrp libvirt
```
Then install the driver itself:

```
curl -Lo docker-machine-driver-kvm2 https://storage.googleapis.com/minikube/releases/latest/docker-machine-driver-kvm2 \
&& chmod +x docker-machine-driver-kvm2 \
&& sudo cp docker-machine-driver-kvm2 /usr/local/bin/ \
&& rm docker-machine-driver-kvm2
```

##### CentOS
Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads) or [KVM](http://www.linux-kvm.org/).

For installing KVM:
```
# Install libvirt and qemu-kvm on your system
$ sudo yum install libvirt-daemon-kvm qemu-kvm

# Add yourself to the libvirt group so you don't need to sudo
$ sudo usermod -a -G libvirt $(whoami)

# Update your current session for the group change to take effect
$ newgrp libvirt
```
Then install the driver itself:

```
curl -Lo docker-machine-driver-kvm2 https://storage.googleapis.com/minikube/releases/latest/docker-machine-driver-kvm2 \
&& chmod +x docker-machine-driver-kvm2 \
&& sudo cp docker-machine-driver-kvm2 /usr/local/bin/ \
&& rm docker-machine-driver-kvm2
```

### Install Kubectl

##### GCloud SDK

```
$ gcloud components install kubectl
```

##### Mac OS X

```
$ brew install kubectl
```

##### Ubuntu

```
$ sudo apt-get update && sudo apt-get install -y apt-transport-https
$ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
$ sudo touch /etc/apt/sources.list.d/kubernetes.list
$ echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
$ sudo apt-get update
$ sudo apt-get install -y kubectl
```

##### CentOS

```
$ cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

$ sudo yum install -y kubectl
```

### Install & Start Minikube
Please see [detailed instructions](https://github.com/kubernetes/minikube/releases) for Minikube installation.
For quick setup instructions follow along below.

##### Mac OS X

```
$ brew cask install minikube
```

OR

```
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.28.0/minikube-darwin-amd64
$ chmod +x minikube
$ sudo mv minikube /usr/local/bin/
```

##### Ubuntu or CentOS

```
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.28.0/minikube-linux-amd64
$ chmod +x minikube
$ sudo mv minikube /usr/local/bin/
```

##### Start your minikube cluster

```
$ minikube start --cpus 4 --memory 8096 --disk-size=40g
```

Notes:

1. These are the minimum recommended settings on the VM created by minikube for kubeflow deployment. You are free to adjust them **higher** based on your host machine
capabilities and workload requirements.
1. Using certain hypervisors might require you to set --vm-driver option [specifying the driver](https://github.com/kubernetes/minikube/blob/{{< params "githubbranch" >}}/docs/drivers.md)
you want to use.

In case, you have the default minikube VM already created (following detailed installation instructions), please use the following to update the VM.

```
$ minikube stop
$ minikube delete
$ minikube start --cpus 4 --memory 8096 --disk-size=40g
```

### Installing Kubeflow using Bootstrapper
The following steps will deploy Kubeflow components and start them on the Minikube you created above.

Download bootstrapper configuration file.
```
$ curl -O https://raw.githubusercontent.com/kubeflow/kubeflow/{{< params "githubbranch" >}}/bootstrap/bootstrapper.yaml
```

Apply the config.

```
$ kubectl create -f bootstrapper.yaml
```
This should output
```
namespace "kubeflow-admin" created
clusterrolebinding.rbac.authorization.k8s.io "kubeflow-cluster-admin" created
persistentvolumeclaim "kubeflow-ksonnet-pvc" created
statefulset.apps "kubeflow-bootstrapper" created
```

Verify the setup worked.
```
$ kubectl get ns
NAME             STATUS    AGE
default          Active    1m
kube-public      Active    1m
kube-system      Active    1m
kubeflow-admin   Active    53s

$ kubectl -n kubeflow get svc
NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
ambassador         ClusterIP   10.97.168.31     <none>        80/TCP     1m
ambassador-admin   ClusterIP   10.99.5.81       <none>        8877/TCP   1m
centraldashboard   ClusterIP   10.111.104.142   <none>        80/TCP     1m
k8s-dashboard      ClusterIP   10.102.65.244    <none>        443/TCP    1m
jupyterhub-0       ClusterIP   None             <none>        8000/TCP   1m
jupyterhub-lb      ClusterIP   10.101.15.28     <none>        80/TCP     1m
tf-job-dashboard   ClusterIP   10.106.133.49    <none>        80/TCP     1m
```

Setup port forwarding for the central dashboard UI and Jupyter Hub
```
$ POD=`kubectl -n kubeflow get pods --selector=service=ambassador | awk '{print $1}' | tail -1`
$ kubectl -n kubeflow port-forward $POD 8080:80 2>&1 >/dev/null &
$ POD=`kubectl -n kubeflow get pods --selector=app=jupyterhub | awk '{print $1}' | tail -1`
$ kubectl -n kubeflow port-forward $POD 8000:8000 2>&1 >/dev/null &
```
Now you can access the Kubeflow dashboard at http://localhost:8080/ and JupyterHub at http://localhost:8000/.
For JupyterHub, you'll be landing on a login page.

  - Use any username and password to login
  - Pick an available CPU tensorflow image
  - Provide at least 2 CPUs
  - Provide 4Gi for the memory
  - Leave "Extra Resource Limits" alone for now
  - Click Spawn.
  - You should be redirected to a page that waits while the server is starting.

If the page doesn't refresh, please see
[troubleshooting](/docs/guides/troubleshooting/#problems-spawning-jupyter-pods).

#### Copy the ksonnet application to your machine

To further customize your Kubeflow deployment you can copy the app to your local machine

```
kubectl cp kubeflow-admin/kubeflow-bootstrapper-0:/opt/bootstrap/default ~/my-kubeflow
```

### Where to go next

Refer to the [guide](/docs/guides/).
