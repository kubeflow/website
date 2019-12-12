+++
title = "Deploy using MiniKF on GCP"
description = "Instructions for using the Google Cloud Marketplace to deploy MiniKF (mini Kubeflow) on Google Cloud Platform (GCP)."
weight = 4
+++

This guide describes how to launch a MiniKF VM on GCP. MiniKF is a
production-ready, full-fledged Kubeflow deployment that installs in minutes.
It's a fast and easy way to get started with Kubeflow. With just a few clicks,
you are up for experimentation, and for running complete Kubeflow Pipelines.

MiniKF installs Kubeflow 0.7.0 and supports NVIDIA GPUs.

### Installing MiniKF on GCP

To install MiniKF on GCP, follow the steps below:

Go to the [MiniKF page](To install MiniKF on GCP, follow the steps below) on
Google Cloud Marketplace.

Click on the Launch on Compute Engine button

<p class="text-center">
  <img src="/docs/images/minikf-launch.png" alt="Launch MiniKF on GCP">
</p>
<p class="text-center" style="font-size:0.75rem">Figure 1: Launch MiniKF on GCP</p>

In the Configure & Deploy window, choose:

  - **name**: a name for your MiniKF instance
  - **zone**: the GCP zone that you will deploy MiniKF
  - **machine type**: a machine type with at least 2 vCPUs and 16 GB of RAM. We
    propose using the default machine type, n1–standard-8, which has 8 vCPUs and
    30 GB of RAM.
  - **boot disk**: A boot disk. This is the disk that holds the images that MiniKF
    needs. We propose using the default value of 200 GB SSD Persistent Disk.
  - **extra disk**: An extra disk. This is the disk that holds your snapshots. We
    propose using an SSD Persistent Disk of at least 500 GB capacity.

Then click *Deploy*:

<p class="text-center">
  <img src="/docs/images/minikf-deploy.png" alt="Configure and deploy MiniKF">
</p>
<p class="text-center" style="font-size:0.75rem">Figure 2: Configure & Deploy MiniKF</p>

Now wait for the VM to boot.

<p class="text-center">
  <img src="/docs/images/minikf-up.png" alt="MiniKF on GCP has been deployed">
</p>
<p class="text-center" style="font-size:0.75rem">Figure 3: MiniKF on GCP has been deployed</p>

When the VM is up:

   - **Ensure that MiniKF is up and running**. Before visiting the MiniKF
     dashboard, ensure that Minikube, Kubeflow, and Rok are up and running. To
     do so, click on the SSH button to connect to the MiniKF VM and follow the
     on-screen instructions.

<p class="text-center">
  <img src="/docs/images/minikf-ssh.png" alt="Connect to the MiniKF VM">
</p>
<p class="text-center" style="font-size:0.75rem">Figure 4: Connect to the MiniKF VM</p>

   - **Log in to Kubeflow**. Visit the MiniKF dashboard URL and log in to Kubeflow
     using the MiniKF username and password.

<p class="text-center">
  <img src="/docs/images/minikf-info.png" alt="MiniKF dashboard, username, and password">
</p>
<p class="text-center" style="font-size:0.75rem">Figure 5: MiniKF dashboard, username, and password</p>

<p class="text-center">
  <img src="/docs/images/minikf-kubeflow.png" alt="Log in to Kubeflow">
</p>
<p class="text-center" style="font-size:0.75rem">Figure 6: Log in to Kubeflow</p>

   - **Log in to Rok**. After logging in to Kubeflow, navigate to the Snapshot
     Store and log in to Rok using the MiniKF username and password.

<p class="text-center">
  <img src="/docs/images/minikf-snapshot-store.png" alt="Navigate to the Snapshot Store">
</p>
<p class="text-center" style="font-size:0.75rem">Figure 7: Navigate to the Snapshot Store</p>

<p class="text-center">
  <img src="/docs/images/minikf-snapshot-store-login.png" alt="Log in to Rok">
</p>
<p class="text-center" style="font-size:0.75rem">Figure 8: Log in to Rok</p>

Congratulations! You have successfully deployed MiniKF on GCP! You can now
create Notebooks, write your ML code, and run Kubeflow Pipelines.
