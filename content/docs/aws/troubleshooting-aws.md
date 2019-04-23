+++
title = "Troubleshooting Deployments on Amazon EKS"
description = "Help diagnose and fix issues you may encounter in your Kubeflow deployment"
weight = 100
+++


### Environment File Not Found

```shell
+ source env.sh
/tmp/kubeflow-aws/scripts/kfctl.sh: line 485: env.sh: No such file or directory
```

When you run generate/apply platform/k8s, Please make sure you verify the following steps and run your command from within the ${KFAPP} folder.


### kfapp already exists

```shell
+ echo 'Directory kfapp already exists'
Directory kfapp already exists
+ exit 1
```

This happens if you have invalid arguments when you initialize your configuration and you try to rerun command with correct arguments. The `kfapp` folder already exists. Delete `kfapp` and try again.


### EKS Cluster Creation Failure

There are several problems that could lead to cluster creation failure. If you see some errors when creating your cluster using `eksctl`, please open the CloudFormation console and check your stacks. To recover from failure, you need to follow the guidance from the `eksctl` output logs. Once you understand the root cause of your failure, you can delete your cluster and rerun `${KUBEFLOW_SRC}/scripts/kfctl.sh apply platform`.

Common issues:

1. The default VPC limit is 5 VPCs per region
1. Invalid command arguments

```
+ eksctl create cluster --config-file=/tmp/cluster_config.yaml
[ℹ]  using region us-west-2
[ℹ]  subnets for us-west-2b - public:192.168.0.0/19 private:192.168.96.0/19
[ℹ]  subnets for us-west-2c - public:192.168.32.0/19 private:192.168.128.0/19
[ℹ]  subnets for us-west-2d - public:192.168.64.0/19 private:192.168.160.0/19
[ℹ]  nodegroup "general" will use "ami-0280ac619ed294a8a" [AmazonLinux2/1.12]
[ℹ]  importing SSH public key "/Users/ubuntu/.ssh/id_rsa.pub" as "eksctl-test-cluster-nodegroup-general-11:2a:f6:ba:b0:98:da:b4:24:db:18:3d:e3:3f:f5:fb"
[ℹ]  creating EKS cluster "test-cluster" in "us-west-2" region
[ℹ]  will create a CloudFormation stack for cluster itself and 1 nodegroup stack(s)
[ℹ]  if you encounter any issues, check CloudFormation console or try 'eksctl utils describe-stacks --region=us-west-2 --name=test-cluster'
[ℹ]  building cluster stack "eksctl-test-cluster-cluster"
[✖]  unexpected status "ROLLBACK_IN_PROGRESS" while waiting for CloudFormation stack "eksctl-test-cluster-cluster"
[ℹ]  fetching stack events in attempt to troubleshoot the root cause of the failure
[ℹ]  AWS::CloudFormation::Stack/eksctl-test-cluster-cluster: ROLLBACK_IN_PROGRESS – "The following resource(s) failed to create: [InternetGateway, ServiceRole, NATIP, VPC]. . Rollback requested by user."
[✖]  AWS::EC2::EIP/NATIP: CREATE_FAILED – "Resource creation cancelled"
[✖]  AWS::IAM::Role/ServiceRole: CREATE_FAILED – "Resource creation cancelled"
[ℹ]  AWS::EC2::EIP/NATIP: CREATE_IN_PROGRESS – "Resource creation Initiated"
[✖]  AWS::EC2::VPC/VPC: CREATE_FAILED – "The maximum number of VPCs has been reached. (Service: AmazonEC2; Status Code: 400; Error Code: VpcLimitExceeded; Request ID: xxxxxxxxxx)"
[ℹ]  AWS::IAM::Role/ServiceRole: CREATE_IN_PROGRESS – "Resource creation Initiated"
[ℹ]  AWS::EC2::EIP/NATIP: CREATE_IN_PROGRESS
[✖]  AWS::EC2::InternetGateway/InternetGateway: CREATE_FAILED – "The maximum number of internet gateways has been reached. (Service: AmazonEC2; Status Code: 400; Error Code: InternetGatewayLimitExceeded; Request ID: 7b3c9620-d1fa-4893-9e91-fb94eb3f2ef3)"
[ℹ]  AWS::EC2::VPC/VPC: CREATE_IN_PROGRESS
[ℹ]  AWS::IAM::Role/ServiceRole: CREATE_IN_PROGRESS
[ℹ]  AWS::EC2::InternetGateway/InternetGateway: CREATE_IN_PROGRESS
[ℹ]  AWS::CloudFormation::Stack/eksctl-test-cluster-cluster: CREATE_IN_PROGRESS – "User Initiated"
[ℹ]  1 error(s) occurred and cluster hasn't been created properly, you may wish to check CloudFormation console
[ℹ]  to cleanup resources, run 'eksctl delete cluster --region=us-west-2 --name=test-cluster'
[✖]  waiting for CloudFormation stack "eksctl-test-cluster-cluster" to reach "CREATE_COMPLETE" status: ResourceNotReady: failed waiting for successful resource state
[✖]  failed to create cluster "test-cluster"
```

### Resource Not Found in `delete all`

```shell
+ kubectl get ns/kubeflow
Error from server (NotFound): namespaces "kubeflow" not found
+ kubectl get ns/kubeflow
Error from server (NotFound): namespaces "kubeflow" not found
+ echo 'namespace kubeflow successfully deleted.'
```

You can ignore kubernetes resource not found issues in the deletion phase.


### InvalidParameterException in UpdateCluster

```shell
+ logging_components='"api","audit","authenticator","controllerManager","scheduler"'
++ aws eks update-cluster-config --name benchmark-0402222-sunday-satur --region us-west-2 --logging '{"clusterLogging":[{"types":["api","audit","authenticator","controllerManager","scheduler"],"enabled":true}]}'

An error occurred (InvalidParameterException) when calling the UpdateClusterConfig operation: No changes needed for the logging config provided
```

The Amazon EKS `UpdateCluster` API operation will fail if you have invalid parameters. For example, if you already enabled logs in your EKS cluster, and you choose to create Kubeflow on existing cluster and also enable logs, you will get this error.

### FSX Mount Failure

```shell
Mounting command: mount
Mounting arguments: -t lustre fs-0xxxxx2a216cf.us-west-2.amazonaws.com@tcp:/fsx /var/lib/kubelet/pods/224c2c96-5a91-11e9-b7e6-0a2a42c99f84/volumes/kubernetes.io~csi/fsx-static/mount
Output: mount.lustre: Can't parse NID 'fs-0xxxxx2a216cf.us-west-2.amazonaws.com@tcp:/fsx'

This mount helper should only be invoked via the mount (8) command,
e.g. mount -t lustre dev dir

usage: mount.lustre [-fhnvV] [-o <mntopt>] <device> <mountpt>
  <device>: the disk device, or for a client:
    <mgsnid>[:<altmgsnid>...]:/<filesystem>[/<subdir>]
  <filesystem>: name of the Lustre filesystem (e.g. lustre1)
  <mountpt>: filesystem mountpoint (e.g. /mnt/lustre)
  -f|--fake: fake mount (updates /etc/mtab)
```

The Amazon FSx `dnsName` is incorrect, you can delete your pod using this persistent volume claim. The next step is to delete the PV and PVC. Next correct your input and reapply the PV and PVC.

```shell
kubectl delete pod ${pod_using_pvc}
ks delete default -c ${COMPONENT}
ks param set ${COMPONENT} dnsName fs-0xxxxx2a216cf.fsx.us-west-2.amazonaws.com
ks apply default -c ${COMPONENT}
```
