+++
title = "Troubleshooting Deployments on Amazon EKS"
description = "Help diagnose and fix issues you may encounter in your Kubeflow deployment"
weight = 100
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


### ALB can not be created

```shell
kubectl get ingress -n istio-system
NAME            HOSTS   ADDRESS   PORTS   AGE
istio-ingress   *                 80      3min
```

If you see your istio-ingress ADDRESS is empty after 3 mins, it must be something wrong in your ALB ingress controller.

```
E1024 09:02:59.934318       1 :0] kubebuilder/controller "msg"="Reconciler error" "error"="failed to build LoadBalancer configuration due to retrieval of subnets failed to resolve 2 qualified subnets. Subnets must contain the kubernetes.io/cluster/\u003ccluster name\u003e tag with a value of shared or owned and the kubernetes.io/role/elb tag signifying it should be used for ALBs Additionally, there must be at least 2 subnets with unique availability zones as required by ALBs. Either tag subnets to meet this requirement or use the subnets annotation on the ingress resource to explicitly call out what subnets to use for ALB creation. The subnets that did resolve were []"  "controller"="alb-ingress-controller" "request"={"Namespace":"istio-system","Name":"istio-ingress"}
```

If you see this error, you probably forget to update `cluster_name` during setup. Please go to edit view by `kubectl edit deployment alb-ingress-controller -n kubeflow` and make the change. Another reason could be that you did not tag your subnets  so that Kubernetes knows to use only those subnets for external load balancers. To fix this ensure the public subnets are tagged with the **Key**: ```kubernetes.io/role/elb``` and **Value**: ```1```. See docs [here](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html) for further details.

### KF_DIR is not empty

```shell
kfctl build -V -f ${CONFIG_URI}
INFO[0000] Downloading https://raw.githubusercontent.com/kubeflow/manifests/v0.7-branch/kfdef/kfctl_aws.0.7.0.yaml to /var/folders/7z/9cx2bbsd3q3352bd8b01j_nmzx5lm9/T/703750259/tmp.yaml  filename="utils/k8utils.go:169"
INFO[0001] Downloading https://raw.githubusercontent.com/kubeflow/manifests/v0.7-branch/kfdef/kfctl_aws.0.7.0.yaml to /var/folders/7z/9cx2bbsd3q3352bd8b01j_nmzx5lm9/T/367955766/tmp_app.yaml  filename="configconverters/converters.go:70"
Error:  (kubeflow.error): Code 400 with message: current directory /kf_base/kf070 not empty, please switch directories
Usage:
  kfctl build [flags]

Flags:
  -f, --file string   Static config file to use. Can be either a local path or a URL.
  -h, --help          help for build
  -V, --verbose       verbose output default is false

 (kubeflow.error): Code 400 with message: current directory /kf_base/kf070 not empty, please switch directories
```

This happens if you already initialize your configuration and you try to rerun `kfctl build`. Delete everything `rm -rf *` and try again.


### EKS Cluster Creation Failure

There are several problems that could lead to cluster creation failure. If you see some errors when creating your cluster using `eksctl`, please open the CloudFormation console and check your stacks. To recover from failure, you need to follow the guidance from the `eksctl` output logs. Once you understand the root cause of your failure, you can delete your cluster and rerun `kfctl apply -V -f ${CONFIG_FILE}`.

Common issues:

1. The default VPC limit is 5 VPCs per region
1. Invalid command arguments

```shell
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

You can ignore any Kubernetes "resource not found" errors that occur during the deletion phase.


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
### Amazon RDS Connectivity Issues

If you run into CloudFormation deployment errors, you can use [troubleshooting guide](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/troubleshooting.html) to find a resolution.

If you have connectivity issues with Amazon RDS, try launching mysql-client container and connecting to your RDS endpoint. This will let you know if you have network connectivity with the db and also if db is created properly.

```
# Remember to change your RDS endpoint, DB username and DB Password
$ kubectl run -it --rm --image=mysql:5.7 --restart=Never mysql-client -- mysql -h <YOUR RDS ENDPOINT> -u admin -pKubefl0w                                                              
If you don't see a command prompt, try pressing enter.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| kubeflow           |
| mlpipeline         |
| mysql              |
| performance_schema |
+--------------------+
5 rows in set (0.00 sec)

mysql> use mlpipeline; show tables;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
+----------------------+
| Tables_in_mlpipeline |
+----------------------+
| db_statuses          |
| default_experiments  |
| experiments          |
| jobs                 |
| pipeline_versions    |
| pipelines            |
| resource_references  |
| run_details          |
| run_metrics          |
+----------------------+
9 rows in set (0.00 sec)
```

### Incompatible eksctl version

If you see this error when you run `apply platform`, it means your eksctl cli version is not compatible with `eksctl.io` version in cluster_config.yaml. Please upgrade your eksctl and try again.
`v1alpha5` is introduced from 0.1.31.

We are working with eksctl team to make sure feature release support backward compatibility at least for one version.

```
loading config file "${KF_DIR}/aws_config/cluster_config.yaml": no kind "ClusterConfig" is registered for version "eksctl.io/v1alpha5" in scheme "k8s.io/client-go/kubernetes/scheme/register.go:60"
```
