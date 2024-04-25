+++
title = "How to Configure Algorithms"
description = "List of supported algorithms for neural architecture search"
weight = 20
+++

This page describes neural architecture search (NAS) algorithms that Katib supports and how to configure
them.

## NAS Algorithms

Katib currently supports several search algorithms for HP tuning:

- [Efficient NAS](/docs/components/katib/user-guides/nas/configure-algorithm/#efficient-nas)
- [Differentiable Architecture Search](/docs/components/katib/user-guides/nas/configure-algorithm/#differentiable-architecture-search)

### Efficient NAS

The algorithm name in Katib is `enas`.

This NAS algorithm is ENAS-based. Currently, it doesn't support parameter sharing.

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting Name</th>
        <th>Type</th>
        <th>Default value</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>controller_hidden_size</td>
        <td>int</td>
        <td>64</td>
        <td>RL controller lstm hidden size. Value must be >= 1.</td>
      </tr>
      <tr>
        <td>controller_temperature</td>
        <td>float</td>
        <td>5.0</td>
        <td>RL controller temperature for the sampling logits. Value must be > 0.
          Set value to "None" to disable it in the controller.</td>
      </tr>
      <tr>
        <td>controller_tanh_const</td>
        <td>float</td>
        <td>2.25</td>
        <td>RL controller tanh constant to prevent premature convergence.
          Value must be > 0. Set value to "None" to disable it in the controller.</td>
      </tr>
      <tr>
        <td>controller_entropy_weight</td>
        <td>float</td>
        <td>1e-5</td>
        <td>RL controller weight for entropy applying to reward. Value must be > 0.
          Set value to "None" to disable it in the controller.</td>
      </tr>
      <tr>
        <td>controller_baseline_decay</td>
        <td>float</td>
        <td>0.999</td>
        <td>RL controller baseline factor. Value must be > 0 and <= 1.</td>
      </tr>
      <tr>
        <td>controller_learning_rate</td>
        <td>float</td>
        <td>5e-5</td>
        <td>RL controller learning rate for Adam optimizer. Value must be > 0 and <= 1.</td>
      </tr>
      <tr>
        <td>controller_skip_target</td>
        <td>float</td>
        <td>0.4</td>
        <td>RL controller probability, which represents the prior belief of a
          skip connection being formed. Value must be > 0 and <= 1.</td>
      </tr>
      <tr>
        <td>controller_skip_weight</td>
        <td>float</td>
        <td>0.8</td>
        <td>RL controller weight of skip penalty loss. Value must be > 0.
          Set value to "None" to disable it in the controller.</td>
      </tr>
      <tr>
        <td>controller_train_steps</td>
        <td>int</td>
        <td>50</td>
        <td>Number of RL controller training steps after each candidate runs.
          Value must be >= 1.</td>
      </tr>
      <tr>
        <td>controller_log_every_steps</td>
        <td>int</td>
        <td>10</td>
        <td>Number of RL controller training steps before logging it. Value must be >= 1.</td>
      </tr>
    </tbody>
  </table>
</div>

For more information, check:

TODO (andreyvelich): Migrate those docs to Kubeflow Website.

- Documentation in the Katib repository on the
  [Efficient Neural Architecture Search (ENAS)](https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1beta1/nas/enas).

- The ENAS example —
  [`enas-gpu.yaml`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/nas/enas-gpu.yaml) —
  which attempts to show all possible operations. Due to the large search
  space, the example is not likely to generate a good result.

### Differentiable Architecture Search (DARTS)

The algorithm name in Katib is `darts`.

Currently, you can't view results of this algorithm in the Katib UI and you can run experiments only
on a single GPU.

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting Name</th>
        <th>Type</th>
        <th>Default value</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>num_epochs</td>
        <td>int</td>
        <td>50</td>
        <td>Number of epochs to train model</td>
      </tr>
      <tr>
        <td>w_lr</td>
        <td>float</td>
        <td>0.025</td>
        <td>Initial learning rate for training model weights.
          This learning rate annealed down to <code>w_lr_min</code>
          following a cosine schedule without restart.</td>
      </tr>
      <tr>
        <td>w_lr_min</td>
        <td>float</td>
        <td>0.001</td>
        <td>Minimum learning rate for training model weights.</td>
      </tr>
      <tr>
        <td>w_momentum</td>
        <td>float</td>
        <td>0.9</td>
        <td>Momentum for training training model weights.</td>
      </tr>
      <tr>
        <td>w_weight_decay</td>
        <td>float</td>
        <td>3e-4</td>
        <td>Training model weight decay.</td>
      </tr>
      <tr>
        <td>w_grad_clip</td>
        <td>float</td>
        <td>5.0</td>
        <td>Max norm value for clipping gradient norm of training model weights.</td>
      </tr>
      <tr>
        <td>alpha_lr</td>
        <td>float</td>
        <td>3e-4</td>
        <td>Initial learning rate for alphas weights.</td>
      </tr>
      <tr>
        <td>alpha_weight_decay</td>
        <td>float</td>
        <td>1e-3</td>
        <td>Alphas weight decay.</td>
      </tr>
      <tr>
        <td>batch_size</td>
        <td>int</td>
        <td>128</td>
        <td>Batch size for dataset.</td>
      </tr>
      <tr>
        <td>num_workers</td>
        <td>int</td>
        <td>4</td>
        <td>Number of subprocesses to download the dataset.</td>
      </tr>
      <tr>
        <td>init_channels</td>
        <td>int</td>
        <td>16</td>
        <td>Initial number of channels.</td>
      </tr>
      <tr>
        <td>print_step</td>
        <td>int</td>
        <td>50</td>
        <td>Number of training or validation steps before logging it.</td>
      </tr>
      <tr>
        <td>num_nodes</td>
        <td>int</td>
        <td>4</td>
        <td>Number of DARTS nodes.</td>
      </tr>
      <tr>
        <td>stem_multiplier</td>
        <td>int</td>
        <td>3</td>
        <td>Multiplier for initial channels. It is used in the first stem cell.</td>
      </tr>
    </tbody>
  </table>
</div>

For more information, check:

TODO (andreyvelich): Migrate those docs to Kubeflow Website.

- Documentation in the Katib repository on the
  [Differentiable Architecture Search](https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1beta1/nas/darts).

- The DARTS example —
  [`darts-gpu.yaml`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/nas/darts-gpu.yaml).
