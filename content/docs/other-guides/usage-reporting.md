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

{{% alert title="Reporting usage data is one of the most significant contributions you can make to Kubeflow" color="info" %}}
Please consider allowing the reporting of usage data.
The data helps the Kubeflow community to improve the project and helps the many 
companies working on Kubeflow justify continued investment.
{{% /alert %}}

## Disable usage reporting on an existing Kubeflow deployment

If you've already deployed Kubeflow, run the following command to disable usage 
reporting on your existing deployment. The command removes the 
`spartakus-volunteer` component:

```bash
export NAMESPACE=kubeflow
kubectl delete -n ${NAMESPACE} deploy spartakus-volunteer
```

You can run the following command to check for existence of the application:

```bash
kubectl get -n ${NAMESPACE} deploy spartakus-volunteer
```

## Remove usage reporting before deploying Kubeflow

The following instructions assume that you plan to use the `kfctl` command-line
tool to deploy Kubeflow, as described in the 
[Kubeflow getting-started guides](/docs/started/getting-started/).

To prevent Spartakus from being deployed, edit your `${KFAPP}/app.yaml` 
configuration file before running `kfctl apply`. 
(`KFAPP` represents the directory where your Kubeflow configuration is stored 
during deployment.)

You need to remove the Spartakus entry from `KfDef.Spec.Applications`. To do 
that, find the `applications` section of the YAML file and delete the following 
lines:

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

**Alternatively,** some YAML configuration files may include entries for 
`KfDef.Spec.Components` and `KfDef.Spec.ComponentParams` instead of 
`KfDef.Spec.Applications`. In this case:

- Find the `componentParams` section of the YAML file and delete the following 
  lines:

        spartakus:
        - initRequired: true
          name: usageId
          value: "<randomly-generated-id>"
        - initRequired: true
          name: reportUsage
          value: "true"


- Find the `components` section of the YAML file and delete the following 
  line:

        - spartakus
