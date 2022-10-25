+++
title = "Kubeflow 1.6"
description = "Information about the Kubeflow 1.6 release"
weight = 98
+++

## 1.6.1

<div class="table-responsive">
<table class="table table-bordered">
  <tbody>
    <tr>
      <th class="table-light">Release Date</th>
      <td>
        2022-10-10
      </td>
    </tr>
    <tr>
      <th class="table-light">Media</th>
      <td>
        <b>Blog:</b> 
          <a href="https://blog.kubeflow.org/kubeflow-1.6-release/">Kubeflow 1.6 Release Announcement</a>
        <br>
        <b>Video:</b> 
          <a href="https://www.youtube.com/watch?v=RR1xSfnFGGI">Kubeflow 1.6 Release Overview</a>
        <br>
        <b>Roadmap:</b>
          <a href="https://github.com/kubeflow/kubeflow/blob/master/ROADMAP.md#kubeflow-16-release-delivered-september-2022">Kubeflow 1.6 Features</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Manifests</th>
      <td>
        <b>Release:</b> 
          <a href="https://github.com/kubeflow/manifests/releases/tag/v1.6.1">v1.6.1</a>
        <br>
        <b>Branch:</b>
          <a href="https://github.com/kubeflow/manifests/tree/v1.6-branch">v1.6-branch</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Release Team</th>
      <td>
        <b>Lead:</b> Anna Jung (<a href="https://github.com/annajung">@annajung</a>)
        <br>
        <b>Member:</b> Amber Graner (<a href="https://github.com/akgraner">@akgraner</a>)
        <br>
        <b>Member:</b> Daniela Plascencia (<a href="https://github.com/DnPlas">@DnPlas</a>)
        <br>
        <b>Member:</b> Dominik Fleischmann (<a href="https://github.com/DomFleischmann">@DomFleischmann</a>)
        <br>
        <b>Member:</b> Kartik Kalamadi (<a href="https://github.com/akartsky">@akartsky</a>)
        <br>
        <b>Member:</b> Kimonas Sotirchos (<a href="https://github.com/kimwnasptd">@kimwnasptd</a>)
        <br>
        <b>Member:</b> Maciek Stopa (<a href="https://github.com/mstopa">@mstopa</a>)
        <br>
        <b>Member:</b> Suraj Kota (<a href="https://github.com/surajkota">@surajkota</a>)
        <br>
        <b>Product Manager:</b> Josh Bottum (<a href="https://github.com/jbottum">@jbottum</a>)
      </td>
    </tr>
  </tbody>
</table>
</div>

<br>
<b>Versions of components in 1.6.1:</b>

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
          <a href="https://github.com/kubeflow/katib/releases/tag/v0.14.0">v0.14.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Notebooks Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="9" class="align-middle">Notebooks Working Group</td>
        <td>Admission Webhook (PodDefaults)</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.1/components/admission-webhook">v1.6.1</a>
        </td>
      </tr>
      <tr>
        <td>Central Dashboard</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.1/components/centraldashboard">v1.6.1</a>
        </td>
      </tr>
      <tr>
        <td>Jupyter Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.1/components/crud-web-apps/jupyter">v1.6.1</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Access Management API</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.1/components/access-management">v1.6.1</a>
        </td>
      </tr>
      <tr>
        <td>Notebook Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.1/components/notebook-controller">v1.6.1</a>
        </td>
      </tr>
      <tr>
        <td>Profile Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.1/components/profile-controller">v1.6.1</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.1/components/notebook-controller">v1.6.1</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.1/components/crud-web-apps/volumes">v1.6.1</a>
        </td>
      </tr>
      <tr>
        <td>Volumes Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.1/components/crud-web-apps/tensorboards">v1.6.1</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Pipelines Working Group</td>
        <td>Kubeflow Pipelines</td>
        <td>
          <a href="https://github.com/kubeflow/pipelines/releases/tag/2.0.0-alpha.5">v2.0.0-alpha.5</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Pipelines Tekton</td>
        <td>
          <a href="https://github.com/kubeflow/kfp-tekton/releases/tag/v1.2.1">v1.2.1</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Serving Working Group</td>
        <td>KServe</td>
        <td>
          <a href="https://github.com/kserve/kserve/releases/tag/v0.8.0">v0.8.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Training Working Group</td>
        <td>Training Operator</td>
        <td>
          <a href="https://github.com/kubeflow/training-operator/releases/tag/v1.5.0">v1.5.0</a>
        </td>
      </tr>
  </tbody>
</table>
</div>

<br>
<b>Versions of dependencies in 1.6.1:</b>

<div class="table-responsive">
<table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Dependent Component Name</th>
        <th>Version</th>
      </tr>
    </thead>
  <tbody>
      <!-- ======================= -->
      <!-- Kubernetes -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Kubernetes</td>
        <td>
          1.22
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Istio -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Istio</td>
        <td>
          1.14.1
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Knative  -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Knative</td>
        <td>
          1.2
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Cert Manager  -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Cert Manager</td>
        <td>
          1.5.0
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Dex  -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Dex</td>
        <td>
          2.31.2
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Kustomize  -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Kustomize</td>
        <td>
          3.2.0
        </td>
      </tr>
  </tbody>
