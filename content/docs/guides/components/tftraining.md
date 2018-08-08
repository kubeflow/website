+++
title = "TensorFlow Training"
description = ""
weight = 10
toc = true
bref= "Training using TensorFlow"
[menu]
[menu.docs]
  parent = "components"
  weight = 60
+++

## What is TFJob?

TFJob is a Kubernetes [custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) that makes it easy to
run TensorFlow training jobs on Kubernetes.

A TFJob is a resource with a simple YAML representation illustrated below.

```yaml
apiVersion: kubeflow.org/v1alpha2
kind: TFJob
metadata:
  labels:
    experiment: experiment10
  name: tfjob
  namespace: kubeflow
spec:
  tfReplicaSpecs:
    Ps:
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
            resources: {}
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
            - --device=cpu
            - --data_format=NHWC
            image: gcr.io/kubeflow/tf-benchmarks-cpu:v20171202-bdab599-dirty-284af3
            name: tensorflow
            ports:
            - containerPort: 2222
              name: tfjob-port
            resources: {}
            workingDir: /opt/tf-benchmarks/scripts/tf_cnn_benchmarks
          restartPolicy: OnFailure
status:
  conditions:
  - lastTransitionTime: 2018-07-29T00:31:48Z
    lastUpdateTime: 2018-07-29T00:31:48Z
    message: TFJob tfjob is running.
    reason: TFJobRunning
    status: "True"
    type: Running
  startTime: 2018-07-29T21:40:13Z
  tfReplicaStatuses:
    PS:
      active: 1
    Worker:
      active: 1
```

If you are not familiar with Kubernetes resources please refer to the page [Understanding Kubernetes Objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/).

