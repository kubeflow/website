+++
title = "Kubeflow AI reference platform 1.3"
description = "Information about the Kubeflow AI reference platform 1.3 release"
weight = 101
+++

## Kubeflow AI reference platform 1.3.1

<div class="table-responsive">
<table class="table table-bordered">
  <tbody>
    <tr>
      <th class="table-light">Release Date</th>
      <td>
        2021-08-04
      </td>
    </tr>
    <tr>
      <th class="table-light">Media</th>
      <td>
        <b>Blog:</b> 
          <a href="https://blog.kubeflow.org/kubeflow-1.3-release/">Kubeflow 1.3 Release Announcement</a>
        <br>
        <b>Video:</b> 
          <a href="https://www.youtube.com/watch?v=RjN55bQ4kh4">Kubeflow 1.3 Release Overview</a>
        <br>
        <b>Roadmap:</b>
          <a href="https://github.com/kubeflow/kubeflow/blob/master/ROADMAP.md#kubeflow-13-features-released-april-2021">Kubeflow 1.3 Features</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Manifests</th>
      <td>
        <b>Release:</b> 
          <a href="https://github.com/kubeflow/manifests/releases/tag/v1.3.1">v1.3.1</a>
        <br>
        <b>Branch:</b>
          <a href="https://github.com/kubeflow/manifests/tree/v1.3-branch">v1.3-branch</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Release Team</th>
      <td>
        <b>Lead:</b> Yannis Zarkadas (<a href="https://github.com/yanniszark">@yanniszark</a>)
      </td>
    </tr>
  </tbody>
</table>
</div>

### Component Versions

<div class="table-responsive">
<table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Maintainers</th>
        <th>Component Name</th>
        <th>Version</th>
      </tr>
    </thead>
  <tbody>
      <!-- ======================= -->
      <!-- AutoML Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1">AutoML Working Group</td>
        <td>Katib</td>
        <td>
          <a href="https://github.com/kubeflow/katib/releases/tag/v0.11.1">v0.11.1</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Notebooks Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="9" class="align-middle">Notebooks Working Group</td>
        <td>Admission Webhook (PodDefaults)</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.1-rc.0/components/admission-webhook">v1.3.1-rc.0</a>
        </td>
      </tr>
      <tr>
        <td>Central Dashboard</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.1-rc.0/components/centraldashboard">v1.3.1-rc.0</a>
        </td>
      </tr>
      <tr>
        <td>Jupyter Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.1-rc.0/components/crud-web-apps/jupyter">v1.3.1-rc.0</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Access Management API</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.1-rc.0/components/access-management">v1.3.1-rc.0</a>
        </td>
      </tr>
      <tr>
        <td>Notebook Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.1-rc.0/components/notebook-controller">v1.3.1-rc.0</a>
        </td>
      </tr>
      <tr>
        <td>Profile Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.1-rc.0/components/profile-controller">v1.3.1-rc.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.1-rc.0/components/notebook-controller">v1.3.1-rc.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.1-rc.0/components/crud-web-apps/volumes">v1.3.1-rc.0</a>
        </td>
      </tr>
      <tr>
        <td>Volumes Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.1-rc.0/components/crud-web-apps/tensorboards">v1.3.1-rc.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Pipelines Working Group</td>
        <td>Kubeflow Pipelines</td>
        <td>
          <a href="https://github.com/kubeflow/pipelines/releases/tag/1.5.1">v1.5.1</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Pipelines Tekton</td>
        <td>
          <a href="https://github.com/kubeflow/kfp-tekton/releases/tag/v0.8.0">v0.8.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Serving Working Group</td>
        <td>KFServing</td>
        <td>
          <a href="https://github.com/kserve/kserve/releases/tag/v0.5.0">v0.5.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="5" class="align-middle">Training Working Group</td>
        <td>MPI Operator</td>
        <td>
          <a href="https://github.com/kubeflow/mpi-operator/releases/tag/v0.2.3">v0.2.3</a>
        </td>
      </tr>
      <tr>
        <td>MXNet Operator</td>
        <td>
          <a href="https://github.com/kubeflow/mxnet-operator/releases/tag/v1.1.0">v1.1.0</a>
        </td>
      </tr>
      <tr>
        <td>PyTorch Operator</td>
        <td>
          <a href="https://github.com/kubeflow/pytorch-operator/releases/tag/v0.7.0">v0.7.0</a>
        </td>
      </tr>
      <tr>
        <td>Training Operator</td>
        <td>
          <a href="https://github.com/kubeflow/training-operator/releases/tag/v1.1.0">v1.1.0</a>
        </td>
      </tr>
      <tr>
        <td>XGBoost Operator</td>
        <td>
          <a href="https://github.com/kubeflow/xgboost-operator/releases/tag/v0.2.0">v0.2.0</a>
        </td>
      </tr>
  </tbody>
