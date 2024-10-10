+++
title = "TensorFlow Training (TFJob)"
description = "Using TFJob to train a model with TensorFlow"
weight = 10
+++

This page describes `TFJob` for training a machine learning model with [TensorFlow](https://www.tensorflow.org/).

## What is TFJob?

`TFJob` is a Kubernetes
[custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
to run TensorFlow training jobs on Kubernetes. The Kubeflow implementation of
`TFJob` is in the [`training-operator`](https://github.com/kubeflow/training-operator).

**Note**: `TFJob` doesn't work in a user namespace by default because of Istio
[automatic sidecar injection](https://istio.io/v1.3/docs/setup/additional-setup/sidecar-injection/#automatic-sidecar-injection).
In order to get `TFJob` running, it needs the annotation `sidecar.istio.io/inject: "false"`
to disable it for `TFJob` pods.

A `TFJob` is a resource with a YAML representation like the one below (edit to use the container image and command for your own training code):

```yaml
apiVersion: kubeflow.org/v1
kind: TFJob
metadata:
  generateName: tfjob
  namespace: your-user-namespace
spec:
  tfReplicaSpecs:
    PS:
      replicas: 1
      restartPolicy: OnFailure
      template:
        metadata:
          annotations:
            sidecar.istio.io/inject: "false"
        spec:
          containers:
            - name: tensorflow
              image: gcr.io/your-project/your-image
              command:
                - python
                - -m
                - trainer.task
                - --batch_size=32
                - --training_steps=1000
    Worker:
      replicas: 3
      restartPolicy: OnFailure
      template:
        metadata:
          annotations:
            sidecar.istio.io/inject: "false"
        spec:
          containers:
            - name: tensorflow
              image: gcr.io/your-project/your-image
              command:
                - python
                - -m
                - trainer.task
                - --batch_size=32
                - --training_steps=1000
```

If you want to give your `TFJob` pods access to credentials secrets, such as the Google Cloud credentials
automatically created when you do a GKE-based Kubeflow installation, you can mount and use a secret like this:

```yaml
apiVersion: kubeflow.org/v1
kind: TFJob
metadata:
  generateName: tfjob
  namespace: your-user-namespace
spec:
  tfReplicaSpecs:
    PS:
      replicas: 1
      restartPolicy: OnFailure
      template:
        metadata:
          annotations:
            sidecar.istio.io/inject: "false"
        spec:
          containers:
            - name: tensorflow
              image: gcr.io/your-project/your-image
              command:
                - python
                - -m
                - trainer.task
                - --batch_size=32
                - --training_steps=1000
              env:
                - name: GOOGLE_APPLICATION_CREDENTIALS
                  value: "/etc/secrets/user-gcp-sa.json"
              volumeMounts:
                - name: sa
                  mountPath: "/etc/secrets"
                  readOnly: true
          volumes:
            - name: sa
              secret:
                secretName: user-gcp-sa
    Worker:
      replicas: 1
      restartPolicy: OnFailure
      template:
        metadata:
          annotations:
            sidecar.istio.io/inject: "false"
        spec:
          containers:
            - name: tensorflow
              image: gcr.io/your-project/your-image
              command:
                - python
                - -m
                - trainer.task
                - --batch_size=32
                - --training_steps=1000
              env:
                - name: GOOGLE_APPLICATION_CREDENTIALS
                  value: "/etc/secrets/user-gcp-sa.json"
              volumeMounts:
                - name: sa
                  mountPath: "/etc/secrets"
                  readOnly: true
          volumes:
            - name: sa
              secret:
                secretName: user-gcp-sa
```

If you are not familiar with Kubernetes resources please refer to the page [Understanding Kubernetes Objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/).

What makes `TFJob` different from built in [controllers](https://kubernetes.io/docs/concepts/workloads/controllers/) is that the `TFJob` spec is designed to manage
[distributed TensorFlow training jobs](https://www.tensorflow.org/guide/distributed_training).

A distributed TensorFlow job typically contains 0 or more of the following processes

- **Chief** The chief is responsible for orchestrating training and performing tasks
  like checkpointing the model.
- **Ps** The ps are parameter servers; these servers provide a distributed data store
  for the model parameters.
- **Worker** The workers do the actual work of training the model. In some cases,
  worker 0 might also act as the chief.
- **Evaluator** The evaluators can be used to compute evaluation metrics as the model
  is trained.

The field **tfReplicaSpecs** in `TFJob` spec contains a map from the type of
replica (as listed above) to the **TFReplicaSpec** for that replica. **TFReplicaSpec**
consists of 3 fields

- **replicas** The number of replicas of this type to spawn for this `TFJob`.
- **template** A [PodTemplateSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#podtemplatespec-v1-core) that describes the pod to create
  for each replica.

  - **The pod must include a container named `tensorflow`**.

- **restartPolicy** Determines whether pods will be restarted when they exit. The
  allowed values are as follows

  - **Always** means the pod will always be restarted. This policy is good
    for parameter servers since they never exit and should always be restarted
    in the event of failure.
  - **OnFailure** means the pod will be restarted if the pod exits due to failure.

    - A non-zero exit code indicates a failure.
    - An exit code of 0 indicates success and the pod will not be restarted.
    - This policy is good for chief and workers.

  - **ExitCode** means the restart behavior is dependent on the exit code of
    the `tensorflow` container as follows:

    - Exit code `0` indicates the process completed successfully and will
      not be restarted.

    - The following exit codes indicate a permanent error and the container
      will not be restarted:

      - `1`: general errors
      - `2`: misuse of shell builtins
      - `126`: command invoked cannot execute
      - `127`: command not found
      - `128`: invalid argument to exit
      - `139`: container terminated by SIGSEGV (invalid memory reference)

    - The following exit codes indicate a retryable error and the container
      will be restarted:

      - `130`: container terminated by SIGINT (keyboard Control-C)
      - `137`: container received a SIGKILL
      - `143`: container received a SIGTERM

    - Exit code `138` corresponds to SIGUSR1 and is reserved for
      user-specified retryable errors.

    - Other exit codes are undefined and there is no guarantee about the
      behavior.

    For background information on exit codes, see the [GNU guide to
    termination signals](https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html)
    and the [Linux Documentation
    Project](https://tldp.org/LDP/abs/html/exitcodes.html).

  - **Never** means pods that terminate will never be restarted. This policy
    should rarely be used because Kubernetes will terminate pods for any number
    of reasons (e.g. node becomes unhealthy) and this will prevent the job from
    recovering.

## Running the Mnist example

See the manifests for the [distributed MNIST example](https://github.com/kubeflow/training-operator/blob/master/examples/tensorflow/simple.yaml). You may change the config file based on your requirements.

Deploy the `TFJob` resource to start training:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/training-operator/master/examples/tensorflow/simple.yaml
```

Monitor the job (see the [detailed guide below](#monitoring-your-job)):

```
kubectl -n kubeflow get tfjob tfjob-simple -o yaml
```

Delete it

```
kubectl -n kubeflow delete tfjob tfjob-simple
```

## Customizing the TFJob

Typically you can change the following values in the `TFJob` yaml file:

1. Change the image to point to the docker image containing your code
1. Change the number and types of replicas
1. Change the resources (requests and limits) assigned to each resource
1. Set any environment variables

   - For example, you might need to configure various environment variables to talk to datastores like GCS or S3

1. Attach PVs if you want to use PVs for storage.

## Using GPUs

To use GPUs your cluster must be configured to use GPUs.

- Nodes must have GPUs attached.
- The Kubernetes cluster must recognize the `nvidia.com/gpu` resource type.
- GPU drivers must be installed on the cluster.
- For more information:
  - [Kubernetes instructions for scheduling GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
  - [GKE instructions](https://cloud.google.com/kubernetes-engine/docs/concepts/gpus)
  - [EKS instructions](https://docs.aws.amazon.com/eks/latest/userguide/gpu-ami.html)

To attach GPUs specify the GPU resource on the container in the replicas
that should contain the GPUs; for example.

```yaml
apiVersion: "kubeflow.org/v1"
kind: "TFJob"
metadata:
  name: "tf-smoke-gpu"
spec:
  tfReplicaSpecs:
    PS:
      replicas: 1
      template:
        metadata:
          creationTimestamp: null
        spec:
          containers:
            - args:
                - python
                - tf_cnn_benchmarks.py
                - --batch_size=32
                - --model=resnet50
                - --variable_update=parameter_server
                - --flush_stdout=true
                - --num_gpus=1
                - --local_parameter_device=cpu
                - --device=cpu
                - --data_format=NHWC
              image: gcr.io/kubeflow/tf-benchmarks-cpu:v20171202-bdab599-dirty-284af3
              name: tensorflow
              ports:
                - containerPort: 2222
                  name: tfjob-port
              resources:
                limits:
                  cpu: "1"
              workingDir: /opt/tf-benchmarks/scripts/tf_cnn_benchmarks
          restartPolicy: OnFailure
    Worker:
      replicas: 1
      template:
        metadata:
          creationTimestamp: null
        spec:
          containers:
            - args:
                - python
                - tf_cnn_benchmarks.py
                - --batch_size=32
                - --model=resnet50
                - --variable_update=parameter_server
                - --flush_stdout=true
                - --num_gpus=1
                - --local_parameter_device=cpu
                - --device=gpu
                - --data_format=NHWC
              image: gcr.io/kubeflow/tf-benchmarks-gpu:v20171202-bdab599-dirty-284af3
              name: tensorflow
              ports:
                - containerPort: 2222
                  name: tfjob-port
              resources:
                limits:
                  nvidia.com/gpu: 1
              workingDir: /opt/tf-benchmarks/scripts/tf_cnn_benchmarks
          restartPolicy: OnFailure
```

Follow TensorFlow's [instructions](https://www.tensorflow.org/guide/gpu)
for using GPUs.

## Monitoring your job

To get the status of your job

```bash
kubectl -n kubeflow get -o yaml tfjobs tfjob-simple
```

Here is sample output for an example job

```yaml
apiVersion: kubeflow.org/v1
kind: TFJob
metadata:
  creationTimestamp: "2021-09-06T11:48:09Z"
  generation: 1
  name: tfjob-simple
  namespace: kubeflow
  resourceVersion: "5764004"
  selfLink: /apis/kubeflow.org/v1/namespaces/kubeflow/tfjobs/tfjob-simple
  uid: 3a67a9a9-cb89-4c1f-a189-f49f0b581e29
spec:
  tfReplicaSpecs:
    Worker:
      replicas: 2
      restartPolicy: OnFailure
      template:
        spec:
          containers:
            - command:
                - python
                - /var/tf_mnist/mnist_with_summaries.py
              image: gcr.io/kubeflow-ci/tf-mnist-with-summaries:1.0
              name: tensorflow
status:
  completionTime: "2021-09-06T11:49:30Z"
  conditions:
    - lastTransitionTime: "2021-09-06T11:48:09Z"
      lastUpdateTime: "2021-09-06T11:48:09Z"
      message: TFJob tfjob-simple is created.
      reason: TFJobCreated
      status: "True"
      type: Created
    - lastTransitionTime: "2021-09-06T11:48:12Z"
      lastUpdateTime: "2021-09-06T11:48:12Z"
      message: TFJob kubeflow/tfjob-simple is running.
      reason: TFJobRunning
      status: "False"
      type: Running
    - lastTransitionTime: "2021-09-06T11:49:30Z"
      lastUpdateTime: "2021-09-06T11:49:30Z"
      message: TFJob kubeflow/tfjob-simple successfully completed.
      reason: TFJobSucceeded
      status: "True"
      type: Succeeded
  replicaStatuses:
    Worker:
      succeeded: 2
  startTime: "2021-09-06T11:48:10Z"
```

### Conditions

A `TFJob` has a `TFJobStatus`, which has an array of `TFJobConditions` through which the `TFJob` has or has not passed.
Each element of the `TFJobCondition` array has six possible fields:

- The **lastUpdateTime** field provides the last time this condition was updated.
- The **lastTransitionTime** field provides the last time the condition transitioned from one status to another.
- The **message** field is a human readable message indicating details about the transition.
- The **reason** field is a unique, one-word, CamelCase reason for the condition's
  last transition.
- The **status** field is a string with possible values "True", "False", and "Unknown".
- The **type** field is a string with the following possible values:
  - **TFJobCreated** means the `TFJob` has been accepted by the system,
    but one or more of the pods/services has not been started.
  - **TFJobRunning** means all sub-resources (e.g. services/pods) of this `TFJob`
    have been successfully scheduled and launched and the job is running.
  - **TFJobRestarting** means one or more sub-resources (e.g. services/pods)
    of this `TFJob` had a problem and is being restarted.
  - **TFJobSucceeded** means the job completed successfully.
  - **TFJobFailed** means the job has failed.

Success or failure of a job is determined as follows

- If a job has a **chief**, success or failure is determined by the status
  of the chief.
- If a job has no chief, success or failure is determined by the workers.
- In both cases, the `TFJob` succeeds if the process being monitored exits
  with exit code 0.
- In the case of non-zero exit code, the behavior is determined by the restartPolicy
  for the replica.
- If the restartPolicy allows for restarts then the process will just be restarted and the `TFJob` will continue to execute.
  - For the restartPolicy ExitCode the behavior is exit code dependent.
  - If the restartPolicy doesn't allow restarts a non-zero exit code is considered
    a permanent failure and the job is marked failed.

### tfReplicaStatuses

tfReplicaStatuses provides a map indicating the number of pods for each
replica in a given state. There are three possible states

- **Active** is the number of currently running pods.
- **Succeeded** is the number of pods that completed successfully.
- **Failed** is the number of pods that completed with an error.

### Events

During execution, `TFJob` will emit events to indicate whats happening such
as the creation/deletion of pods and services. Kubernetes doesn't retain
events older than 1 hour by default. To see recent events for a job run

```
kubectl -n kubeflow describe tfjobs tfjob-simple
```

which will produce output like

```
Name:         tfjob-simple
Namespace:    kubeflow
Labels:       <none>
Annotations:  <none>
API Version:  kubeflow.org/v1
Kind:         TFJob
Metadata:
  Creation Timestamp:  2021-09-06T11:48:09Z
  Generation:          1
  Managed Fields:
    API Version:  kubeflow.org/v1
    Fields Type:  FieldsV1
    fieldsV1:
      f:spec:
        .:
        f:tfReplicaSpecs:
          .:
          f:Worker:
            .:
            f:replicas:
            f:restartPolicy:
            f:template:
              .:
              f:spec:
    Manager:      kubectl-create
    Operation:    Update
    Time:         2021-09-06T11:48:09Z
    API Version:  kubeflow.org/v1
    Fields Type:  FieldsV1
    fieldsV1:
      f:spec:
        f:runPolicy:
          .:
          f:cleanPodPolicy:
        f:successPolicy:
        f:tfReplicaSpecs:
          f:Worker:
            f:template:
              f:metadata:
              f:spec:
                f:containers:
      f:status:
        .:
        f:completionTime:
        f:conditions:
        f:replicaStatuses:
          .:
          f:Worker:
            .:
            f:succeeded:
        f:startTime:
    Manager:         manager
    Operation:       Update
    Time:            2021-09-06T11:49:30Z
  Resource Version:  5764004
  Self Link:         /apis/kubeflow.org/v1/namespaces/kubeflow/tfjobs/tfjob-simple
  UID:               3a67a9a9-cb89-4c1f-a189-f49f0b581e29
Spec:
  Tf Replica Specs:
    Worker:
      Replicas:        2
      Restart Policy:  OnFailure
      Template:
        Spec:
          Containers:
            Command:
              python
              /var/tf_mnist/mnist_with_summaries.py
            Image:  gcr.io/kubeflow-ci/tf-mnist-with-summaries:1.0
            Name:   tensorflow
Status:
  Completion Time:  2021-09-06T11:49:30Z
  Conditions:
    Last Transition Time:  2021-09-06T11:48:09Z
    Last Update Time:      2021-09-06T11:48:09Z
    Message:               TFJob tfjob-simple is created.
    Reason:                TFJobCreated
    Status:                True
    Type:                  Created
    Last Transition Time:  2021-09-06T11:48:12Z
    Last Update Time:      2021-09-06T11:48:12Z
    Message:               TFJob kubeflow/tfjob-simple is running.
    Reason:                TFJobRunning
    Status:                False
    Type:                  Running
    Last Transition Time:  2021-09-06T11:49:30Z
    Last Update Time:      2021-09-06T11:49:30Z
    Message:               TFJob kubeflow/tfjob-simple successfully completed.
    Reason:                TFJobSucceeded
    Status:                True
    Type:                  Succeeded
  Replica Statuses:
    Worker:
      Succeeded:  2
  Start Time:     2021-09-06T11:48:10Z
Events:
  Type    Reason                   Age                    From              Message
  ----    ------                   ----                   ----              -------
  Normal  SuccessfulCreatePod      7m9s                   tfjob-controller  Created pod: tfjob-simple-worker-0
  Normal  SuccessfulCreatePod      7m8s                   tfjob-controller  Created pod: tfjob-simple-worker-1
  Normal  SuccessfulCreateService  7m8s                   tfjob-controller  Created service: tfjob-simple-worker-0
  Normal  SuccessfulCreateService  7m8s                   tfjob-controller  Created service: tfjob-simple-worker-1
  Normal  ExitedWithCode           5m48s (x3 over 5m48s)  tfjob-controller  Pod: kubeflow.tfjob-simple-worker-1 exited with code 0
  Normal  ExitedWithCode           5m48s                  tfjob-controller  Pod: kubeflow.tfjob-simple-worker-0 exited with code 0
  Normal  TFJobSucceeded           5m48s                  tfjob-controller  TFJob kubeflow/tfjob-simple successfully completed.
```

Here the events indicate that the pods and services were successfully created.

## TensorFlow Logs

Logging follows standard K8s logging practices.

You can use kubectl to get standard output/error for any pods
that haven't been **deleted**.

First find the pod created by the job controller for the replica of
interest. Pods will be named

```
${JOBNAME}-${REPLICA-TYPE}-${INDEX}
```

Once you've identified your pod you can get the logs using kubectl.

```
kubectl logs ${PODNAME}
```

The **CleanPodPolicy** in the `TFJob` spec controls deletion of pods when a job terminates.
The policy can be one of the following values

- The **Running** policy means that only pods still running when a job completes
  (e.g. parameter servers) will be deleted immediately; completed pods will
  not be deleted so that the logs will be preserved. This is the default value.
- The **All** policy means all pods even completed pods will be deleted immediately
  when the job finishes.
- The **None** policy means that no pods will be deleted when the job completes.

If your cluster takes advantage of Kubernetes
[cluster logging](https://kubernetes.io/docs/concepts/cluster-administration/logging/)
then your logs may also be shipped to an appropriate data store for
further analysis.

### Stackdriver on GKE

See the guide to [logging and monitoring](/docs/gke/monitoring/) for
instructions on getting logs using Stackdriver.

As described in the guide to
[logging and monitoring](https://www.kubeflow.org/docs/gke/monitoring/#filter-with-labels),
it's possible to fetch the logs for a particular replica based on pod labels.

Using the Stackdriver UI you can use a query like

```
resource.type="k8s_container"
resource.labels.cluster_name="${CLUSTER}"
metadata.userLabels.job-name="${JOB_NAME}"
metadata.userLabels.replica-type="${TYPE}"
metadata.userLabels.replica-index="${INDEX}"
```

Alternatively using gcloud

```
QUERY="resource.type=\"k8s_container\" "
QUERY="${QUERY} resource.labels.cluster_name=\"${CLUSTER}\" "
QUERY="${QUERY} metadata.userLabels.job-name=\"${JOB_NAME}\" "
QUERY="${QUERY} metadata.userLabels.replica-type=\"${TYPE}\" "
QUERY="${QUERY} metadata.userLabels.replica-index=\"${INDEX}\" "
gcloud --project=${PROJECT} logging read  \
     --freshness=24h \
     --order asc  ${QUERY}
```

## Troubleshooting

Here are some steps to follow to troubleshoot your job

1. Is a status present for your job? Run the command

   ```
   kubectl -n ${USER_NAMESPACE} get tfjobs -o yaml ${JOB_NAME}
   ```

   - **USER_NAMESPACE** is the namespace created for your user profile.

   - If the resulting output doesn't include a status for your job then this typically
     indicates the job spec is invalid.

   - If the `TFJob` spec is invalid there should be a log message in the tf operator logs

     ```
     kubectl -n ${KUBEFLOW_NAMESPACE} logs `kubectl get pods --selector=name=tf-job-operator -o jsonpath='{.items[0].metadata.name}'`
     ```

     - **KUBEFLOW_NAMESPACE** Is the namespace you deployed the `TFJob` operator in.

1. Check the events for your job to see if the pods were created

   - There are a number of ways to get the events; if your job is less than **1 hour old**
     then you can do

     ```
     kubectl -n ${USER_NAMESPACE} describe tfjobs ${JOB_NAME}
     ```

   - The bottom of the output should include a list of events emitted by the job; e.g.

     ```yaml
     Events:
      Type    Reason                   Age   From              Message
      ----    ------                   ----  ----              -------
      Normal  SuccessfulCreatePod      90s   tfjob-controller  Created pod: tfjob2-worker-0
      Normal  SuccessfulCreatePod      90s   tfjob-controller  Created pod: tfjob2-ps-0
      Normal  SuccessfulCreateService  90s   tfjob-controller  Created service: tfjob2-worker-0
      Normal  SuccessfulCreateService  90s   tfjob-controller  Created service: tfjob2-ps-0
     ```

   - Kubernetes only preserves events for **1 hour** (see [kubernetes/kubernetes#52521](https://github.com/kubernetes/kubernetes/issues/52521))

     - Depending on your cluster setup events might be persisted to external storage and accessible for longer periods
     - On GKE events are persisted in stackdriver and can be accessed using the instructions in the previous section.

   - If the pods and services aren't being created then this suggests the `TFJob` isn't being processed; common causes are

     - The `TFJob` spec is invalid (see above)
     - The `TFJob` operator isn't running

1. Check the events for the pods to ensure they are scheduled.

   - There are a number of ways to get the events; if your pod is less than **1 hour old**
     then you can do

     ```
      kubectl -n ${USER_NAMESPACE} describe pods ${POD_NAME}
     ```

   - The bottom of the output should contain events like the following

     ```
     Events:
     Type    Reason                 Age   From                                                  Message
     ----    ------                 ----  ----                                                  -------
     Normal  Scheduled              18s   default-scheduler                                     Successfully assigned tfjob2-ps-0 to gke-jl-kf-v0-2-2-default-pool-347936c1-1qkt
     Normal  SuccessfulMountVolume  17s   kubelet, gke-jl-kf-v0-2-2-default-pool-347936c1-1qkt  MountVolume.SetUp succeeded for volume "default-token-h8rnv"
     Normal  Pulled                 17s   kubelet, gke-jl-kf-v0-2-2-default-pool-347936c1-1qkt  Container image "gcr.io/kubeflow/tf-benchmarks-cpu:v20171202-bdab599-dirty-284af3" already present on machine
     Normal  Created                17s   kubelet, gke-jl-kf-v0-2-2-default-pool-347936c1-1qkt  Created container
     Normal  Started                16s   kubelet, gke-jl-kf-v0-2-2-default-pool-347936c1-1qkt  Started container
     ```

   - Some common problems that can prevent a container from starting are
     - Insufficient resources to schedule the pod
     - The pod tries to mount a volume (or secret) that doesn't exist or is unavailable
     - The docker image doesn't exist or can't be accessed (e.g due to permission issues)

1. If the containers start; check the logs of the containers following the instructions
   in the previous section.

## Next steps

- Learn about [distributed training](/docs/components/training/reference/distributed-training/) in Training Operator.

- See how to [run a job with gang-scheduling](/docs/components/training/user-guides/job-scheduling/#running-jobs-with-gang-scheduling).
