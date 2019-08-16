+++
title = "Usage Reporting"
description = "Opting in or out of anonymous usage data reported from Kubeflow"
weight = 40
+++

When enabled, Kubeflow will report **anonymous** usage data using [spartakus](https://github.com/kubernetes-incubator/spartakus), Kubernetes' reporting tool. Spartakus **does not report any personal information**. See [here](https://github.com/kubernetes-incubator/spartakus) for more detail.
This is entirely voluntary and you can opt out by doing the following:

```bash
# Delete any existing deployments of spartakus
kubectl delete -n ${NAMESPACE} deploy spartakus-volunteer
```

**To disable usage reporting** you need to delete spartakus component. 
This command completely deletes any spartakus deployment, while the above 
command only restarts spartakus with reportUsage set to `false`

```bash
kubectl -n ${NAMESPACE} delete deploy -l app=spartakus
```

**Reporting usage data is one of the most significant contributions you can make to Kubeflow; so please consider turning it on.** This data allows us to improve the project and helps the many companies working on Kubeflow justify continued investment.

**To prevent Spartakus from being deployed,** do the following before running `kfctl apply`:

- Edit `${KFAPP}/app.yaml`
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

    * initRequired: true name: usageId value: 
    * initRequired: true name: reportUsage value:

- Delete the entry in KfDef.Spec.Components for spartakus

    * spartakus
