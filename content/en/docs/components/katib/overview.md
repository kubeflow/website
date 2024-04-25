+++
title = "Overview"
description = "An overview for Katib"
weight = 10
+++

{{% beta-status
  feedbacklink="https://github.com/kubeflow/katib/issues" %}}

## What is Katib ?

Katib is a Kubernetes-native project for automated machine learning (AutoML).
Katib supports hyperparameter tuning, early stopping and
neural architecture search (NAS).
Learn more about AutoML at [fast.ai](https://www.fast.ai/2018/07/16/auto-ml2/),
[Google Cloud](https://cloud.google.com/automl),
[Microsoft Azure](https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml#automl-in-azure-machine-learning) or
[Amazon SageMaker](https://aws.amazon.com/blogs/aws/amazon-sagemaker-autopilot-fully-managed-automatic-machine-learning/).

Katib is the project which is agnostic to machine learning (ML) frameworks.
It can tune hyperparameters of applications written in any language
of the users' choice and natively supports many ML frameworks,
such as TensorFlow, MXNet, PyTorch, XGBoost, and others.

Katib supports a lot of various AutoML algorithms, such as
[Bayesian optimization](https://arxiv.org/pdf/1012.2599.pdf),
[Tree of Parzen Estimators](https://papers.nips.cc/paper/2011/file/86e8f7ab32cfd12577bc2619bc635690-Paper.pdf),
[Random Search](https://en.wikipedia.org/wiki/Hyperparameter_optimization#Random_search),
[Covariance Matrix Adaptation Evolution Strategy](https://en.wikipedia.org/wiki/CMA-ES),
[Hyperband](https://arxiv.org/pdf/1603.06560.pdf),
[Efficient Neural Architecture Search](https://arxiv.org/abs/1802.03268),
[Differentiable Architecture Search](https://arxiv.org/abs/1806.09055)
and many more. Additional algorithm support is coming soon.

The [Katib project](https://github.com/kubeflow/katib) is open source.
The [developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md)
is a good starting point for developers who want to contribute to the project.

<img src="/docs/components/katib/images/katib-overview.drawio.png"
  alt="Katib Overview"
  class="mt-3 mb-3">

## Why Katib ?

Katib addresses AutoML step for hyperparameter optimization or Neural Architecture Search
in AI/ML lifecycle as shown on that diagram:

TODO (andreyvelich): Add diagram.

## Next steps

- Follow [the installation guide](/docs/components/training/installation/) to deploy Katib.

- Run examples from [getting started guide](/docs/components/katib/getting-started/).
