+++
title = "XGBoost Training (XGBoostJob)"
description = "Instructions for using XGBoost"
weight = 30
                    
+++

{{% stable-status %}}

This page describes XGBoostJob for training a machine learning model with XGBoost.

## Installing Training Operator

If you haven't already done so please follow the [Getting Started Guide](/docs/started/getting-started/) to deploy Kubeflow.


## Verify that XGBoost support is included in your Kubeflow deployment

Check that the XGboost custom resource is installed

```
kubectl get crd
```

The output should include `xgboostjobs.kubeflow.org`

```
NAME                                           AGE
...
xgboostjobs.kubeflow.org                       4d
...
```

Check that the Training operator is running via:

```
kubectl get pods -n kubeflow
```

The output should include `training-operator-xxx` like the following:

```
NAME                                READY   STATUS    RESTARTS   AGE
training-operator-d466b46bc-xbqvs   1/1     Running   0          4m37s
```

## Creating a XGBoost Job

You can create XGBoost Job by defining a XGboostJob config file. See the manifests for the [IRIS example](https://github.com/kubeflow/tf-operator/blob/master/examples/xgboost/xgboostjob.yaml). You may change the config file based on your requirements. eg: add `CleanPodPolicy` in Spec to `None` to retain pods after job termination.

```
cat xgboostjob.yaml
```
Deploy the XGBoostJob resource to start training:

```
kubectl create -f xgboostjob.yaml
```
You should now be able to see the created pods matching the specified number of replicas.

```
kubectl get pods -l job-name=xgboost-dist-iris-test-train 
```
Training takes 5-10 minutes on a cpu cluster. Logs can be inspected to see its training progress.

```
PODNAME=$(kubectl get pods -l job-name=xgboost-dist-iris-test-train,replica-type=master,replica-index=0 -o name)
kubectl logs -f ${PODNAME}
```
## Monitoring a XGBoost Job

```
kubectl get -o yaml xgboostjobs xgboost-dist-iris-test-train
```
See the status section to monitor the job status. Here is sample output when the job is successfully completed.

```yaml
apiVersion: kubeflow.org/v1
kind: XGBoostJob
metadata:
  creationTimestamp: "2021-09-06T18:34:06Z"
  generation: 1
  name: xgboost-dist-iris-test-train
  namespace: default
  resourceVersion: "5844304"
  selfLink: /apis/kubeflow.org/v1/namespaces/default/xgboostjobs/xgboost-dist-iris-test-train
  uid: a1ea6675-3cb5-482b-95dd-68b2c99b8adc
spec:
  runPolicy:
    cleanPodPolicy: None
  xgbReplicaSpecs:
    Master:
      replicas: 1
      restartPolicy: Never
      template:
        spec:
          containers:
          - args:
            - --job_type=Train
            - --xgboost_parameter=objective:multi:softprob,num_class:3
            - --n_estimators=10
            - --learning_rate=0.1
            - --model_path=/tmp/xgboost-model
            - --model_storage_type=local
            image: docker.io/merlintang/xgboost-dist-iris:1.1
            imagePullPolicy: Always
            name: xgboost
            ports:
            - containerPort: 9991
              name: xgboostjob-port
              protocol: TCP
    Worker:
      replicas: 2
      restartPolicy: ExitCode
      template:
        spec:
          containers:
          - args:
            - --job_type=Train
            - --xgboost_parameter="objective:multi:softprob,num_class:3"
            - --n_estimators=10
            - --learning_rate=0.1
            image: docker.io/merlintang/xgboost-dist-iris:1.1
            imagePullPolicy: Always
            name: xgboost
            ports:
            - containerPort: 9991
              name: xgboostjob-port
              protocol: TCP
status:
  completionTime: "2021-09-06T18:34:23Z"
  conditions:
  - lastTransitionTime: "2021-09-06T18:34:06Z"
    lastUpdateTime: "2021-09-06T18:34:06Z"
    message: xgboostJob xgboost-dist-iris-test-train is created.
    reason: XGBoostJobCreated
    status: "True"
    type: Created
  - lastTransitionTime: "2021-09-06T18:34:06Z"
    lastUpdateTime: "2021-09-06T18:34:06Z"
    message: XGBoostJob xgboost-dist-iris-test-train is running.
    reason: XGBoostJobRunning
    status: "False"
    type: Running
  - lastTransitionTime: "2021-09-06T18:34:23Z"
    lastUpdateTime: "2021-09-06T18:34:23Z"
    message: XGBoostJob xgboost-dist-iris-test-train is successfully completed.
    reason: XGBoostJobSucceeded
    status: "True"
    type: Succeeded
  replicaStatuses:
    Master:
      succeeded: 1
    Worker:
      succeeded: 2
```
