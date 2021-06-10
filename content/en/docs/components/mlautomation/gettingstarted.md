+++
title = "Getting Started with MLRun"
description = "How to set up MLRun"
weight = 20
                    
+++

## Run MLRun on a Local Docker Registry

To use MLRun with your local Docker registry, run the MLRun API service, dashboard, and example Jupyter server by using the following script.

**Note:** 

- By default the MLRun API service will run inside the Jupyter server, set the MLRUN_DBPATH env var in Jupyter to point to an alternative service address.
- The artifacts and DB will be stored under **/home/jovyan/data**, use docker -v option to persist the content on the host (e.g.`-v $(SHARED_DIR}:/home/jovyan/data`)
- Using Docker is limited to local runtimes.

```shell
MLRUN_IP=localhost
SHARED_DIR=/home/me/data
# On Windows, use host.docker.internal for MLRUN_IP

docker pull mlrun/mlrun-ui:0.5.2
docker pull mlrun/jupyter:0.5.2

docker run -it -p 4000:80 --rm -d --name mlrun-ui -e MLRUN_API_PROXY_URL=http://${MLRUN_IP}:8080 mlrun/mlrun-ui:0.5.2
docker run -it -p 8080:8080 -p 8888:8888 --rm -d --name jupy -v $(SHARED_DIR}:/home/jovyan/data mlrun/jupyter:0.5.2
```

When the execution completes —

- Open Jupyter Notebook on port 8888 and run the code in the [**examples/mlrun_basics.ipynb**](https://github.com/mlrun/mlrun/blob/master/examples/mlrun_basics.ipynb) notebook.
- Use the MLRun dashboard on port 4000.

## Install MLRun on a Kubernetes Cluster

Perform the following steps to install and run MLRun on a Kubernetes cluster.

**Note:** The outlined procedure allows using the local, job, and Dask runtimes. To use the MPIJob (Horovod) or Spark runtimes, you need to install additional custom resource definitions (CRDs).

- [Create a namespace](https://mlrun.readthedocs.io/en/latest/install.html#k8s-create-a-namespace)
- [Install a shared volume storage](https://mlrun.readthedocs.io/en/latest/install.html#k8s-install-a-shared-volume-storage)
- [Install the MLRun API and dashboard (UI) services](https://mlrun.readthedocs.io/en/latest/install.html#k8s-install-mlrun-api-n-ui-services)


### Create a namespace

Create a namespace for mlrun. For example:
```shell
kubectl create namespace mlrun
```

### Install a Shared Volume Storage

You can use any shared file system (or object storage, with some limitations) for sharing artifacts and/or code across containers.

To store data on your Kubernetes cluster itself, you will need to define a [**persistent volume**](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

### _NFS Server Provisioner Example_

The following example uses a shared NFS server and a Helm chart for the installation:


1. Run the following commands (provided Helm is installed):

```shell
helm repo add stable https://kubernetes-charts.storage.googleapis.com/
helm install -n mlrun nfsprov stable/nfs-server-provisioner
```

2. Create a [**PersistentVolumeClaim**](https://raw.githubusercontent.com/mlrun/mlrun/master/hack/local/nfs-pvc.yaml) (PVC) for a shared NFS volume by running the following command:

```shell
kubectl apply -n mlrun -f https://raw.githubusercontent.com/mlrun/mlrun/master/hack/local/nfs-pvc.yaml
```

### Install the MLRun API and Dashboard (UI) Services

If you plan to push containers or use a private registry, you need to first create a secret with your Docker registry information. You can do this by running the following command:

```shell
ubectl create -n mlrun secret docker-registry my-docker --docker-server=https://index.docker.io/v1/ --docker-username=<your-user> --docker-password=<your-password> --docker-email=<your-email>
```

Run the following command to apply [**mlrun-local.yaml**](https://raw.githubusercontent.com/mlrun/mlrun/master/hack/local/mlrun-local.yaml):

```shell
kubectl apply -n mlrun -f https://raw.githubusercontent.com/mlrun/mlrun/master/hack/local/mlrun-local.yaml
```

### Install a Jupyter Server with a Preloaded MLRun Package.

Run the following command to apply [**mljupy.yaml**](https://raw.githubusercontent.com/mlrun/mlrun/master/hack/local/mljupy.yaml):

```shell
kubectl apply -n mlrun -f https://raw.githubusercontent.com/mlrun/mlrun/master/hack/local/mljupy.yaml
```

To change or add packages, see the Jupyter Dockerfile ([**Dockerfile.jupy**](https://www.kubeflow.org/docs/started/getting-started/)).

### Install Kubeflow

MLRun enables you to run your functions while saving outputs and artifacts in a way that is visible to Kubeflow Pipelines. If you wish to use this capability you will need to install Kubeflow on your cluster. Refer to the [**Kubeflow documentation**](https://www.kubeflow.org/docs/started/getting-started/) for more information.

### Start Working

-  Open Jupyter Notebook on ```NodePort 30040``` and run the code in the [**examples/mlrun_basics.ipynb**](https://github.com/mlrun/mlrun/blob/master/examples/mlrun_basics.ipynb) notebook.
- Use the dashboard at NodePort ```30068```.


**Note:** 
- You can change the ports by editing the YAML files.
- You can select to use a Kubernetes Ingress for better security. 





