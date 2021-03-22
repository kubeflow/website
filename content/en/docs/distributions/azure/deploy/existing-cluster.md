+++
title = "Initial cluster setup for existing cluster"
description = "Set up a cluster if you already have one"
weight = 5
                    
+++
## Initial Setup for Existing Cluster

Get the Kubeconfig file:

	az aks get-credentials -n <NAME> -g <RESOURCE_GROUP_NAME>

From here on, please see [Install Kubeflow](/docs/azure/deploy/install-kubeflow).
