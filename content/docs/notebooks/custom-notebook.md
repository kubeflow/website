+++
title = "Create a Custom Jupyter Image"
description = "Creating a custom Docker image for your Jupyter notebook"
weight = 40
+++

You can create your own Jupyter image and use it in your Kubeflow cluster.
When starting a Jupyter notebook server from the Kubeflow UI, you can
specify a custom Docker image. See the guide to 
[setting up your Jupyter notebooks](/docs/notebooks/setup/).


Your custom image needs to meet the requirements created by Kubeflow Notebook Controller. Kubeflow Notebook Controller  manages the life-cycle of notebooks.
 Kubeflow Web UI expects the Jupyer to be launched upon running the docker image with only `docker run`. For that you need to set the default command of your image to launch Jupyter. The Jupyter launch command needs to be set as follows:

* Set the working directory: `--notebook-dir=/home/jovyan`. This is because the folder `/home/jovyan` is backed by Kubernetes Persistent Volume (PV)
* Allow Jupyter to listen on all IPs: `--ip=0.0.0.0`
* Allow the user to run the notebook as root: `--allow-root`
* Set port: `--port=8888`
* Disable authentication. Kubeflow takes care of authentication. Use the following to allow passwordless access to Jupyter: `--NotebookApp.token=''  --NotebookApp.password=''`
* Allow any origin to access your Jupyter: `--NotebookApp.allow_origin='*'`
* Set base_url: Kubeflow Notebook Controller manages the base URL for the notebook server using the environment variable called `NB_PREFIX`. Your should define the variable in your image and set the value of `base_url` as follows: `--NotebookApp.base_url=NB_PREFIX`

As an example your Dockerfile should contain the following:


```
ENV NB_PREFIX /

CMD ["sh","-c", "jupyter notebook --notebook-dir=/home/jovyan --ip=0.0.0.0 --no-browser --allow-root --port=8888 --NotebookApp.token='' --NotebookApp.password='' --NotebookApp.allow_origin='*' --NotebookApp.base_url=${NB_PREFIX}"]
```