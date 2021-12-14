+++
title = "Enterprise Kubeflow on D2iQ Kaptain"
description = "Enterprise Kubeflow distribution for day-2 operations"
weight = 50
+++

<a href= "https://d2iq.com/products/kaptain">Kaptain</a> is D2iQ’s enterprise end-to-end machine learning platform that provides a notebooks-first approach for data scientists. It runs on top of <a href="https://d2iq.com/kubernetes-platform">DKP</a>, D2iQ’s enterprise Kubernetes platform, bringing models from prototype to production faster. 
- *SDK*: The Kaptain SDK is a Python API that abstracts away underlying Kubernetes details, allowing data scientists to focus on building, tuning, and deploying models. The Jupyter Notebooks that data scientists use are pre-installed with many top libraries such as SciPy and Keras, and with frameworks such as PyTorch and Tensorflow. The SDK is released independently of Kaptain. 
- *Multi-tenancy*: Kaptain is built for security, scale, and speed. Kaptain supports multi-tenancy with fine-grained role-based access control (RBAC), as well as authentication, authorization, and end-to-end encryption with Dex and single sign-on with Istio. Administrators can manage access across namespaces and configure access to data volumes that users can mount directly in their notebooks.
- *Resource Monitoring*: The Kaptain UI displays the resource consumption of notebooks, jobs, experiments, and deployments in a single dashboard so data scientists can monitor their resource usage.
- *Training Progress*: Additionally, Kaptain is integrated with TensorBoard to visually track model training progress, analyze model fairness and feature importance, and debug issues with architecture or code in individual nodes. 
- *Infrastructure Support*: Kaptain is supported in public cloud, on-premise, or hybrid environments and can also be deployed in air-gapped environments. Kaptain has out-of-the-box GPU support, and is certified on Nvidia’s DGX platform and can be deployed in HPC (high performance computing) clusters. Kaptain is tested and “soaked,” or run with a heavy load for a certain duration, to validate the performance and stability of the system on different infrastructures.
- *End-to-End Expert Support*: From basic to robust, D2iQ offers Premium and Signature support options with 24x7x365 coverage and some of the strongest SLAs in the industry to ensure that your business and machine learning initiatives have the advanced support and response time they need. Our documentation also offers notebook tutorials to help support anyone new to Kubeflow.
