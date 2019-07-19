+++
title = "End-to-End Pipeline Deployment on Azure"
description = "An end-to-end guide to using the azurepipeline example"
weight = 50
+++

# Introductions
## Overview of Azure and AKS

Microsoft Azure is an open, flexible, enterprise-grade cloud computing platform running on Microsoft infrastructure. The platform has various services, including (SERVICES). 

The [Azure CLI]((https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)) is a set of tools that you can use to interact with Azure from the command line.

Azure Kubernetes Service (AKS) on Azure allows you to deploy containerized applications, within which you describe the resources your application needs, and AKS will manage the underlying resources automatically. This workflow is especially efficient at scale.
##The overall workflow
This guide will take you through using your Kubeflow deployment to build a Machine Learning pipeline on Azure. This guide uses a sample pipeline to detail the process of creating an ML workflow from scratch. You will create and run a pipeline that processes data, trains a model, and then registers and deploys that model as a webservice. 

 To build your pipeline, you must create and build containers using Docker images. The containers are used to abstract the dependencies for each step of the pipeline. The containers can be managed using [Azure's portal](https://ms.portal.azure.com/#home), specifically using the Container Registry to store the containers in the cloud. The containers are then pulled by Kubeflow as they are needed in each step of the pipeline.

By following this guide, you will be able to:

- Set up Kubeflow in an AKS Cluster
- Create and compile a pipeline that can:
	- Preprocess data
	- Train a model
	- Register the model to ACR ([Azure Container Registry](https://docs.microsoft.com/en-us/azure/devops/pipelines/languages/acr-template?view=azure-devops))
	- Profile the model to optimize compute resources in AML (Azure Machine Learning)
	- Deploy the model to AML
- Interact with and customize your deployment
- Test and use your deployed model

When your pipeline is finished, you should be able to see a registered image, model, and deployment in your Azure ML workspace. You will then be able to visit the scoring URI and upload images for scoring in real time.

#Set up your environment
##Download the project files
This tutorial uses the Azure Pipelines example in the Kubeflow examples repo. You can optionally use a pipeline of your own, but several key steps may differ.

Clone the project files and go to the directory containing the [Azure Pipelines (Tacos and Burritos)](https://github.com/kubeflow/examples/tree/master/pipelines) example:
```
git clone https://github.com/kubeflow/examples.git
cd examples/pipelines/azurepipeline
```
As an alternative to cloning, you can download the [Kubeflow examples repository zip file](https://github.com/kubeflow/examples/archive/master.zip).
#Deploy Kubeflow
If you don't already have one, create an Azure account. If you have not used Azure services before, you can recieve up to [1 year of free services and free credits.](https://azure.microsoft.com/en-ca/free/)

> Note: that some of the services used in this guide may not be included in the free services, but can be covered by free credits. 

First, install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest), then follow the instructions in the [guide to deploying Kubeflow on Azure](https://www.kubeflow.org/docs/azure/deploy/install-kubeflow/). 
> Ensure that the agent size you use has the proper memory and storage requirements. For the Azure Pipelines example, **56 GiB** of memory are needed and **premium storage** must be available. Use [this guide](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes) to choose the right agent size for your deployment. (We chose an agent size of Standard_DS13_v2.)
#Configuring Azure Resources
##Create an ML Workspace in Azure
An ML Workspace in Azure is where all of your ML models will be stored and updated. There is also support for managing your active deployments, which will be displayed later in this tutorial.

Go to portal.azure.com and click on your resource group. From there, select the “add a new resource” option. Search for ‘Machine Learning Studio Workspace’ and use the default options, taking note of the name you decide for it. 

![Creating an ML workspace](creatingWS.PNG)
##Create an Azure Container Registry
Go to portal.azure.com and click on your resource group. From there, select the “add a new resource” option. Search for ‘Container Registry’ and add it to your resource group.

Configure your registry by selecting and noting the name you use for it. Enable an admin user, and change the SKU option to ‘Premium’. 
![Create Container Reg](createContainerReg.PNG)
##Create a Persistent Volume Claim
A persistent volumes claim is a dynamically provisioned storage resource attached to a Kubernetes cluster. It is used in the pipeline to store data and files across pipeline steps. 

Using a bash shell, navigate to the azurepipeline directory. Use the following commands to create a persistent volumes claim for your cluster.
```
cd kubernetes
kubectl apply -f pvc.yaml
```

#Authenticate your Service Principal
##Create an App Registration
In the Azure Portal, navigate to [Azure Active Directory](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview). Select "App registrations" and click “New registration”. Name it, noting the name and use the default options. Click “Register”. 
![Create app registration](appReg.PNG)

You should be redirected to your app registration’s dashboard. Select “Overview” from the sidebar. Make note of the “Application (client) ID” and the “Directory (tenant) ID”. The client ID is your service principal username. Save these in a secure location. 
![Client ID location](clientID2.PNG)

Select “Certificates and Secrets” from the sidebar. Select “New client secret”. Give the client secret a description and select how long you would like it to remain active for. Once you click the “Add” button, make sure you take note of the client secret value and save it in a secure place. This is your service principal password.
![Client secret location](password.PNG)
##Add a Role Assignment
Go to your resource group page on the Azure Portal. Select “Access control (IAM)” from the sidebar. Select “Add a role assignment”. Set the role to “Contributor” and search for the name you gave your app registration in the “Select” dropdown. Click “Save”. 
![Role assignment](roleAssign.PNG)

#Creating Containers from Docker Images
##Install Docker
For Windows and WSL: [Guide](https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly)
For other OS: [Docker Desktop](https://hub.docker.com/?overlay=onboarding)
##Build Images
To deploy your code to Kubernetes, you must build your local project’s Docker images and push the containers to your Container Registry so that they are available in the cloud. 

Set the path in Container Registry that you want to push the containers to:
`export REGISTRY_PATH=<REGISTRY_NAME>.azurecr.io`

Run the following command to authenticate your Container Registry: 
`az acr login --name <REGISTRY_NAME>`

Create a version, to be associated with your model each time it runs (change this accordingly):

```export VERSION_TAG=1```

Each docker image will be built and uploaded to the cloud using the Container Registry. 

Note: If you would like to test a container locally, you can use the `docker run -it ${REGISTRY_PATH}<CONTAINER NAME>:$(VERSION_TAG}` before pushing to Container Registry. 

```
//Starting in the 'code' directory of azurepipeline

cd preprocess
docker build . -t ${REGISTRY_PATH}/preprocess:${VERSION_TAG}
docker push ${REGISTRY_PATH}/preprocess:${VERSION_TAG}

cd ../training
docker build . -t ${REGISTRY_PATH}/training:${VERSION_TAG}
docker push ${REGISTRY_PATH}/training:${VERSION_TAG}

cd ../register
docker build . -t ${REGISTRY_PATH}/register:${VERSION_TAG}
docker push ${REGISTRY_PATH}/register:${VERSION_TAG}

cd ../profile
docker build . -t ${REGISTRY_PATH}/profile:${VERSION_TAG}
docker push ${REGISTRY_PATH}/profile:${VERSION_TAG}

cd ../deploy
docker build . -t ${REGISTRY_PATH}/deploy:${VERSION_TAG}
docker push ${REGISTRY_PATH}/deploy:${VERSION_TAG}
```

Once all of the images are pushed successfully, modify the pipeline.py file to use the appropriate image for each pipeline step.

# Running and deploying your pipeline
## Compile
To compile the pipeline, simply open a terminal and navigate to the azurepipeline/code folder. Run the following command to generate a pipeline in the tar.gz format:		
		`python pipeline.py`
## Run & Deploy
Upload the pipeline.tar.gz file to the pipelines dashboard on your Kubeflow deployment.
![Upload pipeline](pipelinedash.PNG)
 
 Create an experiment and then create a run using the pipeline you just uploaded. 
 ![Pipeline inputs](pipelinesInput.PNG)

 The finished pipeline should have five completed steps.
 ![Completed pipeline](finishedRunning.PNG)

## Pushing images for scoring
Once your pipeline has finished successfully, you can visit the Azure portal to find your deployment url. Go to your ML workspace dashboard and select “Deployments” from the sidebar. Click on the most recent deployment. You should see a link under “Scoring URI”. You can whatever method you know best to send a GET/POST request with an image of a taco or a burrito to this url and it should return whether or not the image is of a taco or a burrito. 

The easiest method is to find a url of an image of a taco or a burrito and append it to your scoring url as follows: `<scoring_url>?image=<image_url>`

![Final output](finalOutput.PNG)

# Clean Up Your Azure Environment
When you are done, make sure you delete your resource group to avoid extra charges.

	az group delete -n MyResourceGroup
You can optionally choose to delete individual resources on your clusters using the [Azure cluster docs](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-tutorial-delete-cluster).

# Next Steps
Build your own pipeline using the [Kubeflow Pipelines SDK](https://www.kubeflow.org/docs/pipelines/sdk/sdk-overview/).