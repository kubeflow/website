+++
title = "Deploy using MiniKF on GCP"
description = "Using Google Cloud Marketplace to deploy MiniKF (mini Kubeflow) on Google Cloud Platform (GCP)"
weight = 40

This guide describes how to launch a MiniKF virtual machine (VM) on GCP. MiniKF
is a single VM solution on the Google Cloud Marketplace, and installs:

- Kubernetes (using Minikube)
- Kubeflow
- Kale, a tool to convert general purpose Jupyter Notebooks to Kubeflow
  Pipelines workflows ([GitHub](https://github.com/kubeflow-kale))
- Arrikto's Rok, a data management software for data versioning and
  reproducibility

MiniKF supports NVIDIA GPUs.
### Before you start

Before installing MiniKF, make sure that your GCP project meets the minimum
requirements described below:

1. Select or create a project on the [GCP Console](https://console.cloud.google.com/cloud-resource-manager).
2. Make sure that you have the [editor role](https://cloud.google.com/iam/docs/understanding-roles#primitive_role_definitions)
   role for the project. You can add a member to a project and
   [grant them a Cloud IAM role](https://cloud.google.com/iam/docs/granting-changing-revoking-access#using_the) using the Cloud Console.
3. Make sure that billing is enabled for your project. For more info, see the
   [Modify a Project's Billing Settings](https://cloud.google.com/billing/docs/how-to/modify-project) guide.
4. If you are using the [GCP Free Tier](https://cloud.google.com/free/docs/gcp-free-tier) or the 12-month trial period with $300
   credit, note that you can’t run the default GCP installation of MiniKF,
   because the free tier does not offer enough resources. You need to [upgrade to a paid account](https://cloud.google.com/free/docs/gcp-free-tier#how-to-upgrade).
5. Read the GCP guide to [resource quotas](https://cloud.google.com/compute/quotas) to understand the quotas on
   resource usage that Compute Engine enforces, and to learn how to check your
   quota and how to request an increase in quota.

### Installing MiniKF on GCP

To install MiniKF on GCP, follow the steps below:

1. Go to the [MiniKF page](https://console.cloud.google.com/marketplace/details/arrikto-public/minikf?q=minikf&id=1f5eac28-1808-4969-b6fa-2cc231a23f45) on
Google Cloud Marketplace.

2. Click on the **LAUNCH** button

     <img src="/docs/images/minikf-launch.png"
       alt="Launch MiniKF on GCP"
       class="mt-3 mb-3 p-3 border border-info rounded">
  
3. In the **Configure & Deploy** window, choose:

  - **Deployment name**: a name for your MiniKF instance
  - **Zone**: the GCP zone that you will deploy MiniKF
  - **Machine type**: a machine type with at least 2 vCPUs and 16 GB of RAM. If
    in doubt, use the default machine type, n1–standard-8, which has 8 vCPUs and
    30 GB of RAM.
  - **Boot Disk**: a boot disk. This is the disk that holds the images that MiniKF
    needs. Use the default value of 200 GB SSD Persistent Disk.
  - **Data Disk**: a data disk. This is the disk that holds your snapshots. Use
    an SSD Persistent Disk of at least 500 GB capacity.
  - **GPUs**: add one or more GPUs if you are running computationally intensive
    ML workloads.

     Then click **Deploy**:

     <img src="/docs/images/minikf-deploy.png"
       alt="Configure and deploy MiniKF"
       class="mt-3 mb-3 p-3 border border-info rounded">

4. Now wait for the VM to boot.

    <img src="/docs/images/minikf-up.png"
      alt="MiniKF on GCP has been deployed"
      class="mt-3 mb-3 p-3 border border-info rounded">

5. When the VM is up, **ensure that MiniKF is up and running**. Before visiting
   the MiniKF dashboard, ensure that Minikube, Kubeflow, and Rok (Snapshot
   Store) are up and running. To do so, click on the **SSH** button to connect
   to the MiniKF VM and follow the on-screen instructions.

    <img src="/docs/images/minikf-ssh.png"
      alt="Connect to the MiniKF VM"
      class="mt-3 mb-3 p-3 border border-info rounded">

6. **MiniKF dashboard, username, and password**. Now that Minikube, Kubeflow,
   and Rok are up-and-running, close the SSH browser window, as you will not
   need it anymore. On your current view, please find the **MiniKF dashboard**
   URL, **MiniKF username**, and **MiniKF password**. You will need them to log
   in to Kubeflow and Rok. You should see a table like the one below:

     <img src="/docs/images/minikf-info.png"
       alt="MiniKF dashboard, username, and password"
      class="mt-3 mb-3 p-3 border border-info rounded">

7. **Log in to Kubeflow**. Visit the MiniKF dashboard URL and log in to Kubeflow
   using the MiniKF username and password.

    <img src="/docs/images/minikf-kubeflow.png"
      alt="Log in to Kubeflow"
      class="mt-3 mb-3 p-3 border border-info rounded">

8. **Log in to Snapshot Store (Rok)**. After logging in to Kubeflow, navigate to
   the **Snapshot Store**:

    <img src="/docs/images/minikf-snapshot-store.png"
      alt="Navigate to the Snapshot Store"
      class="mt-3 mb-3 p-3 border border-info rounded">

    And log in to Snapshot Store (Arrikto's Rok) using the MiniKF username and
    password.


    <img src="/docs/images/minikf-snapshot-store-login.png"
      alt="Log in to Rok"
      class="mt-3 mb-3 p-3 border border-info rounded">

Congratulations! You have successfully deployed MiniKF on GCP. You can now
create notebooks, write your ML code, and run Kubeflow Pipelines.
