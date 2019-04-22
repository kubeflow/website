+++
title = "Storage Options"
description = "Using EFS and FSx for Lustre with kubeflow"
weight = 95
+++

This guide describes how to use EKS and Fsx for Lustre with kubeflow.


## EFS

EFS is managed NFS in AWS. EKS supports `ReadWriteMany` access mode, which means the volume can be mounted as ready-write by many nodes. It is very useful for creating a shared filesystem that can be mounted into pods such as Jupyter. For example, one group can share datasets or models across entire team members.
By default, driver is not enabled and you need to follow steps to install it.

### Deploy EFS CSI Plugin

```
cd ${KUBEFLOW_SRC}/${KFAPP}/ks_app
export COMPONENT=aws-efs-csi-driver
ks generate aws-efs-csi-driver ${COMPONENT}
ks apply default -c ${COMPONENT}
```

### Static Provision

You can go to [EFS console](https://us-west-2.console.aws.amazon.com/efs/home) to create a new EFS file system. Choose right VPC, SubnetIds and provision mode you like to use.
Please pay special attention to SecurityGroups and make sure traffic to NFS port 2049 is allowed.
Then you will get a file system id and you can use it to create PersistentVolume and PersistentVolumeClaim.

```
cd ${KUBEFLOW_SRC}/${KFAPP}/ks_app
export COMPONENT=efs-storage
ks generate aws-efs-pv ${COMPONENT} --efsId=${your_file_system_id}
ks apply default -c ${COMPONENT}
```

Use EFS as Notebook Volume when you create Jupyter Notebook.
<img src="/docs/images/aws/efs-volume.png"
  alt="EKS JupyterNotebook Volume"
  class="mt-3 mb-3 border border-info rounded">


## FSx for Lustre

Amazon FSx for Lustre provides a high-performance file system optimized for fast processing of workloads such as machine learning, high performance computing (HPC) workloads. [AWS FSx for Lustre CSI Driver] (https://github.com/kubernetes-sigs/aws-fsx-csi-driver) can help kubernetes user easily leverage this service in Kubernetes.

Lustre is another file system supports `ReadWriteMany`. Once difference between EFS and Lustre is that Lustre could be used as training data caching layer using S3 as backend storage. You don't need to transfer data before using volume.  By default, driver is not enabled and you need to follow steps to install it.

### Deploy FSx CSI Plugin

```
cd ${KUBEFLOW_SRC}/${KFAPP}/ks_app
export COMPONENT=aws-fsx-csi-driver
ks generate aws-fsx-csi-driver ${COMPONENT}
ks apply default -c ${COMPONENT}
```

### Static Provision

You can statically provision FSx for Lustre and then pass file system id and dns name to generate PersistentVolume and PersistentVolumeClaim. It will create default storage class `fsx-default`.

```
cd ${KUBEFLOW_SRC}/${KFAPP}/ks_app
export COMPONENT=fsx-static-storage

ks generate aws-fsx-pv-static ${COMPONENT} --fsxId=fs-048xxxx7c25 --dnsName=fs-048xxxx7c25.fsx.us-west-2.amazonaws.com

ks apply default -c ${COMPONENT}
```


Once PVC is ready, you can claim in your workloads like this

```
volumes:
- name: persistent-storage
  persistentVolumeClaim:
    claimName: fsx-static-storage
```


### Dynamic Provision

You can dynamically provision FSx for Lustre filesystems for your high performance computing workloads by using following way. `SecurityGroupId` and `SubnetId` are required. FSx for Lustre is availability zone based file system, you can only pass one SubnetId here. It means you need to create a cluster in single availability zone which makes sense for Machine Learning workloads.

If you already have S3 training dataset, you can pass your bucket name optionally and this will be used by FSx for Lustre as data repository and you will get file system ready with training dataset.

It will create a Storage Class, Persistent Volume and PersistentVolumeClaim for you.

```
cd ${KUBEFLOW_SRC}/${KFAPP}/ks_app
export COMPONENT=fsx-dynamic-storage

ks generate aws-fsx-pv-dynamic ${COMPONENT} --securityGroupIds=sg-0c380xxxxxxxx --subnetId=subnet-007f9cxxxxxxx
ks param set ${COMPONENT} s3ImportPath s3://your_dataset_bucket

ks apply default -c ${COMPONENT}
```

In your workloads, you just need to mount volume and use `${COMPONENT}` as your claim name. It takes 5-7 minutes to get storage ready.

