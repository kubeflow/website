+++
title = "Configure External Database using Azure Database for MySQL"
description = "Using Azure Database for MySQL to store metadata"
weight = 100
                    
+++
This section shows how to use Kustomization to configure an external Azure MySQL database to store metadata.

### Azure Database for MySQL
[Azure Database for MySQL](https://docs.microsoft.com/en-us/azure/mysql) is a relational database service in Microsoft cloud based on the [MySQL Community Edition](https://www.mysql.com/products/community/) database engine. Azure Database for MySQL delivers: built-in high availability; data protection using automatic backups and point-in-time-restore for up to 35 days; automated maintainance for underlying hardware, operating system and database engine to keep the service secure and up to date. [See more about Azure Database for MySQL.](https://docs.microsoft.com/en-us/azure/mysql/overview)

#### 1. Create an Azure database for MySQL
Create an Azure MySQL data base following the [guidance](https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal) using Azure Portal. Alternatively, you could also use Azure CLI by following [steps](https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-cli) here. Take notes for ```Server Name```, ```Admin username```, and ```Password```. 

{{% alert title="Warning" color="warning" %}}
By default the server created is protected with a firewall and is not accessible publicly. Follow the [guidance](https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal#configure-a-server-level-firewall-rule) to allow database to be accessible from external IP addresses. Based on your configuration, you might also enable all IP addresses, and disable ```Enforce SSL connection```.
{{% /alert %}}


#### 2. Deploy Kubeflow to use Azure metadata overlay
Follow the [installation document for Azure AKS](https://www.kubeflow.org/docs/azure/deploy/install-kubeflow/) until the step to build and apply the ```CONFIG_URI```. Download your configuration file, so that you can customize the configuration before deploying Kubeflow by running ```wget -O kfctl_azure.yaml ${CONFIG_URI}```, where the ```${CONFIG_URL}``` should be the one you specified in the previous steps. Run
```kfctl build -V -f kfctl_azure.yaml```.

Edit the Azure stack at ```/stacks/azure``` and make change under ```resources``` from ```- ../../metadata/v3``` to ```metadata``` to use Azure MySQL.

The updated Kustomization.yaml in ```stacks/azure``` should something similar to this:
```
  # Metadata
  # - ../../metadata/v3
  # Uncomment the line below if you want to use Azure MySQL
  - metadata
```

Edit ```params.env``` to provide parameters to config map as follows (change the ```[db_name]``` to the server name you used):
```
MYSQL_HOST=[db_name].mysql.database.azure.com
MYSQL_DATABASE=mlmetadata
MYSQL_PORT=3306
MYSQL_ALLOW_EMPTY_PASSWORD=true
```

Edit ```secrets.env``` to create a secret based on your database configuration (make sure the user name follows the pattern with an "@", like the one showed below):
```
MYSQL_USERNAME=[admin_user_name]@[db_name]
MYSQL_PASSWORD=[admin_password]
```

#### 3. Run Kubeflow Installation
```
kfctl apply -V -f kfctl_azure.yaml
```
Your metadata database should be using the Azure Database for MySQL now. 

You could also configure the pipeline database using external Azure Database for MySQL following the instructions [here](https://github.com/kubeflow/pipelines/tree/master/manifests/kustomize/env/azure).

