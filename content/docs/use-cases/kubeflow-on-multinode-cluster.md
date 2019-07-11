+++
title = "Kubeflow on-prem in k8s multi-node cluster"
description = "How to install Kubeflow on-prem leveraging Dynamic Volume Provisioning and NFS volumes"
weight = 30
+++

This guide describes how to setup Kubeflow on premise in a multi-node cluster using dynamic volume provisioning.

## Vanilla on-prem KubeFlow installation

In order to install KubeFlow in a on-prem Kubernetes cluster (both single node and multi-node) you can follow this guide
[Kubeflow on Kubernetes](/docs/started/getting-started-k8s).

At the end of the installation, as stated in the troubleshooting section [Pods stuck in Pending state](/docs/other-guides/troubleshooting/#pods-stuck-in-pending-state), you could have some Persistent Volume Claims (PVCs) ubounded.

In fact, in KubeFlow there are three pods that have 10Gi PVCs that will get stuck in pending state 
if they are unable to bind their PVC. The three pods are minio, mysql, and vizier-db. 
You can check the status of the PVC requests:

```
kubectl -n ${NAMESPACE} get pvc
```

  * Look for the status of "Bound"
  * PVC requests in "Pending" state indicate that the scheduler was unable to bind the required PVC.

In order to change status of PersistentVolumeClaims in "Bound" three Persistent Volumes (PVs) must be provisioned.

But wait! 

There are a couple of problems to solve before: you are in a multi-node cluster, you cannot simply create an *hostPath* PersistentVolume (the volume that exposes a filesystem directory to a Pod) like in a single node scenario.

## A step back: the storage on Kubernetes

Kubernetes defines several ways to attach Volumes to Pods. 

The best practice consists in decoupling the need for storage ([Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims): PVC) from the real storage ([Persistent Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/): PV). The latter is provisioned by Kubernetes administratore based on the available resources. PV can be one of the [several supported](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes).

Cloud providers define, in their Kubernetes cluster, mechanisms to allocate PVs based on existing PVCs using their storage infrastructure; on-prem cluster must provision their PV according the existing capability of the system.

In development clusters (e.g. Minikube) or single node clusters, PVCs can be binded to HostPath PVs: a particular kind of volume that maps the Pod's Volume to a directory of the filesystem.

This approach, however, is not a feasible solution in multi-node clusters. A Pod, in fact, can be on different nodes during its lifecycle: Kubernetes can kill and restart it on another node at any time based on the resources available in the cluster. In this scenario, the migrated Pod will not find its old data after restarting on a new node.

A common solution is to use a remote volume mounted in the Pods so that it can be reached from any node in the cluster. 

In this document we will show you:

* how to associate a remote NFS volume to KubeFlow Pods so you don't have any problems when Pod is scheduled on different cluster nodes during its lifecycle. 
* how simplify the life of the cluster administrator using [dynamic provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) and leaving to Kubernetes the task to create different PV for each PVC without needs on manual intervention.

## NFS Persistent Volumes

[NFS](https://en.wikipedia.org/wiki/Network_File_System) is a popular distributed filesystem commonly used in Unix operating systems. 

We want to use a NFS server to create PV where Pods can write their data.

In order to do this you should provide a NFS server with an IP reachable from inside the Kubernetes cluster.

If a NFS volume is not available and reachble for your cluster, you can transform, for simplicity, one of the nodes of the cluster as NFS server with the following commands:

```shell
sudo apt install nfs-common
sudo apt install nfs-kernel-server
sudo mkdir /nfsroot
```

Than you need to configure /etc/exports to share that directory:

```shell
/nfsroot 192.168.0.0/16(rw,no_root_squash,no_subtree_check)
```

Notice that 192.168.0.0 is the nodes' CIDR, not the Kubernetes CIDR.

### NFS Client

Each node of the cluster must be able to establish connection to NFS server.
This can be done by installing the right NFS client library in any node:

```shell
sudo apt install nfs-common
```

## Install Dynamic Provisioner

Now you can create NFS PVs to enable each Pod to write its own data 
in a common place from any node it will be spawned.
 
In order to successfully complete the KubeFlow installation, a NFS PV must be created, to
be binded to all the PVCs must be created.

Since this operation can be tedious, Kubernetes has a mechanism to solve this problem
and make creation of PVs based on existing PVCs automatic:
[Dynamic Provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/).

In next section we will install a Dynamic Provisioner for NFS volumes via Helm in our cluster.

### Install Helm

Helm is the Kubernetes packet manager. You can follow [this guide](https://helm.sh/docs/using_helm/#install-helm) to install it in a couple of steps.

### Install NFS Provisioner

The Dynamic Provisioner we are going to install will be able to create PVs for any PVC for a given [storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/).

A storage class is a label associated to volumes to specify a class of storage: using storage class 
definition is possible to query and provision volumes with different performances or capabilities
 (e.g SSD or slower disks)

A special storage class is *default*: any PV or PVC that doesn't
specify one is associated to it.

NFS client provisioner can be found [here](https://github.com/helm/charts/tree/master/stable/nfs-client-provisioner).

You can install it with Helm:

```shell
helm install 
  --name nfs-client-provisioner \
  --set nfs.server=<NFS Server IP> \
  --set nfs.path=/exported/path \
  --set storageClass.name=nfs \
  --set storageClass.defaultClass=true \
  stable/nfs-client-provisioner
```

The component in the system will add a *nfs* Storage Class that you can see in this way:

```shell
kubectl get storageclass -n kubeflow

NAME                   PROVISIONER                            AGE
nfs (default)          cluster.local/nfs-client-provisioner   6h13m
...
```

As you noticed we specified an optional parameter storageClass.defaultClass to true: 
this will define *nfs* storage class as default.
In this way during KubeFlow installation, all PVCs will be labelled
with *nfs* storage class.

## Finally: install KubeFlow!

We finally prepared our on-prem multi-node Kubernetes cluster to manage transparently volumes
using a NFS server: now you can finally install KubeFlow following the Vanilla on-prem KubeFlow installation guideline that you encountered in the top of this document.

At the end of procedure you'll see that all PVCs defined by KubeFlow will be binded to some
automatically created PV with the storage class *nfs*.

Notice that the provisioner will create a directory for each PVC with a unique name related 
to that PVC inside the root NFS directory.

## In case of existing kubeflow installation

In case you setup Dynamic Provisioning *after* the installation of KubeFlow you must change the storage class on your existing unbinded PVCs.

Unlikely Kubernetes doesn't allow to change storage class of PVCs on the fly.

To perform this task you need to:
* download existing PVCs.
* change in them storage class
* delete and recreate them in the cluster.

Download the three PVCs:

```shell
kubectl get pvc/mysql-pv-claim -n kubeflow -o yaml > mysql-pv-claim.yaml
kubectl get pvc/minio-pvc -n kubeflow -o yaml > minio-pvc.yaml
kubectl get pvc/katib-mysql -n kubeflow -o yaml > katib.yaml
```

And then modify files to add the right storageClassName under *spec* section:

```yaml
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

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: katib-mysql
  namespace: kubeflow
  ...
spec:
  storageClassName: nfs-client
  ...
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: katib-mysql
  namespace: kubeflow
  ...
spec:
  storageClassName: nfs-client
  ...
```

Finally remove old ones:

```shell
kubectl delete -f mysql-pv-claim.yaml
kubectl delete -f minio-pvc.yaml
kubectl delete -f katib.yaml
```

and add them again:

```shell
kubectl apply -f mysql-pv-claim.yaml
kubectl apply -f minio-pvc.yaml
kubectl apply -f katib.yaml
```

As you'll see, the PVCs wil lbi binded to your NFS storage.

## Limitations

NFS is a remote filesystem that is high performant in reading while in writing it is slower.
If you have to write a huge amount of data in your workflow, you will need to do some 
consideration to understand if NFS filesystem is the right choice.

It is preferable to use version 4 of NFS (instead 3): NFS 3 can have some problems like 
partial write of documents and has no authentication. Ensure that you are using version 4 of NFS.

In this document we used one of the nodes as NFS server. This is not a good idea for production
environment because you will have a single point of failure in your cluster.

## Resources

This short guide is intended to be complete. 
For more information about the followind Kubernetes resources please refer to the official documentation:

* [Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
* [Persistent Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
* [Storage Class](https://kubernetes.io/docs/concepts/storage/storage-classes/)
* [Storage Types Supported by Kubernetes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)
* [Dynamic Provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/)
