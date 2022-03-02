+++
title = "Troubleshooting"
description = "Diagnose and fix issues you may encounter in your Kubeflow deployment"
weight = 30
+++

For general errors related to Kubernetes and Amazon EKS, please refer to the [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/troubleshooting.html) troubleshooting section. For issues with cluster creation or modification with `eksctl`, see the [`eksctl` troubleshooting](https://eksctl.io/usage/troubleshooting/) page.

### Validate prerequisites

You may experience issues due to version incompatibility. Before diving into more specific issues, check to make sure that you have the correct [prerequisites](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/vanilla#prerequisites) installed. 

### ALB fails to provision

If you see that your istio-ingress `ADDRESS` is empty after more than a few minutes, it is possible that something is misconfigured in your ALB ingress controller.
```shell
kubectl get ingress -n istio-system
NAME            HOSTS   ADDRESS   PORTS   AGE
istio-ingress   *                 80      3min
```

Check the AWS ALB Ingress Controller logs for errors.
```shell
kubectl -n kubeflow logs $(kubectl get pods -n kubeflow --selector=app=aws-alb-ingress-controller --output=jsonpath={.items..metadata.name}) 
```

```
E1024 09:02:59.934318       1 :0] kubebuilder/controller "msg"="Reconciler error" "error"="failed to build LoadBalancer configuration due to retrieval of subnets failed to resolve 2 qualified subnets. Subnets must contain the kubernetes.io/cluster/\u003ccluster name\u003e tag with a value of shared or owned and the kubernetes.io/role/elb tag signifying it should be used for ALBs Additionally, there must be at least 2 subnets with unique availability zones as required by ALBs. Either tag subnets to meet this requirement or use the subnets annotation on the ingress resource to explicitly call out what subnets to use for ALB creation. The subnets that did resolve were []"  "controller"="alb-ingress-controller" "request"={"Namespace":"istio-system","Name":"istio-ingress"}
```

Please check `kubectl get configmaps aws-alb-ingress-controller-config -n kubeflow -o yaml` and make any needed changes.

If this does not resolve the error, it is possible that your subnets are not tagged so that Kubernetes knows which subnets to use for external load balancers. To fix this, ensure that your cluster's public subnets are tagged with the **Key**: ```kubernetes.io/role/elb``` and **Value**: ```1```. See the Prerequisites section for application load balancing in the [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html) for further details.

### FSx issues

Verify that the FSx drivers are installed by running the following command: 
```bash
kubectl get csidriver -A
```

Check that `PersistentVolumes`, `PersistentVolumeClaims`, and `StorageClasses` are all deployed as expected:
```bash
kubectl get pv,pvc,sc -A
```

Use the `kubectl logs` command to get more information on Pods that use these resources.

For more information, see the [Amazon FSx for Lustre CSI Driver](https://github.com/kubernetes-sigs/aws-fsx-csi-driver) GitHub repository. Troubleshooting information for specific FSx filesystems can be found in the [Amazon FSx documentation](https://docs.aws.amazon.com/fsx/index.html). 

### RDS issues

If you run into CloudFormation deployment errors, see the [CloudFormation troubleshooting guide](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/troubleshooting.html).

If you have connectivity issues with Amazon RDS, launch a `mysql-client` container and try connecting to your RDS endpoint. This will let you know if you have network connectivity with the database and also if the database was created and is configured properly.

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
