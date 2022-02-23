# Migrating from KFServing

### **KFServing is now KServe**
###[Blog Post](https://kserve.github.io/website/0.7/blog/articles/2021-09-27-kfserving-transition/)

We are excited to announce the next chapter for KFServing.
In coordination with the Kubeflow Project Steering Group, the [<u>KFServing GitHub repository</u>](https://github.com/kubeflow/kfserving) has now been
transferred to an independent [<u>KServe GitHub organization</u>](https://github.com/kserve/kserve) under the stewardship of the Kubeflow Serving Working
Group leads.


This doc explains how to migrate existing inference services from KFServing to KServe without downtime.

!!! note 
    The migration job will by default delete the leftover KFServing installation after migrating the inference services from
    `serving.kubeflow.org` to `serving.kserve.io`.

### Migrating from Kubeflow-based KFServing

1. Install Kubeflow-based KServe 0.7 using the [install YAML](https://github.com/kserve/kserve/blob/master/install/v0.7.0/kserve_kubeflow.yaml)
    - This will not affect existing services yet.

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/kserve/kserve/master/install/v0.7.0/kserve_kubeflow.yaml
    ```

2. Run the [KServe Migration YAML](https://github.com/kserve/kserve/blob/master/hack/kserve_migration/kserve_migration_job_kubeflow.yaml) for Kubeflow-based installations
    - This will begin the migration. Any errors here may affect your existing services.

    - If you do not want to delete the KFServing resources after migrating, download and edit the env `REMOVE_KFSERVING`
      in the YAML before applying it 

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/kserve/kserve/master/hack/kserve_migration/kserve_migration_job_kubeflow.yaml
    ```

3. Clean up the migration resources

    ```bash
    kubectl delete ClusterRoleBinding cluster-migration-rolebinding
    kubectl delete ClusterRole cluster-migration-role
    kubectl delete ServiceAccount cluster-migration-svcaccount -n kubeflow 
    ```

4. Update the models web app to use the new InferenceService API group `serving.kserve.io`
    - Change the deployment image to `kserve/models-web-app:v0.7.0-rc0`
    - This is a temporary fix until the next Kubeflow release includes these changes

    ```bash
    kubectl edit deployment kfserving-models-web-app -n kubeflow
    ```

5. Update the cluster role to be able to access the new InferenceService API group `serving.kserve.io`
    - Edit the `apiGroups` from `serving.kubeflow.org` to `serving.kserve.io`
    - This is a temporary fix until the next Kubeflow release includes these changes

    ```bash
    kubectl edit clusterrole kfserving-models-web-app-cluster-role
    ```

### Migrating from standalone KFServing

1. Install KServe v0.7 using the [install YAML](https://github.com/kserve/kserve/releases/download/v0.7.0/kserve.yaml)
    - This will not affect existing services yet.

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/kserve/kserve/master/install/v0.7.0/kserve.yaml
    ```

2. Run the [KServe Migration YAML](https://github.com/kserve/kserve/blob/master/hack/kserve_migration/kserve_migration_job.yaml)
    - This will begin the migration. Any errors here may affect your existing services.

    - If you do not want to delete the KFServing resources after migrating, download and edit the env `REMOVE_KFSERVING`
      in the YAML before applying it 

    - If your KFServing is installed in a namespace other than `kfserving-system`, then download and set the env `KFSERVING_NAMESPACE`
      in the YAML before applying it

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/kserve/kserve/master/hack/kserve_migration/kserve_migration_job.yaml
    ```

3. Clean up the migration resources

    ```bash
    kubectl delete ClusterRoleBinding cluster-migration-rolebinding
    kubectl delete ClusterRole cluster-migration-role
    kubectl delete ServiceAccount cluster-migration-svcaccount -n kserve 
    ```
