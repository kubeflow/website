+++
title = "MiniKF on AWS Marketplace"
description = "Deploy Kubeflow with MiniKF via AWS Marketplace"
weight = 40
+++

![MiniKF latest
version](https://www.arrikto.com/wp-content/uploads/2020/11/minikf-latest-version-aws.svg
"MiniKF latest version")

This guide describes how to launch a MiniKF instance on AWS. MiniKF is a single
VM solution on the AWS Marketplace, and installs:

- Kubernetes (using [Minikube](https://minikube.sigs.k8s.io/docs/))
- Kubeflow
- [Kale](https://github.com/kubeflow-kale/kale), an orchestration and workflow
  tool for Kubeflow that enables you to run complete data science workflows
  starting from a notebook
- Arrikto's [Rok](https://www.arrikto.com/rok-data-management/), a data
  management software for data versioning and reproducibility

### Installing MiniKF on AWS

To install MiniKF on AWS, follow the steps below:

1. Go to the [MiniKF page](https://aws.amazon.com/marketplace/pp/B08MBGH311) on
   the AWS Marketplace.
1. Click on the **Continue to Subscribe** button.

   <img src="/docs/images/minikf-aws/minikf-aws-page.png"
       alt="Continue to Subscribe"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Click on the **Accept Terms** button.

   <img src="/docs/images/minikf-aws/minikf-aws-accept-terms.png"
       alt="Accept Terms"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Wait for a few minutes and the click on **Continue to Configuration**.

   <img src="/docs/images/minikf-aws/minikf-aws-continue-configuration.png"
       alt="Continue to Configuration"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Select a **Region**. We recommend you keep the default values for **Delivery
   Method** and  **Software Version**. Then click **Continue to Launch**.

   <img src="/docs/images/minikf-aws/minikf-aws-configuration.png"
       alt="Configure MiniKF"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Here you can review your configuration details. Don’t forget to view the
   **Usage Instructions** and keep them handy, as you are going to need them
   later.

   <img src="/docs/images/minikf-aws/minikf-aws-configuration-details.png"
       alt="Configuration Details"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. You can also select how to launch MiniKF or change the EC2 instance type. We
   recommend you leave the default value for **Choose Action**. We recommend
   that you keep the default **EC2 Instance Type** (m5.2xlarge) or choose an
   even more powerful instance. Choosing a VM with reduced specs may make it
   impossible to train ML models.

   <img src="/docs/images/minikf-aws/minikf-aws-instance-type.png"
       alt="Select Intance Type"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Choose an existing **VPC** or create a new one. If you create a new one, make
   sure you click on the **refresh** icon to update the contents of the list, so
   that your new VPC appears in it.

   <img src="/docs/images/minikf-aws/minikf-aws-security-settings-vpc.png"
       alt="Select a VP or create a new one"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Choose an existing **Subnet** or create a new one. If you create a new one,
   make sure you click on the **refresh** icon to update the contents of the
   list, so that your new subnet appears in it.

   <img src="/docs/images/minikf-aws/minikf-aws-security-settings-subnet.png"
       alt="Select a Subnet or create a new one"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. We strongly recommend to create a new security group. Otherwise you may not
   be able to access your MiniKF. To do so, click on **Create New Based On
   Seller Settings**.
   
   ---
   **Note**: If you need to use an existing security group, **make sure it
   covers the ports mentioned in the usage instructions** (check at the top of
   this page).

   ---
   
   <img src="/docs/images/minikf-aws/minikf-aws-security-group.png"
       alt="Create a new security group"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Choose an existing **Key Pair** or create a new one. If you create a new one,
   make sure you click on the **refresh** icon to update the contents of the
   list, so that your new key pair appears in it.
   
   <img src="/docs/images/minikf-aws/minikf-aws-security-settings-key-pair.png"
       alt="Select a Key Pair or create a new one"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Click **Launch**. Then, a message will show up informing you about the
   successful installation. The message contains a link to view the instance on
   the EC2 Console. Click on it.

   <img src="/docs/images/minikf-aws/minikf-aws-successful-deployment.png"
       alt="Successful deployment message"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. You should now see a screen like this. Click on the **Instance ID** of the
   created instance.

   <img src="/docs/images/minikf-aws/minikf-aws-ec2-console.png"
       alt="Instance on EC2 Console"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. You will then see this page. Click **Connect** to connect to the instance
   using EC2 Instance Connect.

   ---
   **Note**: This will only work if you have created a security group based on
   seller settings, as in step 10, or you have configured a security group based
   on the usage instructions. Otherwise, you need to SSH to the instance
   manually, please refer to [Connecting to your Linux instance using SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html).

   ---
   
   <img src="/docs/images/minikf-aws/minikf-aws-connect.png"
       alt="Connect to the instance using EC2 Instance Connect"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. The **User name** will be prefilled. Click **Connect**.

   <img src="/docs/images/minikf-aws/minikf-aws-ec2-connect.png"
       alt="EC2 Instance Connect"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Follow the on-screen instructions and type **minikf** to view the progress of
   the deployment.

   <img src="/docs/images/minikf-aws/minikf-aws-view-progress.png"
       alt="View MiniKF deployment progress"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Wait for a few minutes.

   <img src="/docs/images/minikf-aws/minikf-aws-progress.png"
       alt="Wait for the installation to complete"
       class="mt-3 mb-3 p-3 border border-info rounded"> 

1. Once the installation is completed you will see this screen.

   <img src="/docs/images/minikf-aws/minikf-aws-provisioning-completed.png"
       alt="MiniKF installation completed"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Follow the URL and log in to MiniKF using the provided username and password.

   ---
   **Νote**: Note that MiniKF uses a self-signed certificate, so you will have
   to follow this [guide](https://www.arrikto.com/faq/self-signed-certs/) to
   proceed to the MiniKF dashboard.

   ---

   <img src="/docs/images/minikf-login.png"
       alt="MiniKF login page"
       class="mt-3 mb-3 p-3 border border-info rounded">

1. Once you log in, you will see the MiniKF Dashboard.

   <img src="/docs/images/minikf-dashboard.png"
       alt="MiniKF dashboard"
       class="mt-3 mb-3 p-3 border border-info rounded"> 

Congratulations! You have successfully deployed MiniKF on AWS. You can now
create notebooks, write your ML code, and run Kubeflow Pipelines.
