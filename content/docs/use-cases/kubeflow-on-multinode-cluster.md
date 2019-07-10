+++
title = "Kubeflow on-prem in k8s multi-node cluster"
description = "How to install Kubeflow on-prem leveraging Dynamic Volume Provisioning and NFS volumes"
weight = 30
+++

This guide describes how to setup Kubeflow on premise in a multi-node cluster using dynamic volume provisioning.

## Vanilla on-prem KubeFlow installation

In order to install KubeFlow in a on-prem kubernetes cluster (both single node and multi-node) you can follow this guide
[Kubeflow on Kubernetes](/docs/started/getting-started-k8s).

At the end of installation, as stated in the troubleshooting section [Pods stuck in Pending state](/docs/other-guides/troubleshooting/#pods-stuck-in-pending-state), you could have some Persistent Volume Claims (PVCs) ubounded.

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

## A step back: the storage on kubernetes

Kubernetes defines several ways to attach Volumes to Pods. 

The best practice consists in decoupling the need for storage ([Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims): PVC) from the real storage ([Persistent Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/): PV). The latter is provisioned by kubernetes administratore based on the available resources. Persistent Volume can be one of the [several supported](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes).

Cloud providers define in their kubernetes cluster mechanisms to allocate PVs based on existing PVCs using their storage infrastructure; on-prem cluster must provision their PV according the existing capability of the system.

In development clusters (e.g. Minikube) or single node clusters, PVCs can be binded to HostPath PVs: a particular kind of volume that maps the Pod's Volume to a directory of the filesystem.

This approach, however, is not a feasible solution in multi-node clusters. A Pod, in fact, can be on different nodes during its lifecycle: kubernetes can kill and restart it on another node at any time based on the resources available in the cluster. In this scenario, the migrated Pod will not find its old data after restarting on a new node.

A common solution is to use a remote volume mounted in the Pods so that it can be reached from any node in the cluster. 

In this document we will show you:

* how to associate a remote NFS volume to KubeFlow Pods so you don't have any problems when Pod is scheduled on different cluster nodes during its lifecycle. 
* how simplify the life of the cluster administrator using [dynamic provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) and leaving to kubernetes the task to create different PV for each PVC without needs on manual intervention.

## NFS Persistent Volumes

[NFS](https://en.wikipedia.org/wiki/Network_File_System) is the a popular distributed filesystem commonly used in Unix operating systems. 

We want to use a NFS server to create PV where Pods can write their data.

In order to do this you should provide a NFS server with an IP reachble from inside the kubernetes cluster.

For simplicity, we will use one of the kubernetes nodes for this purpose. In general this is not a good idea because in case of fault of one of the nodes you will loose your data.  





In order to provide a NFS volume you need to have a NFS server:

```shell
sudo apt install nfs-common
sudo apt install nfs-kernel-server
sudo mkdir /nfsroot
```

Configure /etc/exports to share that directory:

```shell
/nfsroot 192.168.0.0/16(rw,no_root_squash,no_subtree_check)
```

Notice that 192.168.0.0 is the nodes' CIDR, not the Kubernetes CIDR.
NFS Client

In order to allow any node of the cluster to be able to mount NFS filesystem:

```shell
sudo apt install nfs-common
```

## Install Dynamic Provisioner

*TODO* introduction

### Install Helm

https://helm.sh/docs/using_helm/#install-helm

### Install NFS Provisioner

*TODO* spiega la default class

In order to work with Dynamic Volume Provisioning and with NFS you need to install a provisioner: a component that create automatically NFS persistent volume based on existing Persistent Volume Claims.

NFS client provisioner can be found here.

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

The component in the system will add a Storage Class that you can see in this way:

```shell
kubectl get storageclass -n kubeflow

NAME                   PROVISIONER                            AGE
nfs (default)          cluster.local/nfs-client-provisioner   6h13m
...
```

### In case of existing kubeflow installation

Se kubeflow è già stato istallato e i PVC sono appesi in attesa del bound, nessun problema: possiamo manualmente editare i PVC e aggiungere la classe *nfs*

In ordert to trigger the automatic assigment for Kubeflow's Persistent Volume Claims you need to remove them and then add them again: you cannot modify storageClassName at runtime.

In order to perform this you can download the three Persistent Volume Claims:

```shell
kubectl get pvc/mysql-pv-claim -n kubeflow -o yaml > mysql-pv-claim.yaml
kubectl get pvc/minio-pvc -n kubeflow -o yaml > minio-pvc.yaml
kubectl get pvc/katib-mysql -n kubeflow -o yaml > katib.yaml
```

And then modify files to add the right storageClassName like in those examples:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  annotations:
    ksonnet.io/managed: '...'
    kubecfg.ksonnet.io/garbage-collect-tag: gc-tag
  labels:
    app.kubernetes.io/deploy-manager: ksonnet
    ksonnet.io/component: pipeline
  name: mysql-pv-claim
  namespace: kubeflow
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: nfs-client
  resources:
    requests:
      storage: 20Gi
  volumeMode: Filesystem
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  annotations:
    ksonnet.io/managed: '...'
    kubecfg.ksonnet.io/garbage-collect-tag: gc-tag
  labels:
    app: katib
    app.kubernetes.io/deploy-manager: ksonnet
    ksonnet.io/component: katib
  name: katib-mysql
  namespace: kubeflow
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: nfs-client
  resources:
    requests:
      storage: 10Gi
  volumeMode: Filesystem
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  annotations:
    ksonnet.io/managed: '...'
    kubecfg.ksonnet.io/garbage-collect-tag: gc-tag
  labels:
    app: katib
    app.kubernetes.io/deploy-manager: ksonnet
    ksonnet.io/component: katib
  name: katib-mysql
  namespace: kubeflow
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: nfs-client
  resources:
    requests:
      storage: 10Gi
  volumeMode: Filesystem
```

Finally use the files to remove:

```shell
kubectl delete -f mysql-pv-claim.yaml
kubectl delete -f minio-pvc.yaml
kubectl delete -f katib.yaml
```

and add again:

```shell
kubectl apply -f mysql-pv-claim.yaml
kubectl apply -f minio-pvc.yaml
kubectl apply -f katib.yaml
```

## Limitations

NFS è un filesystem remoto molto performante in lettura e meno performante in scrittura e e pertanto ogni scrittura introduce latenze dovute al protocollo rispetto al mero salvataggio

Inoltre è preferibile utilizzare la versione 4 di NFS anzichè la 3: quest'ultima ha dei problemi di scrittura parziale per cui non vi trovate i file scritti, mentre la 4 risolve questi problemi. In caso abbiate già un server NFS assicuratevi che sia della versione 4. La versione 3 ha anche problemi con i permessi.


## Resources

* helm chart per NFS provisioner
* dynamic provisioning
* tipi di volumi esistenti

Please go to the [Argo CD documentation](https://github.com/argoproj/argo-cd/tree/master/docs#argocd-documentation) to read more about how to configure other features like auto-sync, SSO, RBAC, and more!


