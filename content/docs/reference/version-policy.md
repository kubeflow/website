+++
title = "Kubeflow Versioning Policies"
description = "Versioning policies and production-ready status of Kubeflow applications and other components"
weight = 05
+++

With the launch of Kubeflow v1.0, the Kubeflow community attributes 
*production-ready status* to those applications and deployment platforms that 
meet a defined level of stability, supportability, and upgradability.

This page describes the Kubeflow versioning policies and provides a version matrix for Kubeflow applications and deployment platforms.

## Kubeflow versioning

Kubeflow version numbers are of the form **vX.Y.Z**, where **X** is the major 
version, **Y** is the minor version, and **Z** is the patch version. The
versioning policy follows the [Semantic Versioning](https://semver.org/) 
terminology.

The version name **vX.Y.Z** refers to the version (git tag) of the 
[kfctl release](https://github.com/kubeflow/kubeflow/releases). 
If the version number includes an appendix **-rcN**, where **N** is a
number, the appendix indicates a *release candidate*, which is a pre-release 
version of an upcoming release.

Examples of Kubeflow version numbers:

* `v0.7.0`
* `v0.7.0-rc8`
* `v1.0.0`
* `v1.0.1`

<a id="app-versioning"></a>
## Application versioning and production-ready status

When you deploy Kubeflow to a Kubernetes cluster, your deployment includes a
number of applications. Application versioning is independent of Kubeflow 
versioning. An application moves to version **1.0** when the application meets 
certain 
[criteria](https://github.com/kubeflow/community/blob/master/guidelines/application_requirements.md) 
in terms of stability, upgradability, and the provision of services such as 
logging and monitoring. 

An application version number of 1.0 or greater indicates that the Kubeflow 
community attributes **production-ready** status to the application.

When an application moves to version 1.0, the Kubeflow community will decide 
whether to include that version of the application in the next major or minor
release of Kubeflow.

<a id="application-matrix"></a>
## Kubeflow v1.0 application matrix

The following table shows the production-ready status of the applications that
may be deployed to your Kubernetes cluster when you deploy Kubeflow. 
The applications are specified in the 
[manifest](https://github.com/kubeflow/manifests/tree/master/kfdef) that you 
use to deploy Kubeflow. You can use the information below to decide which of 
the applications you should deploy to your production system.

* **Production-ready** means that the application has reached application 
  version 1.0 or later, and complies with the criteria defined <a href="#app-versioning">above</a> to reach version 1.0.
* **Beta** means that the application is working towards a version 1.0 release
  and is expected to meet the criteria for version 1.0 soon.
* **Experimental** means that the application is in the early phases of development
  and/or integration into Kubeflow.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Application</th>
        <th>Production readiness in Kubeflow v1.0</th>
        <th>App version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/centraldashboard">Central 
        dashboard - Kubeflow UI</a> (<a href="/docs/other-guides/accessing-uis/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/chainer-operator">Chainer 
        operator</a> (<a href="/docs/components/training/chainer/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/katib">Hyperparameter tuning
        - Katib</a> 
          (<a href="/docs/components/hyperparameter-tuning/hyperparameter/">docs</a>)</td>
        <td>Beta</td>
        <td>TODO</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/metadata">Metadata</a>
          (<a href="/docs/components/misc/metadata//">docs</a>)</td>
        <td>Beta</td>
        <td>TODO</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/mpi-operator">MPI operator</a>
          (<a href="/docs/components/training/mpi/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/mxnet-operator">MXNet operator</a>
          (<a href="/docs/components/training/mxnet/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/jupyter-web-app">Notebook 
        web app</a> (<a href="/docs/notebooks/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/notebook-controller">Notebook
        controller</a> (<a href="/docs/notebooks/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/pipelines">Pipelines</a>
          (<a href="/docs/pipelines/pipelines-quickstart/">docs</a>)</td>
        <td>Beta</td>
        <td>TODO</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kubeflow/tree/master/components/profile-controller">Profile 
        Controller</a> (<a href="/docs/other-guides/multi-user-overview/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/pytorch-operator">PyTorch operator</a> (<a href="/docs/components/training/pytorch/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/tf-operator">TFJob operator</a>
          (<a href="/docs/components/training/tftraining/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/xgboost-operator">XGBoost operator</a></td>
        <td>Experimental</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

<a id="serving-matrix"></a>
## Serving platforms for Kubeflow v1.0

Alongside Kubeflow v1.0, you may want to use one of the following platforms to
serve your model for prediction (inference).

TODO: FOR DISCUSSION: Should we move the serving components into the
application matrix above? 
How correct is it to say that the serving components are "applications
that may be deployed to your K8s cluster"?

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Serving platform</th>
        <th>Production readiness with Kubeflow v1.0</th>
        <th>Serving platform version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/kubeflow/kfserving">KFServing</a>
          (<a href="/docs/components/serving/kfserving/">docs</a>)</td>
        <td>Beta</td>
        <td>TODO</td>
      </tr>
      <tr>
        <td>NVIDIA TensorRT Inference Server 
          (<a href="/docs/components/serving/trtinferenceserver/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td>PyTorch serving 
          (<a href="/docs/components/serving/pytorchserving/">docs</a>)</td>
        <td>Production-ready</td>
        <td>TODO</td>
      </tr>
      <tr>
        <td>Seldon serving (<a href="/docs/components/serving/seldon/">docs</a>)</td>
        <td>Production-ready</td>
        <td>TODO</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/batch-predict">TensorFlow 
          batch prediction</a>
          (<a href="/docs/components/serving/tfbatchpredict/">docs</a>)</td>
        <td>Experimental</td>
        <td></td>
      </tr>
      <tr>
        <td>TensorFlow serving (<a href="/docs/components/serving/tfserving_new/">docs</a>)</td>
        <td>Production-ready</td>
        <td>TODO</td>
      </tr>
    </tbody>
  </table>
</div>

<a id="platform-matrix"></a>
## Kubeflow v1.0 manifests and deployment platforms

Kubeflow v1.0 supports a subset of manifests and deployment platforms
that are compatible with Kubeflow v1.0 and that the Kubeflow community considers
mature and stable enough to gain v1.0 status.

TODO: NOTE TO REVIEWERS OF THIS DISCUSSION PR: Please ignore the `0.7.0` version numbers and links in the table below.
They're happening because the doc set is currently focused on v0.7.7 and
we use variables for the versioned file/URI names. When we
move to v1.0.0, the version numbers and links will change automatically.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Deployment platform</th>
        <th>Manifest</th>
        <th>Production readiness in Kubeflow v1.0</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Existing Kubernetes cluster</td>
        <td><a href="{{% config-uri-k8s-istio %}}">{{% config-file-k8s-istio %}}</a> 
          (<a href="/docs/started/k8s/kfctl-k8s-istio/">docs</a>)</td>
        <td>Production-ready</td>
      </tr>
      <tr>
        <td>Existing Kubernetes cluster</td>
        <td><a href="{{% config-uri-existing-arrikto %}}">{{% config-file-existing-arrikto %}}</a> 
          (<a href="/docs/started/k8s/kfctl-existing-arrikto/">docs</a>)</td>
        <td>Production-ready</td>
      </tr>
      <tr>
        <td>Amazon Web Services (AWS)</td>
        <td><a href="{{% config-uri-aws-standard %}}">{{% config-file-aws-standard %}}</a> 
          (<a href="/docs/aws/deploy/install-kubeflow/">docs</a>)</td>
        <td>Production-ready</td>
      </tr>
      <tr>
        <td>Amazon Web Services (AWS)</td>
        <td><a href="{{% config-uri-aws-cognito %}}">{{% config-file-aws-cognito %}}</a> 
          (<a href="/docs/aws/deploy/install-kubeflow/">docs</a>)</td>
        <td>Production-ready</td>
      </tr>
      <tr>
        <td>Microsoft Azure</td>
        <td><a href="{{% config-uri-k8s-istio %}}">{{% config-file-k8s-istio %}}</a>  
          (<a href="/docs/azure/deploy/install-kubeflow/">docs</a>)</td>
        <td>Production-ready</td>
      </tr>
      <tr>
        <td>Google Cloud Platform (GCP)</td>
        <td><a href="{{% config-uri-gcp-basic-auth %}}">{{% config-file-gcp-basic-auth %}}</a>  
          (<a href="/docs/gke/deploy/">docs</a>)</td>
        <td>Production-ready</td>
      </tr>
      <tr>
        <td>Google Cloud Platform (GCP)</td>
        <td><a href="{{% config-uri-gcp-iap %}}">{{% config-file-gcp-iap %}}</a>  
          (<a href="/docs/gke/deploy/">docs</a>)</td>
        <td>Production-ready</td>
      </tr>
      <tr>
        <td>IBM Cloud Private</td>
        <td><a href="{{% config-uri-k8s-istio %}}">{{% config-file-k8s-istio %}}</a>  
          (<a href="/docs/started/cloud/getting-started-icp/">docs</a>)</td>
        <td>Production-ready</td>
      </tr>
    </tbody>
  </table>
</div>

<a id="sdk-matrix"></a>
## Kubeflow SDKs and CLIs for Kubeflow v1.0

Alongside Kubeflow v1.0, you may want to use one of the following Kubeflow
SDKs and command-line interfaces (CLIs).

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>SDK / CLI</th>
        <th>Production readiness with Kubeflow v1.0</th>
        <th>SDK/CLI version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/kubeflow/fairing">Fairing</a> (<a href="/docs/fairing/">docs</a>)</td>
        <td>Beta</td>
        <td>TODO</td>
      </tr>
      <tr>
        <td><a href="https://github.com/kubeflow/kfctl">kfctl</a> (<a href="/docs/other-guides/kustomize/">docs</a>)</td>
        <td>Production-ready</td>
        <td>1.0</td>
      </tr>
    </tbody>
  </table>
</div>

## Support levels

The expectations for supportability and the types of support available depend
on the production-ready status of each application or deployment platform.
For more information, see the support details page (*TODO: LINK COMING SOON*).
