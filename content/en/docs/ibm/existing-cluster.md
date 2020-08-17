+++
title = "Initial cluster setup for existing cluster"
description = "Set up a cluster if you already have one"
weight = 5
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

## Initial Setup for Existing Cluster

Get the Kubeconfig file:

	ibmcloud ks cluster config --cluster $CLUSTER_NAME

From here on, please see [Install Kubeflow](/docs/ibm/install-kubeflow).
