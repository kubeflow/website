+++
title = "IBM Cloud Private for Kubeflow"
description = "Get Kubeflow running on IBM Cloud Private"
weight = 2
+++

This guide is a quick start to deploying Kubeflow on [IBM Cloud Private](https://www.ibm.com/cloud/private) 3.1.0 or later.  IBM Cloud Private is an enterprise platform as a service (PaaS) layer for developing and managing on-premises, containerized applications. It is an integrated environment for managing containers that includes the container orchestrator Kubernetes, a private image registry, a management console, and monitoring frameworks.

## Prerequisites

- Get the system requirements from [IBM Knowledge Center](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.1.0/supported_system_config/hardware_reqs.html) for IBM Cloud Private.
  
- Set up NFS Server and export one or more paths for persistent volume(s).

## Installing IBM Cloud Private

Follow the [installation steps in IBM Knowledge Center](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.1.0/installing/install.html) to install IBM Cloud Private 3.1.0 or later with master, proxy, worker, and optional management and vulnerability advisory nodes in your cluster in standard or high availability configurations.

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
## Creating image policy and persistent volume

Follow these steps to create an image policy for your Kubernetes namespace and a persistent volume (PV) for your Kubeflow components:

1. Create Kubernetes namespace.

    ```
    export K8S_NAMESPACE=kubeflow
    kubectl create namespace $K8S_NAMESPACE
    ```

    * **K8S_NAMESPACE** is namespace name that the Kubeflow will be installed in. By default should be "kubeflow".

1. Create image policy for the namespace.

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

1. Create persistent volume (PV) for Kubeflow components.
   
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

## Installing Kubeflow

Follow these steps to deploy Kubeflow:

1. Download the kfctl {{% kf-latest-version %}} release from the
  [Kubeflow releases 
  page](https://github.com/kubeflow/kubeflow/releases/tag/{{% kf-latest-version %}}).

1. Unpack the tar ball:

    ```
    tar -xvf kfctl_{{% kf-latest-version %}}_<platform>.tar.gz
    ```

1. Run the following commands to set up and deploy Kubeflow. The code below
  includes an optional command to add the kfctl binary to your path. If you don't add the binary to your path, you must use the full path to the kfctl 
  binary each time you run it.

    ```
    # The following command is optional, to make kfctl binary easier to use.
    export PATH=$PATH:<path to kfctl in your Kubeflow installation>

    # Set KF_NAME to the name of your Kubeflow deployment. This also becomes the
    # name of the directory containing your configuration.
    # For example, your deployment name can be 'my-kubeflow' or 'kf-test'.
    export KF_NAME=<your choice of name for the Kubeflow deployment>

    # Set the path to the base directory where you want to store one or more 
    # Kubeflow deployments. For example, /opt/.
    # Then set the Kubeflow application directory for this deployment.
    export BASE_DIR=<path to a base directory>
    export KF_DIR=${BASE_DIR}/${KF_NAME}

    # Installs Istio by default. Comment out Istio components in the config file to skip Istio installation.
    export CONFIG_URI="{{% config-uri-k8s-istio %}}"

    mkdir ${KF_DIR}
    cd ${KF_DIR}
    kfctl apply -V -f ${CONFIG_URI}
    ```
      * **${KF_NAME}** - the name of your Kubeflow deployment. This value also
        becomes the name of the directory where your Kubeflow configurations are 
        stored. 
        If you want a custom deployment name, specify that name here.
        For example,  `my-kubeflow` or `kf-test`.
        The value of this variable cannot be greater than 25 characters. It must
        contain just the deployment name, not the full path to the directory.

1. Check the resources deployed in namespace `kubeflow`:

    ```
    kubectl -n kubeflow get  all
    ```

## Access Kubeflow dashboard

From Kubeflow v0.6, the Kubeflow Dashboard can be accessed via `istio-ingressgateway` service. If loadbalancer is not available in your environment, NodePort or Port forwarding can be used to access the Kubeflow Dashboard. Refer [Ingress Gateway guide](https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/).

For Kubeflow version lower than v0.6, access the Kubeflow Dashboard via Ambassador service. Change the Ambassador service type to NodePort, then access the Kubeflow dashboard through Ambassador.
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

Set the `${CONFIG_FILE}` environment variable to the path for your 
Kubeflow configuration file:

  ```
  export CONFIG_FILE=${KF_DIR}/{{% config-file-k8s-istio %}}
  ```

Run the following commands to delete your deployment and reclaim all resources:

```bash
cd ${KF_DIR}
# If you want to delete all the resources, including storage.
kfctl delete -f ${CONFIG_FILE} --delete_storage
# If you want to preserve storage, which contains metadata and information
# from Kubeflow Pipelines.
kfctl delete -f ${CONFIG_FILE}
```
## TroubleShooting
### Insufficient Pods 
  
Default installation of IBM Cloud Private configures 10 allocatable pods per core. So if you have 8 cores, there will be 80 allocatable pods. However, execution of IBM Cloud Private (from default installation) requires ~40 pods and Kubeflow requires ~45 pods, so you may have insufficient pods issue.  

To increase the number of pods, you can edit /etc/cfc/kubelet/kubelet-service-config, increase podsPerCore from 10 to 20 (or 30). Save your change and restart kubelet.
```
systemctl restart kubelet
```

### Kubeflow Central Dashboard: connection reset error or slow response   
This may happen when there is not enough memory (e.g. if you only have 16G memory). You may consider turning off some non-essential services in IBM Cloud Private

```
kubectl -n kube-system patch ds logging-elk-filebeat-ds  --patch '{ "spec": { "template": { "spec": { "nodeSelector": { "switch": "down" } } } } }'
kubectl -n kube-system patch ds nvidia-device-plugin  --patch '{ "spec": { "template": { "spec": { "nodeSelector": { "switch": "down" } } } } }'
kubectl -n kube-system patch ds audit-logging-fluentd-ds  --patch '{ "spec": { "template": { "spec": { "nodeSelector": { "switch": "down" } } } } }'

kubectl -n kube-system scale deploy logging-elk-client --replicas=0
kubectl -n kube-system scale deploy logging-elk-kibana --replicas=0
kubectl -n kube-system scale deploy logging-elk-logstash --replicas=0
kubectl -n kube-system scale deploy logging-elk-master --replicas=0
kubectl -n kube-system scale deploy secret-watcher --replicas=0
```

### Deployed Service's EXTERNAL-IP field stuck in PENDING state
If you have deployed a service of `LoadBalancer` type, but the EXTERNAL-IP field stucks in `<pending>` state, this is because IBM Cloud Private doesn't provide a built-in support for the `LoadBalancer` service. To enable the `LoadBalancer` service on IBM Cloud Private, please see options desribed [here](https://medium.com/ibm-cloud/working-with-loadbalancer-services-on-ibm-cloud-private-26b7f0d22b44).