</table>
</div>

## 1.6.0

<div class="table-responsive">
<table class="table table-bordered">
  <tbody>
    <tr>
      <th class="table-light">Release Date</th>
      <td>
        2022-09-07
      </td>
    </tr>
    <tr>
      <th class="table-light">Media</th>
      <td>
        <b>Blog:</b> 
          <a href="https://blog.kubeflow.org/kubeflow-1.6-release/">Kubeflow 1.6 Release Announcement</a>
        <br>
        <b>Video:</b> 
          <a href="https://www.youtube.com/watch?v=RR1xSfnFGGI">Kubeflow 1.6 Release Overview</a>
        <br>
        <b>Roadmap:</b>
          <a href="https://github.com/kubeflow/kubeflow/blob/master/ROADMAP.md#kubeflow-16-release-delivered-september-2022">Kubeflow 1.6 Features</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Manifests</th>
      <td>
        <b>Release:</b> 
          <a href="https://github.com/kubeflow/manifests/releases/tag/v1.6.0">v1.6.0</a>
        <br>
        <b>Branch:</b>
          <a href="https://github.com/kubeflow/manifests/tree/v1.6-branch">v1.6-branch</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Release Team</th>
      <td>
        <b>Lead:</b> Anna Jung (<a href="https://github.com/annajung">@annajung</a>)
        <br>
        <b>Member:</b> Amber Graner (<a href="https://github.com/akgraner">@akgraner</a>)
        <br>
        <b>Member:</b> Daniela Plascencia (<a href="https://github.com/DnPlas">@DnPlas</a>)
        <br>
        <b>Member:</b> Dominik Fleischmann (<a href="https://github.com/DomFleischmann">@DomFleischmann</a>)
        <br>
        <b>Member:</b> Kartik Kalamadi (<a href="https://github.com/akartsky">@akartsky</a>)
        <br>
        <b>Member:</b> Kimonas Sotirchos (<a href="https://github.com/kimwnasptd">@kimwnasptd</a>)
        <br>
        <b>Member:</b> Maciek Stopa (<a href="https://github.com/mstopa">@mstopa</a>)
        <br>
        <b>Member:</b> Suraj Kota (<a href="https://github.com/surajkota">@surajkota</a>)
        <br>
        <b>Product Manager:</b> Josh Bottum (<a href="https://github.com/jbottum">@jbottum</a>)
      </td>
    </tr>
  </tbody>
</table>
</div>

<br>
<b>Versions of components in 1.6.0:</b>

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
          <a href="https://github.com/kubeflow/katib/releases/tag/v0.14.0">v0.14.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Notebooks Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="9" class="align-middle">Notebooks Working Group</td>
        <td>Admission Webhook (PodDefaults)</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.0/components/admission-webhook">v1.6.0</a>
        </td>
      </tr>
      <tr>
        <td>Central Dashboard</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.0/components/centraldashboard">v1.6.0</a>
        </td>
      </tr>
      <tr>
        <td>Jupyter Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.0/components/crud-web-apps/jupyter">v1.6.0</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Access Management API</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.0/components/access-management">v1.6.0</a>
        </td>
      </tr>
      <tr>
        <td>Notebook Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.0/components/notebook-controller">v1.6.0</a>
        </td>
      </tr>
      <tr>
        <td>Profile Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.0/components/profile-controller">v1.6.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.0/components/notebook-controller">v1.6.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.0/components/crud-web-apps/volumes">v1.6.0</a>
        </td>
      </tr>
      <tr>
        <td>Volumes Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.6.0/components/crud-web-apps/tensorboards">v1.6.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Pipelines Working Group</td>
        <td>Kubeflow Pipelines</td>
        <td>
          <a href="https://github.com/kubeflow/pipelines/releases/tag/2.0.0-alpha.3">v2.0.0-alpha.3</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Pipelines Tekton</td>
        <td>
          <a href="https://github.com/kubeflow/kfp-tekton/releases/tag/v1.2.1">v1.2.1</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Serving Working Group</td>
        <td>KServe</td>
        <td>
          <a href="https://github.com/kserve/kserve/releases/tag/v0.8.0">v0.8.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Training Working Group</td>
        <td>Training Operator</td>
        <td>
          <a href="https://github.com/kubeflow/training-operator/releases/tag/v1.5.0">v1.5.0</a>
        </td>
      </tr>
  </tbody>
</table>
</div>

<br>
<b>Versions of dependencies in 1.6.0:</b>

<div class="table-responsive">
<table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Dependent Component Name</th>
        <th>Version</th>
      </tr>
    </thead>
  <tbody>
      <!-- ======================= -->
      <!-- Kubernetes -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Kubernetes</td>
        <td>
          1.22
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Istio -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Istio</td>
        <td>
          1.14.1
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Knative  -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Knative</td>
        <td>
          1.2
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Cert Manager  -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Cert Manager</td>
        <td>
          1.5.0
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Dex  -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Dex</td>
        <td>
          2.31.2
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Kustomize  -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Kustomize</td>
        <td>
          3.2.0
        </td>
      </tr>
  </tbody>
</table>
</div>