+++
title = "Upgrading and reinstalling Kubeflow Pipelines"
description = "How to upgrade or reinstall your Kubeflow Pipelines implementation"
weight = 20
+++

Starting from version TODO:VERSION-NUMBER, Kubeflow Pipelines persists the
pipeline data in a permanent storage volume. Kubeflow Pipelines therefore
supports the following capabilities:

- **Upgrade:** You can upgrade your Kubeflow Pipelines deployment to a
  later version without deleting and recreating the cluster.
- **Reinstall:** You can delete a cluster and create a new cluster, specifying
  the storage to retrieve the original data in the new cluster.

## Context

Kubeflow Pipelines creates and manages the following machine learning related
data: 

-  Pipeline metadata: experiments, jobs, runs, etc.
-  Artifacts: pipeline packages, metrics, views, etc.

Kubeflow Pipelines stores the pipeline metadata in a MySQL database and the
artifacts in a [Minio server](https://docs.minio.io/). Both of these storage
services are backed by the Kubernetes
[PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)
(PV) subsystem. During deployment, Kubeflow Pipelines automatically creates a
Compute Engine [Persistent Disk](https://cloud.google.com/persistent-disk/) (PD)
and mounts it as a PV if you are deploying Kubeflow on GCP, or allows you to
specify your own prefered PV for an on-prem deployment.

Note: At some time in the future, Kubeflow will move to Kustomize due to ksonnet
being archived. The specific commands will change at that time but the overall
experience will stay similar. For more details, see
[http://bit.ly/kf-kustomize](http://bit.ly/kf-kustomize). 

## Deploying Kubeflow

**GCP** - Follow the guide to [getting started with Kubeflow on
GKE](https://www.kubeflow.org/docs/started/getting-started-gke/). You don't need
to do any additional steps. When the deployment has finished, you can see two
entries in the Deployment Manager, one for deploying the cluster, and one for
deploying the storage.

![image](https://drive.google.com/a/google.com/file/d/1xePsme0B3xpm4mnPbhJIBhq7ITh6Xy7F/view?usp=drivesdk)

The entry suffixed with "-storage"creates one PD for the metadata store and one
for the artifact store.

![image](https://drive.google.com/a/google.com/file/d/1vHKxhcnIWMK4A1AUwNZQDtRHQTp1vV9F/view?usp=drivesdk)

**Non GCP** - Follow the steps below, assuming you have a Kubernetes cluster set
up already. 

If you don't need custom storage and are happy with the default storage provided
by Kubeflow, you can skip the steps below. The deployment script then uses the
Kubernetes default
[StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/#the-storageclass-resource)
to provision the PVs for you. 

If you want to specify a custom persistent volume:

First create two PVs in the cluster with your preferred storage. See the
[Kubernetes guide](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes).  
Then follow the Kubeflow
[quick start](https://www.kubeflow.org/docs/started/getting-started/#kubeflow-quick-start).
Before running the following `apply` command:

<table>
<thead>
<tr>
<th><p><pre>
${KUBEFLOW_SRC}/scripts/kfctl.sh apply k8s
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Run the following command to specify the persistent volume for storing the
additional data:

<table>
<thead>
<tr>
<th><p><pre>
cd ks_app
ks param set pipeline mysqlPvName [your-pre-created-mysql-pv-name]
ks param set pipeline minioPvName [your-pre-created-minio-pv-name]
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Then apply to the cluster. 

## Redeploying Kubeflow

You can redeploy a Kubeflow with an existing storage. Note this is supported
through command line deployment only.

**GCP** - Follow the standard
[command line deployment instructions](https://www.kubeflow.org/docs/started/getting-started-gke/#deploy-kubeflow-on-gke-using-the-command-line).
  
Before running the following `apply` command:

<table>
<thead>
<tr>
<th><p><pre>
${KUBEFLOW_SRC}/scripts/kfctl.sh apply platform
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Edit` gcp_config/storage-kubeflow.yaml `

<table>
<thead>
<tr>
<th><p><pre>
...
createPipelinePersistentStorage: false
...
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Before running the following `apply` command:

<table>
<thead>
<tr>
<th><p><pre>
${KUBEFLOW_SRC}/scripts/kfctl.sh apply k8s
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Run the following command to specify the persistent disk created from a previous
deployment:

<table>
<thead>
<tr>
<th><p><pre>
cd ks_app
ks param set pipeline mysqlPd [previous-metadata-store-disk-name]
ks param set pipeline minioPd [previous-artifact-store-disk-name]
cd ..
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Then apply to the cluster.

**Non GCP **- the experience is same as non-GCP installation above, except you
need to use the same PV definition as previous deployment to create the new PV
in the new cluster, before applying to the cluster.

## Upgrading your Kubeflow deployment

To upgrade your Kubeflow deployment, run the following script in the Kubeflow
app directory (the same directory where you performed the deployment):

<table>
<thead>
<tr>
<th><p><pre>
$ {KUBEFLOW_SRC}/scripts/upgrade_kfp.sh
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

If you used the web interface
([https://deploy.kubeflow.cloud/#/deploy](https://deploy.kubeflow.cloud/#/deploy))
to deploy Kubeflow, you must first download the Kubeflow app directory from the
cloud source repo. Then you can proceed with the upgrade.

<table>
<thead>
<tr>
<th><p><pre>
$ gcloud source repos clone yang-experiment-6-kubeflow-config --project=[your-gcp-project]
<br>
$ kubectl create clusterrolebinding admin-binding --clusterrole=cluster-admin --user=[your-email-address]
<br>
$ {KUBEFLOW_SRC}/scripts/upgrade_kfp.sh 
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>