What makes TFJob different from built in [controllers](https://kubernetes.io/docs/concepts/workloads/controllers/) is the TFJob spec is designed to manage 
[distributed TensorFlow training jobs](https://www.tensorflow.org/deploy/distributed).

A distributed TensorFlow job typically contains 0 or more of the following processes

* **Chief** The chief is responsible for orchestrating training and performing tasks
like checkpointing the model. 
* **Ps** The ps are parameter servers; these servers provide a distributed data store
for the model parameters.
* **Worker** The workers do the actual work of training the model. In some cases, 
worker 0 might also act as the chief.
* **Evaluator** The evaluators can be used to compute evaluation metrics as the model
is trained.

The field **tfReplicaSpecs** in TFJob spec contains a map from the type of
replica (as listed above) to the **TFReplicaSpec** for that replica. **TFReplicaSpec**
consists of 3 fields

* **replicas** The number of replicas of this type to spawn for this TFJob.
* **template** A [PodTemplateSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.11/#podtemplatespec-v1-core) that describes the pod to create
 for each replica. 
    * **The pod must include a container named tensorflow**.
* **restartPolicy** Determines whether pods will be restarted when they exit. The
 allowed values are as follows
    * **Always** means the pod will always be restarted. This policy is good 
      for parameter servers since they never exit and should always be restarted
      in the event of failure.
    * **OnFailure** means the pod will be restarted if the pod exits due to failure.
        * A non-zero exit code indicates a failure. 
        * An exit code of 0 indicates success and the pod will not be restarted. 
        * This policy is good for chief and workers.
    * **ExitCode** means the restart behavior is dependent on the exit code of the
      tensorflow container as follows
        * **0** indicates the process completed successfully and will not be restarted.
        * **1-127** indicates a permanent error and the container will not be restarted.
        * **128-255** indicates a retryable error and the container will be restarted.
          This policy is good for the chief and workers.
    * **Never** means pods that terminate will never be restarted. This policy
      should rarely be used because Kubernetes will terminate pods for any number
      of reasons (e.g. node becomes unhealthy) and this will prevent the job from
      recovering.

## Quick start
### Submitting a TensorFlow training job

**Note:** Before submitting a training job, you should have [deployed kubeflow to your cluster](#deploy-kubeflow). Doing so ensures that
the [`TFJob` custom resource](https://github.com/kubeflow/tf-operator) is available when you submit the training job.

We treat each TensorFlow job as a [component](https://ksonnet.io/docs/tutorial#2-generate-and-deploy-an-app-component) in your APP.

### Run the TfCnn example

Kubeflow ships with a [ksonnet prototype](https://ksonnet.io/docs/concepts#prototype) suitable for running the [TensorFlow CNN Benchmarks](https://github.com/tensorflow/benchmarks/tree/master/scripts/tf_cnn_benchmarks).

You can also use this prototype to generate a component which you can then customize for your jobs.

Create the component

```
CNN_JOB_NAME=mycnnjob

ks registry add kubeflow-git github.com/kubeflow/kubeflow/tree/${VERSION}/kubeflow
ks pkg install kubeflow-git/examples

ks generate tf-job-simple ${CNN_JOB_NAME} --name=${CNN_JOB_NAME}
```

Submit it

```
ks apply ${KF_ENV} -c ${CNN_JOB_NAME}
```

Monitor it (Please refer to the [TfJob docs](https://github.com/kubeflow/tf-operator#monitoring-your-job))

```
kubectl get -o yaml tfjobs ${CNN_JOB_NAME}
```

Delete it

```
ks delete ${KF_ENV} -c ${CNN_JOB_NAME}
```

### Customizing the TFJob

Generating a component as in the previous step will create a file named 

```
components/${CNN_JOB_NAME}.jsonnet
```

A jsonnet file is basically a json file defining the manifest for your TFJob. You can modify this manifest
to run your jobs.

Typically you will want to change the following values

1. Change the image to point to the docker image containing your code
1. Change the number and types of replicas
1. Change the resources (requests and limits) assigned to each resource
1. Set any environment variables

   * For example, you might need to configure various environment variables to talk to datastores like GCS or S3

1. Attach PV's if you want to use PVs for storage.

### Submitting a TensorFlow training job

**Note:** Before submitting a training job, you should have [deployed kubeflow to your cluster](#deploy-kubeflow). Doing so ensures that
the [`TFJob` custom resource](https://github.com/kubeflow/tf-operator) is available when you submit the training job.

We treat each TensorFlow job as a [component](https://ksonnet.io/docs/tutorial#2-generate-and-deploy-an-app-component) in your APP.

### Run the TfCnn example

Kubeflow ships with a [ksonnet prototype](https://ksonnet.io/docs/concepts#prototype) suitable for running the [TensorFlow CNN Benchmarks](https://github.com/tensorflow/benchmarks/tree/master/scripts/tf_cnn_benchmarks).

You can also use this prototype to generate a component which you can then customize for your jobs.

Create the component

```
CNN_JOB_NAME=mycnnjob

ks registry add kubeflow-git github.com/kubeflow/kubeflow/tree/${VERSION}/kubeflow
ks pkg install kubeflow-git/examples

ks generate tf-job-simple ${CNN_JOB_NAME} --name=${CNN_JOB_NAME}
```

Submit it

```
ks apply ${KF_ENV} -c ${CNN_JOB_NAME}
```

Monitor it (Please refer to the [TfJob docs](https://github.com/kubeflow/tf-operator#monitoring-your-job))

```
kubectl get -o yaml tfjobs ${CNN_JOB_NAME}
```

Delete it

```
ks delete ${KF_ENV} -c ${CNN_JOB_NAME}
```

### Customizing the TFJob

Generating a component as in the previous step will create a file named 

```
components/${CNN_JOB_NAME}.jsonnet
```

A jsonnet file is basically a json file defining the manifest for your TFJob. You can modify this manifest
to run your jobs.

Typically you will want to change the following values

1. Change the image to point to the docker image containing your code
1. Change the number and types of replicas
1. Change the resources (requests and limits) assigned to each resource
1. Set any environment variables

   * For example, you might need to configure various environment variables to talk to datastores like GCS or S3

1. Attach PV's if you want to use PVs for storage.


## Using GPUs

To use GPUs your cluster must be configured to use GPUs.

  * Nodes must have GPUs attached
  * K8s cluster must recognize the `nvidia.com/gpu` resource type
  * GPU drivers must be installed on the cluster.
  * For more information:
      * [K8s Instructions For Scheduling GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
      * [GKE Instructions](https://cloud.google.com/kubernetes-engine/docs/concepts/gpus)

To attach GPUs specify the GPU resource on the container in the replicas
that should contain the GPUs; for example.

```yaml
apiVersion: "kubeflow.org/v1alpha2"
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
                nvidia.com/gpu: 1
            workingDir: /opt/tf-benchmarks/scripts/tf_cnn_benchmarks
          restartPolicy: OnFailure
```

Follow TensorFlow's [instructions](https://www.tensorflow.org/tutorials/using_gpu)
for using GPUs.

## Monitoring your job

To get the status of your job

```bash
kubectl get -o yaml tfjobs $JOB
```

Here is sample output for an example job

```yaml
apiVersion: v1
items:
- apiVersion: kubeflow.org/v1alpha2
  kind: TFJob
  metadata:
    creationTimestamp: 2018-07-29T00:31:12Z
    generation: 1
    labels:
      app.kubernetes.io/deploy-manager: ksonnet
    name: tfjob
    namespace: kubeflow
    resourceVersion: "22310"
    selfLink: /apis/kubeflow.org/v1alpha2/namespaces/kubeflow/tfjobs/tfjob
    uid: b20c924b-92c6-11e8-b3ca-42010a80019c
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
              resources: {}
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
              - --device=cpu
              - --data_format=NHWC
              image: gcr.io/kubeflow/tf-benchmarks-cpu:v20171202-bdab599-dirty-284af3
              name: tensorflow
              ports:
              - containerPort: 2222
                name: tfjob-port
              resources: {}
              workingDir: /opt/tf-benchmarks/scripts/tf_cnn_benchmarks
            restartPolicy: OnFailure
  status:
    conditions:
    - lastTransitionTime: 2018-07-29T00:31:48Z
      lastUpdateTime: 2018-07-29T00:31:48Z
      message: TFJob tfjob is running.
      reason: TFJobRunning
      status: "True"
      type: Running
    startTime: 2018-07-29T02:18:13Z
    tfReplicaStatuses:
      PS:
        active: 1
      Worker:
        active: 1
```

### Conditions

A TFJob has a TFJobStatus, which has an array of TFJobConditions through which the TFJob has or has not passed. Each element of the TFJobCondition array has six possible fields:

* The **lastUpdateTime** field provides the last time this condition was updated.
* The **lastTransitionTime** field provides the last time the condition transitioned from one status to another.
* The **message** field is a human readable message indicating details about the transition.
* The **reason** field is a unique, one-word, CamelCase reson for the condition's
  last transition.
* The **status** field is a string with possible values "True", "False", and "Unknown".
* The **type** field is a string with the following possible values:
  * **TFJobCreated** means the tfjob has been accepted by the system,
    but one or more of the pods/services has not been started.
  * **TFJobRunning** means all sub-resources (e.g. services/pods) of this TFJob
	  have been successfully scheduled and launched and the job is running.
  * **TFJobRestarting** means one or more sub-resources (e.g. services/pods) 
      of this TFJob had a problem and is being restarted.
  * **TFJobSucceeded** means the job completed successfully.
  * **TFJobFailed** means the job has failed.

Success or failure of a job is determined as follows

* If a job has a **chief** success or failure is determined by the status
  of the chief.
* If a job has no chief success or failure is determined by the workers.
* In both cases the TFJob succeeds if the process being monitored exits
  with exit code 0.
* In the case of non-zero exit code the behavior is determined by the restartPolicy
  for the replica.
* If the restartPolicy allows for restarts then the process will just be restarted and the TFJob will continue to execute.
  * For the restartPolicy ExitCode the behavior is exit code dependent.
  * If the restartPolicy doesn't allow restarts a non-zero exit code is considered
    a permanent failure and the job is marked failed.
  * For the restartPolicy ExitCode the behavior is exit code dependent.        

### tfReplicaStatuses

tfReplicaStatuses provides a map indicating the number of pods for each
replica in a given state. There are three possible states

  * **Active** is the number of currently running pods.
  * **Succeeded** is the number of pods that completed successfully.
  * **Failed** is the number of pods that completed with an error.


### Events

During execution, TFJob will emit events to indicate whats happening such
as the creation/deletion of pods and services. Kubernetes doesn't retain
events older than 1 hour by default. To see recent events for a job run

```
kubectl describe tfjobs ${JOB}
```

which will produce output like

```
Name:         tfjob2
Namespace:    kubeflow
Labels:       app.kubernetes.io/deploy-manager=ksonnet
Annotations:  ksonnet.io/managed={"pristine":"H4sIAAAAAAAA/+yRz27UMBDG7zzGnJ3NbkoFjZQTqEIcYEUrekBVNHEmWbOObY3HqcJq3x05UC1/ngCJHKKZbz6P5e93AgzmM3E03kENx9TRYP3TxvNYzju04YAVKDga10MN97fvfQcKJhLsURDqEzicCGqQ4avvsjX3MaCm...
API Version:  kubeflow.org/v1alpha2
Kind:         TFJob
Metadata:
  Cluster Name:        
  Creation Timestamp:  2018-07-29T02:46:53Z
  Generation:          1
  Resource Version:    26872
  Self Link:           /apis/kubeflow.org/v1alpha2/namespaces/kubeflow/tfjobs/tfjob2
  UID:                 a6bc7b6f-92d9-11e8-b3ca-42010a80019c
Spec:
  Tf Replica Specs:
    PS:
      Replicas:  1
      Template:
        Metadata:
          Creation Timestamp:  <nil>
        Spec:
          Containers:
            Args:
              python
              tf_cnn_benchmarks.py
              --batch_size=32
              --model=resnet50
              --variable_update=parameter_server
              --flush_stdout=true
              --num_gpus=1
              --local_parameter_device=cpu
              --device=cpu
              --data_format=NHWC
            Image:  gcr.io/kubeflow/tf-benchmarks-cpu:v20171202-bdab599-dirty-284af3
            Name:   tensorflow
            Ports:
              Container Port:  2222
              Name:            tfjob-port
            Resources:
            Working Dir:   /opt/tf-benchmarks/scripts/tf_cnn_benchmarks
          Restart Policy:  OnFailure
    Worker:
      Replicas:  1
      Template:
        Metadata:
          Creation Timestamp:  <nil>
        Spec:
          Containers:
            Args:
              python
              tf_cnn_benchmarks.py
              --batch_size=32
              --model=resnet50
              --variable_update=parameter_server
              --flush_stdout=true
              --num_gpus=1
              --local_parameter_device=cpu
              --device=cpu
              --data_format=NHWC
            Image:  gcr.io/kubeflow/tf-benchmarks-cpu:v20171202-bdab599-dirty-284af3
            Name:   tensorflow
            Ports:
              Container Port:  2222
              Name:            tfjob-port
            Resources:
            Working Dir:   /opt/tf-benchmarks/scripts/tf_cnn_benchmarks
          Restart Policy:  OnFailure
Status:
  Conditions:
    Last Transition Time:  2018-07-29T02:46:55Z
    Last Update Time:      2018-07-29T02:46:55Z
    Message:               TFJob tfjob2 is running.
    Reason:                TFJobRunning
    Status:                True
    Type:                  Running
  Start Time:              2018-07-29T02:46:55Z
  Tf Replica Statuses:
    PS:
      Active:  1
    Worker:
      Active:  1
Events:
  Type     Reason                          Age                From         Message
  ----     ------                          ----               ----         -------
  Warning  SettedPodTemplateRestartPolicy  19s (x2 over 19s)  tf-operator  Restart policy in pod template will be overwritten by restart policy in replica spec
  Normal   SuccessfulCreatePod             19s                tf-operator  Created pod: tfjob2-worker-0
  Normal   SuccessfulCreateService         19s                tf-operator  Created service: tfjob2-worker-0
  Normal   SuccessfulCreatePod             19s                tf-operator  Created pod: tfjob2-ps-0
  Normal   SuccessfulCreateService         19s                tf-operator  Created service: tfjob2-ps-0
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

The **CleanPodPolicy** in the TFJob spec controls deletion of pods when a job terminates. 
The policy can be one of the following values

* The **Running** policy means that only pods still running when a job completes 
  (e.g. parameter servers) will be deleted immediately; completed pods will
  not be deleted so that the logs will be preserved. This is the default value.
* The **All** policy means all pods even completed pods will be deleted immediately
  when the job finishes.
* The **None** policy means that no pods will be deleted when the job completes.

If your cluster takes advantage of K8s
[cluster logging](https://kubernetes.io/docs/concepts/cluster-administration/logging/)
then your logs may also be shipped to an appropriate data store for
further analysis.

### Stackdriver on GKE

See [here](/docs/guides/monitoring/) for instructions to get logs using Stackdriver.

As described [here](https://www.kubeflow.org/docs/guides/monitoring/#filter-with-labels) its possible
to fetch the logs for a particular replica based on pod labels. 

Using the Stackdriver UI you can use a query like

```
resource.type="k8s_container"
resource.labels.cluster_name="${CLUSTER}"
metadata.userLabels.tf_job_name="${JOB_NAME}"
metadata.userLabels.tf-replica-type="${TYPE}"
metadata.userLabels.tf-replica-index="${INDEX}"
```

Alternatively using gcloud

```
QUERY="resource.type=\"k8s_container\" "
QUERY="${QUERY} resource.labels.cluster_name=\"${CLUSTER}\" "
QUERY="${QUERY} metadata.userLabels.tf_job_name=\"${JOB_NAME}\" "
QUERY="${QUERY} metadata.userLabels.tf-replica-type=\"${TYPE}\" "
QUERY="${QUERY} metadata.userLabels.tf-replica-index=\"${INDEX}\" "
gcloud --project=${PROJECT} logging read  \
     --freshness=24h \
     --order asc  ${QUERY}        
```


## Troubleshooting

Here are some steps to follow to troubleshoot your job

1. Is a status present for your job? Run the command
    ```yaml
    kubectl -n ${NAMESPACE} get tfjobs -o yaml ${JOB_NAME}
    ```

   * If the resulting output doesn't include a status for your job then this typically
     indicates the job spec is invalid.

   * If the TFJob spec is invalid there should be a log message in the tf operator logs

      ```
      kubectl -n ${KUBEFLOW_NAMESPACE} logs `kubectl get pods --selector=name=tf-job-operator -o jsonpath='{.items[0].metadata.name}'` 
      ```
     * **KUBEFLOW_NAMESPACE** Is the namespace you deployed the TFJob operator in.
1. Check the events for your job to see if the pods were created

   * There are a number of ways to get the events; if your job is less than **1 hour old**
 	 then you can do

 	  ```
 	  kubectl -n ${NAMESPACE} describe tfjobs -o yaml ${JOB_NAME}
 	  ```

   * The bottom of the output should include a list of events emitted by the job; e.g.

 	  ```yaml
Events:
  Type     Reason                          Age                From         Message
  ----     ------                          ----               ----         -------
  Warning  SettedPodTemplateRestartPolicy  19s (x2 over 19s)  tf-operator  Restart policy in pod template will be overwritten by restart policy in replica spec
  Normal   SuccessfulCreatePod             19s                tf-operator  Created pod: tfjob2-worker-0
  Normal   SuccessfulCreateService         19s                tf-operator  Created service: tfjob2-worker-0
  Normal   SuccessfulCreatePod             19s                tf-operator  Created pod: tfjob2-ps-0
  Normal   SuccessfulCreateService         19s                tf-operator  Created service: tfjob2-ps-0
      ```
	
	* Kubernetes only preserves events for **1 hour** (see [kubernetes/kubernetes#52521](https://github.com/kubernetes/kubernetes/issues/52521))

	  * Depending on your cluster setup events might be persisted to external storage and accessible for longer periods
	  * On GKE events are persisted in stackdriver and can be accessed using the instructions in the previous section.
	* If the pods and services aren't being created then this suggests the TFJob isn't being processed; common causes are

	  * The TFJob spec is invalid (see above)
	  * The TFJob operator isn't running
	
1. Check the events for the pods to ensure they are scheduled.

   * There are a number of ways to get the events; if your pod is less than **1 hour old**
     then you can do

 	  ```
 	  kubectl -n ${NAMESPACE} describe pods ${POD_NAME}
 	  ```

   * The bottom of the output should contain events like the following

 	  ```yaml
Events:
  Type    Reason                 Age   From                                                  Message
  ----    ------                 ----  ----                                                  -------
  Normal  Scheduled              18s   default-scheduler                                     Successfully assigned tfjob2-ps-0 to gke-jl-kf-v0-2-2-default-pool-347936c1-1qkt
  Normal  SuccessfulMountVolume  17s   kubelet, gke-jl-kf-v0-2-2-default-pool-347936c1-1qkt  MountVolume.SetUp succeeded for volume "default-token-h8rnv"
  Normal  Pulled                 17s   kubelet, gke-jl-kf-v0-2-2-default-pool-347936c1-1qkt  Container image "gcr.io/kubeflow/tf-benchmarks-cpu:v20171202-bdab599-dirty-284af3" already present on machine
  Normal  Created                17s   kubelet, gke-jl-kf-v0-2-2-default-pool-347936c1-1qkt  Created container
  Normal  Started                16s   kubelet, gke-jl-kf-v0-2-2-default-pool-347936c1-1qkt  Started container
 	  ```

 	 * Some common problems that can prevent a container from starting are
 	   * Insufficient resources to schedule the pod
 	   * The pod tries to mount a volume (or secret) that doesn't exist or is unavailable
 	   * The docker image doesn't exist or can't be accessed (e.g due to permission issues)
1. If the containers start; check the logs of the containers following the instructions
   in the previous section.