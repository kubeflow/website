+++
title = "Create a Custom Jupyter Image"
description = "Creating a custom Docker image for your Jupyter notebook"
weight = 30
+++

This guide tells you how to configure a custom Docker image for your Jupyter
notebook server in Kubeflow.

Your custom image must meet the requirements of the Kubeflow notebook
controller which manages the life cycle of notebooks. The Kubeflow UI expects
Jupyter to start after launching the Docker image with `docker run`. You must
therefore set the default command of your Docker image to launch Jupyter.

Follow these steps to configure your Docker image:

* Set the working directory:

    ```
    --notebook-dir=/home/jovyan
    ```

    The `/home/jovyan`  directory is backed by a 
    [Kubernetes persistent volume (PV)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).

* Allow Jupyter to listen on all IP addresses:

    ```
    --ip=0.0.0.0
    ```

* Allow the user to run the notebook as root:

    ```
    --allow-root
    ```

* Set the port:

    ```
    --port=8888
    ```

* Disable authentication, as Kubeflow takes care of authentication. Use the 
  following setting to allow passwordless access to Jupyter:

    ```
    --NotebookApp.token=''  --NotebookApp.password=''
    ```

* Allow any origin to access your Jupyter notebook server:


    ```
    --NotebookApp.allow_origin='*'
    ```

* Set the base URL. The Kubeflow notebook controller manages the base URL for
  the notebook server using the environment variable called `NB_PREFIX`. Your
  Docker image should define the variable and set the value of `base_url` as
  follows:

    ```
    --NotebookApp.base_url=NB_PREFIX
    ```

Below is an example of what your Dockerfile should contain:


```
ENV NB_PREFIX /

CMD ["sh","-c", "jupyter notebook --notebook-dir=/home/jovyan --ip=0.0.0.0 --no-browser --allow-root --port=8888 --NotebookApp.token='' --NotebookApp.password='' --NotebookApp.allow_origin='*' --NotebookApp.base_url=${NB_PREFIX}"]
```

## Next steps

When starting a Jupyter notebook server from the
Kubeflow UI, specify your custom Docker image. See the guide to [setting up
your Jupyter notebooks](/docs/notebooks/setup/).