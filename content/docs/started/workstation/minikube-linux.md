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
- compilation of a pipeline example
- upload of compilated application to Pipeline UI
- execution of the uploaded application

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
`kubectl` is a Kubernetes command-line tool that allows you to run commands against Kubernetes clusters. Following instruction will install the latest version of `kubectl`, if you are looking for a specific version, see [official instruction](https://kubernetes.io/docs/tasks/tools/install-kubectl/). 
```
apt-get update
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | tee -a /etc/apt/sources.list.d/kubernetes.list
apt-get update
apt-get install -y kubectl
```


### Install minikube

Following instruction will install v1.0.0, if you are looking for a specific version, see [minikube official site](https://github.com/kubernetes/minikube/releases).
```
curl -Lo minikube https://storage.googleapis.com/minikube/releases/v1.0.0/minikube-linux-amd64
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

The following instruction is for installing Kubeflow v1.0-rc.4 under /root/kubeflow directory. 
```
mkdir /root/kubeflow 
cd /root/kubeflow
wget https://github.com/kubeflow/kfctl/releases/download/v1.0-rc.4/kfctl_v1.0-rc.3-1-g24b60e8_linux.tar.gz

tar -xvf kfctl_v1.0-rc.3-1-g24b60e8_linux.tar.gz			
export PATH=$PATH:/root/kubeflow
export KF_NAME=my-kubeflow
mkdir v1rc4
export BASE_DIR=/root/kubeflow/v1rc4
export KF_DIR=${BASE_DIR}/${KF_NAME}
export CONFIG_URI="https://raw.githubusercontent.com/kubeflow/manifests/v1.0-branch/kfdef/kfctl_k8s_istio.v1.0.0.yaml" 

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

## Compilation of a sample pipeline application
This tutorial covers the required steps to compile a sample pipeline application. Full instruction to set up development environment can be found in the [offical Kubeflow site](https://www.kubeflow.org/docs/pipelines/sdk/install-sdk/).

### Step 1: Set up Python environment
Python 3.5 or later is required. 
```
apt-get update; apt-get install -y wget bzip2
wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh 
```
Re-open your current shell.
Create a Python 3.7 environment name of mlpipeline(or any name you preferred):
```
conda create --name mlpipeline python=3.7
conda init
conda activate mlpipeline 
```

### Step 2: Install the Kubeflow SDK
```
pip install https://storage.googleapis.com/ml-pipeline/release/latest/kfp.tar.gz --upgrade
```

### Step 3: Compile sample source (sequential.py)
```
cd /root/kubeflow
git clone https://github.com/kubeflow/pipelines.git
cd /root/kubeflow/pipelines/samples/core/sequential
conda activate mlpipeline
dsl-compile --py ./sequential.py --output ./sequential.tar.gz
```
For a successful compilateion, a file called `sequential.tar.gz` will be created in `/root/kubeflow/pipelines/samples/core/sequential` directory.


## Upload of compilated application to Pipeline UI
1. Launch [Kubeflow central dashboard](/docs/started/workstation/minikube-linux/#launch-of-kubeflow-central-dashboard) (see instruction above).
   
2. Under **Quick shortcuts**, click **Upload a pipeline**.
   <img src="/docs/started/workstation/images/Kubeflow_frontpage.png"
    alt="Launch Kubeflow central dashboard"
    class="mt-3 mb-3 p-3 border border-info rounded">

3. In **Pipelines GUI**, click **Upload pipeline**.
    <img src="/docs/started/workstation/images/upload_front.png"
    alt="Upload a pipeline application"
    class="mt-3 mb-3 p-3 border border-info rounded">

4. In **Upload Pipeline or Pipeline Version** GUI, select **Create a new pipeline** and **Uploaded a file**. Drag/choose the compiled pipeline application. Under **Pipeline Description**, enter a description you like. Click **Create** button.
    <img src="/docs/started/workstation/images/choosefile.png"
    alt="Upload a pipeline application"
    class="mt-3 mb-3 p-3 border border-info rounded">
 

## Execution of the uploaded application
1.  To execute the uploaded application, click **Create run** button.
   <img src="/docs/started/workstation/images/createRun.png"
    alt="Create a run"
    class="mt-3 mb-3 p-3 border border-info rounded">

2. In the **Experiments** GUI, click **Start** button at the bottom. Optionally, you can associate the run with an experiment.
   <img src="/docs/started/workstation/images/run_start.png"
    alt="start a run"
    class="mt-3 mb-3 p-3 border border-info rounded">

3. To check the status of the run, click **Experiments** on the left, then the run name (Run of sequential(b1a3f) under **Default** experiment.    

<img src="/docs/started/workstation/images/checkRun.png"
    alt="check run status"
    class="mt-3 mb-3 p-3 border border-info rounded">

Expected output will be something like this. There should be 2 rectangles which corresponding to 2 containers/steps in the pipeline. The two green check signs mean the jobs are run successfully. You can check the logs under **Logs** tab.

   <img src="/docs/started/workstation/images/run_result.png"
    alt="check result of a pipeline application run"
    class="mt-3 mb-3 p-3 border border-info rounded">

 




