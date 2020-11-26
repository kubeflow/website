+++
title = "Delete using CLI"
description = "Deleting Kubeflow from Google Cloud using the command line interface (CLI)"
weight = 7
+++

This page explains how to delete your Kubeflow cluster or management cluster on
Google Cloud.

## Before you start

This guide assumes the following settings:

- The `${KF_DIR}` environment variable contains the path to
  your Kubeflow application directory, which holds your Kubeflow configuration
  files. For example, `/opt/my-kubeflow/`.

  ```bash
  export KF_DIR=<path to your Kubeflow application directory>
  ```

- The `${MGMT_DIR}` environment variable contains the path to
  your management directory, which holds your management cluster configuration
  files. For example, `~/kf-deployments/management/`.

## Deleting your Kubeflow cluster

1.  To delete the applications running in the Kubeflow namespace, remove that namespace:

    ```bash
    kubectl delete namespace kubeflow
    ```

1.  To delete the cluster and all GCP resources, run the following commands:

    ```bash
    cd ${KF_DIR}
    make delete-gcp
    ```

    **Warning**: this will delete the persistent disks storing metadata. If you want to preserve the disks don't run this command;
    instead selectively delete only those resources you want to delete.

## Clean up your management cluster

The following instructions introduce how to clean up all resources created when
installing management cluster and using management cluster to manage Google
Cloud resources in managed projects.

### Delete or keep managed Google Cloud resources

There are Google Cloud resources managed by Config Connector in the
management cluster after you deploy Kubeflow clusters with this management
cluster.

To delete all the managed Google Cloud resources, delete the managed project namespace:

```bash
kubectl use-context ${MGMTCTXT}
kubectl delete namespace --wait ${MANAGED_PROJECT}
```

To keep all the managed Google Cloud resources, you can delete the management
cluster directly.

If you need fine-grained control, refer to
[Config Connector: Keeping resources after deletion](https://cloud.google.com/config-connector/docs/how-to/managing-deleting-resources#keeping_resources_after_deletion)
for more details.

After deleting cnrm resources for a managed project, you can revoke IAM permission
that let the management cluster manage the project:

```bash
gcloud projects remove-iam-policy-binding ${MANAGED_PROJECT} \
    --member=serviceAccount:${MGMT_NAME}-cnrm-system@${PROJECT}.iam.gserviceaccount.com \
    --role=roles/owner
```

### Delete management cluster

To delete the Google service account, and the management cluster:

```bash
cd ${MGMT_DIR}
make delete-cluster
```

Note, after deleting the management cluster, all the managed Google Cloud
resources will be kept. You will be responsible for managing them by yourself.

You can create a management cluster to manage them again if you apply the same
cnrm resources. Refer to [Managing and deleting resources - Acquiring an existing resource](https://cloud.google.com/config-connector/docs/how-to/managing-deleting-resources#acquiring_an_existing_resource).
