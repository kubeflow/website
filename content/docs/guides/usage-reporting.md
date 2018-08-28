+++
title = "Usage Reporting"
weight = 10
toc = true
[menu.docs]
  parent = "guides"
  weight = 40
+++

When enabled, Kubeflow will report **anonymous** usage data using [spartakus](https://github.com/kubernetes-incubator/spartakus), Kubernetes' reporting tool. Spartakus **does not report any personal information**. See [here](https://github.com/kubernetes-incubator/spartakus) for more detail.
This is entirely voluntary and you can opt out by doing the following

```
ks param set spartakus reportUsage false

# Delete any existing deployments of spartakus
kubectl delete -n ${NAMESPACE} deploy spartakus-volunteer
```

To explictly enable usage reporting repeat the above steps setting reportUsage to `true`

```
ks param set spartakus reportUsage true

# Delete any existing deployments of spartakus
kubectl delete -n ${NAMESPACE} deploy spartakus-volunteer
```

**Reporting usage data is one of the most signifcant contributions you can make to Kubeflow; so please consider turning it on.** This data
allows us to improve the project and helps the many companies working on Kubeflow justify continued investement.

You can improve the quality of the data by giving each Kubeflow deployment a unique id

```
ks param set spartakus usageId $(uuidgen)
```

**To disable usage reporting** you need to delete spartakus component

```
ks delete default ${ENV} -c spartakus
kubectl -n ${NAMESPACE} delete deploy -l app=spartakus
ks component rm spartakus
```