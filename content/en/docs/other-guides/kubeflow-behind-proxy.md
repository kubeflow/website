+++
title = "Deploying Kubeflow behind a proxy server"
description = "Instructions for installing and configuring Kubeflow behind a proxy server"
weight = 10

+++

## Install Kubeflow behind a proxy server

This guide demonstrates how to install and configure Kubeflow behind a proxy server.

**Note**: These instructions assume that your Docker setup has a [configured
proxy service](https://docs.docker.com/network/proxy/) on each Kubernetes node.

1. Create an alias for the proxy:

```shell
alias https='https_proxy=https://{SERVER}:{PORT}'
```

where `{SERVER}` is the IP address of your proxy server and `{PORT}` is the port number.

2. Download the latest [kfctl](https://github.com/kubeflow/kfctl) — the control
   pane for deploying and managing Kubeflow from the [Kubeflow
   releases](https://github.com/kubeflow/kfctl/releases/) page. For example, run
   the command below to download the zipped kfctl TAR file for Kubeflow v1.1 and
   extract it to `/usr/local/bin`:

```shell
https wget https://github.com/kubeflow/kfctl/releases/download/v1.1.0/kfctl_v1.1.0-0-g9a3621e_linux.tar.gz extract to /usr/local/bin
```

3. To install Kubeflow on an existing cluster, you need to download the the
   latest configuration YAML file. For example, for Kubeflow v1.1 it is:

```
https wget https://raw.githubusercontent.com/kubeflow/manifests/v1.1-branch/kfdef/kfctl_istio_dex.v1.1.0.yaml
```

4. Download the KfDef manifest zipped TAR file. For example, for Kubeflow v1.1
   you should run the following command:

```shell
https wget https://github.com/kubeflow/manifests/archive/v1.1-branch.tar.gz
```

5. Open the YAML configuration (zipped) file and under `- name: manifests`
   change the old URI (such as
   `https://github.com/kubeflow/manifests/archive/v1.1-branch.tar.gz`) to the
   location of the new one as follows:

```shell
- name: manifests
  uri: {ABSOLUTE_PATH}/v1.1-branch.tar.gz
```

where `{ABSOLUTE_PATH}` is your path to the the manifest.

6. Run `kfctl build` to create configuration files before Kubeflow deployment:

```shell
kfctl build -V -f kfctl_k8s_istio.yaml
```

7. Deploy Kubeflow:

```shell
kfctl apply -V -f kfctl_k8s_istio.yaml
```

# To Use a ConfigMap to Configure Kubeflow Proxy
An alternative to changing the manifests would be to use `PodDefault` to inject the proxy configuration via a (ConfigMap)[https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/] 

A sample config map may look like the following:
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: proxies
data:
  HTTP_PROXY: http://my-proxy.exemple.com:3128
  HTTPS_PROXY: http://my-proxy.exemple.com:3128
  NO_PROXY: exemple.com,localhost,cluster.local,192.168.0.0/16,172.16.0.0/12,10.247.0.0/16
```

Then, create a `PodDefault`:
```
apiVersion: kubeflow.org/v1alpha1
kind: PodDefault
metadata:
  name: my-proxies
spec:
  desc: Inject proxies environment variables to get access to Internet
  selector:
    matchLabels:
      my-proxies: "true"
  envFrom:
  - configMapRef:
    name: proxies
```

Now, any pod with the label `my-proxies` will automatically have these environment variables available to them.

To do so after deployment, you can use `kubectl` 

```
# # Assign label 'my-proxies=true' to a single pod
# kubectl label pods my-pod my-proxies=true     

# # Assign label 'my-proxies=true' to a group of pods with the label 'group-of-pods'
# kubectl label pods -l group-of-pods my-proxies=true     
```

Though, this is not recommended - it's better to add the label during initial deployment. 