</table>
</div>

## Kubeflow 1.3.0

<div class="table-responsive">
<table class="table table-bordered">
  <tbody>
    <tr>
      <th class="table-light">Release Date</th>
      <td>
        2021-04-23
      </td>
    </tr>
    <tr>
      <th class="table-light">Media</th>
      <td>
        <b>Blog:</b> 
          <a href="https://blog.kubeflow.org/kubeflow-1.3-release/">Kubeflow 1.3 Release Announcement</a>
        <br>
        <b>Video:</b> 
          <a href="https://www.youtube.com/watch?v=RjN55bQ4kh4">Kubeflow 1.3 Release Overview</a>
        <br>
        <b>Roadmap:</b>
          <a href="https://github.com/kubeflow/kubeflow/blob/master/ROADMAP.md#kubeflow-13-features-released-april-2021">Kubeflow 1.3 Features</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Manifests</th>
      <td>
        <b>Release:</b> 
          <a href="https://github.com/kubeflow/manifests/releases/tag/v1.3.0">v1.3.0</a>
        <br>
        <b>Branch:</b>
          <a href="https://github.com/kubeflow/manifests/tree/v1.3-branch">v1.3-branch</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Release Team</th>
      <td>
        <b>Lead:</b> Yannis Zarkadas (<a href="https://github.com/yanniszark">@yanniszark</a>)
      </td>
    </tr>
  </tbody>
</table>
</div>

### Component Versions

<div class="table-responsive">
<table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Maintainers</th>
        <th>Component Name</th>
        <th>Version</th>
      </tr>
    </thead>
  <tbody>
      <!-- ======================= -->
      <!-- AutoML Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1">AutoML Working Group</td>
        <td>Katib</td>
        <td>
          <a href="https://github.com/kubeflow/katib/releases/tag/v0.11.0">v0.11.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Notebooks Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="9" class="align-middle">Notebooks Working Group</td>
        <td>Admission Webhook (PodDefaults)</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.0-rc.1/components/admission-webhook">v1.3.0-rc.1</a>
        </td>
      </tr>
      <tr>
        <td>Central Dashboard</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.0-rc.1/components/centraldashboard">v1.3.0-rc.1</a>
        </td>
      </tr>
      <tr>
        <td>Jupyter Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.0-rc.1/components/crud-web-apps/jupyter">v1.3.0-rc.1</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Access Management API</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.0-rc.1/components/access-management">v1.3.0-rc.1</a>
        </td>
      </tr>
      <tr>
        <td>Notebook Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.0-rc.1/components/notebook-controller">v1.3.0-rc.1</a>
        </td>
      </tr>
      <tr>
        <td>Profile Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.0-rc.1/components/profile-controller">v1.3.0-rc.1</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.0-rc.1/components/notebook-controller">v1.3.0-rc.1</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.0-rc.1/components/crud-web-apps/volumes">v1.3.0-rc.1</a>
        </td>
      </tr>
      <tr>
        <td>Volumes Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.3.0-rc.1/components/crud-web-apps/tensorboards">v1.3.0-rc.1</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Pipelines Working Group</td>
        <td>Kubeflow Pipelines</td>
        <td>
          <a href="https://github.com/kubeflow/pipelines/releases/tag/1.5.0">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Pipelines Tekton</td>
        <td>
          <a href="https://github.com/kubeflow/kfp-tekton/releases/tag/v0.8.0-rc0">v0.8.0-rc0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Serving Working Group</td>
        <td>KFServing</td>
        <td>
          <a href="https://github.com/kserve/kserve/releases/tag/v0.5.0">v0.5.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="5" class="align-middle">Training Working Group</td>
        <td>MPI Operator</td>
        <td>
          <a href="https://github.com/kubeflow/mpi-operator/releases/tag/v0.2.3">v0.2.3</a>
        </td>
      </tr>
      <tr>
        <td>MXNet Operator</td>
        <td>
          <a href="https://github.com/kubeflow/mxnet-operator/releases/tag/v1.1.0">v1.1.0</a>
        </td>
      </tr>
      <tr>
        <td>PyTorch Operator</td>
        <td>
          <a href="https://github.com/kubeflow/pytorch-operator/releases/tag/v0.7.0">v0.7.0</a>
        </td>
      </tr>
      <tr>
        <td>Training Operator</td>
        <td>
          <a href="https://github.com/kubeflow/training-operator/releases/tag/v1.1.0">v1.1.0</a>
        </td>
      </tr>
      <tr>
        <td>XGBoost Operator</td>
        <td>
          <a href="https://github.com/kubeflow/xgboost-operator/releases/tag/v0.2.0">v0.2.0</a>
        </td>
      </tr>
  </tbody>
</table>
</div>
