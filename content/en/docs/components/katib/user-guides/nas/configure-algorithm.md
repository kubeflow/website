+++
title = "How to Configure Algorithms"
description = "List of supported algorithms for neural architecture search"
weight = 20
+++

This page describes neural architecture search (NAS) algorithms that Katib supports and how to configure
them.

## NAS Algorithms

Katib currently supports several search algorithms for NAS:

- [Efficient NAS](/docs/components/katib/user-guides/nas/configure-algorithm/#efficient-neural-architecture-search-enas)

- [Differentiable Architecture Search](/docs/components/katib/user-guides/nas/configure-algorithm/#differentiable-architecture-search-darts)

### Efficient Neural Architecture Search (ENAS)

The algorithm name in Katib is `enas`.

The ENAS example —
[`enas-gpu.yaml`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/nas/enas-gpu.yaml) —
which attempts to show all possible operations. Due to the large search
space, the example is not likely to generate a good result.

The algorithm follows the idea proposed in _Efficient Neural Architecture Search via Parameter Sharing_
by Hieu Pham, Melody Y. Guan, Barret Zoph, Quoc V. Le and Jeff Dean (https://arxiv.org/abs/1802.03268)
and _Neural Architecture Search with Reinforcement Learning_ by Barret Zoph and
Quoc V. Le (https://arxiv.org/abs/1611.01578).

The implementation is based on the github of _Efﬁcient Neural Architecture Search via Parameter Sharing_
(https://github.com/melodyguan/enas and https://github.com/google-research/google-research/tree/master/enas_lm).
It uses a recurrent neural network with LSTM cells as controller to generate neural architecture candidates.
And this controller network is updated by policy gradients. However, it currently does not support parameter sharing.

#### Definition of a Neural Architecture

Define the number of layers is n, the number of possible operations is m.

If n = 12, m = 6, the definition of an architecture will be like:

```
[2]
[0 0]
[1 1 0]
[5 1 0 1]
[1 1 1 0 1]
[5 0 0 1 0 1]
[1 1 1 0 0 1 0]
[2 0 0 0 1 1 0 1]
[0 0 0 1 1 1 1 1 0]
[2 0 1 0 1 1 1 0 0 0]
[3 1 1 1 1 1 1 0 0 1 1]
[0 1 1 1 1 0 0 1 1 1 1 0]
```

There are n rows, the i<sup>th</sup> row has i elements and describes the i<sup>th</sup>
layer. Please notice that layer 0 is the input and is not included in this definition.

In each row, the first integer ranges from 0 to m-1 and indicates the operation in this layer.
Starting from the second position, the k<sup>th</sup> integer is a boolean value that indicates
whether (k-2)<sup>th</sup> layer has a skip connection with this layer.
(There will always be a connection from (k-1)<sup>th</sup> layer to k<sup>th</sup> layer)

#### Output of `GetSuggestion()`

The output of `GetSuggestion()` from the algorithm service consists of two parts:
`architecture` and `nn_config`.

`architecture` is a json string of the definition of a neural architecture. The format is as stated
above. One example is:

```
[[27], [29, 0], [22, 1, 0], [13, 0, 0, 0], [26, 1, 1, 0, 0], [30, 1, 0, 1, 0, 0], [11, 0, 1, 1, 0, 1, 1], [9, 1, 0, 0, 1, 0, 0, 0]]
```

`nn_config` is a json string of the detailed description of what is the num of layers,
input size, output size and what each operation index stands for. A `nn_config` corresponding to
the architecture above can be:

```
{
    "num_layers": 8,
    "input_sizes": [32, 32, 3],
    "output_sizes": [10],
    "embedding": {
        "27": {
            "opt_id": 27,
            "opt_type": "convolution",
            "opt_params": {
                "filter_size": "7",
                "num_filter": "96",
                "stride": "2"
            }
        },
        "29": {
            "opt_id": 29,
            "opt_type": "convolution",
            "opt_params": {
                "filter_size": "7",
                "num_filter": "128",
                "stride": "2"
            }
        },
        "22": {
            "opt_id": 22,
            "opt_type": "convolution",
            "opt_params": {
                "filter_size": "7",
                "num_filter": "48",
                "stride": "1"
            }
        },
        "13": {
            "opt_id": 13,
            "opt_type": "convolution",
            "opt_params": {
                "filter_size": "5",
                "num_filter": "48",
                "stride": "2"
            }
        },
        "26": {
            "opt_id": 26,
            "opt_type": "convolution",
            "opt_params": {
                "filter_size": "7",
                "num_filter": "96",
                "stride": "1"
            }
        },
        "30": {
            "opt_id": 30,
            "opt_type": "reduction",
            "opt_params": {
                "reduction_type": "max_pooling",
                "pool_size": 2
            }
        },
        "11": {
            "opt_id": 11,
            "opt_type": "convolution",
            "opt_params": {
                "filter_size": "5",
                "num_filter": "32",
                "stride": "2"
            }
        },
        "9": {
            "opt_id": 9,
            "opt_type": "convolution",
            "opt_params": {
                "filter_size": "3",
                "num_filter": "128",
                "stride": "2"
            }
        }
    }
}
```

This neural architecture can be visualized as:

<img src="/docs/components/katib/images/nas-example.png"
  alt="Example of NAS network"
  class="mt-3 mb-3">

The following items can be implemented in ENAS:

1. Add 'micro' mode, which means searching for a neural cell instead of the whole neural network.
1. Add support for recurrent neural networks and build a training container for the Penn Treebank task.
1. Add parameter sharing, if possible.
1. Change LSTM cell from self defined functions in LSTM.py to `tf.nn.rnn_cell.LSTMCell`
1. Store the suggestion checkpoint to PVC to protect against unexpected enas service pod restarts
1. Add `RequestCount` into API so that the suggestion can clean the information of completed studies.

Katib supports the following algorithm settings for ENAS:

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

### Differentiable Architecture Search (DARTS)

The algorithm name in Katib is `darts`.

The DARTS example —
[`darts-gpu.yaml`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/nas/darts-gpu.yaml).

The algorithm follows the idea proposed in _DARTS: Differentiable Architecture Search_ by Hanxiao Liu,
Karen Simonyan, Yiming Yang (https://arxiv.org/abs/1806.09055).
The implementation is based on [official github implementation](https://github.com/quark0/darts) and
[popular repository](https://github.com/khanrc/pt.darts).

The algorithm addresses the scalability challenge of architecture search by formulating the task in
a differentiable manner. It is based on continuous relaxation and gradient descent in the search space.
It is able to efficiently design high-performance convolutional architectures for image classification
(on CIFAR-10 and ImageNet) and recurrent architectures for language modeling (on Penn Treebank and WikiText-2).

#### Katib Implementation

To support DARTS in current Katib functionality the implementation follows this way:

1. [DARTS Suggestion service](https://github.com/kubeflow/katib/blob/ea46a7f2b73b2d316b6b7619f99eb440ede1909b/pkg/suggestion/v1beta1/nas/darts/service.py)
   creates set of primitive operations from the Experiment search space.
   For example:

   ```
   ['separable_convolution_3x3', 'dilated_convolution_3x3', 'dilated_convolution_5x5', 'avg_pooling_3x3', 'max_pooling_3x3', 'skip_connection']
   ```

1. Suggestion returns algorithm settings, number of layers and set of primitives to Katib Controller

1. Katib controller starts
   [DARTS training container](https://github.com/kubeflow/katib/tree/ea46a7f2b73b2d316b6b7619f99eb440ede1909b/examples/v1beta1/trial-images/darts-cnn-cifar10)
   with the appropriate settings and all possible operations.

1. Training container runs DARTS algorithm.

1. Metrics collector saves Best Genotype from the training container log.

#### Best Genotype representation

Best Genotype is the best cell for each neural network layer. Cells are generated by DARTS algorithm.
Here is an example of the Best Genotype:

```
Genotype(
  normal=[
      [('max_pooling_3x3',0),('max_pooling_3x3',1)],
      [('max_pooling_3x3',0),('max_pooling_3x3',1)],
      [('max_pooling_3x3',0),('dilated_convolution_3x3',3)],
      [('max_pooling_3x3',0),('max_pooling_3x3',1)]
    ],
    normal_concat=range(2,6),
  reduce=[
      [('dilated_convolution_5x5',1),('separable_convolution_3x3',0)],
      [('max_pooling_3x3',2),('dilated_convolution_5x5',1)],
      [('dilated_convolution_5x5',3),('dilated_convolution_5x5',2)],
      [('dilated_convolution_5x5',3),('dilated_convolution_5x5',4)]
    ],
    reduce_concat=range(2,6)
)
```

In this example you can see 4 DARTS nodes with indexes: 2,3,4,5.

`reduce` parameter is the cells which located at the 1/3 and 2/3 of the total neural network layers.
They represent reduction cells in which all the operations adjacent to the input nodes are of stride two.

`normal` parameter is the cells which is located at the rest neural network layers.
They represent normal cell.

In CNN all reduce and normal intermediate nodes are concatenated and each node has 2 edges.

Each element in `normal` array is the node which has 2 edges. First element is the operation on
the edge and second element is the node index connection. Note that index 0 is the `C_{k-2}` node
and index 1 is the `C_{k-1}` node.

For example `[('max_pooling_3x3',0),('max_pooling_3x3',1)]` means that `C_{k-2}` node connects to
the first node with `max_pooling_3x3` operation (Max Pooling with filter size 3) and `C_{k-1}`
node connects to the first node with `max_pooling_3x3` operation.

`reduce` array follows the same way as `normal` array.

`normal_concat` and `reduce_concat` means concatenation between intermediate nodes.

Currently, it supports running only on single GPU and second-order approximation, which produced
better results than first-order.

The following items can be implemented in DARTS:

- Support multi GPU training. Add functionality to select GPU for training.

- Support DARTS in Katib UI.

- Think about better representation of Best Genotype.

- Add more dataset for CNN. Currently, it supports only CIFAR-10.

- Support RNN in addition to CNN.

- Support micro mode, which means searching for a particular neural network cell.

Katib supports the following algorithm settings for DARTS:

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
