+++
title = "How to Configure Hyperparameter Tuning Algorithm"
description = "List of supported algorithms for hyperparameter tuning"
weight = 20
+++

This page describes hyperparameter (HP) tuning algorithms that Katib supports and how to configure
them.

## HP Tuning Algorithms

Katib currently supports several search algorithms for NAS:

- [Grid Search](#grid-search)
- [Random Search](#random-search)
- [Bayesian Optimization](#bayesian-optimization)
- [Hyperband](#hyperband)
- [Tree of Parzen Estimators](#tree-of-parzen-estimators)
- [Multivariate TPE](#multivariate-tpe)
- [Covariance Matrix Adaptation Evolution Strategy](#cma-es)
- [Sobol Quasirandom Sequence](#sobol-quasirandom-sequence)
- [Population Based Training](#population-based-training)

### Grid Search

The algorithm name in Katib is `grid`.

Grid sampling is useful when all variables are discrete (as opposed to
continuous) and the number of possibilities is low. A grid search
performs an exhaustive combinatorial search over all possibilities,
making the search process extremely long even for medium sized problems.

Katib uses the [Optuna](https://github.com/optuna/optuna) optimization
framework for its grid search.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting name</th>
        <th>Description</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>random_state</td>
        <td>[int]: Set <code>random_state</code> to something other than None
          for reproducible results.</td>
        <td>10</td>
      </tr>
    </tbody>
  </table>
</div>

### Random search

The algorithm name in Katib is `random`.

Random sampling is an alternative to grid search and is used when the number of
discrete variables to optimize is large and the time required for each
evaluation is long. When all parameters are discrete, random search performs
sampling without replacement. Random search is therefore the best algorithm to
use when combinatorial exploration is not possible. If the number of continuous
variables is high, you should use quasi random sampling instead.

Katib uses the [Hyperopt](https://hyperopt.github.io/hyperopt/),
[Goptuna](https://github.com/c-bata/goptuna) or
[Optuna](https://github.com/optuna/optuna) optimization
framework for its random search.

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting name</th>
        <th>Description</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>random_state</td>
        <td>[int]: Set <code>random_state</code> to something other than None
          for reproducible results.</td>
        <td>10</td>
      </tr>
    </tbody>
  </table>
</div>

### Bayesian optimization

The algorithm name in Katib is `bayesianoptimization`.

The [Bayesian optimization](https://arxiv.org/pdf/1012.2599.pdf) method uses
Gaussian process regression to model the search space. This technique calculates
an estimate of the loss function and the uncertainty of that estimate at every
point in the search space. The method is suitable when the number of
dimensions in the search space is low. Since the method models both
the expected loss and the uncertainty, the search algorithm converges in a few
steps, making it a good choice when the time to
complete the evaluation of a parameter configuration is long.

Katib uses the
[Scikit-Optimize](https://github.com/scikit-optimize/scikit-optimize) optimization framework
for its Bayesian search. Scikit-Optimize is also known as `skopt`.

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting Name</th>
        <th>Description</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>base_estimator</td>
        <td>[“GP”, “RF”, “ET”, “GBRT” or sklearn regressor, default=“GP”]:
          Should inherit from <code>sklearn.base.RegressorMixin</code>.
          The <code>predict</code> method should have an optional
          <code>return_std</code> argument, which returns
          <code>std(Y | x)</code> along with <code>E[Y | x]</code>. If
          <code>base_estimator</code> is one of
          [“GP”, “RF”, “ET”, “GBRT”], the system uses a default surrogate model
          of the corresponding type. Learn more information in the
          <a href="https://scikit-optimize.github.io/stable/modules/generated/skopt.Optimizer.html#skopt.Optimizer">skopt
          documentation</a>.</td>
        <td>GP</td>
      </tr>
      <tr>
        <td>n_initial_points</td>
        <td>[int, default=10]: Number of evaluations of <code>func</code> with
          initialization points before approximating it with
          <code>base_estimator</code>. Points provided as <code>x0</code> count
          as initialization points.
          If <code>len(x0) &lt; n_initial_points</code>, the
          system samples additional points at random. Learn more information in the
          <a href="https://scikit-optimize.github.io/stable/modules/generated/skopt.Optimizer.html#skopt.Optimizer">skopt
          documentation</a>.</td>
        <td>10</td>
      </tr>
      <tr>
        <td>acq_func</td>
        <td>[string, default=<code>&quot;gp_hedge&quot;</code>]: The function to
          minimize over the posterior distribution. Learn more information in the
          <a href="https://scikit-optimize.github.io/stable/modules/generated/skopt.Optimizer.html#skopt.Optimizer">skopt
          documentation</a>.</td>
        <td>gp_hedge</td>
      </tr>
      <tr>
        <td>acq_optimizer</td>
        <td>[string, “sampling” or “lbfgs”, default=“auto”]: The method to
          minimize the acquisition function. The system updates the fit model
          with the optimal value obtained by optimizing <code>acq_func</code>
          with <code>acq_optimizer</code>. Learn more information in the
          <a href="https://scikit-optimize.github.io/stable/modules/generated/skopt.Optimizer.html#skopt.Optimizer">skopt
          documentation</a>.</td>
        <td>auto</td>
      </tr>
      <tr>
        <td>random_state</td>
        <td>[int]: Set <code>random_state</code> to something other than None
          for reproducible results.</td>
        <td>10</td>
      </tr>
    </tbody>
  </table>
</div>

### Hyperband

The algorithm name in Katib is `hyperband`.

Katib supports the [Hyperband](https://arxiv.org/pdf/1603.06560.pdf)
optimization framework.
Instead of using Bayesian optimization to select configurations, Hyperband
focuses on early stopping as a strategy for optimizing resource allocation and
thus for maximizing the number of configurations that it can evaluate.
Hyperband also focuses on the speed of the search.

### Tree of Parzen Estimators (TPE)

The algorithm name in Katib is `tpe`.

Katib uses the [Hyperopt](https://hyperopt.github.io/hyperopt/),
[Goptuna](https://github.com/c-bata/goptuna) or
[Optuna](https://github.com/optuna/optuna) optimization
framework for its TPE search.

This method provides a [forward and reverse gradient-based](https://arxiv.org/pdf/1703.01785.pdf)
search.

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting name</th>
        <th>Description</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>n_EI_candidates</td>
        <td>[int]: Number of candidate samples used to calculate the expected improvement.</td>
        <td>25</td>
      </tr>
      <tr>
        <td>random_state</td>
        <td>[int]: Set <code>random_state</code> to something other than None
          for reproducible results.</td>
        <td>10</td>
      </tr>
      <tr>
        <td>gamma</td>
        <td>[float]: The threshold to split between l(x) and g(x), check equation 2 in
        <a href="https://papers.nips.cc/paper/2011/file/86e8f7ab32cfd12577bc2619bc635690-Paper.pdf">
        this Paper</a>. Value must be in (0, 1) range.</td>
        <td>0.25</td>
      </tr>
      <tr>
        <td>prior_weight</td>
        <td>[float]: Smoothing factor for counts, to avoid having 0 probability.
        Value must be > 0.</td>
        <td>1.1</td>
      </tr>
    </tbody>
  </table>
</div>

### Multivariate TPE

The algorithm name in Katib is `multivariate-tpe`.

Katib uses the [Optuna](https://hyperopt.github.io/hyperopt/) optimization
framework for its Multivariate TPE search.

[Multivariate TPE](https://tech.preferred.jp/en/blog/multivariate-tpe-makes-optuna-even-more-powerful/)
is improved version of independent (default) TPE. This method finds
dependencies among hyperparameters in search space.

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting name</th>
        <th>Description</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>n_ei_candidates</td>
        <td>[int]: Number of Trials used to calculate the expected improvement.</td>
        <td>25</td>
      </tr>
      <tr>
        <td>random_state</td>
        <td>[int]: Set <code>random_state</code> to something other than None
          for reproducible results.</td>
        <td>10</td>
      </tr>
      <tr>
        <td>n_startup_trials</td>
        <td>[int]: Number of initial Trials for which the random search algorithm generates
        hyperparameters.</td>
        <td>5</td>
      </tr>
    </tbody>
  </table>
</div>

### Covariance Matrix Adaptation Evolution Strategy

The algorithm name in Katib is `cmaes`.

Katib uses the [Goptuna](https://github.com/c-bata/goptuna) or
[Optuna](https://github.com/optuna/optuna) optimization
framework for its CMA-ES search.

The [Covariance Matrix Adaptation Evolution Strategy](https://en.wikipedia.org/wiki/CMA-ES)
is a stochastic derivative-free numerical optimization algorithm for optimization
problems in continuous search spaces.
You can also use [IPOP-CMA-ES](https://sci2s.ugr.es/sites/default/files/files/TematicWebSites/EAMHCO/contributionsCEC05/auger05ARCMA.pdf) and [BIPOP-CMA-ES](https://hal.inria.fr/inria-00382093/document), variant algorithms for restarting optimization when converges to local minimum.

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting name</th>
        <th>Description</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>random_state</td>
        <td>[int]: Set <code>random_state</code> to something other than None
          for reproducible results.</td>
        <td>10</td>
      </tr>
      <tr>
        <td>sigma</td>
        <td>[float]: Initial standard deviation of CMA-ES.</td>
        <td>0.001</td>
      </tr>
      <tr>
        <td>restart_strategy</td>
        <td>[string, "none", "ipop", or "bipop", default="none"]: Strategy for restarting CMA-ES optimization when converges to a local minimum.</td>
        <td>"ipop"</td>
      </tr>
    </tbody>
  </table>
</div>

### Sobol Quasirandom Sequence

The algorithm name in Katib is `sobol`.

Katib uses the [Goptuna](https://github.com/c-bata/goptuna) optimization
framework for its Sobol's quasirandom search.

The [Sobol's quasirandom sequence](https://dl.acm.org/doi/10.1145/641876.641879)
is a low-discrepancy sequence. And it is known that Sobol's quasirandom sequence can
provide better uniformity properties.

### Population Based Training

The algorithm name in Katib is `pbt`.

Review the population based training [paper](https://arxiv.org/abs/1711.09846) for more details about the algorithm.

The PBT service requires a Persistent Volume Claim with [RWX access mode](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) to share resources between Suggestion and Trials. Currently, Katib Experiments should have <code>resumePolicy: FromVolume</code> to run the PBT algorithm. Learn more about resume policies in [this guide](/docs/components/katib/resume-experiment/).

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting name</th>
        <th>Description</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>suggestion_trial_dir</td>
        <td>The location within the trial container where checkpoints are saved</td>
        <td><code>/var/log/katib/checkpoints/</code></td>
      </tr>
      <tr>
        <td>n_population</td>
        <td>Number of trial seeds per generation</td>
        <td>40</td>
      </tr>
      <tr>
        <td>resample_probability</td>
        <td>null (default): perturbs the hyperparameter by 0.8 or 1.2. 0-1: resamples the original distribution by the specified probability</td>
        <td>0.3</td>
      </tr>
      <tr>
        <td>truncation_threshold</td>
        <td>Exploit threshold for pruning low performing seeds</td>
        <td>0.4</td>
      </tr>
    </tbody>
  </table>
</div>

## Add a new HP Tuning Algorithm to Katib

You can add an algorithm to Katib yourself. the design of Katib follows the `ask-and-tell` pattern:

This pattern follows this:

1. Ask for a new set of parameters
1. Walk to the Experiment and program in the new parameters
1. Observe the outcome of running the Experiment
1. Walk back to your laptop and tell the optimizer about the outcome 1. go to step 1

When an Experiment is created, one algorithm service as Kubernetes Deployment will be created.
Then Katib asks for new sets of parameters via `GetSuggestions` gRPC call. After that, Katib
creates new Trials according to the sets and observe the outcome. When the Trials are finished,
Katib tells the metrics of the finished trials to the algorithm, and ask another new sets.

### Create a new Algorithm Service

The new algorithm needs to implement Suggestion service defined in [api.proto](https://github.com/kubeflow/katib/blob/4a2db414d85f29f17bc8ec6ff3462beef29585da/pkg/apis/manager/v1beta1/api.proto).

One sample algorithm looks like:

```python
from pkg.apis.manager.v1beta1.python import api_pb2
from pkg.apis.manager.v1beta1.python import api_pb2_grpc
from pkg.suggestion.v1beta1.internal.search_space import HyperParameter, HyperParameterSearchSpace
from pkg.suggestion.v1beta1.internal.trial import Trial, Assignment
from pkg.suggestion.v1beta1.hyperopt.base_service import BaseHyperoptService
from pkg.suggestion.v1beta1.internal.base_health_service import HealthServicer


# Inherit SuggestionServicer and implement GetSuggestions.
class HyperoptService(
        api_pb2_grpc.SuggestionServicer, HealthServicer):
    def ValidateAlgorithmSettings(self, request, context):
        # Optional, it is used to validate algorithm settings defined by users.
        pass
    def GetSuggestions(self, request, context):
        # Convert the Experiment in GRPC request to the search space.
        # search_space example:
        #   HyperParameterSearchSpace(
        #       goal: MAXIMIZE,
        #       params: [HyperParameter(name: param-1, type: INTEGER, min: 1, max: 5, step: 0),
        #                HyperParameter(name: param-2, type: CATEGORICAL, list: cat1, cat2, cat3),
        #                HyperParameter(name: param-3, type: DISCRETE, list: 3, 2, 6),
        #                HyperParameter(name: param-4, type: DOUBLE, min: 1, max: 5, step: )]
        #   )
        search_space = HyperParameterSearchSpace.convert(request.experiment)
        # Convert the trials in GRPC request to the trials in algorithm side.
        # trials example:
        #   [Trial(
        #       assignment: [Assignment(name=param-1, value=2),
        #                    Assignment(name=param-2, value=cat1),
        #                    Assignment(name=param-3, value=2),
        #                    Assignment(name=param-4, value=3.44)],
        #       target_metric: Metric(name="metric-2" value="5643"),
        #       additional_metrics: [Metric(name=metric-1, value=435),
        #                            Metric(name=metric-3, value=5643)],
        #   Trial(
        #       assignment: [Assignment(name=param-1, value=3),
        #                    Assignment(name=param-2, value=cat2),
        #                    Assignment(name=param-3, value=6),
        #                    Assignment(name=param-4, value=4.44)],
        #       target_metric: Metric(name="metric-2" value="3242"),
        #       additional_metrics: [Metric(name=metric=1, value=123),
        #                            Metric(name=metric-3, value=543)],
        trials = Trial.convert(request.trials)
        #--------------------------------------------------------------
        # Your code here
        # Implement the logic to generate new assignments for the given current request number.
        # For example, if request.current_request_number is 2, you should return:
        # [
        #   [Assignment(name=param-1, value=3),
        #    Assignment(name=param-2, value=cat2),
        #    Assignment(name=param-3, value=3),
        #    Assignment(name=param-4, value=3.22)
        #   ],
        #   [Assignment(name=param-1, value=4),
        #    Assignment(name=param-2, value=cat4),
        #    Assignment(name=param-3, value=2),
        #    Assignment(name=param-4, value=4.32)
        #   ],
        # ]
        list_of_assignments = your_logic(search_space, trials, request.current_request_number)
        #--------------------------------------------------------------
        # Convert list_of_assignments to
        return api_pb2.GetSuggestionsReply(
            trials=Assignment.generate(list_of_assignments)
        )
```

### Package Algorithm Service as Docker Image

You should build Docker image from your Algorithm service, for that add a new Docker image under
`cmd/suggestion`, for example: [cmd/suggestion/hyperopt](https://github.com/kubeflow/katib/tree/6f372f68089c0a01d2c06e98489557a88e5a7183/cmd/suggestion/hyperopt/v1beta1).
The new GRPC server should serve in port **6789**.

After that you can build Docker image from your algorithm:

```shell
docker build . -f cmd/suggestion/<PATH_TO_DOCKER> -t <DOCKER_IMAGE>
```

### Update the Katib Config with

Update the [Katib config](../manifests/v1beta1/installs/katib-standalone/katib-config.yaml) with
the new algorithm entity:

```diff
  runtime:
    suggestions:
      - algorithmName: random
        image: docker.io/kubeflowkatib/suggestion-hyperopt:$(KATIB_VERSION)
      - algorithmName: tpe
        image: docker.io/kubeflowkatib/suggestion-hyperopt:$(KATIB_VERSION)
+     - algorithmName: <new-algorithm-name>
+       image: <DOCKER_IMAGE>
```

Follow [this guide](/docs/components/katib/user-guides/katib-config/) to learn more about Katib Config.

### Contribute the Algorithm to Katib

If you want to contribute the algorithm to Katib, you could add unit test and/or
e2e test for it in the CI and submit a PR.

#### Add Unit Tests for the Algorithm

Here is an example [test_hyperopt_service.py](https://github.com/kubeflow/katib/blob/6f372f68089c0a01d2c06e98489557a88e5a7183/test/unit/v1beta1/suggestion/test_hyperopt_service.py):

```python
import grpc
import grpc_testing
import unittest

from pkg.apis.manager.v1beta1.python import api_pb2_grpc
from pkg.apis.manager.v1beta1.python import api_pb2

from pkg.suggestion.v1beta1.hyperopt.service import HyperoptService

class TestHyperopt(unittest.TestCase):
    def setUp(self):
        servicers = {
            api_pb2.DESCRIPTOR.services_by_name['Suggestion']: HyperoptService()
        }

        self.test_server = grpc_testing.server_from_dictionary(
            servicers, grpc_testing.strict_real_time())


if __name__ == '__main__':
    unittest.main()
```

You can setup the gRPC server using `grpc_testing`, then define your own test cases.

#### Add E2E Test for the Algorithm

TODO (andreyvelich): Add instructions for E2E tests.
