+++
title = "Kubeflow in on-prem k8s multi-node cluster"
description = "How to install Kubeflow on-prem leveraging Dynamic Volume Provisioning and NFS volumes"
weight = 30
+++

This guide describes how to setup Kubeflow on premise in a multi-node cluster using dynamic volume provisioning.

## Vanilla on-prem KubeFlow installation

## Consideration about Storage on kubernetes
Kubernetes defines several ways to attach Volumes to Pods. 

A best practice consists in decoupling the need for storage ([Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims): PVC) from the real storage ([Persistent Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/): PV). The latter is provisioned by kubernetes administratore based on the available resources. Persistent Volume can be one of the [several supported](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes).

In development clusters (e.g. Minikube) or single node clusters, PVCs can be binded to HostPath Volumes: this is a particular kind of Volume that maps the Pod's Volume to a directory of the filesystem.

This approach, however, is not a solution in multi-node clusters, as the data underlying a Pod can change from time to time. A Pod, in fact, can live in several nodes during its existence: kubernetes can kill a Pod and restart it at another node at any time based on the resources available in the cluster.

Cose da fare (ESEMPIO):
* Integrations with templating tools like Ksonnet, Helm, and Kustomize in addition to plain yaml files to define the desired state of an application
* Automated or manual syncing of applications to its desired state
* Intuitive UI to provide observability into the state of applications
* Extensive CLI to integrate Argo CD with any CI system
* Enterprise-ready features like auditability, compliance, security, RBAC, and SSO


## NFS Persistent Volumes

*TODO* introduction on NFS volumes

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

## Install Dynamic Volume Provisioner

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
    ksonnet.io/managed: '{"pristine":"H4sIAAAAAAAA/yyOPU8DMRBEe37G1Be+SrcUVAhEEQpEsfENyDp71/H6glB0/x05Svf0dvU0Z0hNezZPpgg4PWDCknRGwNuw3ql9b3ktfMqSCiYUdpmlC8IZWQ7MPmhxU2W/TXYXrVRTakdATZU5KbFNUClEQPnzY97V0y5eg8N7lTiOy3rgd7bf8e+VcaQlRrq/2ExH+MQ7Zf5oqfNVI/E1odFtbZGXHY3Hld4v7N2a/Izs4/1zwrZt280/AAAA//8BAAD//y8JyQ7xAAAA"}'
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
    ksonnet.io/managed: '{"pristine":"H4sIAAAAAAAA/zyOsU40MQyE+/8xpt4fuHZbCioEojgKROHNDii6JM7FXhA65d1RFkE3ns/67AukxiObRS2Y8XHAhFMsK2Y8jtacxY+atszbJDFjQqbLKi6YL0iyMNlIUitmnMTjMhSmpdCvol4HzVULi//hPqFI5u/8P3/ZOeGntCphJ9vCt6SfY9kqw34iBJrd60rD/IInyvrcovOhBOJ1QqPp1gL3fxrPG833bK5N3of2cHMX0Xvv/74BAAD//wEAAP//9g4X9/kAAAA="}'
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
    ksonnet.io/managed: '{"pristine":"H4sIAAAAAAAA/zyOsU40MQyE+/8xpt4fuHZbCioEojgKROHNDii6JM7FXhA65d1RFkE3ns/67AukxiObRS2Y8XHAhFMsK2Y8jtacxY+atszbJDFjQqbLKi6YL0iyMNlIUitmnMTjMhSmpdCvol4HzVULi//hPqFI5u/8P3/ZOeGntCphJ9vCt6SfY9kqw34iBJrd60rD/IInyvrcovOhBOJ1QqPp1gL3fxrPG833bK5N3of2cHMX0Xvv/74BAAD//wEAAP//9g4X9/kAAAA="}'
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


