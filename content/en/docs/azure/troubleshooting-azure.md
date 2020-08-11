+++
title = "Troubleshooting Deployments on Azure AKS"
description = "Help diagnose and fix issues you may encounter in your Kubeflow deployment"
weight = 100
                    
+++
### Jupyter Notebook ‘is not a valid page’ when accessing notebook
Restarting the ambassador pods will often fix this issue:
`kubectl delete pods -l service=ambassador`

### The client does not have authorization to perform action...
This is likely an issue with ensuring your subscriptions are correctly setup. To fix the issue, list your subscriptions and then change the active subscription.

```
#list subscription 
az account list --output table 

#change the active subscription 
az account set --subscription "My Demos"
```
