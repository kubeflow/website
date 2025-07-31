+++
title = "Kubeflow AI reference platform 1.4"
description = "Information about the Kubeflow AI reference platform 1.4 release"
weight = 100
+++

## Kubeflow AI reference platform 1.4.1

<div class="table-responsive">
<table class="table table-bordered">
  <tbody>
    <tr>
      <th class="table-light">Release Date</th>
      <td>
        2021-12-23
      </td>
    </tr>
    <tr>
      <th class="table-light">Media</th>
      <td>
        <b>Blog:</b> 
          <a href="https://blog.kubeflow.org/kubeflow-1.4-release/">Kubeflow 1.4 Release Announcement</a>
        <br>
        <b>Video:</b> 
          <a href="https://www.youtube.com/watch?v=gG61gHw4J14">Kubeflow 1.4 Release Overview</a>
        <br>
        <b>Roadmap:</b>
          <a href="https://github.com/kubeflow/kubeflow/blob/master/ROADMAP.md#kubeflow-141-release-delivered-december-2021">Kubeflow 1.4.1 Features</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Manifests</th>
      <td>
        <b>Release:</b> 
          <a href="https://github.com/kubeflow/manifests/releases/tag/v1.4.1">v1.4.1</a>
        <br>
        <b>Branch:</b>
          <a href="https://github.com/kubeflow/manifests/tree/v1.4-branch">v1.4-branch</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Release Team</th>
      <td>
        <b>Lead:</b> Kimonas Sotirchos (<a href="https://github.com/kimwnasptd">@kimwnasptd</a>)
        <br>
        <b>Member:</b> Anna Jung (<a href="https://github.com/annajung">@annajung</a>)
        <br>
        <b>Member:</b> David van der Spek (<a href="https://github.com/DavidSpek">@DavidSpek</a>)
        <br>
        <b>Member:</b> Rui Vasconcelos (<a href="https://github.com/RFMVasconcelos">@RFMVasconcelos</a>)
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
        <td rowspan="1" class="align-middle">AutoML Working Group</td>
        <td>Katib</td>
        <td>
          <a href="https://github.com/kubeflow/katib/releases/tag/v0.12.0">v0.12.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Notebooks Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="9" class="align-middle">Notebooks Working Group</td>
        <td>Admission Webhook (PodDefaults)</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/admission-webhook">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Central Dashboard</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/centraldashboard">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Jupyter Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/crud-web-apps/jupyter">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Access Management API</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/access-management">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Notebook Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/notebook-controller">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Profile Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/profile-controller">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/notebook-controller">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/crud-web-apps/volumes">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Volumes Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/crud-web-apps/tensorboards">v1.4.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Pipelines Working Group</td>
        <td>Kubeflow Pipelines</td>
        <td>
          <a href="https://github.com/kubeflow/pipelines/releases/tag/1.7.0">v1.7.0</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Pipelines Tekton</td>
        <td>
          <a href="https://github.com/kubeflow/kfp-tekton/releases/tag/v1.0.0">v1.0.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Serving Working Group</td>
        <td>KFServing (KServe)</td>
        <td>
          <a href="https://github.com/kserve/kserve/releases/tag/v0.6.1">v0.6.1</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Training Working Group</td>
        <td>MPI Operator</td>
        <td>
          <a href="https://github.com/kubeflow/mpi-operator/releases/tag/v0.3.0">v0.3.0</a>
        </td>
      </tr>
      <tr>
        <td>Training Operator</td>
        <td>
          <a href="https://github.com/kubeflow/training-operator/releases/tag/v1.3.0">v1.3.0</a>
        </td>
      </tr>
  </tbody>
</table>
</div>

## Kubeflow AI reference platform 1.4.0

<div class="table-responsive">
<table class="table table-bordered">
  <tbody>
    <tr>
      <th class="table-light">Release Date</th>
      <td>
        2021-10-12
      </td>
    </tr>
    <tr>
      <th class="table-light">Media</th>
      <td>
        <b>Blog:</b> 
          <a href="https://blog.kubeflow.org/kubeflow-1.4-release/">Kubeflow 1.4 Release Announcement</a>
        <br>
        <b>Video:</b> 
          <a href="https://www.youtube.com/watch?v=gG61gHw4J14">Kubeflow 1.4 Release Overview</a>
        <br>
        <b>Roadmap:</b>
          <a href="https://github.com/kubeflow/kubeflow/blob/master/ROADMAP.md#kubeflow-14-release-delivered-october-2021">Kubeflow 1.4 Features</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Manifests</th>
      <td>
        <b>Release:</b> 
          <a href="https://github.com/kubeflow/manifests/releases/tag/v1.4.0">v1.4.0</a>
        <br>
        <b>Branch:</b>
          <a href="https://github.com/kubeflow/manifests/tree/v1.4-branch">v1.4-branch</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Release Team</th>
      <td>
        <b>Lead:</b> Kimonas Sotirchos (<a href="https://github.com/kimwnasptd">@kimwnasptd</a>)
        <br>
        <b>Member:</b> Anna Jung (<a href="https://github.com/annajung">@annajung</a>)
        <br>
        <b>Member:</b> David van der Spek (<a href="https://github.com/DavidSpek">@DavidSpek</a>)
        <br>
        <b>Member:</b> Rui Vasconcelos (<a href="https://github.com/RFMVasconcelos">@RFMVasconcelos</a>)
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
        <td rowspan="1" class="align-middle">AutoML Working Group</td>
        <td>Katib</td>
        <td>
          <a href="https://github.com/kubeflow/katib/releases/tag/v0.12.0">v0.12.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Notebooks Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="9" class="align-middle">Notebooks Working Group</td>
        <td>Admission Webhook (PodDefaults)</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/admission-webhook">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Central Dashboard</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/centraldashboard">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Jupyter Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/crud-web-apps/jupyter">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Access Management API</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/access-management">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Notebook Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/notebook-controller">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Profile Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/profile-controller">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/notebook-controller">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/crud-web-apps/volumes">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Volumes Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.4.0/components/crud-web-apps/tensorboards">v1.4.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Pipelines Working Group</td>
        <td>Kubeflow Pipelines</td>
        <td>
          <a href="https://github.com/kubeflow/pipelines/releases/tag/1.7.0">v1.7.0</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Pipelines Tekton</td>
        <td>
          <a href="https://github.com/kubeflow/kfp-tekton/releases/tag/v1.0.0">v1.0.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Serving Working Group</td>
        <td>KFServing (KServe)</td>
        <td>
          <a href="https://github.com/kserve/kserve/releases/tag/v0.6.1">v0.6.1</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Training Working Group</td>
        <td>MPI Operator</td>
        <td>
          <a href="https://github.com/kubeflow/mpi-operator/releases/tag/v0.3.0">v0.3.0</a>
        </td>
      </tr>
      <tr>
        <td>Training Operator</td>
        <td>
          <a href="https://github.com/kubeflow/training-operator/releases/tag/v1.3.0">v1.3.0</a>
        </td>
      </tr>
  </tbody>
</table>
</div>
