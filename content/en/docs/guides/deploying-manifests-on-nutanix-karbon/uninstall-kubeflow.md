+++
title = "Uninstall Kubeflow"
description = "How to uninstall Kubeflow from a Nutanix Karbon cluster"
weight = 6

+++

## Uninstall Kubeflow
To delete a Kubeflow installation, apply the following command from your terraform script folder

   ```
   terraform destroy -var-file=env.tfvars
   ```
