+++
title = "Install Kubeflow Fairing"
description = "Setting up your Kubeflow Fairing development environment"
weight = 10
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

You can use Kubeflow Fairing to build, train, and deploy machine learning (ML)
models in a hybrid cloud environment directly from Python code or a Jupyter
notebook. This guide describes how to install Kubeflow Fairing in your
development environment for [local development][local], or [development in a
hosted notebook][hosted].

## Using Kubeflow Fairing with Kubeflow notebooks

Kubeflow notebook servers that are built from one of the standard Jupyter
Docker images include Kubeflow Fairing and come preconfigured for using
Kubeflow Fairing to run training jobs on your Kubeflow cluster.

If you use a Kubeflow notebook server that was built from a custom Jupyter
Docker image as your development environment, follow the instruction on
[setting up Kubeflow Fairing in a hosted notebook environment][hosted].  

## Set up Kubeflow Fairing for local development 

Follow these instructions to set up Kubeflow Fairing for local development.
This guide has been tested on Linux and Mac OS X. Currently, this guide has
not been tested on Windows.

### Set up Python

1.  You need **Python 3.6** or later to use Kubeflow Fairing. To check if
    you have Python 3.6 or later installed, run the following command:

    ```bash
    python3 -V
    ```

    The response should be something like this:

    ```
    Python 3.6.5
    ```

    If you do not have Python 3.6 or later, you can [download
    Python](https://www.python.org/downloads/) from the Python Software
    Foundation.

1.  Use virtualenv to create a virtual environment to install Kubeflow
    Fairing in. To check if you have virtualenv installed, run the
    following command: 

    ```bash
    which virtualenv
    ```

    The response should be something like this:

    ```bash
    /usr/bin/virtualenv
    ```

    If you do not have virtualenv, use pip3 to install virtualenv.

    ```bash
    pip3 install virtualenv
    ```

    Create a new virtual environment, and activate it.

    ```bash
    virtualenv venv --python=python3
    source venv/bin/activate
    ```

### Install Kubeflow Fairing

Run the following command to install Kubeflow Fairing in your virtual
environment.

```bash
pip install kubeflow-fairing
```

After the install is complete, the `fairing` python package is
available. Run the following command to verify that Kubeflow Fairing
is installed:

```bash
pip show kubeflow-fairing
```

The response should be something like this:

```
Name: kubeflow-fairing
Version: 0.6.0
Summary: Kubeflow Fairing Python SDK.
Home-page: https://github.com/kubeflow/fairing
Author: Kubeflow Authors
Author-email: hejinchi@cn.ibm.com
License: Apache License Version 2.0
Location: <path-to-kubeflow-fairing>
Requires: notebook, future, docker, tornado, cloudpickle, oauth2client, numpy, requests, setuptools, httplib2, google-auth, google-api-python-client, urllib3, boto3, azure, six, kubernetes, google-cloud-storage
```

### Docker setup

Kubeflow Fairing uses Docker to package your code. Run the following command
to verify if Docker is installed and running:

```bash
docker ps
```

*  If you receive the `docker: command not found` message, [install
   Docker](https://docs.docker.com/install/).
*  If you receive the `Error response from daemon: Bad response from
   Docker engine` message, [restart your docker daemon][docker-start].
*  If you are using Linux and you use sudo to access Docker, follow these
   steps to [add your user to the docker group][docker-non-root]. Note, the
   docker group grants privileges equivalent to the root user. To learn more
   about how this affects security in your system, see the guide to the
   [Docker daemon attack surface][docker-attack].

### Configure Kubeflow Fairing

To configure Kubeflow Fairing with access to an environment that you would like to
use for training and deployment, follow the instructions in the [guide to
configuring Kubeflow Fairing][conf].

## Set up Kubeflow Fairing in a hosted Jupyter notebook 

Follow these instructions to set up Kubeflow Fairing in a hosted Jupyter
notebook. 

If you are using a Kubeflow notebook server that was built from one of the
standard Jupyter Docker images, your notebooks environment has been
preconfigured for training and deploying ML models with Kubeflow Fairing and
no additional installation steps are required.  

### Prerequisites

Check the following prerequisites to verify that Kubeflow Fairing is compatible
with your hosted notebook environment.

1.  In the Jupyter notebooks user interface, click **File** > **New** >
    **Terminal** in the menu to start a new terminal session in your notebook
    environment.
1.  You need **Python 3.6** or later to use Kubeflow Fairing. To check if you
    have Python 3.6 or later installed, run the following command in your
    terminal session:

    ```bash
    python3 -V
    ```

    The response should be something like this:

    ```
    Python 3.6.5
    ```

1.  Kubeflow Fairing uses Docker to package your code. Run the following
    command in your terminal session to verify if Docker is installed and
    running in your notebook environment:

    ```bash
    docker ps
    ```

    *  If you receive the `docker: command not found` message, [install
       Docker](https://docs.docker.com/install/).
    *  If you receive the `Error response from daemon: Bad response from
       Docker engine` message, [restart your docker daemon][docker-start].
    *  If you are using Linux and you use sudo to access Docker, follow these
       steps to [add your user to the docker group][docker-non-root]. Note, the
       docker group grants privileges equivalent to the root user. To learn
       more about how this affects security in your system, see the guide to
       the [Docker daemon attack surface][docker-attack].

### Install Kubeflow Fairing

1.  In the Jupyter notebooks user interface, click **File** > **New** >
    **Terminal** in the menu to start a new terminal session in your notebook
    environment.
1.  Run the following command to install Kubeflow Fairing.

    ```bash
    pip3 install kubeflow-fairing
    ```

    After successful installation, the `fairing` python package should be
    available. Run the following command to verify that Kubeflow Fairing
    is installed:

    ```bash
    pip3 show kubeflow-fairing
    ```

    The response should be something like this:

    ```
    Name: kubeflow-fairing
    Version: 0.6.0
    Summary: Kubeflow Fairing Python SDK.
    Home-page: https://github.com/kubeflow/fairing
    Author: Kubeflow Authors
    Author-email: hejinchi@cn.ibm.com
    License: Apache License Version 2.0
    Location: <path-to-kubeflow-fairing>
    Requires: notebook, future, docker, tornado, cloudpickle, oauth2client, numpy, requests, setuptools, httplib2, google-auth, google-api-python-client, urllib3, boto3, azure, six, kubernetes, google-cloud-storage
    ```

### Configure Kubeflow Fairing

To configure Kubeflow Fairing with access to the environment you would like to
use for training and deployment, follow the instructions in the guide to
[configuring Kubeflow Fairing][conf].

## Next steps

*  [Configure your Kubeflow Fairing development environment][conf] with access
   to run training jobs remotely.
*  Follow the [samples and tutorials][tutorials] to learn more about how to run
   training jobs remotely with Kubeflow Fairing. 

[docker-non-root]: https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user
[docker-attack]: https://docs.docker.com/engine/security/security/#docker-daemon-attack-surface
[docker-start]: https://docs.docker.com/config/daemon/#start-the-daemon-manually
[kubectl-install]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[conf]: /docs/components/fairing/configure-fairing/
[conf-gcp]: /docs/components/fairing/gcp/configure-gcp/
[tutorials]: /docs/components/fairing/tutorials/other-tutorials/
[local]: #set-up-kubeflow-fairing-for-local-development
[hosted]: #set-up-kubeflow-fairing-in-a-hosted-jupyter-notebook
