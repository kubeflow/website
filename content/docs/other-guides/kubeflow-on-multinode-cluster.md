+++
title = "Kubeflow On-prem in a Multi-node Kubernetes Cluster"
description = "How to install Kubeflow on-prem using dynamic volume provisioning and NFS volumes"
weight = 30
+++

This guide describes how to set up Kubeflow on premises (on-prem) in a multi-node cluster using [dynamic volume provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/).

## Vanilla on-prem Kubeflow installation

In order to install Kubeflow in an on-prem Kubernetes cluster, follow the guide
to [installing Kubeflow on existing clusters](/docs/started/k8s), which works 
for single node and multi-node clusters.

At the end of the installation, some Persistent Volume Claims (PVCs) might be unbound. To fix this issue, see the troubleshooting section [Pods stuck in Pending state](/docs/other-guides/troubleshooting/#pods-stuck-in-pending-state).

However, when you set up Kubeflow in a multi-node cluster you might run into an additional issue: you can't create a *HostPath* PersistentVolume (which exposes a filesystem directory to a Pod), because this type of PersistentVolume only works on a single node cluster.

## Background on Kubernetes storage

Kubernetes defines several ways to attach Volumes to Pods. 

The best practice is to decouple storage needs ([Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) or PVCs) from actual storage ([Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) or PVs). Kubernetes provisions PVs based on available resources. There are [several types](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes) of PV.

Cloud providers define mechanisms to allocate PVs based on existing PVCs using their storage infrastructure; on-prem clusters must provision their PVs according the existing capability of the system.

In development clusters (e.g. Minikube) or single node clusters, you can bind PVCs to HostPath PVs, which are a particular kind of volumes that maps the Pod's Volume to a directory of the filesystem.

This approach, however, is not a feasible solution in multi-node clusters. A Pod can be on different nodes during its lifecycle: Kubernetes can kill and restart it on another node at any time based on the resources available in the cluster. In this scenario, the migrated Pod will not find its old data after restarting on a new node.

A common solution is to mount a remote volume in the Pods so that any node in the cluster can reach it.

The rest of this document describes the following tasks:

* how to associate a remote NFS volume to Kubeflow Pods so you don't have any problems when the Pod is scheduled on different cluster nodes during its lifecycle. 
* how to simplify cluster administration by using [dynamic provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/), which lets Kubernetes create a different PV for each PVC without manual intervention.

The best way to avoid PVC problems is to complete both of these steps before you install Kubeflow on your Kubernetes cluster. However, if you have already installed Kubeflow on your cluster and want to resolve PVC problems, complete the steps and then read the [In case of existing Kubeflow installation](#in-case-of-existing-kubeflow-installation) section at the end of this document.

## NFS Persistent Volumes

[NFS](https://en.wikipedia.org/wiki/Network_File_System) is a popular distributed filesystem commonly used in Unix operating systems. 

You can use an NFS server to create PVs where Pods can write their data.

In order to do this you must provide an NFS server with an IP reachable from inside the Kubernetes cluster.

If an NFS volume is not available to your cluster, you can transform one of the cluster's nodes into an NFS server with the following commands:

```shell
sudo apt install nfs-common
sudo apt install nfs-kernel-server
sudo mkdir /nfsroot
```

Than you need to configure `/etc/exports` to share that directory:

```shell
/nfsroot 192.168.0.0/16(rw,no_root_squash,no_subtree_check)
```

Notice that 192.168.0.0 is the nodes' Classless Inter-Domain Routing (CIDR), not the Kubernetes CIDR.

### NFS Client

Each node of the cluster must be able to establish a connection to the NFS server.
To enable this, install the following NFS client library on each node:

```shell
sudo apt install nfs-common
```

## Install Dynamic Provisioner

Now you can create NFS PVs to enable each Pod to write its own data 
in a common place from any node.
 
In order to successfully complete the Kubeflow installation, your cluster must have an NFS PV for each PVC to bind to.

Since creating NFS PVs can be tedious, you can set up [Dynamic provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) to automatically create PVs based on existing PVCs.

Follow the instructions in this section to instal a Dynamic Provisioner for NFS volumes in your cluster.

### Install Helm

To install a Dynamic Provisioner, you must first install Helm, the Kubernetes package manager.
You can follow [this guide](https://helm.sh/docs/using_helm/#install-helm) to install it in a couple of steps.

### Install NFS Provisioner

Next, install [NFS client provisioner](https://github.com/helm/charts/tree/master/stable/nfs-client-provisioner), which is a Dynamic Provisioner that can create PVs for any PVC for a given [storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/).

A storage class is a label associated to volumes to specify a class of storage: 
storage class definitions make it possible to query and provision volumes with different performances or capabilities
 (e.g SSD or slower disks).

A special storage class is *default*: any PV or PVC that doesn't
specify one is associated to it.

You can install NFS Client Provisioner with Helm:

```shell
helm install 
  --name nfs-client-provisioner \
  --set nfs.server=<NFS Server IP> \
  --set nfs.path=/exported/path \
  --set storageClass.name=nfs \
  --set storageClass.defaultClass=true \
  stable/nfs-client-provisioner
```

The component in the system will add an *nfs* Storage Class that you can see with the following command:

```shell
kubectl get storageclass -n kubeflow

NAME                   PROVISIONER                            AGE
nfs (default)          cluster.local/nfs-client-provisioner   6h13m
...
```

Notice that the installation command set the `storageClass.defaultClass` parameter to `true`. 
This sets the *nfs* as the default storage class. 
Therefore when you install Kubeflow, all PVCs will be labelled with the *nfs* storage class.

## Finally: install Kubeflow

Now that you have prepared your on-prem, multi-node Kubernetes cluster to manage 
volumes using an NFS server, you can install Kubeflow by following the guide to 
[installing Kubeflow on existing clusters](/docs/started/k8s).

After installing Kubeflow, notice that that Kubernetes binds each PVC created by Kubeflow to an automatically created PV with the *nfs* storage class. Notice also that the provisioner has created a directory for each PVC inside the root NFS directory.

## In case of existing Kubeflow installation

If you set up Dynamic Provisioning *after* installing Kubeflow, you must change the storage class on your existing unbound PVCs.

To perform this task you need to:

1. Download existing PVCs.
2. Change their storage class.
3. Delete and recreate them in the cluster.

For downloading the existing PVCs, first get list of all PVCs:

```shell
kubectl get pvc --all-namespaces
```

This will show the list of PVCs with details including `NAMESPACE`, `STATUS`, `STORAGECLASS`.
(e.g. `mysql-pv-claim` in `Kubeflow` namespace and `authservice-pvc` in `istio-systems` namespace).

Download the PVCs:

```shell
kubectl get pvc/<PVC-NAME> -n <NAMESPACE> -o yaml > <PVC-NAME>.yaml
```

And then modify files to add the right `storageClassName` under the `spec` section:

```yaml
# mysql-pv-claim.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pv-claim
  namespace: kubeflow
  ...
spec:
  storageClassName: nfs
  ...
```

After modifying all downloaded PVCs, remove the old PVCs. Note that the field `<PVC-NAME>` below stands for the downloaded file name and not the actual PVC name.

```shell
kubectl delete -f <PVC-NAME>.yaml
```

Finally, add the modified PVCs:

```shell
kubectl apply -f <PVC-NAME>.yaml
```

The PVCs are now bound to your NFS storage.

## Limitations

NFS is a remote filesystem that is high performant in reading but slower in writing.
If you have to write a huge amount of data in your workflow, NFS might not be the right choice.

Ensure that you are using version 4 of NFS (instead of version 3): NFS 3 can have some problems like 
partial writing of documents and it does not support authentication.

In this document you used one of the nodes as an NFS server. This is not a good idea for a production
environment because you will have a single point of failure in your cluster.

## Resources

This short guide is not intended to be complete. 
For more information about the following Kubernetes resources, please refer to the official documentation:

* [Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
* [Persistent Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
* [Storage Class](https://kubernetes.io/docs/concepts/storage/storage-classes/)
* [Storage Types Supported by Kubernetes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)
* [Dynamic Provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/)
