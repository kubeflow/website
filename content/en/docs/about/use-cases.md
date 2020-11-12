+++
title = "Use Cases"
description = "Reasons for using Kubeflow"
weight = 1
aliases = ["/docs/", "/docs//", "/docs/usecases/"]
                    
+++

The end goal of every organization that utilizes machine learning (ML) is to have
their ML models successfully run in production and generate value to the
business. But what does it take to reach that point?

Before a model ends up in production, there are potentially many steps required
to build and deploy an ML model: data loading, verification, splitting,
processing, feature engineering, model training and verification, hyperparameter
tuning, and model serving.

In addition, ML models can require more observation than traditional
applications, because your data inputs can drift over time. Manually rebuilding
models and data sets is time consuming and error prone.

To simplify these requirements and challenges, we created Kubeflow.

## Deploying and managing a complex ML system at scale

Kubeflow is a scalable, portable, distributed ML platform that runs on
Kubernetes. This means that all capabilities of Kubernetes are available to a
Kubeflow user. With Kubeflow, you can manage the entire AI organization at scale
and still be able to maintain the same quality of control.

Kubeflow and Kubernetes provide consistent and efficient operations and
optimized infrastructure. Your researchers can have more time to focus on the
valuable tasks of developing domain specific intellectual property rather than
debugging DevOps configuration issues.

Kubeflow’s core and ecosystem critical user journeys (CUJs) provide software
solutions for end-to-end workflows: build, train and deploy and/or develop a
model and create, run and explore a pipeline.

## Experimentation with training an ML model

Rapid experimentation is critical to building high quality machine learning
models quickly. Kubeflow offers a user-friendly interface (UI) that allows you
to track and compare experiments. You can decide later on which experiment was
the best and use it as a main source for your future steps.

In addition, Kubeflow 1.1 provides stable software sub-systems for model
training, such as Jupyter notebooks and popular ML training operators—
TensorFlow and PyTorch that run efficiently and securely in Kubernetes isolated
namespaces. The ML training operators simplify configuration and operations of
scaling ML training tasks.

Kubeflow has also delivered Critical User Journeys (CUJs), such as the build,
train and deploy, which provide end-to-end workflows that speed development.
You can read more about the CUJs in the Kubeflow roadmap.

## End to end hybrid and multi-cloud ML workloads

The development of ML models can require hybrid and multi-cloud portability and
secure sharing between teams, clusters and clouds. Kubeflow is supported
by all major cloud providers and available for on-premises installation.

If you need to develop on your laptop, train with GPU on your on-prem cluster
and serve in the cloud, Kubeflow provides the portability to support fast
experimentation, rapid training and robust deployment in the same or
different environments with minimal operational overhead.

## Tuning the model hyperparameters during training

During the model development part hyperparameters are often hard to tune.
Tuning hyperparameters is critical for model performance and accuracy.
Manually configuring hyperparameters is time consuming.

Kubeflow’s hyperparameter tuner (Katib) provides an automated way to match
your objectives. This automation can save days of model testing compute time
(freeing up valuable infrastructure), and speed the delivery of improved models.

## Continuous integration and deployment (CI/CD) for ML

Kubeflow currently doesn’t have a dedicated tool for this purpose. But our users
have been using the Pipelines component and it worked really well for them.

Kubeflow Pipelines can be used to create reproducible workflows.
These workflows automate the steps needed to build a ML workflow,
which delivers consistency, saves iteration time, and helps in debugging,
auditability and compliance requirements.

## Next steps

See these docs for more information on the topics covered above:

- [Hyperparameter tuning with Katib](/docs/components/katib/)
- [Training models with operators](/docs/components/training/)
- [Get started with Pipelines](https://www.kubeflow.org/docs/pipelines/)
- [Jupyter notebooks](/docs/notebooks/)
- [Kubeflow roadmap](http://bit.ly/kf_roadmap)
