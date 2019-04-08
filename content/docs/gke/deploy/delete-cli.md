+++
title = "Delete using CLI"
description = "Instructions for deleting Kubeflow using the command line interface (CLI)"
weight = 5
+++

Run the following commands to delete your deployment and reclaim all resources:

```
cd ${KFAPP}
# If you want to delete all the resources, including storage.
kfctl delete all --delete_storage
# If you want to preserve storage, which contains metadata and information
# from mlpipeline.
kfctl delete all
```

You should consider preserving storage if you may want to relaunch
Kubeflow in the future and restore the data from your pipelines.