+++
title = "Configure Kubeflow with Amazon RDS"
date = 2020-04-29T12:54:30-04:00
description = "Using Amazon RDS for storing pipelines and metadata"
weight = 60
+++

This guide describes how to use Amazon RDS as your pipelines and metadata store.

## Amazon Relational Database Service (Amazon RDS)

[Amazon RDS](https://aws.amazon.com/rds/) is a managed service that makes it easy to set up, operate, and scale a relational database in the AWS Cloud. It provides cost-efficient, resizable capacity for an industry-standard relational database and manages common database administration tasks. It has support for several engines such as  Amazon Aurora, MySQL, MariaDB, PostgreSQL, Oracle Database, and SQL Server.

### Deploy Amazon RDS MySQL

To get started deploying a MySQL database using Amazon RDS, you'll need to retrieve some configuration parameters that are needed.

```shell
# Use these commands to find VpcId, SubnetId and SecurityGroupId if you create your EKS cluster using eksctl
# For clusters created in other ways, retrieve these values before moving on to deploying your database
export AWS_CLUSTER_NAME=<your_cluster_name>

# Retrieve your VpcId
aws ec2 describe-vpcs \
    --filters Name=tag:alpha.eksctl.io/cluster-name,Values=$AWS_CLUSTER_NAME \
    | jq -r '.Vpcs[].VpcId'

# Retrieve the list of SubnetId's of your cluster's Private subnets, select at least two
aws ec2 describe-subnets \
    --filters Name=tag:alpha.eksctl.io/cluster-name,Values=$AWS_CLUSTER_NAME Name=tag:aws:cloudformation:logical-id,Values=SubnetPrivate* \
    | jq -r '.Subnets[].SubnetId'

# Retrieve the SecurityGroupId for your nodes
# Note, this assumes your nodes share the same SecurityGroup
INSTANCE_IDS=$(aws ec2 describe-instances --query 'Reservations[*].Instances[*].InstanceId' --filters "Name=tag-key,Values=eks:cluster-name" "Name=tag-value,Values=$AWS_CLUSTER_NAME" --output text)
for i in "${INSTANCE_IDS[@]}"
do
  echo "SecurityGroup for EC2 instance $i ..."
aws ec2 describe-instances --instance-ids $i | jq -r '.Reservations[].Instances[].SecurityGroups[].GroupId'
done  
```

With this information in hand, you can now use either the Amazon RDS console or use the attached [CloudFormation template](/docs/distributions/aws/customizing-aws/files/rds.yaml) to deploy your database.

{{% alert title="Warning" color="warning" %}}
The CloudFormation template deploys Amazon RDS for MySQL that is intended for Dev/Test environment.
We highly recommend deploying a Multi-AZ database for Production use. Please review the Amazon RDS [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html) to learn more.
{{% /alert %}}

[{{<figure src="/docs/images/aws/cloudformation-launch-stack.png">}}](https://console.aws.amazon.com/cloudformation/home?#/stacks/new?stackName=kubeflow-db&templateURL=https://cloudformation-kubeflow.s3-us-west-2.amazonaws.com/rds.yaml)

Select your desired **Region** in the AWS CloudFormation management console then click **Next**.
We recommend you change the **DBPassword**, if not it will default to `Kubefl0w`. Select VpcId, Subnets and SecurityGroupId then click **Next**.
Take the rest of the defaults by clicking **Next**, then clicking **Create Stack**.

Once the CloudFormation stack creation is complete, click on **Outputs** to get the RDS endpoint.

![dashboard](/docs/images/aws/cloudformation-rds-output.png)

If you didn't use CloudFormation, you can retrieve the RDS endpoint through the RDS console on the Connectivity & Security tab under the Endpoint & Port section. We will use it in the next step while installing Kubeflow.   

### Deploy Kubeflow Pipeline and Metadata using Amazon RDS

1. Follow the [install documentation](https://www.kubeflow.org/docs/distributions/aws/deploy/install-kubeflow/) up until the [Deploy Kubeflow](https://www.kubeflow.org/docs/distributions/aws/deploy/install-kubeflow/#deploy-kubeflow) section.
Modify the `${CONFIG_FILE}` file to add `external-mysql` in both pipeline and metadata kustomizeConfigs and remove the mysql database as shown in the diff below.  

    ![dashboard](/docs/images/aws/external-mysql-rds.png)

2. Run the following commands to build additional Kubeflow installation configuration:

    ```
    cd ${KF_DIR}
    kfctl build -V -f ${CONFIG_FILE}
    ```

    This will create two folders `aws_config` and `kustomize` in your environment. Edit the `params.env` file for the external-mysql pipeline service (`kustomize/api-service/overlays/external-mysql/params.env`) and update the values based on your configuration:
    ```
    mysqlHost=<$RDSEndpoint>
    mysqlUser=<$DBUsername>
    mysqlPassword=<$DBPassword>
    ```

    Edit the `params.env` file for the external-mysql metadata service (`kustomize/metadata/overlays/external-mysql/params.env`) and update the values based on your configuration:
    ```
    MYSQL_HOST=external_host
    MYSQL_DATABASE=<$RDSEndpoint>
    MYSQL_PORT=3306
    MYSQL_ALLOW_EMPTY_PASSWORD=true
    ```

    Edit the `secrets.env` file for the external-mysql metadata service (`kustomize/metadata/overlays/external-mysql/secrets.env`) and update the values based on your configuration:
    ```
    MYSQL_USERNAME=<$DBUsername>
    MYSQ_PASSWORD=<$DBPassword>
    ```

3. Invoke the Kubeflow installation:
    ```
    cd ${KF_DIR}
    kfctl apply -V -f ${CONFIG_FILE}
    ```

Your pipeline and metadata will now using Amazon RDS. Review [troubleshooting section](.../troubleshooting-aws/#amazon-rds-connectivity-issues) if you run into any issues.
