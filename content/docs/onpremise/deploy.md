+++
title = "Deployment On-premises"
description = "Instructions to deploy Kubeflow on-premise cluster"
weight = 1
+++

This guide is here to help you to deploy Kubeflow on vanilla kubernetes cluster

## Before you start

1. Verify that Istio is supported in the current Kubernetes environment.
You can do that by checking that following flags are set:

```bash
  --service-account-issuer
  --service-account-signing-key-file
  --service-account-api-audiences
```

If the verification has failed you will need to set up APIServer flags for Istio Secure Gateways (SDS). Follow istio KinD Kubefadm configs [here](https://github.com/istio/istio/blob/master/prow/config/trustworthy-jwt-13-14.yaml). To read more about Istio Secure Gateways follow the [link](https://istio.io/blog/2019/trustworthy-jwt-sds/).

2. Set up `kfctl` command on your cluster:

```bash
wget -O kfctl.tar.gz https://github.com/kubeflow/kfctl/releases/download/v1.0-rc.3/kfctl_v1.0-rc.2-13-g521fcfe_linux.tar.gz tar -zvf kfctl.tar.gz rm kfctl.tar.gz chmod +x ./kfctl export PATH=$(pwd)/kfctl:${PATH}
```

3. Verify kfctl with the following command:

```bash
kfctl version
```

Once kfctl is successfully installed you can proceed further with Kubeflow installation.

<a id="deploy-kubeflow"></a>

## Installation

Depending on your requirements you can install Kubeflow for a single tenant or Kubeflow for a multi-user environment.

*Single-tenant installation:*

```bash
export KFAPP=kf-k8s
mkdir -p ${KFAPP}
cd ${KFAPP}
wget -O kfctl_k8s.yaml https://raw.githubusercontent.com/kubeflow/manifests/v1.0-branch/kfdef/kfctl_k8s_istio.yaml
kfctl build -V -f kfctl_k8s.yaml
kfctl apply -V -f kfctl_k8s.yaml
```

*Multi-tenant installation:*

```bash
export KFAPP=kf-k8s
mkdir -p ${KFAPP}
cd ${KFAPP}
wget -O kfctl_dex.yaml https://raw.githubusercontent.com/kubeflow/manifests/v1.0-branch/kfdef/kfctl_istio_dex.yaml
kfctl build -V -f kfctl_dex.yaml
kfctl apply -V -f kfctl_dex.yaml
```

To verify that Kubeflow is up and running get gateway endpoint to central dashboard page.

```bash
export INGRESS_HOST=$(kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}')
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')
printf "Kubeflow CentralDashboard URL: \n${INGRESS_HOST}:${INGRESS_PORT}\n"
```

## Next steps

- Run a full ML workflow on Kubeflow, using the
  [end-to-end MNIST tutorial](https://github.com/kubeflow/examples/blob/master/mnist/mnist_vanilla_k8s.ipynb).
