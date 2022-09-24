+++
title = "Install Kubeflow on Civo Cloud"
description = "How to deploy Kubeflow on a Civo Cloud cluster"
weight = 4
                    
+++

Through this tutorial, I will show you how you can leverage Civo marketplace to single click deploy Kubeflow or using the Civo CLI to deploy Kubeflow on Civo Cloud.

## Instakll Kubeflow using the UI

You can also use an existing cluster you have in the same way but for this article, I will walk you through creating a new cluster and installing Kubeflow.

You can easily create a new cluster from the Civo dashboard. In this example I created a cluster with 4 nodes each of the size "Stanndard Large".

<img src="/docs/images/civo/create-cluster.png">

By default, Civo installs the Traefik-v2-nodeport and metrics-server application in a cluster you create. You should now select Kubeflow from the list of applications you are prompted to install when creating a cluster.

Now simply click "Create Cluster".

This process will take longer than standard cluster creation since it needs to deploy multiple Kubernetes resources to install Kubeflow.

Once your clusters created, it could take a while for all the newly created Pods to reach the running state. At this stage, you should make sure all Pods are ready, which can be done by running the following commands after connecting with the Kubernetes cluster:

```sh
kubectl get pods -n cert-manager
kubectl get pods -n istio-system
kubectl get pods -n auth
kubectl get pods -n knative-eventing
kubectl get pods -n knative-serving
kubectl get pods -n kubeflow
kubectl get pods -n kubeflow-user-example-com
```

Once your pods are all running, you are all set to use Kubeflow! On the Civo dashboard you will see a Load Balancer named `<CLUSTER_NAME>--istio-system-istio-ingressgateway`. You should be able to access the Kubeflow dashboard using the DNS name Civo assigns it.

Once you use the DNS name and use the default username `user@example.com` and default password `12341234`, you will be able to access your Kubeflow Central dashboard.

## Install Kubeflow using the CLI

If you plan to use the Kubeflow marketplace app using the Civo CLI, I would first recommend you go through [this documentation](https://www.civo.com/learn/kubernetes-cluster-administration-using-civo-cli), highlighting how you can use the Civo CLI.

Running the following command creates the same cluster as we created with the UI, and installs the Kubeflow application:

```sh
civo kubernetes create kubeflow --size=g3.k3s.large --nodes=4 --applications=kubeflow --wait
```

Once you do so, you can connect to your Kubernetes cluster using:

```sh
civo kubernetes config kubeflow --save
```

Once your cluster is created, it could take a little while for all the newly created Pods to come to the running state. You should make sure all Pods are ready, to check that all Kubeflow-related Pods are ready, run the following commands:

```sh
kubectl get pods -n cert-manager
kubectl get pods -n istio-system
kubectl get pods -n auth
kubectl get pods -n knative-eventing
kubectl get pods -n knative-serving
kubectl get pods -n kubeflow
kubectl get pods -n kubeflow-user-example-com
```

Now that your pods are running, you are all set to use Kubeflow. You should run the following:

```sh
kubectl get svc -n istio-system istio-ingressgateway
```

This command gives you the external IP for the istio-ingressgateway Load Balancer. This will allow you to access the Kubeflow dashboard using the external IP. Once you use the external IP and use the default username `user@example.com` and default password `12341234`, you will be able to access your Kubeflow Central dashboard.