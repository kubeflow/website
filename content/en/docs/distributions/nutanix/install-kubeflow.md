+++
title = "Install Kubeflow on Nutanix Karbon"
description = "How to deploy Kubeflow on a Nutanix Karbon cluster"
weight = 4
                    
+++

## Prerequisites


* Make sure you first create a Kubernetes cluster using Nutanix Karbon. See [Nutanix Karbon documentation](https://portal.nutanix.com/page/documents/details?targetId=Karbon-v2_2:kar-karbon-deploy-karbon-t.html) at the Nutanix Support Portal. 

* Install [Terraform](https://www.terraform.io/downloads.html) based on your platform

* Install kubectl from [Install Tools](https://kubernetes.io/docs/tasks/tools/#kubectl)

* Download [Kubeconfig](https://portal.nutanix.com/page/documents/details?targetId=Karbon-v2_2:kar-karbon-download-kubeconfig-t.html) of your deployed Karbon cluster. 


## Installing Kubeflow

Do these steps to deploy Kubeflow 1.3 on your Karbon cluster.

1. Download the terraform script to deploy kubeflow on Nutanix Karbon by cloning the Github repository shown.

   ```
   git clone https://github.com/nutanix/karbon-platform-services.git
   cd automation/infrastructure/terraform/kcs/install_kubeflow
    
   ```

2. Create `env.tfvars` file in the same folder with the following cluster variables. Override other variables from variables.tf file if required.

   ```
   prism_central_username = "enter username"
   prism_central_password = "enter password"
   prism_central_endpoint = "enter endpoint_ip_or_host_fqdn"
   karbon_cluster_name    = "enter karbon_cluster_name"
   kubeconfig_filename    = "enter karbon_cluster_name-kubectl.cfg"
   kubeflow_version       = "1.3.0"
   ```

3. Apply terraform commands to deploy Kubeflow in the cluster.  

   ```
   terraform init
   terraform plan --var-file=env.tfvars
   terraform apply --var-file=env.tfvars
   ```

4. Make sure all the pods are running before continuing to the next step.

   ```
   $ kubectl -n kubeflow get pods

   NAME                                                         READY   STATUS    RESTARTS   AGE
   admission-webhook-deployment-65dcd649d8-468g9                1/1     Running   0          3m39s
   cache-deployer-deployment-6b78494889-6lfg9                   2/2     Running   1          3m1s
   cache-server-bff956474-lm952                                 2/2     Running   0          3m
   centraldashboard-6b5fb79878-h9dqn                            1/1     Running   0          3m40s
   jupyter-web-app-deployment-75559c6c87-mt4q2                  1/1     Running   0          3m1s
   katib-controller-79f44b76bb-t7rzl                            1/1     Running   0          3m
   katib-db-manager-6d9857f658-p4786                            1/1     Running   0          2m59s
   katib-mysql-586f79b694-2qcl5                                 1/1     Running   0          2m59s
   katib-ui-5fdb7869cf-jmssr                                    1/1     Running   0          3m
   kfserving-controller-manager-0                               2/2     Running   0          3m15s
   kubeflow-pipelines-profile-controller-6cfd6bf9bd-cptgg       1/1     Running   0          2m59s
   metacontroller-0                                             1/1     Running   0          3m15s
   metadata-envoy-deployment-6756c995c9-gqkbd                   1/1     Running   0          3m
   metadata-grpc-deployment-7cb87744c7-4crm9                    2/2     Running   3          3m40s
   metadata-writer-6bf5cfd7d8-fgq9f                             2/2     Running   0          3m40s
   minio-5b65df66c9-9z7mg                                       2/2     Running   0          2m59s
   ....

   ```

## Add a new Kubeflow user

New users are created using the Profile resource. A new namespace is created with the same Profile name. For creating a new user with email `user@example.com` in a namespace `project1`, apply the following profile

   ```
   cat <<EOF | kubectl apply -f -
   apiVersion: kubeflow.org/v1beta1
   kind: Profile
   metadata:
       name: project1   # replace with the name of profile you want, this will be the user's namespace name
   spec:
       owner:
           kind: User
           name: user2@example.com   # replace with the user email
   EOF
   ``` 
    
If you are using basic authentication, add the user credentials in dex which is the default OpenId Connect provider in Kubeflow. Generate the hash by using bcrypt (available at https://bcrypt-generator.com) in the following configmap
 
    
   ```
   kubectl edit cm dex -o yaml -n auth
   ```

Add the following  under staticPasswords section
    
   ```
   - email: user2@example.com
     hash: <hash>
     username: user2
   ```


### Access Kubeflow Central Dashboard

The default way to access Kubeflow Central Dashboard is by using Port-Forward. You can port forward the istio ingress gateway to local port 8080.
    
   ```
   kubectl --kubeconfig=<karbon_k8s_cluster_kubeconfig_path> port-forward svc/istio-ingressgateway -n istio-system 8080:80
   ```
    
You can now access the Kubeflow Central Dashboard at http://localhost:8080. At the Dex login page, enter user credentials that you previously created.
    
 
For accessing through NodePort, you need to configure HTTPS. Create a certificate using cert-manager for your Worker node IP in your cluster. Add HTTPS to kubeflow gateway as given in [Istio Secure Gateways](https://istio.io/latest/docs/tasks/traffic-management/ingress/secure-ingress/). Then access your cluster at
   
   ```
   https://<worknernode-ip>:<https-nodeport>
   ```
