+++
title = "Usage Reporting"
description = "Opting in or out of anonymous usage data reported from Kubeflow"
weight = 40
+++

When enabled, Kubeflow will report **anonymous** usage data using [spartakus](https://github.com/kubernetes-incubator/spartakus), Kubernetes' reporting tool. Spartakus **does not report any personal information**. See [here](https://github.com/kubernetes-incubator/spartakus) for more detail.
This is entirely voluntary and you can opt

```
# Delete any existing deployments of spartakus
kubectl delete -n ${NAMESPACE} deploy spartakus-volunteer
```

**To disable usage reporting** you need to delete spartakus component. 
This command completely deletes any spartakus deployment, while the above 
command only restarts spartakus with reportUsage set to `false`

```
kubectl -n ${NAMESPACE} delete deploy -l app=spartakus
```

**Reporting usage data is one of the most significant contributions you can make to Kubeflow; so please consider turning it on.** This data
allows us to improve the project and helps the many companies working on Kubeflow justify continued investment.

You can improve the quality of the data by giving each Kubeflow deployment a unique id by editing `spartakus.yaml` in your `KF_APP` directory:

```
apiVersion: v1
data:
  usageId: "your usage id"
kind: ConfigMap
metadata:
  labels:
    kustomize.component: spartakus
  name: spartakus-parameters
  namespace: kubeflow
```

Then deploy your changes:
```
kubectl apply -f spartakus.yaml`
```
