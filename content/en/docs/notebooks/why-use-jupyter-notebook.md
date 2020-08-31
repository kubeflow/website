+++
title = "Overview of Jupyter Notebooks in Kubeflow"
description = "Why use Jupyter notebooks in Kubeflow"
weight = 5
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

{{% stable-status %}}

There are multiple benefits of integrating Jupyter notebooks in Kubeflow for enterprise environments. These benefits include:

* Integrating well with the rest of the infrastructure with respect to authentication and access control.
* Enabling easier notebook sharing across the organization. Users can create notebook containers or pods directly in the cluster, rather than locally on their workstations. Admins can provide standard notebook images for their organization, and set up role-based access control (RBAC), Secrets and Credentials to manage which teams and individuals can access the notebooks.

When you bundle Jupyter notebooks in Kubeflow, you can use the Fairing library to submit training jobs using TFJob. The training job can run single node or distributed on the same Kubernetes cluster, but not inside the notebook pod itself. Submitting the job with the Fairing library makes processes like Docker containerization and pod allocation clear for data scientists.

Overall, Kubeflow-hosted notebooks are better integrated with other components while providing extensibility for notebook images.

## Next steps

* Learn more about [setting up notebooks](/docs/notebooks/setup/).
