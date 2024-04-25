+++
title = "How to Configure Katib Experiment"
description = "Katib Experiment specification for neural architecture search"
weight = 10
+++

This guide describes how to configure Katib Experiment for neural architecture search (NAS).

Before reading this guide, please follow
[the guide to configure Experiment](/docs/components/katib/user-guides/hp-tuning/configure/experiment/#create-image-for-training-code)
for hyperparameter (HP) tuning to understand the common parameters for NAS.

## Configuring the Experiment

You can configure your NAS in Katib Experiment YAML file.

The YAML file defines the range of potential network architectures, configuration for neural network graph,
the objective metric to use when determining optimal values, the search algorithm to use during architecture search.

As a reference, you can use the YAML file of the
[efficient neural architecture search (ENAS)](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/nas/enas-cpu.yaml).

The list below describes the NAS-specific parameters in the YAML file for an Experiment.

- **nasConfig**: The configuration for a neural architecture search (NAS). You can specify the
  configurations of the neural network design that you want to optimize, including the number of
  layers in the network, the types of operations, and more.

  - **graphConfig**: The graph config that defines structure for a directed acyclic graph of the
    neural network. You can specify the number of layers, `input_sizes` for the input layer and
    `output_sizes` for the output layer.

  - **operations**: The range of operations that you want to tune for your ML model. For each neural
    network layer the NAS algorithm selects one of the operations to build a neural network.
    Each operation contains sets of **parameters** similar to HP tuning Experiment.

    You can find all NAS examples [here](https://github.com/kubeflow/katib/tree/master/examples/v1beta1/nas).

## Next steps

- Learn how to run the
  [random search algorithm and other Katib examples](/docs/components/katib/hyperparameter/#random-search).

- How to
  [restart your experiment and use the resume policies](/docs/components/katib/resume-experiment/).

- Learn to configure your
  [trial templates](/docs/components/katib/trial-template/).

- For an overview of the concepts involved in hyperparameter tuning and
  neural architecture search, check the
  [introduction to Katib](/docs/components/katib/overview/).

- Boost your hyperparameter tuning experiment with
  the [early stopping guide](/docs/components/katib/early-stopping/)

- Check the
  [Katib Configuration (Katib config)](/docs/components/katib/katib-config/).

- How to [set up environment variables](/docs/components/katib/env-variables/)
  for each Katib component.
