+++
title = "Storage Options"
description = "Using EFS and FSx for Lustre with Kubeflow"
weight = 95
+++

This guide describes how to use Amazon EKS and Amazon FSx for Lustre with Kubeflow.


## Amazon EFS

Amazon EFS is managed NFS in AWS. Amazon EFS supports `ReadWriteMany` access mode, which means the volume can be mounted as read-write by many nodes. It is very useful for creating a shared filesystem that can be mounted into pods such as Jupyter. For example, one group can share datasets or models across an entire team.
By default, the Amazon EFS CSI driver is not enabled and you need to follow steps to install it.

### Deploy the Amazon EFS CSI Plugin

```
cd ${KUBEFLOW_SRC}/${KFAPP}/ks_app
export COMPONENT=aws-efs-csi-driver
ks generate aws-efs-csi-driver ${COMPONENT}
ks apply default -c ${COMPONENT}
```

### Static Provisioning

You can go to the [Amazon EFS console](https://us-west-2.console.aws.amazon.com/efs/home) to create a new Amazon EFS file system. Choose the VPC, Subnet IDs, and provisioning mode to use.
Please pay special attention to the Security Groups, and make sure that traffic to NFS port 2049 is allowed.
Then you will get a file system ID and you can use it to create persistent volumes and persistent volume claims.

```
cd ${KUBEFLOW_SRC}/${KFAPP}/ks_app
export COMPONENT=efs-storage
ks generate aws-efs-pv ${COMPONENT} --efsId=${your_file_system_id}
ks apply default -c ${COMPONENT}
```

Use Amazon EFS as a notebook volume when you create Jupyter notebooks.
<img src="/docs/images/aws/efs-volume.png"
  alt="Amazon EFS JupyterNotebook Volume"
  class="mt-3 mb-3 border border-info rounded">


## Amazon FSx for Lustre

Amazon FSx for Lustre provides a high-performance file system optimized for fast processing of workloads such as machine learning and high performance computing (HPC) workloads. [AWS FSx for Lustre CSI Driver] (https://github.com/kubernetes-sigs/aws-fsx-csi-driver) can help Kubernetes users easily leverage this service.

Lustre is another file system that supports `ReadWriteMany`. Once difference between Amazon EFS and Lustre is that Lustre could be used as training data caching layer using S3 as backend storage. You don't need to transfer data before using the volume. By default, the Amazon FSx CSI driver is not enabled and you need to follow steps to install it.

### Deploy the Amazon FSx CSI Plugin

```
cd ${KUBEFLOW_SRC}/${KFAPP}/ks_app
export COMPONENT=aws-fsx-csi-driver
ks generate aws-fsx-csi-driver ${COMPONENT}
ks apply default -c ${COMPONENT}
```

### Static Provisioning

You can statically provision Amazon FSx for Lustre and then pass the file system ID and DNS name to generate persistent volumes and persistent volume claims. It will create default storage class `fsx-default`.

```
cd ${KUBEFLOW_SRC}/${KFAPP}/ks_app
export COMPONENT=fsx-static-storage

ks generate aws-fsx-pv-static ${COMPONENT} --fsxId=fs-048xxxx7c25 --dnsName=fs-048xxxx7c25.fsx.us-west-2.amazonaws.com

ks apply default -c ${COMPONENT}
```


Once your persistent volume claim is ready, you can claim in your workloads like this:

```
volumes:
- name: persistent-storage
  persistentVolumeClaim:
    claimName: fsx-static-storage
```


### Dynamic Provisioning

You can dynamically provision Amazon FSx for Lustre filesystems for your high performance computing workloads in the following way. The `SecurityGroupId` and `SubnetId` are required. Amazon FSx for Lustre is an Availability Zone based file system, and you can only pass one SubnetId here. This means you need to create a cluster in single Availability Zone, which makes sense for machine learning workloads.

If you already have a training dataset in Amazon S3, you can pass your bucket name optionally and this will be used by Amazon FSx for Lustre as a data repository and your file system will be ready with the training dataset.

It will create Storage Class, Persistent Volume, and PersistentVolumeClaim Kubernetes resources for you.

```
cd ${KUBEFLOW_SRC}/${KFAPP}/ks_app
export COMPONENT=fsx-dynamic-storage

ks generate aws-fsx-pv-dynamic ${COMPONENT} --securityGroupIds=sg-0c380xxxxxxxx --subnetId=subnet-007f9cxxxxxxx
ks param set ${COMPONENT} s3ImportPath s3://your_dataset_bucket

ks apply default -c ${COMPONENT}
```

In your workloads, you just need to mount the volume and use `${COMPONENT}` as your persistent volume claim name. It takes roughly 5-7 minutes to get storage ready.

