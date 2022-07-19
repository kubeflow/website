+++
title = "Kubeflow 1.5"
description = "Information about the Kubeflow 1.5 release"
weight = 99
+++

## 1.5.1

<div class="table-responsive">
<table class="table table-bordered">
  <tbody>
    <tr>
      <th class="table-light">Release Date</th>
      <td>
        2022-06-15
      </td>
    </tr>
    <tr>
      <th class="table-light">Roadmap</th>
      <td>
        N/A
      </td>
    </tr>
    <tr>
      <th class="table-light">Manifests</th>
      <td>
        <b>Release:</b> 
          <a href="https://github.com/kubeflow/manifests/releases/tag/v1.5.1">v1.5.1</a>
        <br>
        <b>Branch:</b>
          <a href="https://github.com/kubeflow/manifests/tree/v1.5-branch">v1.5-branch</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Release Team</th>
      <td>
        <b>Lead:</b> Kimonas Sotirchos (<a href="https://github.com/kimwnasptd">@kimwnasptd</a>)
        <br>
        <b>Member:</b> Anna Jung (<a href="https://github.com/annajung">@annajung</a>)
        <br>
        <b>Member:</b> Daniela Plascencia (<a href="https://github.com/DnPlas">@DnPlas</a>)
        <br>
        <b>Member:</b> Dominik Fleischmann (<a href="https://github.com/DomFleischmann">@DomFleischmann</a>)
        <br>
        <b>Member:</b> Kylie Travis (<a href="https://github.com/Bhakti087">@Bhakti087</a>)
        <br>
        <b>Member:</b> Mathew Wicks (<a href="https://github.com/thesuperzapper">@thesuperzapper</a>)
        <br>
        <b>Member:</b> Suraj Kota (<a href="https://github.com/surajkota">@surajkota</a>)
        <br>
        <b>Member:</b> Vedant Padwal (<a href="https://github.com/js-ts">@js-ts</a>)
        <br>
        <b>Product Manager:</b> Josh Bottum (<a href="https://github.com/jbottum">@jbottum</a>)
        <br>
        <b>Docs Lead:</b> Shannon Bradshaw (<a href="https://github.com/shannonbradshaw">@shannonbradshaw</a>)
      </td>
    </tr>
  </tbody>
</table>
</div>

<br>
<b>Versions of components in 1.5.1:</b>

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
          <a href="https://github.com/kubeflow/katib/releases/tag/v0.13.0">v0.13.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Notebooks Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="9" class="align-middle">Notebooks Working Group</td>
        <td>Admission Webhook (PodDefaults)</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/admission-webhook">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Central Dashboard</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/centraldashboard">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Jupyter Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/crud-web-apps/jupyter">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Access Management API</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/access-management">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Notebook Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/notebook-controller">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Profile Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/profile-controller">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/notebook-controller">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/crud-web-apps/volumes">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Volumes Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/crud-web-apps/tensorboards">v1.5.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Pipelines Working Group</td>
        <td>Kubeflow Pipelines</td>
        <td>
          <a href="https://github.com/kubeflow/pipelines/releases/tag/1.8.2">v1.8.2</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Pipelines Tekton</td>
        <td>
          <a href="https://github.com/kubeflow/kfp-tekton/releases/tag/v1.1.1">v1.1.1</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Serving Working Group</td>
        <td>KServe</td>
        <td>
          <a href="https://github.com/kserve/kserve/releases/tag/v0.7.0">v0.7.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Training Working Group</td>
        <td>MPI Operator</td>
        <td>
          <a href="https://github.com/kubeflow/mpi-operator/releases/tag/v1.4.0">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Training Operator</td>
        <td>
          <a href="https://github.com/kubeflow/training-operator/releases/tag/v1.4.0">v1.4.0</a>
        </td>
      </tr>
  </tbody>
</table>
</div>

## 1.5.0

<div class="table-responsive">
<table class="table table-bordered">
  <tbody>
    <tr>
      <th class="table-light">Release Date</th>
      <td>
        2022-03-10
      </td>
    </tr>
    <tr>
      <th class="table-light">Roadmap</th>
      <td>
        N/A
      </td>
    </tr>
    <tr>
      <th class="table-light">Manifests</th>
      <td>
        <b>Release:</b> 
          <a href="https://github.com/kubeflow/manifests/releases/tag/v1.5.0">v1.5.0</a>
        <br>
        <b>Branch:</b>
          <a href="https://github.com/kubeflow/manifests/tree/v1.5-branch">v1.5-branch</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Release Team</th>
      <td>
        <b>Lead:</b> Kimonas Sotirchos (<a href="https://github.com/kimwnasptd">@kimwnasptd</a>)
        <br>
        <b>Member:</b> Anna Jung (<a href="https://github.com/annajung">@annajung</a>)
        <br>
        <b>Member:</b> Daniela Plascencia (<a href="https://github.com/DnPlas">@DnPlas</a>)
        <br>
        <b>Member:</b> Dominik Fleischmann (<a href="https://github.com/DomFleischmann">@DomFleischmann</a>)
        <br>
        <b>Member:</b> Kylie Travis (<a href="https://github.com/Bhakti087">@Bhakti087</a>)
        <br>
        <b>Member:</b> Mathew Wicks (<a href="https://github.com/thesuperzapper">@thesuperzapper</a>)
        <br>
        <b>Member:</b> Suraj Kota (<a href="https://github.com/surajkota">@surajkota</a>)
        <br>
        <b>Member:</b> Vedant Padwal (<a href="https://github.com/js-ts">@js-ts</a>)
        <br>
        <b>Product Manager:</b> Josh Bottum (<a href="https://github.com/jbottum">@jbottum</a>)
        <br>
        <b>Docs Lead:</b> Shannon Bradshaw (<a href="https://github.com/shannonbradshaw">@shannonbradshaw</a>)
      </td>
    </tr>
  </tbody>
</table>
</div>

<br>
<b>Versions of components in 1.5.0:</b>

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
          <a href="https://github.com/kubeflow/katib/releases/tag/v0.13.0">v0.13.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Notebooks Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="9" class="align-middle">Notebooks Working Group</td>
        <td>Admission Webhook (PodDefaults)</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/admission-webhook">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Central Dashboard</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/centraldashboard">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Jupyter Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/crud-web-apps/jupyter">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Access Management API</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/access-management">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Notebook Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/notebook-controller">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Profile Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/profile-controller">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/notebook-controller">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/crud-web-apps/volumes">v1.5.0</a>
        </td>
      </tr>
      <tr>
        <td>Volumes Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.5.0/components/crud-web-apps/tensorboards">v1.5.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Pipelines Working Group</td>
        <td>Kubeflow Pipelines</td>
        <td>
          <a href="https://github.com/kubeflow/pipelines/releases/tag/1.8.1">v1.8.1</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Pipelines Tekton</td>
        <td>
          <a href="https://github.com/kubeflow/kfp-tekton/releases/tag/v1.1.1">v1.1.1</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Serving Working Group</td>
        <td>KServe</td>
        <td>
          <a href="https://github.com/kserve/kserve/releases/tag/v0.7.0">v0.7.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Training Working Group</td>
        <td>MPI Operator</td>
        <td>
          <a href="https://github.com/kubeflow/mpi-operator/releases/tag/v1.4.0">v1.4.0</a>
        </td>
      </tr>
      <tr>
        <td>Training Operator</td>
        <td>
          <a href="https://github.com/kubeflow/training-operator/releases/tag/v1.4.0">v1.4.0</a>
        </td>
      </tr>
  </tbody>
</table>
</div>

