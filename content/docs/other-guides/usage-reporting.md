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

**To prevent Spartakus from being deployed; users should do the following before running `kfctl apply`** 
- Edit ${KFAPP}/app.yaml
- Delete the entry in KfDef.Spec.Applications for spartakus
```
  - kustomizeConfig:
      parameters:
      - initRequired: true
        name: usageId
        value: <randomly-generated-id>
      - initRequired: true
        name: reportUsage
        value: "true"
      repoRef:
        name: manifests
        path: common/spartakus
    name: spartakus
```
- Delete the entry in KfDef.Spec.ComponentParams for spartakus
```
    spartakus:
    - initRequired: true
      name: usageId
      value: <randomly-generated-id>
    - initRequired: true
      name: reportUsage
      value: "true"
```
- Delete the entry in KfDef.Spec.Components for spartakus
```
  - spartakus
```
