+++
title = "IBM Cloud Private for Kubeflow"
description = "Get Kubeflow running on IBM Cloud Private"
weight = 2
+++

This guide is a quick start to deploy Kubeflow on [IBM Cloud Private](https://www.ibm.com/cloud/private) 3.1.0 or later.  IBM Cloud Private is an enterprise PaaS layer for developing and managing on-premises, containerized applications. It is an integrated environment for managing containers that includes the container orchestrator Kubernetes, a private image registry, a management console, and monitoring frameworks.

### Prerequisites

- Get the system requirements from [IBM Knowledge Center](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.1.0/supported_system_config/hardware_reqs.html) for IBM Cloud Private.
  
- Setup NFS Server and export one or more path for persistent volume.

### Installing IBM Cloud Private

Following [installation steps in IBM Knowledge Center](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.1.0/installing/install.html) to install IBM Cloud Private 3.1.0 or later with master, proxy, worker, and optional management and vulnerability advisory nodes in your cluster in standard or high availability configurations.

The guide takes IBM Cloud Private 3.1.0 as example below. You can check the IBM Cloud Private after installation.

```bash
# kubectl get node
NAME         STATUS    ROLES                      AGE       VERSION
10.43.0.38   Ready     management                 11d       v1.11.1+icp-ee
10.43.0.39   Ready     master,etcd,proxy          11d       v1.11.1+icp-ee
10.43.0.40   Ready     va                         11d       v1.11.1+icp-ee
10.43.0.44   Ready     worker                     11d       v1.11.1+icp-ee
10.43.0.46   Ready     worker                     11d       v1.11.1+icp-ee
10.43.0.49   Ready     worker                     11d       v1.11.1+icp-ee
```
### Creating image policy and persistent volume

1. Create Kubernetes namespace.

    ```bash
    export K8S_NAMESPACE=kubeflow
    kubectl create namespace $K8S_NAMESPACE
    ```
    * **K8S_NAMESPACE** is namespace name that the Kubeflow will be installed in. By default should be "kubeflow".

2. Create image policy for the namespace.

    The image policy definition file (`image-policy.yaml`) is as following:

    ```yaml
    apiVersion: securityenforcement.admission.cloud.ibm.com/v1beta1
    kind: ImagePolicy
    metadata:
      name: image-policy
    spec:
      repositories:
        - name: docker.io/*
          policy: null
        - name: k8s.gcr.io/*
          policy: null
        - name: gcr.io/*
          policy: null
        - name: ibmcom/*
          policy: null
        - name: quay.io/*
          policy: null
    ```
    Create ImagePolicy for the specified namespace.
    ```bash
    kubectl create -n $K8S_NAMESPACE -f image-policy.yaml 
    ```

3. Create persistent volume (PV) for Kubeflow components.
   
    Some Kubeflow components need PVs to storage data, such as minio, mysql katib. We need to create PVs for those pods in advance. 
    The PVs defination file (`pv.yaml`) is as following:
    
    ```yaml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: kubeflow-pv1
    spec:
      capacity:
        storage: 20Gi
      accessModes:
      - ReadWriteOnce
      persistentVolumeReclaimPolicy: Retain
      nfs:
        path: ${NFS_SHARED_DIR}/pv1
        server: ${NFS_SERVER_IP}
    ---
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: kubeflow-pv2
    spec:
      capacity:
        storage: 20Gi
      accessModes:
      - ReadWriteOnce
      persistentVolumeReclaimPolicy: Retain
      nfs:
        path: ${NFS_SHARED_DIR}/pv2
        server: ${NFS_SERVER_IP}
    ---
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: kubeflow-pv3
    spec:
      capacity:
        storage: 20Gi
      accessModes:
      - ReadWriteOnce
      persistentVolumeReclaimPolicy: Retain
      nfs:
        path: ${NFS_SHARED_DIR}/pv3
        server: ${NFS_SERVER_IP}
    ```
    
    * **NFS_SERVER_IP** is the NFS server IP, that can be management node IP but need management node need to support NFS mounting. 
    * **NFS_SHARED_DIR** is the NFS shared path that can be mounted by othe nodes in IBM Cloud Private cluster. And ensure the sub-folders(`pv1, pv2,pv3`) in defination above are created.
  
    Create PV by running below command:
    ```bash
    kubectl create -f pv.yaml
    ```

### Installing Kubeflow

Follow these steps to deploy Kubeflow:

1. Download a `kfctl` v0.5.0 or later release from the [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/).

2. Unpack the tar ball:

    ```bash
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```

3. Run the following commands to set up and deploy Kubeflow. The code below
  includes an optional command to add the binary `kfctl` to your path. If you don't add the binary to your path, you must use the full path to the `kfctl` 
  binary each time you run it.

    ```bash
    # The following command is optional, to make kfctl binary easier to use.
    export PATH=$PATH:<path to kfctl in your Kubeflow installation>

    export KFAPP=<your choice of application directory name>
    # Default uses IAP.
    kfctl init ${KFAPP}
    cd ${KFAPP}
    kfctl generate all -V
    kfctl apply all -V
    ```
   * **${KFAPP}** - the _name_ of a directory where you want Kubeflow 
     configurations to be stored. This directory is created when you run
     `kfctl init`. If you want a custom deployment name, specify that name here.
     The value of this variable becomes the name of your deployment.
     The value of this variable cannot be greater than 25 characters. It must
     contain just the directory name, not the full path to the directory.
     The content of this directory is described in the next section.

4. Check the resources deployed in namespace `kubeflow`:

    ```bash
    kubectl -n kubeflow get  all
    ```

## Access Kubeflow dashboard

Change the Ambassador service type to NodePort, then access the Kubeflow dashboard through Ambassador.
```bash
kubectl -n kubeflow patch service ambassador -p '{"spec":{"type": "NodePort"}}'
AMBASSADOR_PORT=$(kubectl -n kubeflow get service ambassador -ojsonpath='{.spec.ports[?(@.name=="ambassador")].nodePort}')
```
Then you will find the NodePort and access the Kubeflow dashboard by NodePort.
```
http://${MANAGEMENT_IP}:$AMBASSADOR_PORT/
```
* **MANAGEMENT_IP** is management node IP.
* **AMBASSADOR_PORT** is the ambassador port.

## Delete Kubeflow

Run the following commands to delete your deployment and reclaim all resources:

```bash
cd ${KFAPP}
# If you want to delete all the resources, including storage.
kfctl delete all --delete_storage
# If you want to preserve storage, which contains metadata and information
# from mlpipeline.
kfctl delete all
```
