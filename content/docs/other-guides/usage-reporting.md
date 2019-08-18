+++
title = "Usage Reporting"
description = "Opting in or out of anonymous usage data reported from Kubeflow"
weight = 40
+++

When enabled, Kubeflow will report **anonymous** usage data using 
[Spartakus](https://github.com/kubernetes-incubator/spartakus), Kubernetes' 
reporting tool. Spartakus does not report any personal information. 
See the [Spartakus docs](https://github.com/kubernetes-incubator/spartakus) for 
more detail. 

Allowing usage reporting is entirely voluntary.
**Reporting usage data is one of the most significant contributions you can make 
to Kubeflow; so please consider allowing the reporting of usage data.** 
The data helps the Kubeflow community to improve the project and helps the many 
companies working on Kubeflow justify continued investment.

**To opt out of usage reporting,** run the following command:

```bash
kubectl delete -n ${NAMESPACE} deploy spartakus-volunteer
```

**To disable usage reporting,** you need to delete the Spartakus component. 
The above command restarts Spartakus with the `reportUsage` flag set to `false`, 
while the following command completely removes any Spartakus deployment:

```bash
kubectl -n ${NAMESPACE} delete deploy -l app=spartakus
```

**To prevent Spartakus from being deployed,** edit `${KFAPP}/app.yaml` before 
running `kfctl apply`. Make the following changes to the YAML file:

- Delete the Spartakus entry in the `applications` section. These are the lines
  to delete:

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

- Delete the Spartakus entry in the `componentParams` section. These are the
  lines to delete:

  ```
  spartakus:
  - initRequired: true
    name: usageId
    value: "<randomly-generated-id>"
  - initRequired: true
    name: reportUsage
    value: "true"
  ```

- Delete the Spartakus entry in the `components` section. This is the line
  to delete:

  ```
  - spartakus
  ```
