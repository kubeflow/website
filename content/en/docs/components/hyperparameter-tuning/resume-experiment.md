+++
title = "Resuming an experiment"
description = "How to restart and modify running experiment"
weight = 40
                    
+++

This page describes in detail how to modify running experiment and restart succeeded experiment.
Follow this guide to known more about changing experiment execution process and use various
resume policies for the Katib experiment.

For details of how to configure and run your experiment, see the guide to
[running an experiment](/docs/components/hyperparameter-tuning/experiment/).

<a id="modify-experiment">

## Modify running experiment

While experiment is running you are able to change trial count parameters.
For example, if you want to decrease maximum number of hyperparameters sets that are trained parallel.

You can change only **`parallelTrialCount`**, **`maxTrialCount`** and **`maxFailedTrialCount`**
experiment parameters.

Use Kubernetes API or `kubectl`
[in-place update of resources](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources)
to make experiment changes. For example, run:

```
kubectl edit experiment <experiment-name> -n <experiment-namespace>
```

Make appropriate changes and save it. Controller automatically proceeds new parameters and
makes necessary changes.

- If you want to increase or decrease parallel trial execution, modify `parallelTrialCount`.
  Controller accordingly creates or deletes trials in line with `parallelTrialCount`.

- If you want to increase or decrease maximum trial count, modify `maxTrialCount`. `maxTrialCount`
  should be greater than current count of `Succeeded` trials. You can remove this parameter, if
  experiment should run endless with `parallelTrialCount` parallel trials until it reaches `Goal` or `maxFailedTrialCount`.

- If you want to increase or decrease maximum failed trial count, modify `maxFailedTrialCount`.
  You can remove this parameter, if experiment should not reach `Failed` status.

## Resume succeeded experiment

To control various resume policies, you can specify `.spec.resumePolicy` for the experiment.
See the [`ResumePolicy` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L54).

Katib experiment is restartable only if it is in **`Succeeded`** status because
`maxTrialCount` has been reached. To check current experiment status run:
`kubectl get experiment <experiment-name> -n <experiment-namespace>`.

To restart experiment, you are able to change only **`parallelTrialCount`**, **`maxTrialCount`** and **`maxFailedTrialCount`**
as described [above](#modify-experiment)

### Resume policy: Never

Use this policy if your experiment should not be resumed at any time.
After experiment is succeeded, suggestion's [deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
and [service](https://kubernetes.io/docs/concepts/services-networking/service/)
are deleted and you can't restart the experiment.
Read more about Katib concepts in [overview guide](/docs/components/hyperparameter-tuning/overview/#katib-concepts).

See the [never resume policy example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/resume-experiment/never-resume.yaml#L20).

### Resume policy: LongRunning

Use this policy if you intend to restart the experiment.
After experiment is succeeded, suggestion's deployment and service stay running.
Modify experiment's trial count parameters to restart the experiment.

When you delete the experiment, suggestion's deployment and service are deleted.

This is the default policy for all Katib experiments. You can omit `.spec.resumePolicy` parameter for that functionality.

### Resume policy: FromVolume

Use this policy if you intend to restart the experiment.
In that case, [volume](https://kubernetes.io/docs/concepts/storage/volumes/)
is attached to the suggestion's deployment.

Katib controller creates [persistent volume claim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC)
and [persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes) (PV)
in addition to the suggestion's deployment and service.

**Note that** If you specify [storage class name](https://kubernetes.io/docs/concepts/storage/storage-classes/)
in Katib configuration settings for the PVC differently from `katib-suggestion`, controller creates only PVC.
Follow the [Katib configuration guide](/docs/components/hyperparameter-tuning/katib-config/#suggestion-volume-settings)
to set up suggestion's volume settings.

- PVC is deployed with the name: `<suggestion-name>-<suggestion-algorithm>` in suggestion namespace.

- PV is deployed with the name: `<suggestion-name>-<suggestion-algorithm>-<suggestion-namespace>`

After experiment is succeeded, suggestion's deployment and service are deleted.
Suggestion data can be retained in the volume.
When you restart the experiment, suggestion's deployment and service are created and
suggestion statistics can be recovered from the volume.

When you delete the experiment, suggestion's deployment, service, PVC and PV are deleted automatically.

See the [from volume policy example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/resume-experiment/from-volume-resume.yaml#L18).

## Next steps

- See how to configure and run your experiment in the
  [running an experiment guide](/docs/components/hyperparameter-tuning/experiment/).

- For a detailed instruction of the Katib Configuration file,
  read the [Katib config page](/docs/components/hyperparameter-tuning/katib-config/).

- See how you can change installation of Katib components in the [environment variables guide](/docs/components/hyperparameter-tuning/env-variables/).
