+++
title = "Configure External Database Using Amazon RDS"
date = 2020-04-29T12:54:30-04:00
description = "Using Amazon RDS for storing pipelines and metadata"
weight = 98
+++

This guide describes how to use Amazon RDS as your pipelines and metadata store.

## Amazon Relational Database Service (Amazon RDS)

Amazon RDS is a managed service that makes it easier to set up, operate, and scale a relational database in the AWS Cloud. It provides cost-efficient, resizable capacity for an industry-standard relational database and manages common database administration tasks. It has support for several engines such as  MySQL, MariaDB, PostgreSQL, Oracle, and Microsoft SQL Server DB engines.  

### Deploy Amazon RDS MySQL in your environment

Before deploying MySQL database using Amazon RDS, let's get configuration parameters that are needed such as VpcId, SubnetIds and SecurityGroupId.

```shell
# Use these commands to find VpcId, SubnetId and SecurityGroupId if you deployed your EKS cluster using eksctl
# For DIY Kubernetes on AWS, modify tag name or values to get desired results
export AWS_CLUSTER_NAME=<YOUR EKS CLUSTER NAME>

# Below command will retrieve your VpcId
aws ec2 describe-vpcs --filters Name=tag:alpha.eksctl.io/cluster-name,Values=$AWS_CLUSTER_NAME | jq -r '.Vpcs[].VpcId'

# Below command will retrieve list of Private subnets
# You need to use at least two Subnets from your List
aws ec2 describe-subnets --filters Name=tag:alpha.eksctl.io/cluster-name,Values=$AWS_CLUSTER_NAME Name=tag:aws:cloudformation:logical-id,Values=SubnetPrivate* | jq -r '.Subnets[].SubnetId'

# Below command will retrieve SecurityGroupId for your Worker nodes
# This assumes all your Worker nodes share same SecurityGroups
INSTANCE_IDS=$(aws ec2 describe-instances --query 'Reservations[*].Instances[*].InstanceId' --filters "Name=tag-key,Values=eks:cluster-name" "Name=tag-value,Values=$AWS_CLUSTER_NAME" --output text)
for i in "${INSTANCE_IDS[@]}"
do
  echo "SecurityGroup for EC2 instance $i ..."
aws ec2 describe-instances --instance-ids $i | jq -r '.Reservations[].Instances[].SecurityGroups[].GroupId'
done  
```
You can either use console or use attached [CloudFormation template](/docs/aws/files/rds.yaml) to deploy Amazon RDS database.

{{% alert title="Warning" color="warning" %}}
The CloudFormation template deploys Amazon RDS for MySQL that is intended for Dev/Test environment.
We highly recommend deploying Multi-AZ database for Production. Please review RDS [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html) to learn more
{{% /alert %}}

[{{<figure src="/docs/images/aws/cloudformation-launch-stack.png">}}](https://console.aws.amazon.com/cloudformation/home?#/stacks/new?stackName=kubeflow-db&templateURL=https://cloudformation-kubeflow.s3-us-west-2.amazonaws.com/rds.yaml)

Remember to select correct **Region** in CloudFormation management console before clicking Next. We recommend you to change the **DBPassword**, if not it will default to `Kubefl0w`. Select VpcId, Subnets and SecurityGroupId before clicking Next. Take rest all defaults and click **Create Stack**.

Once the CloudFormation is completed, click on Outputs tab to get RDS endpoint. If you didn't use CloudFormation, you can retrieve RDS endpoint through AWS management console for RDS on the Connectivity & security tab under Endpoint & port section. We will use it in the next step while installing Kubeflow.   

![dashboard](/docs/images/aws/cloudformation-rds-output.png)

### Deploy Kubeflow Pipeline and Metadata using Amazon RDS

1. Follow the [install documentation](https://www.kubeflow.org/docs/aws/deploy/install-kubeflow/) until [Deploy Kubeflow](https://www.kubeflow.org/docs/aws/deploy/install-kubeflow/#deploy-kubeflow) section.
Modify `${CONFIG_FILE}` file to add `external-mysql` in both pipeline and metadata kustomizeConfigs and remove mysql database as shown below.  

    ![dashboard](/docs/images/aws/external-mysql-rds.png)

2. Run the follow commands to build Kubeflow installation:

    ```
    cd ${KF_DIR}
    kfctl build -V -f ${CONFIG_FILE}
    ```
    This will create two folders `aws_config` and `kustomize` in your environment. Edit `params.env` file for the external-mysql pipeline service (`kustomize/api-service/overlays/external-mysql/params.env`) and update values based on your configuration:

    ```
    mysqlHost=<$RDSEndpoint>
    mysqlUser=<$DBUsername>
    mysqlPassword=<$DBPassword>
    ```
    Edit `params.env` file for the external-mysql metadata service (`kustomize/metadata/overlays/external-mysql/params.env`) and update values based on your configuration:

    ```
    MYSQL_HOST=external_host
    MYSQL_DATABASE=<$RDSEndpoint>
    MYSQL_PORT=3306
    MYSQL_ALLOW_EMPTY_PASSWORD=true
    ```
    Edit `secrets.env` file for the external-mysql metadata service (`kustomize/metadata/overlays/external-mysql/secrets.env`) and update values based on your configuration:

    ```
    MYSQL_USERNAME=<$DBUsername>
    MYSQ_PASSWORD=<$DBPassword>
    ```

3. Run Kubeflow installation:

    ```
    cd ${KF_DIR}
    kfctl apply -V -f ${CONFIG_FILE}
    ```
Your pipeline and metadata is now using Amazon RDS. Review [troubleshooting section](../troubleshooting-aws/#amazon-rds-connectivity-issues) if you run into any issues.
