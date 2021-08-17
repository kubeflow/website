+++
title = "Integrate with Nutanix Storage"
description = "How to integrate Nutanix Storage in Kubeflow"
weight = 5

+++

## Nutanix Objects in Kubeflow Pipeline

You can use standard s3 boto api to upload and download objects from a Kubeflow Pipeline. See [Nutanix Objects Docs](https://portal.nutanix.com/page/documents/details?targetId=Objects-v3_2:Objects-v3_2) for more details on creating object store and buckets.

   ```
   import boto3

   bucket_name="ml-pipeline-storage"
   object_name="models"
   object_store_access_key_id="<key_id>"
   object_store_secret_access_key="<access_key>"
   host="http://<Nutanix Objects Store Domain Name>"
   region_name='us-west-1'
   s3_client = boto3.client(
                    's3',
                    endpoint_url=host,
                    aws_access_key_id=object_store_access_key_id,
                    aws_secret_access_key=object_store_secret_access_key,
                    region_name=region_name,
                    verify=False)
   response = s3_client.upload_file(f'./test_upload_data.txt', bucket_name, object_name)
   ```

## Nutanix Volumes in Kubeflow Pipeline

Nutanix volumes are created with the default storage class configured in the Karbon cluster. See [Default Storage Class](https://portal.nutanix.com/page/documents/details?targetId=Karbon-v2_2:kar-karbon-storage-class-r.html) of Nutanix Karbon for more details about creating storage classes.

   ```
   vop = dsl.VolumeOp(
      name="Create a volume to share data between stages on Nutanix Volumes",
      resource_name="data-volume",
      size="1Gi",
      modes=dsl.VOLUME_MODE_RWO)
   ```

## Nutanix Files in Kubeflow Pipeline
    
   Create a storage class to dynamically provision Nutanix File shares. See [Files Storage Class](https://portal.nutanix.com/page/documents/details?targetId=CSI-Volume-Driver-v2_3:csi-csi-plugin-manage-dynamic-nfs-t.html) of Nutanix Karbon for more details on creating storage classes for dynamic NFS Share provisioning with Nutanix Files.
   Once storage class is setup, you can use `VolumeOp` operation to create volume on Nutanix Files.
    
   ```
   vop = dsl.VolumeOp(
      name="Create a volume to share data between stages on Nutanix Files",
      resource_name="data-volume",
      size="1Gi",
      modes=dsl.VOLUME_MODE_RWM,
      storage_class="files-sc")
   ```
