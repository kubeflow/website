+++
title = "Troubleshooting"
description = "Finding and fixing problems in your Kubeflow Pipelines deployment"
weight = 65
+++

This page presents some hints for troubleshooting specific problems that you
may encounter.

## Diagnosing problems in your Kubeflow Pipelines environment

For help diagnosing environment issues that affect Kubeflow Pipelines, run
the [`kfp diagnose_me` command-line tool](/docs/pipelines/sdk/sdk-overview/#kfp-cli-tool).

The `kfp diagnose_me` CLI reports on the configuration of your local
development environment, Kubernetes cluster, or Google Cloud environment.
Use this command to help resolve issues like the following:

*  Python library dependencies
*  Trouble accessing resources or APIs using Kubernetes secrets
*  Trouble accessing Persistent Volume Claims

To use the `kfp diagnose_me` CLI, follow these steps:

1.  Install the [Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).
1.  Follow the [guide to configuring access to Kubernetes clusters][kubeconfig],
    to update your kubeconfig file with appropriate credentials and endpoint
    information to access your Kubeflow cluster.
    If your Kubeflow Pipelines cluster is hosted on a cloud provider like
    Google Cloud, use your cloud provider's instructions for configuring
    access to your Kubernetes cluster. 
1.  Run the `kfp diagnose_me` command.
1.  Analyze the results to troubleshoot your environment.

[kubeconfig]: https://kubernetes.io/docs/reference/access-authn-authz/authentication/

## Troubleshooting the Kubeflow Pipelines SDK

The following sections describe how to resolve issues that can occur when
installing or using the Kubeflow Pipelines SDK.

### Error: Could not find a version that satisfies the requirement kfp

This error indicates that you have not installed the `kfp` package in your
Python3 environment. Follow the instructions in the [Kubeflow Pipelines SDK
installation guide](/docs/pipelines/sdk/install-sdk/), if you have not already
installed the SDK.

If you have already installed the Kubeflow Pipelines SDK, check that you have
Python 3.5 or higher:

```
python3 -V
```

The response should be something like the following:

```
Python 3.7.3
```

If you do not have Python 3.5 or higher, you can
[download Python](https://www.python.org/downloads/) from the Python
Software Foundation.

### kfp or dsl-compile command not found

If your install the Kubeflow Pipelines SDK with the `--user` flag, you may
get the following error when using the `kfp` or `dsl-compile` command-line
tools.

```
bash: kfp: command not found
```

This error occurs because installing the Kubeflow Pipelines SDK with
`--user` stores `kfp` and `dsl-compile` in your `~/.local/bin` directory.
In some Linux distributions, the `~/.local/bin` directory is not part of the
$PATH environment variable.

You can resolve this issue by using one of the following options:

*  Add `export $PATH=$PATH:~/.local/bin` to the end of your `~/.bashrc` file.
   Then restart your terminal session or run `source ~/.bashrc`.
*  Run the `kfp` and `dsl-compile` commands as `~/.local/bin/kfp` and
   `~/.local/bin/dsl-compile`.
