+++
title = "Uninstall Kubeflow"
description = "Instructions for uninstalling Kubeflow"
weight = 20
                    
+++

Uninstall Kubeflow on your IBM Cloud IKS cluster.

1. Go to your Kubeflow deployment directory where you download the
   IBM manifests repository: https://github.com/IBM/manifests.git
   ```shell
   cd ibm-manifests-150
   ```

2. Run the following command to get Kubeflow Profiles:
   ```shell
   kubectl get profile
   ```

3. Delete all Kubeflow Profiles manually:
   ```shell
   kubectl delete profile --all
   ```
   Use the following command to check all namespaces for Kubeflow Profiles
   are removed properly:
   ```
   kubectl get ns
   ```
   Make sure no namespace is in the `Terminating` state.


4. Remove Kubeflow:

   For single-user deployment:
   ```shell
   kustomize build iks-single | kubectl delete -f -
   ```

   For multi-user deployment:
   ```shell
   kustomize build iks-multi | kubectl delete -f -
   ```
