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
`spartakus-volunteer` application:

```bash
export NAMESPACE=kubeflow
kubectl delete -n ${NAMESPACE} deploy spartakus-volunteer
```

You can run the following command to check for existence of the application:

```bash
kubectl get -n ${NAMESPACE} deploy spartakus-volunteer
```

## Remove usage reporting before deploying Kubeflow

The following instructions assume that you plan to use the kfctl command-line
interface to deploy Kubeflow.

This guide refers to the `${CONFIG_FILE}`, which is the Kubeflow configuration 
file in your Kubeflow deployment directory. For example,
`${KF_DIR}/{{% config-file-k8s-istio %}}` or 
`${KF_DIR}/{{% config-file-gcp-iap %}}`.

To prevent Spartakus from being deployed:

1. Follow your chosen guide to deploying Kubeflow, but stop before you deploy
  Kubeflow. For example, see the guide to 
  [deploying Kubeflow with kfctl_k8s_istio](/docs/started/k8s/kfctl-k8s-istio/).
1. When you reach the 
  [setup and deploy step](/docs/started/k8s/kfctl-k8s-istio/#alt-set-up-and-deploy),
  **skip the `kfctl apply` command** and run the **`kfctl build`** command 
  instead, as  described in the above guide. Now you can edit the configuration
  files before deploying Kubeflow.
1. Edit your `${CONFIG_FILE}` file as described [below](#remove-spartakus).

1. Run the `kfctl apply` command to deploy Kubeflow:

  ```
  cd ${KF_DIR}
  kfctl apply -V -f ${CONFIG_FILE}
  ```

<a id="remove-spartakus"></a>
### Removing Spartakus from your configuration

You need to remove the Spartakus entry from `KfDef.Spec.Applications` in
the `${CONFIG_FILE}` file. Find the `applications` section of the YAML 
file and delete the following lines:

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
