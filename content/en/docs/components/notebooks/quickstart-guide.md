+++
title = "Quickstart Guide"
description = "Getting started with Kubeflow Notebooks"
weight = 10
                    
+++

## Summary

1. Install Kubeflow by following [Getting Started - Installing Kubeflow](/docs/started/installing-kubeflow/).
2. Open the Kubeflow [Central Dashboard](/docs/components/central-dash/) in your browser.
3. Click __"Notebooks"__ in the left-hand panel.
4. Click __"New Server"__ to create a new notebook server.
5. Specify the configs for your notebook server.
6. Click  __"CONNECT"__ once the notebook has been provisioned

## Detailed Steps

1. Open the Kubeflow [Central Dashboard](/docs/components/central-dash/) in your browser.

2. Select a Namespace:
    - Click the namespace dropdown to see the list of available namespaces.
    - Choose the namespace that corresponds to your Kubeflow Profile.
      (See the page on [profiles and namespaces](/docs/components/central-dash/profiles/) for more information)

   <img src="/docs/images/notebooks-namespace.png"
   alt="Selecting a Kubeflow namespace"
   class="mt-3 mb-3 border rounded">

3. Click __"Notebook Servers"__ in the left-hand panel:

   <img src="/docs/images/jupyterlink.png"
   alt="Opening notebooks from the Kubeflow UI"
   class="mt-3 mb-3 border rounded">

4. Click __"New Server"__ on the __"Notebook Servers"__ page:

   <img src="/docs/images/add-notebook-server.png"
   alt="The Kubeflow notebook servers page"
   class="mt-3 mb-3 border rounded">

5. Enter a __"Name"__ for your notebook server.
    - The name can include letters and numbers, but no spaces.
    - For example, `my-first-notebook`.

   <img src="/docs/images/new-notebook-server.png"
   alt="Form for adding a Kubeflow notebook server"
   class="mt-3 mb-3 border rounded">

6. Select a Docker __"Image"__ for your notebook server
    - __Custom image__: If you select the custom option, you must specify a Docker image in  the form `registry/image:tag`.
      (See the guide on [container images](/docs/components/notebooks/container-images/).)
    - __Standard image__: Click the __"Image"__ dropdown menu to see the list of available images.
      (You can choose from the list configured by your Kubeflow administrator)

7. Specify the amount of __"CPU"__ that your notebook server will request.

8. Specify the amount of __"RAM"__ that your notebook server will request.

9. Specify a __"workspace volume"__ to be mounted as a PVC Volume on your home folder.

10. *(Optional)* Specify one or more __"data volumes"__ to be mounted as a PVC Volumes.

11. *(Optional)* Specify one or more additional __"configurations"__
    - These correspond to [PodDefault resources](https://github.com/kubeflow/kubeflow/blob/master/components/admission-webhook/README.md) which exist in your profile namespace.
    - Kubeflow matches the labels in the __"configurations"__ field against the properties specified in the PodDefault manifest.
    - For example, select the label `add-gcp-secret` in the __"configurations"__ field to match to a PodDefault manifest containing the following configuration:
    ```yaml
    apiVersion: kubeflow.org/v1alpha1
    kind: PodDefault
    metadata:
      name: add-gcp-secret
      namespace: MY_PROFILE_NAMESPACE
    spec:
     selector:
      matchLabels:
        add-gcp-secret: "true"
     desc: "add gcp credential"
     volumeMounts:
     - name: secret-volume
       mountPath: /secret/gcp
     volumes:
     - name: secret-volume
       secret:
        secretName: gcp-secret
    ```

12. *(Optional)* Specify any __"GPUs"__ that your notebook server will request.
    - Kubeflow uses "limits" in Pod requests to provision GPUs onto the notebook Pods
      (Details about scheduling GPUs can be found in the [Kubernetes Documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/).)

13. *(Optional)* Specify the setting for __"enable shared memory"__.
    - Some libraries like PyTorch use shared memory for multiprocessing.
    - Currently, there is no implementation in Kubernetes to activate shared memory.
    - As a workaround, Kubeflow mounts an empty directory volume at `/dev/shm`.

14. Click __"LAUNCH"__ to create a new Notebook CRD with your specified settings.
    - You should see an entry for your new notebook server on the __"Notebook Servers"__ page
    - There should be a spinning indicator in the __"Status"__ column.
    - It can take a few minutes for kubernetes to provision the notebook server pod.
    - You can check the status of your Pod by hovering your mouse cursor over the icon in the __"Status"__ column.

15. Click __"CONNECT"__ to view the web interface exposed by your notebook server.

    <img src="/docs/images/notebook-servers.png"
    alt="Opening notebooks from the Kubeflow UI"
    class="mt-3 mb-3 border rounded">

## Next steps

- Learn how to create your own [container images](/docs/components/notebooks/container-images/).
- Review examples of using [jupyter and tensorflow](/docs/components/notebooks/jupyter-tensorflow-examples/).
- Visit the [troubleshooting guide](/docs/components/notebooks/troubleshooting) to fix common errors.
