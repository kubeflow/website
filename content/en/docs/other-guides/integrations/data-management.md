+++
title = "Data Management"
description = "Integrating Kubeflow with Rok for data versioning, packaging, and secure sharing"
weight = 10
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


Since a data scientist can build hundreds of different variants of their models,
the ability to quickly create new models and save the code and data of each
version is critical for faster iterations and better models. Automating
workflows and keeping track of the machine learning (ML) code, packages,
libraries, data sets and artifacts for each ML pipeline step requires integrated
data management systems and processes. 

As a leading contributor to Kubeflow, Arrikto incorporates its standards-based,
scale-out storage and data management solution (Rok) with Kubeflow. Arrikto's
Rok presents a Kubernetes storage class to Kubeflow and natively integrates with
the critical Kubeflow components. Rok’s native integration simplifies
operations, boosts performance, and enables best practices for efficient data
versioning, packaging, and secure sharing across teams and cloud boundaries.

The screenshot below shows the **Snapshot Store** option that Rok adds to the
left-hand navigation panel in the Kubeflow UI:

<img src="/docs/images/snapshot-store-in-kubeflow-ui.png" 
  alt="Accessing the snapshot store from the Kubeflow UI"
  class="mt-3 mb-3 border border-info rounded">

To experience the value of Kubeflow and Rok, follow this 
[hands-on tutorial](http://g.co/codelabs/kubeflow-minikf-kale).
