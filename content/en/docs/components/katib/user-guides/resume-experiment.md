+++
title = "How to Resume Experiments"
description = "How to modify running Experiments and resume completed Experiments"
weight = 70
+++

This guide describes how to modify running experiments and restart completed experiments.
You will learn about changing the Experiment execution process and use various
resume policies for the Katib Experiment.

## Modify Running Experiment

While the experiment is running you are able to change Trial count parameters. For example, you
can decrease the maximum number of hyperparameter sets that are trained in parallel.

You can change only **`parallelTrialCount`**, **`maxTrialCount`** and **`maxFailedTrialCount`**
Experiment parameters.

Use Kubernetes API or `kubectl`
[in-place update of resources](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources)
to make experiment changes. For example, run:

```shell
kubectl edit experiment <experiment-name> -n <experiment-namespace>
```

Make appropriate changes and save it. Controller automatically processes
the new parameters and makes necessary changes.

- If you want to increase or decrease parallel Trial execution, modify `parallelTrialCount`.
  Controller accordingly creates or deletes trials in line with the `parallelTrialCount` value.

- If you want to increase or decrease maximum Trial count, modify `maxTrialCount`. `maxTrialCount`
  should be greater than current count of `Succeeded` trials.
  You can remove the `maxTrialCount` parameter, if your Experiment should run endless
  with `parallelTrialCount` of parallel Trials until the experiment reaches `Goal` or `maxFailedTrialCount`

- If you want to increase or decrease maximum failed Trial count, modify `maxFailedTrialCount`.
  You can remove the `maxFailedTrialCount` parameter, if the experiment should not reach `Failed` status.

## Resume Succeeded Experiment

Katib Experiment is restartable only if it is in **`Succeeded`** status because `maxTrialCount`
has been reached. To check current experiment status run:
`kubectl get experiment <experiment-name> -n <experiment-namespace>`.

To restart an Experiment, you are able to change only **`parallelTrialCount`**,
**`maxTrialCount`** and **`maxFailedTrialCount`** as described [above](#modify-running-experiment)

To control various resume policies, you can specify `.spec.resumePolicy` for the Experiment.

### Resume policy: Never

Use this policy if your Experiment should not be resumed at any time. After the Experiment has finished,
the Suggestion's [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
and [Service](https://kubernetes.io/docs/concepts/services-networking/service/)
are deleted and you can't restart the Experiment.

This is the default policy for all Katib experiments. You can omit `.spec.resumePolicy` parameter
for that functionality.

### Resume policy: LongRunning

Use this policy if you intend to restart the Experiment. After the Experiment has finished,
the Suggestion's Deployment and Service stay running until you delete your Experiment.
Modify Experiment's Trial count parameters to restart the Experiment.

Check the
[`long-running-resume.yaml`](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/resume-experiment/long-running-resume.yaml#L17)
example for more details.

### Resume policy: FromVolume

Use this policy if you intend to restart the Experiment. In that case, [volume](https://kubernetes.io/docs/concepts/storage/volumes/)
is attached to the suggestion's Deployment.

Katib controller creates [PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
in addition to the suggestion's Deployment and Service.

- PVC is deployed with the name: `<suggestion-name>-<suggestion-algorithm>`
  in the suggestion namespace.

- PV is deployed with the name:
  `<suggestion-name>-<suggestion-algorithm>-<suggestion-namespace>`

After the Experiment has finished, the Suggestion's Deployment and Service are deleted.
Suggestion data can be retained in the volume. When you restart the Experiment, the Suggestion's
Deployment and Service are created and Suggestion statistics can be recovered from the volume.

When you delete the Experiment, the Suggestion's Deployment, Service, PVC and PV are deleted automatically.

Check the
[`from-volume-resume.yaml`](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/resume-experiment/from-volume-resume.yaml#L17)
example for more details.

## Next steps

- Learn how to
  [configure and run your Katib experiments](/docs/components/katib/experiment/).

- Check the
  [Katib Configuration (Katib config)](/docs/components/katib/katib-config/).

- How to [set up environment variables](/docs/components/katib/env-variables/)
  for each Katib component.
