+++
title = "Deploying Kubeflow behind proxy"
description = "The Kubeflow configuration for a corporate scenario."
weight = 10
                    
+++

## Install Kubeflow behind a proxy server

Use the below steps to install Kubeflow behind a proxy server.

Please note that these steps assume Docker, on each kubernetes node, has access through the proxy.

1. Create alias for proxy:
```
alias https='https_proxy=https://server:port'
```
2. Download kfctl:
```
https wget https://github.com/kubeflow/kfctl/releases/download/v1.1.0/kfctl_v1.1.0-0-g9a3621e_linux.tar.gz extract to /usr/local/bin
```
3. Download the kfdef yaml file kfctl_k8s_istio.yaml:
```
https wget https://raw.githubusercontent.com/kubeflow/manifests/v1.1-branch/kfdef/kfctl_istio_dex.v1.1.0.yaml
```
4. Download Manifest
```
https wget https://github.com/kubeflow/manifests/archive/v1.1-branch.tar.gz
```
5. Modify kfctl_k8s_istio.yaml changing the below:
    FROM:
    ```
        repos:

        - name: manifests
        uri: https://github.com/kubeflow/manifests/archive/v1.1-branch.tar.gz
    ```
    TO:
    ```
        repos:
      - name: manifests
        uri: file:/absolute/path/v1.1-branch.tar.gz
    ```    
6. Run build:
```
kfctl build -V -f kfctl_k8s_istio.yaml
```
7. Run apply:
```
kfctl apply -V -f kfctl_k8s_istio.yaml
```
