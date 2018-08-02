+++
title = "TensorFlow Serving"
description = ""
weight = 10
toc = true
bref= "Training and serving using TFJob"
[menu]
[menu.docs]
  parent = "components"
 weight = 50
+++

## Serving a model

We treat each deployed model as a [component](https://ksonnet.io/docs/tutorial#2-generate-and-deploy-an-app-component) in your APP.

Create a component for your model located on cloud

```
MODEL_COMPONENT=serveInception
MODEL_NAME=inception
MODEL_PATH=gs://kubeflow-models/inception
ks generate tf-serving ${MODEL_COMPONENT} --name=${MODEL_NAME}
ks param set ${MODEL_COMPONENT} modelPath ${MODEL_PATH}
```

*(Or)* create a  component for your model located on nfs, learn more from `components/k8s-model-server`

```
MODEL_COMPONENT=serveInceptionNFS
MODEL_NAME=inception-nfs
MODEL_PATH=/mnt/var/nfs/general/inception
MODEL_STORAGE_TYPE=nfs
NFS_PVC_NAME=nfs
ks generate tf-serving ${MODEL_COMPONENT} --name=${MODEL_NAME}
ks param set ${MODEL_COMPONENT} modelPath ${MODEL_PATH}
ks param set ${MODEL_COMPONENT} modelStorageType ${MODEL_STORAGE_TYPE}
ks param set ${MODEL_COMPONENT} nfsPVC ${NFS_PVC_NAME}
```

Deploy the model component. Ksonnet will pick up existing parameters for your environment (e.g. cloud, nocloud) and customize the resulting deployment appropriately

```
ks apply ${KF_ENV} -c ${MODEL_COMPONENT}
```

As before, a few pods and services have been created in your cluster. You can get the inception serving endpoint by querying kubernetes:

```
kubectl get svc inception -n=${NAMESPACE}
NAME        TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)          AGE
...
inception   LoadBalancer   10.35.255.136   ww.xx.yy.zz   9000:30936/TCP   28m
...
```

In this example, you should be able to use the inception_client to hit ww.xx.yy.zz:9000

The model at gs://kubeflow-models/inception is publicly accessible. However, if your environment doesn't
have google cloud credential setup, TF serving will not be able to read the model.
See this [issue](https://github.com/kubeflow/kubeflow/issues/621) for example.
To setup the google cloud credential, you should either have the environment variable
`GOOGLE_APPLICATION_CREDENTIALS` pointing to the credential file, or run `gcloud auth login`.
See [doc](https://cloud.google.com/docs/authentication/) for more detail.

## Telemetry using Istio

Please look at the [Istio guide](/docs/guides/components/istio/).
