+++
title = "Deploy using MiniKube on Linux"
description = "Install Kubeflow on Minikube on Linux"
weight = 50
+++

This tutorial cover installation of minikube and Kubeflow in a single node Ubuntu system.  Minikube provides a single node Kubernetes cluster that is ideal for development and testing purpose.

The following topics will be covered:

- installation of docker-community edition (docker-ce), kubectl, and minikube
- installation of Kubeflow
- launch of Kubeflow central dashboard
- execution of a MNIST on-prem notebook

## Prerequistes

 - Ubuntu 18 machine with min 8 cores, 16GB RAM, 250GB storage
 - Root privilege on a ubuntu machine


## Installation of docker-ce, kubectl, and minikube
Minikube provides a no-driver mode based on docker without requiring a hypervisor.

### Install docker-ce
```
apt-get update
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get update
apt-get install docker-ce docker-ce-cli containerd.io
```
To verify your installation, run 
```
docker run hello-world
```
The expected output should like this:
```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete                                                                                        Digest: sha256:fc6a51919cfeb2e6763f62b6d9e8815acbf7cd2e476ea353743570610737b752
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
```

### Install kubectl
`kubectl` is a Kubernetes command-line tool that allows you to run commands against Kubernetes clusters. Following instruction will install the version 1.15 of `kubectl`, if you are looking for a specific version, see [official instruction](https://kubernetes.io/docs/tasks/tools/install-kubectl/). 
```
curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.15.0/bin/linux/amd64/kubectl
chmod +x ./kubectl
mv ./kubectl /usr/local/bin/kubectl
```


### Install minikube

Following instruction will install minikube v1.2.0, if you are looking for a specific version, see [minikube official site](https://github.com/kubernetes/minikube/releases).
```
curl -Lo minikube https://storage.googleapis.com/minikube/releases/v1.2.0/minikube-linux-amd64
```
Move to /usr/local/bin directory
```
chmod +x minikube
cp minikube /usr/local/bin/
rm minikube
```

### Start minikube
Following command will start minikube with 6 CPUs, 12288 memory, 120G disk size. 
```
minikube start --vm-driver=none --cpus 6 --memory 12288 --disk-size=120g --extra-config=apiserver.authorization-mode=RBAC --extra-config=kubelet.resolv-conf=/run/systemd/resolve/resolv.conf --extra-config kubeadm.ignore-preflight-errors=SystemVerification
```

## Installation of Kubeflow

1. Download the kfctl {{% kf-latest-version %}} release from the
  [Kubeflow releases 
  page](https://github.com/kubeflow/kfctl/releases/tag/{{% kf-latest-version %}}).

1. Unpack the tar ball
      ```
      tar -xvf kfctl_{{% kf-latest-version %}}_<platform>.tar.gz
      ```
1. Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary kfctl to your path. If you don’t add the binary to your path, you must use the full path to the kfctl binary each time you run it.

    ```
    # The following command is optional, to make kfctl binary easier to use.
    export PATH=$PATH:<path to where kfctl was unpacked>

    # Set KF_NAME to the name of your Kubeflow deployment. This also becomes the
    # name of the directory containing your configuration.
    # For example, your deployment name can be 'my-kubeflow' or 'kf-test'.
    export KF_NAME=<your choice of name for the Kubeflow deployment>

    # Set the path to the base directory where you want to store one or more 
    # Kubeflow deployments. For example, /opt/.
    # Then set the Kubeflow application directory for this deployment.
    export BASE_DIR=<path to a base directory>
    export KF_DIR=${BASE_DIR}/${KF_NAME}

    # Set the configuration file to use, such as the file specified below:
    export CONFIG_URI="{{% config-uri-k8s-istio %}}"

    # Generate and deploy Kubeflow:
    mkdir -p ${KF_DIR}
    cd ${KF_DIR}
    kfctl apply -V -f ${CONFIG_URI}
    ```

    * **${KF_NAME}** - The name of your Kubeflow deployment.
      If you want a custom deployment name, specify that name here.
      For example,  `my-kubeflow` or `kf-test`.
      The value of KF_NAME must consist of lower case alphanumeric characters or
      '-', and must start and end with an alphanumeric character.
      The value of this variable cannot be greater than 25 characters. It must
      contain just a name, not a directory path.
      This value also becomes the name of the directory where your Kubeflow 
      configurations are stored, that is, the Kubeflow application directory. 

    * **${KF_DIR}** - The full path to your Kubeflow application directory.
  
The following is an example for installing Kubeflow v1.0 under /root/kubeflow/v1.0 directory. 
```
mkdir -p /root/kubeflow/v1.0
cd /root/kubeflow/v1.0
wget https://github.com/kubeflow/kfctl/releases/download/v1.0/kfctl_v1.0-0-g94c35cf_linux.tar.gz

tar -xvf kfctl_v1.0-0-g94c35cf_linux.tar.gz			
export PATH=$PATH:/root/kubeflow/v1.0
export KF_NAME=my-kubeflow
export BASE_DIR=/root/kubeflow/v1.0
export KF_DIR=${BASE_DIR}/${KF_NAME}
export CONFIG_URI="{{% config-uri-k8s-istio %}}" 

mkdir -p ${KF_DIR}
cd ${KF_DIR}
kfctl apply -V -f ${CONFIG_URI}
```
When installation finish, run the following command to see whether all the pods are in running status. Depend on your machine’s capability, this may take a few minutes.
```
kubectl get pod -n kubeflow
```
Expected output:
```
NAME                                                           READY   STATUS      RESTARTS   AGE
admission-webhook-bootstrap-stateful-set-0                     1/1     Running     0          10m
admission-webhook-deployment-64cb96ddbf-w7ptd                  1/1     Running     0        9m33s
application-controller-stateful-set-0                          1/1     Running     0          13m
argo-ui-778676df64-kjw6s                                       1/1     Running     0          10m
centraldashboard-7dd7dd685d-hvll8                              1/1     Running     0          10m
jupyter-web-app-deployment-89789fd5-cjkwf                      1/1     Running     0          10m
katib-controller-6b789b6cb5-kgzv8                              1/1     Running     1          10m
katib-db-manager-64f548b47c-sszv9                              1/1     Running     3        9m59s
katib-mysql-57884cb488-d4qt2                                   1/1     Running     0        9m59s
katib-ui-5c5cc6bd77-2kqvc                                      1/1     Running     0        9m59s
kfserving-controller-manager-0                                 2/2     Running     1          10m
metacontroller-0                                               1/1     Running     0          10m
metadata-db-76c9f78f77-7r8vb                                   0/1     Running     1          10m
metadata-deployment-674fdd976b-hzmzx                           0/1     Running     0          10m
metadata-envoy-deployment-5688989bd6-rqtrk                     1/1     Running     0          10m
metadata-grpc-deployment-5579bdc87b-xx9fk                      1/1     Running     6          10m
metadata-ui-9b8cd699d-scs9d                                    1/1     Running     0          10m
minio-755ff748b-lxsb6                                          1/1     Running     0        9m55s
ml-pipeline-79b4f85cbc-8tjff                                   1/1     Running     0        9m55s
ml-pipeline-ml-pipeline-visualizationserver-5fdffdc5bf-zsngc   1/1     Running     0        9m42s
ml-pipeline-persistenceagent-645cb66874-b465h                  1/1     Running     0        9m54s
ml-pipeline-scheduledworkflow-6c978b6b85-cffng                 1/1     Running     0        9m42s
ml-pipeline-ui-6995b7bccf-s642q                                1/1     Running     0        9m45s
ml-pipeline-viewer-controller-deployment-8554dc7b9f-vgw9r      1/1     Running     0        9m44s
mysql-598bc897dc-lsmqc                                         1/1     Running     0        9m54s
notebook-controller-deployment-7db57b9ccf-vw9vw                1/1     Running     0          10m
profiles-deployment-5d87dd4f87-7gfrj                           2/2     Running     0        9m41s
pytorch-operator-5fd5f94bdd-kfgvp                              1/1     Running     2          10m
seldon-controller-manager-679fc777cd-4n229                     1/1     Running     0        9m39s
spark-operatorcrd-cleanup-kxr7g                                0/2     Completed   0          10m
spark-operatorsparkoperator-c7b64b87f-cfptj                    1/1     Running     0          10m
spartakus-volunteer-6b767c8d6-4v6hc                            1/1     Running     0          10m
tensorboard-6544748d94-8ctk8                                   1/1     Running     0          10m
tf-job-operator-7d7c8fb8bb-xz5pw                               1/1     Running     1          10m
workflow-controller-945c84565-57c72                            1/1     Running     0          10m
``` 

## Launch of Kubeflow central dashboard
Kubeflow Dashboard can be accessed via istio-ingressgateway service. To see your setting of istio-ingressgateway service, execute the following:
```
export INGRESS_HOST=$(minikube ip)
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')
```
Then you can access Kubeflow dashboard in a web browser: 
```
http://<INGRESS_HOST>:<INGRESS_PORT>
```

## Execution of a MNIST on-prem notebook

[The MNIST on-prem notebook](https://github.com/kubeflow/fairing/blob/master/examples/mnist/mnist_e2e_on_prem.ipynb) builds a docker image, launches a TFJob to train model, and creates a InferenceService (KFServing) to deploy the trained model.

### Prerequistes

#### Step 1: Set up Python environment
Python 3.5 or later is required. 
```
apt-get update; apt-get install -y wget bzip2
wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh 
```
Re-open your current shell.
Create a Python 3.7 environment name of `mlpipeline` (or any name you preferred):
```
conda create --name mlpipeline python=3.7
conda init
conda activate mlpipeline 
``` 
#### Step 2: Install Jupyter Notebook
Full instruction can be found in [Jupyter Documentation](https://jupyter.readthedocs.io/en/latest/install.html)
```
pip install --upgrade pip
pip install jupyter
```

#### Step 3: Create a Docker ID
In order to build docker images from your notebook, a docker registry is needed where the images will be stored.
If you don't have a Docker ID, please follow [Docker Documentation](https://docs.docker.com/docker-id/) to create one.


#### Step 4: Create a namespace to run the MNIST on-prem notebook 
The following will create a namespace called `mnist`. You can use any name you like.
```
kubectl create ns mnist
kubectl label namespace mnist serving.kubeflow.org/inferenceservice=enabled 
```
#### Step 5:  Download the MNIST on-prem notebook

```
cd /root/kubeflow
git clone https://github.com/kubeflow/fairing.git
```

### Launch Jupyter Notebook
```
cd /root/kubeflow/fairing/examples/mnist
conda activate mlpipeline
docker login
jupyter notebook --allow-root
```

You will see output like this:
```
[I 21:17:37.473 NotebookApp] Writing notebook server cookie secret to /root/.local/share/jupyter/runtime/notebook_cookie_secret
[I 21:17:37.784 NotebookApp] Serving notebooks from local directory: /root/kubeflow/fairing/examples/mnist
[I 21:17:37.784 NotebookApp] The Jupyter Notebook is running at:
[I 21:17:37.784 NotebookApp] http://localhost:8888/?token=06cd43860cb7cb214bba30028d4b93f9f1acb08e3121ee13
[I 21:17:37.784 NotebookApp]  or http://127.0.0.1:8888/?token=06cd43860cb7cb214bba30028d4b93f9f1acb08e3121ee13
[I 21:17:37.784 NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[W 21:17:37.789 NotebookApp] No web browser found: could not locate runnable browser.
[C 21:17:37.789 NotebookApp]

    To access the notebook, open this file in a browser:
        file:///root/.local/share/jupyter/runtime/nbserver-16796-open.html
    Or copy and paste one of these URLs:
        http://localhost:8888/?token=06cd43860cb7cb214bba30028d4b93f9f1acb08e3121ee13
     or http://127.0.0.1:8888/?token=06cd43860cb7cb214bba30028d4b93f9f1acb08e3121ee13
```

See [Hints and Tips section](#hints-and-tips) to learn how to access the notebook GUI remotely.

### Execute MNIST on-prem notebook
After launching Jupyter Notebook, click `mnist_e2e_on_prem.ipynb` to open this notebook.
Read the following before execution of the notebook.

1. Under `Configure The Docker Registry For Kubeflow Fairing`, modify the cell to use your Docker ID and namespace created above.
   ```
      DOCKER_REGISTRY = 'index.docker.io/<your Docker ID>'
      my_namespace = 'mnist'
   ```

2. Current MNIST on-prem notebook assume a NFS server is available or an existing persistent volume(PV) and persistent volume claim(PVC) is created. NFS server is not installed with Minikube. If you don't have a NFS server and don't have any existing PV and PVC, you can still let the notebook to create a PV and PVC by making the following change.

    Under `Create PV/PVC to Store The Exported Model`

    1. In the first cell, comment out `nfs_server` and `nfs_path`
    ```
    # nfs_server = '172.16.189.69'
    # nfs_path = '/opt/kubeflow/data/mnist'
    pv_name = 'mnist-e2e-pv'
    pvc_name = 'mnist-e2e-pvc'
    ```
    2. In the second cell, change the `nfs` section to `hostPath`
  
        ```
        nfs:
          path: {nfs_path}
          server: {nfs_server}
        ```
        to

        ```
        hostPath:
          path: /mnt/data
        ```

## Hints and tips
### Access a Jupyter Notebook GUI remotely
If your Jupyter Notebook server is hosted in a Linux machine and you want to access a notebook GUI from your Windows/Mac, you can use the following port forwarding technique.

   General syntax for port forwarding from XXXX to YYYY
   ```
   ssh -N -f -L localhost:YYYY:localhost:XXXX remoteuser@remotehost
   ```

Below is an example of accessing a Jupyter notebook hosted in a Linux machine remotehost.com (port 8888) in a Windows machine using port 8889. 

1. In the Windows machine, issue
    ```
    ssh -N -f -L localhost:8889:localhost:8888 root@remotehost.com
    ```
    You will be promoted for the password to access remotehost.com
   
2. In the Windows machine, open a web browser and enter the following url
   ```
   localhost:8889
   ```
   
## TroubleShooting
### AttributeError when create namespace object
When using Kubeflow Fairing to build a Docker image and launch a training job (part of the [notebook](https://github.com/kubeflow/fairing/blob/master/examples/mnist/mnist_e2e_on_prem.ipynb)), you may see the following error:
```
AttributeError: 'V1TFJob' object has no attribute 'openapi_types'
```
This is caused by an [existing issue in Kubernetes client API](https://github.com/kubernetes-client/python/issues/1112).

To bypass this issue, please install kubernetes Client API version 10.0.1
```
pip install kubernetes==10.0.1
```

