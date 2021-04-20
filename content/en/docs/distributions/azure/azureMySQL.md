+++
title = "Configure Azure MySQL database to store metadata"
description = "How to configure an external Azure Database for MySQL with kustomize to store metadata"
weight = 100

+++

This section shows how to use Kubeflow kustomize to configure an external Azure
MySQL database to store metadata.

Microsoft [Azure Database for
MySQL](https://docs.microsoft.com/en-us/azure/mysql) is a relational database
service based on [MySQL](https://www.mysql.com/products/community/). It provides
built-in high availability, data protection using automatic backups and
point-in-time-restore for up to 35 days, and automated maintainance for
underlying hardware, operating system and database engine to keep the service
secure and up to date. [Learn more about Azure Database for
MySQL](https://docs.microsoft.com/en-us/azure/mysql/overview).

Table of contents:

1. Create an Azure database for MySQL
2. Deploy Kubeflow to use the Azure metadata overlay
3. Update Kubeflow resources

# Create an Azure database for MySQL

First, you need to create an Azure database for MySQL on Azure through either Azure
Portal or using Azure CLI:

- **Azure Portal**: follow the
  [quickstart](https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal)
  in the Azure documentation.

- **Azure CLI**: follow the
  [quickstart](https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-cli).

Remember your `Server Name`, `Admin username`, and `Password` - you'll be using
them later in this guide.

{{% alert title="Warning" color="warning" %}}
By default, the created server is protected with a firewall and is not
accessible publicly. You can refer to the section on [configuring a server-level
firewall
rule](https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal#configure-a-server-level-firewall-rule)
in the official documentation to allow your database to be accessible from
external IP addresses. Depending on your configuration, you may also be able to
enable all IP addresses and disable `Enforce SSL connection`.
{{% /alert %}}

# Deploy Kubeflow to use the Azure metadata overlay

You have created the MySQL server database. Next, you need to deploy Kubeflow
to use the Azure metadata overlay.

1. Follow the [Install
   Kubeflow](https://www.kubeflow.org/docs/azure/deploy/install-kubeflow/) on
   AKS (Azure Kubernetes Service) guide until the step where you have to build
   and apply the `CONFIG_URI`.

2. If you followed the previous step, you should have downloaded the
   configuration file. Next, you need to customize the configuration before
   deploying Kubeflow. Run the following command:

```shell
wget -O kfctl_azure.yaml ${CONFIG_URI}
```

where the `${CONFIG_URL}` is the URL pointing to Kubeflow manifest for Azure
(for example,
`.../kubeflow/manifests/v1.1-branch/kfdef/kfctl_azure.v1.1.0.yaml`) that you
specified in step 1.

3. Before deploying Kubeflow, use `kfctl build` to create configuration files:

```shell
kfctl build -V -f kfctl_azure.yaml
```

4. Under `/stacks/azure` and `resources` replace `- ../../metadata/v3` with
   `metadata` to  enable using Azure MySQL.

The updated `kustomization.yaml` in `stacks/azure` should look similar to this:

```
  # Metadata
  # - ../../metadata/v3
  # Uncomment the line below if you want to use Azure MySQL
  - ./metadata
```

5. Edit `params.env` to provide parameters to configuration map as follows:

```
MYSQL_HOST={YOUR_DB_SERVER_NAME}.mysql.database.azure.com
MYSQL_DATABASE=mlmetadata
MYSQL_PORT=3306
MYSQL_ALLOW_EMPTY_PASSWORD=true
```

where `{YOUR_DB_SERVER_NAME}` is your server name.

6. Edit `secrets.env` to create a secret with the admin username and password
   based on your database configuration. Make sure the user name follows the
   pattern with an "@", like the one showed below:

```
MYSQL_USERNAME={ADMIN_USERNAME}@{YOUR_DB_SERVER_NAME}
MYSQL_PASSWORD={ADMIN_PASSWORD}
```

# Deploy Kubeflow

Having completed the previous steps to set up the MySQL server, you can deploy
Kubeflow:

```
kfctl apply -V -f kfctl_azure.yaml
```

Your metadata database should now be using the Azure Database for MySQL.

To configure the pipeline database using an external Azure Database for MySQL,
go to [KFP customizations for
Azure](https://github.com/kubeflow/pipelines/tree/master/manifests/kustomize/env/azure).