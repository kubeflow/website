+++
title = "Why Kubeflow in your Infrastructure?"
description = "Answering the 'why' about Kubeflow in an organization's Infrastructure."
weight = 20
publishDate = 2018-11-09T02:00:00+01:00
draft = false
+++

![Figure 1: Premise of Kubeflow is that ML products are complex distributed systems involving multiple components working together.](../kubeflow_in_infra_premise.png)

*Figure 1: Premise of Kubeflow is that ML products are complex distributed systems involving multiple components working together.*

CEOs and CTOs are being challenged by customers, analysts and investors to define how Artificial Intelligence and Machine Learning will impact their revenues and costs. The leading research and development organizations are quickly migrating to open source machine learning frameworks, especially those that take advantage of the operational and infrastructure efficiencies provided by containers, microservices and [Kubernetes](https://kubernetes.io/). This trend is demonstrated in a recent [451 Research survey](https://www.zdnet.com/article/kubernetes-leads-container-orchestration/) which found that over 70% of enterprise organizations surveyed are using Kubernetes. GitHub has over [95M projects](https://octoverse.github.com/projects), and Kubernetes and Tensorflow are frequently in the top 10 projects, in terms of contributors, discussions, forks, and reviews. With an ever increasing availability of data and compute power, machine learning is turning out to be a powerful tool to solve various problems and helping achieve state of the art results. In such interesting times, [Kubeflow](https://www.kubeflow.org/) has grown very quickly to be one of the most promising ML toolkits in the cloud native open source world.

We at [Cliqz](http://cliqz.com/en/) (a privacy focussed web browser with built-in web search operational in ~7 countries) are also solving some of the most complex problems around user privacy and web search using self managed Kubernetes ([kops](https://github.com/kubernetes/kops)) on AWS. Since January 2017, we started our cloud native journey and have been building Web Search solutions using Kubernetes. Since December 2017, the Search-Recency system has been in production, helping us towards near-real time index updates leading to most recent and up-to-date search results. To solve this problem at that scale, we heavily use Machine Learning, Natural Language Processing, Deep Learning and core Information Retrieval techniques which led us to explore Kubeflow. We are currently evaluating Kubeflow as a general alternative to our custom ML workflow. We would like to present some initial assessments and how Kubeflow might work well for one’s k8s infrastructure, as follows:

### Know Thy Users

It’s important that the target audience which would be interested in Kubeflow should be  looked up closely. Most organizations which have an established infrastructure might be reluctant to even move to kubernetes. For example, it took a good amount of time for most teams to migrate to Terraform based deployments and because of this investment in time, switching to kubernetes is sometimes not appreciated. For a cloud native strategy where Kubernetes is preferred, Kubeflow becomes a good candidate for deploying and working with ML components. This brings to light, the following types of teams who can potentially be interested: 

*   A team (within an organization) starting out their cloud native journey with K8s, who might want to leverage the consistency offered by Kubeflow for ML workloads for new projects.
*   A very early stage startup which has started out with K8s as base.
*   Teams interested in ML at Scale and want to ease deployment of existing multiple services and reduce management of resources by switching to kubeflow and k8s. 
*   Research Teams / Institutes who want to minimize the complexity of managing an infrastructure for a data scientist or a researcher and instead provide a clean and consistent interface  which eases setting things up using a few clicks.  
*   Teams interested in on-premise / multi-cloud deployments where there is no service offered which can provide a consistent experience.
    
### Consistency in Infrastructure

One of the greatest advantage using a k8s based deployment is the consistency and features offered out of the box. Often times each new service tries to implement the same fundamental requisites: monitoring, health checks, replication etc. Kubeflow provides a native way to extend the same features to an organization’s ML needs. This is particularly useful to augment existing services without rewriting deployments from scratch. Having Kubeflow in the organization means one needs to worry more on the problem at hand and less worry about how to set things up and manage it over time. 

### Multiple Use Cases

* Team is researching a problem which can be solved with an ML technique. They just can focus on the problem and not on the infrastructure. A Jupyter Notebook pinned to a GPU instance or a cluster abstracts this out cleanly. Several Researchers can work on shared notebooks and also use the same data backends instead of copying the data over to individual instances.
* Road to production for ML projects is simplified. The end to end solution offered in Kubeflow helps to productionize an ML model in the fastest way. This allows a team of researchers to finish testing a model for accuracy on a Jupyter Notebook, Build a continuous data pipeline to keep this model updated via argo and then test production workloads using Serving / Seldon.
* [Katib](https://github.com/kubeflow/katib) can be a central solution for hyper parameter tuning across several applications. Hyperparameter optimization is one of the most underappreciated yet most important aspects of machine learning. Katib provides the ground framework to extend this to multiple applications and have a shared view of this tuning with historical data. For example, [Hyperopt](https://github.com/hyperopt/hyperopt) is a python library for such optimizations, but it largely is limited to only the scope of the project. For an organization where multiple teams and services are backed by ML they can leverage the common interface which Katib provides to learn more complex but powerful optimizations which can significantly impact the product at large. Also having an infrastructure leads to more teams trying out implementing some solution which can leverage the benefits offered via such optimization.
* With multiple frameworks being supported ([Tensorflow](https://www.tensorflow.org/), [PyTorch](https://pytorch.org/) and [Mxnet](https://mxnet.apache.org/)), writing a distributed training or serving application ([TFServing](https://www.tensorflow.org/serving/) or [Seldon](https://www.seldon.io/)) becomes a lot more easier. 

### Onboarding ease

It becomes easier to onboard a new developer and a researcher to introduce him to a single cloud independent platform. One can provide templates for deployment based on tasks, which can be easily scheduled on low cost infrastructure as compared to starting instances for test applications. Even for ML workloads, the researcher or a research engineer can abstract the use-case effectively without worrying about underlying cloud deployment.  
Secure and Better control over Infrastructure 
In an organization, moving towards K8s, helps to standardize some processes. Not only one can make the infrastructure more secure, but can also achieve better control over the same.


**We would also like to highlight some requested features (currently missing) for an enterprise rollout.** 

### Billing of cloud resources per pod / service

Currently, when using a cloud provider one is billed per instance or resource used. If the resources are properly tagged the billing works perfectly. Most teams and organizations use this information for cost assessments per project or per team and also view this as an opportunity to minimize costs wherever possible. In a Kubernetes based world, this slightly changes. Its highly likely that on the same base instance a number of other pods are scheduled and this may mean that the resources are shared by teams or projects. Now this helps with resource utilization but it also means we do not have a view of the resource usage per project. In ideal world, teams can be charged on average, but this may not work in practice as its highly likely the resource utilization varies.

### Conformance with other package managers (Ex. Helm)

We use Helm for almost all our package management needs. With features like templating, release management, upgrades and rollback. It forms the backbone of how we deploy our services and even core addons on our k8s cluster. We operate multiple clusters, spread across various regions / availability zones, housing production, staging and dev workloads. Helm allows us to schedule workloads on these clusters seamlessly by utilizing its decent templating support. When working with Kubeflow, Helm is not supported by default. Although, [ksonnet](https://ksonnet.io/) is feature rich, using it means that we break our tried and tested helm workflow. The rationale of choosing helm was its popularity (CNCF Project, 7800+ Stars, 382 Contributors), incredible community support and public chart store which provides a good starting point to install packages into K8s cluster with ease. This speeds up initial development, as one can easily modify charts / inject values and get an enterprise grade deployment ready in limited time, geared towards ones organisation practices. We believe that a lot of teams using k8s might have the same mindset and a proper helm support for Kubeflow might be of interest to many.  

### Resource utilization by the Training / Serving modules

There is a need to understand the amount of compute resources being used by a said workload inside a k8s cluster. Can a deep learning training task using some GPU / Memory / CPU, can allow another task (e.g. Serving) to be allocated on the same GPU / node pools. Shared allocation requires continuous monitoring/probing of resources that should result in useful metrics, which can be used to gauge infrastructure scaling events and cost estimations. 

### Configurable tear down of Infrastructure after use

An interesting theme, common to all teams as described before is cost control. Large or small organizations alike would like to only pay for infrastructure, till its useful. Which means if cloud instances / resources are not used anymore then its best to shut them down. Since cloud infrastructure is not directly tied to the lifecycle of the service, even after a training job (TFJob) finishes, the instances are left idle. This might incur unnecessary cost to an organization. Also native solution around scheduled downscaling of Serving Infrastructure during low RPS or using spot instances (targeted instance choices) for marginal redundancy can help significantly in cost reduction. These use-cases are common to a K8s app and we can write custom auto-scalers and/or bring about improvements to upstream auto-scalers to ease Kubeflow adoption significantly.

We truly believe that Kubernetes is the tool to truly democratize big data and AI. Toolkits like Kubeflow really reinforces the dream where running AI tasks and serving them is not just limited to a handful of organizations but it is easily accessible to everyone. We would like to continue our efforts towards exploring Kubeflow, as we plan to ship it in our production cluster soon. Feel free to reach out to us with your questions or comments here: 

*Ankit Bahuguna (ankit@cliqz.com; [Linkedin](https://www.linkedin.com/in/ankitbahuguna/))*, 
*Faheem Nadeem (faheem@cliqz.com; [Linkedin](https://www.linkedin.com/in/faheemnadeem/))* 
[Software Engineer, Cliqz GmbH]

