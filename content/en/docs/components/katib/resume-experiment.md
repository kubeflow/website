+++
title = "Resuming an Experiment"
description = "How to restart and modify running experiments"
weight = 40
                    
+++

This guide describes how to modify running experiments
and restart completed experiments. You will learn
about changing the experiment execution process and use various
resume policies for the Katib experiment.

For the details on how to configure and run your experiment, follow the
[running an experiment guide](/docs/components/katib/experiment/).

<a id="modify-experiment">

## Modify running experiment

While the experiment is running you are able to change trial count parameters.
For example, you can decrease the maximum number of
hyperparameter sets that are trained in parallel.

You can change only **`parallelTrialCount`**, **`maxTrialCount`** and **`maxFailedTrialCount`**
experiment parameters.

Use Kubernetes API or `kubectl`
[in-place update of resources](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources)
to make experiment changes. For example, run:

```
kubectl edit experiment <experiment-name> -n <experiment-namespace>
```

Make appropriate changes and save it. Controller automatically processes
the new parameters and makes necessary changes.

- If you want to increase or decrease parallel trial execution,
  modify `parallelTrialCount`. Controller accordingly creates or
  deletes trials in line with the `parallelTrialCount` value.

- If you want to increase or decrease maximum trial count,
  modify `maxTrialCount`. `maxTrialCount` should be greater than current
  count of `Succeeded` trials. You can remove the `maxTrialCount` parameter,
  if your experiment should run endless with `parallelTrialCount` of parallel
  trials until the experiment reaches `Goal` or `maxFailedTrialCount`

- If you want to increase or decrease maximum failed trial count,
  modify `maxFailedTrialCount`. You can remove the `maxFailedTrialCount`
  parameter, if the experiment should not reach `Failed` status.

## Resume succeeded experiment

Katib experiment is restartable only if it is in **`Succeeded`** status because
`maxTrialCount` has been reached. To check current experiment status run:
`kubectl get experiment <experiment-name> -n <experiment-namespace>`.

To restart an experiment, you are able to change only **`parallelTrialCount`**,
**`maxTrialCount`** and **`maxFailedTrialCount`**
as described [above](#modify-experiment)

To control various resume policies, you can specify `.spec.resumePolicy`
for the experiment.
Refer to the
[`ResumePolicy` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L58).

### Resume policy: Never

Use this policy if your experiment should not be resumed at any time.
After the experiment has finished,
the suggestion's [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
and [Service](https://kubernetes.io/docs/concepts/services-networking/service/)
are deleted and you can't restart the experiment.
Learn more about Katib concepts
in the [overview guide](/docs/components/katib/overview/#katib-concepts).

Check the
[`never-resume.yaml`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/resume-experiment/never-resume.yaml#L18)
example for more details.

### Resume policy: LongRunning

Use this policy if you intend to restart the experiment.
After the experiment has finished, the suggestion's Deployment and Service stay
running. Modify experiment's trial count parameters to restart the experiment.

When you delete the experiment, the suggestion's Deployment and
Service are deleted.

This is the default policy for all Katib experiments.
You can omit `.spec.resumePolicy` parameter for that functionality.

### Resume policy: FromVolume

Use this policy if you intend to restart the experiment.
In that case, [volume](https://kubernetes.io/docs/concepts/storage/volumes/)
is attached to the suggestion's Deployment.

Katib controller creates
[PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
in addition to the suggestion's Deployment and Service.

**Note:** Your Kubernetes cluster must have `StorageClass` for
[dynamic volume provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/)
to automatically provision storage for the created PVC. Otherwise, you have to define
suggestion's [PersistentVolume (PV)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes)
specification in the Katib configuration settings and Katib controller will create PVC and PV.
Follow the [Katib configuration guide](/docs/components/katib/katib-config/#suggestion-volume-settings)
to set up the suggestion's volume settings.

- PVC is deployed with the name: `<suggestion-name>-<suggestion-algorithm>`
  in the suggestion namespace.

- PV is deployed with the name:
  `<suggestion-name>-<suggestion-algorithm>-<suggestion-namespace>`

After the experiment has finished, the suggestion's Deployment and
Service are deleted. Suggestion data can be retained in the volume.
When you restart the experiment, the suggestion's Deployment and Service
are created and suggestion statistics can be recovered from the volume.

When you delete the experiment, the suggestion's Deployment, Service,
PVC and PV are deleted automatically.

Check the
[`from-volume-resume.yaml`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/resume-experiment/from-volume-resume.yaml#L18)
example for more details.

## Next steps

- Learn how to
  [configure and run your Katib experiments](/docs/components/katib/experiment/).

- Check the
  [Katib Configuration (Katib config)](/docs/components/katib/katib-config/).

- How to [set up environment variables](/docs/components/katib/env-variables/)
  for each Katib component.
