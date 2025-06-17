+++
title = "Kubeflow 1.10"
description = "Information about the Kubeflow 1.10 release"
weight = 95
+++

## Kubeflow 1.10.1

<div class="table-responsive">
<table class="table table-bordered">
  <tbody>
    <tr>
      <th class="table-light">Release Date</th>
      <td>
        2025-04-01
      </td>
    </tr>
    <tr>
      <th class="table-light">Media</th>
      <td>
        <b>Blog:</b> 
          <a href="https://blog.kubeflow.org/kubeflow-1.10-release/">Kubeflow 1.10 Release Announcement</a>
        <br>
        <b>Video:</b> 
          To be pubçished
        <br>
        <b>Roadmap:</b>
          <a href="https://github.com/kubeflow/kubeflow/blob/master/ROADMAP.md#kubeflow-110-release-planned-for-release-mar-2025">Kubeflow 1.10 Features</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Manifests</th>
      <td>
        <b>Release:</b> 
          <a href="https://github.com/kubeflow/manifests/releases/tag/v1.10.0">v1.10.0</a>
        <br>
        <b>Branch:</b>
          <a href="https://github.com/kubeflow/manifests/tree/v1.10-branch">v1.10-branch</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Release Team</th>
      <td>
        <b>Lead:</b> Ricardo Martinelli de Oliveira (<a href="https://github.com/rimolive">@rimolive</a>)
        <br>
        <b>Member:</b> Valentina Rodriguez Sosa (<a href="https://github.com/varodrig">@varodrig</a>)
        <br>
        <b>Member:</b> Dagvanorov Lkhagvajav (<a href="https://github.com/tombuuz">@tombuuz</a>)
        <br>
        <b>Member:</b> Tarek Abouzeid (<a href="https://github.com/tarekabouzeid">@tarekabouzeid</a>)
        <br>
        <b>Member:</b> Sailesh Duddupudi (<a href="https://github.com/saileshd1402">@saileshd1402</a>)
        <br>
        <b>Member:</b> Manos Vlassis (<a href="https://github.com/mvlassis">@mvlassis</a>)
        <br>
        <b>Member:</b> Helber Belmiro (<a href="https://github.com/hbelmiro">@hbelmiro</a>)
        <br>
        <b>Member:</b> Milos Grubjesic (<a href="https://github.com/milosjava">@milosjava</a>)
        <br>
        <b>Member:</b> Vraj Bhatt (<a href="https://github.com/vrajjbhatt">@vrajjbhatt</a>)
        <br>
        <b>Product Manager:</b> Dimitris Poulopoulos (<a href="https://github.com/StefanoFioravanzo">@StefanoFioravanzo</a>)
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
          <a href="https://github.com/kubeflow/katib/releases/tag/v0.18.0">v0.18.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Notebooks Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="9" class="align-middle">Notebooks Working Group</td>
        <td>Admission Webhook (PodDefaults)</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/admission-webhook">v1.10.0</a>
        </td>
      </tr>
      <tr>
        <td>Central Dashboard</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/centraldashboard">v1.10.0</a>
        </td>
      </tr>
      <tr>
        <td>Jupyter Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/crud-web-apps/jupyter">v1.10.0</a>
        </td>
      </tr>
      <tr>
        <td>Kubeflow Access Management API</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/access-management">v1.10.0</a>
        </td>
      </tr>
      <tr>
        <td>Notebook Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/notebook-controller">v1.10.0</a>
        </td>
      </tr>
      <tr>
        <td>Profile Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/profile-controller">v1.10.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Controller</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/notebook-controller">v1.10.0</a>
        </td>
      </tr>
      <tr>
        <td>Tensorboard Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/crud-web-apps/volumes">v1.10.0</a>
        </td>
      </tr>
      <tr>
        <td>Volumes Web App</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/crud-web-apps/tensorboards">v1.10.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Pipelines Working Group</td>
        <td>Kubeflow Pipelines</td>
        <td>
          <a href="https://github.com/kubeflow/pipelines/releases/tag/2.5.0">v2.5.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Serving Working Group</td>
        <td>KServe</td>
        <td>
          <a href="https://github.com/kserve/kserve/releases/tag/v0.15.0">v0.15.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Training Working Group</td>
        <td>Training Operator</td>
        <td>
          <a href="https://github.com/kubeflow/training-operator/releases/tag/v1.9.2">v1.9.2</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Data Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Data Working Group</td>
        <td>Model Registry</td>
        <td>
          <a href="https://github.com/kubeflow/model-registry/releases/tag/v0.2.17">v0.2.17</a>
        </td>
      </tr>
      <tr>
        <td>Spark Operator</td>
        <td>
          <a href="https://github.com/kubeflow/spark-operator/releases/tag/v2.1.1">v2.1.1</a>
        </td>
      </tr>
  </tbody>
</table>
</div>

### Dependency Versions (Manifests)

{{% alert title="Note" color="warning" %}}
This information is only for the manifests found in the <a href="https://github.com/kubeflow/manifests">kubeflow/manifests</a> repository, packaged distributions may have different requirements or supported versions.
{{% /alert %}}

<div class="table-responsive">
<table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Dependency</th>
        <th>Validated or Included Version(s)</th>
        <th>Notes</th>
      </tr>
    </thead>
  <tbody>
      <!-- ======================= -->
      <!-- Kubernetes -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://kubernetes.io/">Kubernetes</a>
        </td>
        <td>1.32</td>
        <td rowspan="4" class="align-middle">
          <i>Other versions may work, but have not been validated by the <a href="https://github.com/kubeflow/community/tree/master/wg-manifests">Kubeflow Manifests Working Group</a>.</i>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Istio -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://istio.io/">Istio</a>
        </td>
        <td>1.24.3</td>
      </tr>
      <!-- ======================= -->
      <!-- cert-manager  -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://cert-manager.io/">cert-manager</a>
        </td>
        <td>1.16.1</td>
      </tr>
      <!-- ======================= -->
      <!-- dex  -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://dexidp.io/">dex</a>
        </td>
        <td>2.41.1</td>
      </tr>
      <!-- ======================= -->
      <!-- Kustomize  -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://kustomize.io/">Kustomize</a>
        </td>
        <td>5.4</td>
      </tr>
      <!-- ======================= -->
      <!-- Knative Serving -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://knative.dev/docs/serving/">Knative Serving</a>
        </td>
        <td>1.16.2</td>
        <td rowspan="2" class="align-middle">
          <i>Knative is only needed when using the optional <a href="https://kserve.github.io/website/">KServe Component</a>.</i>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Knative Eventing -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://knative.dev/docs/eventing/">Knative Eventing</a>
        </td>
        <td>1.16.4</td>
      </tr>
      <!-- ======================= -->
      <!-- OAuth2-proxy -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://github.com/oauth2-proxy/oauth2-proxy/releases/tag/v7.6.0">OAuth2 Proxy</a>
        </td>
        <td>7.7.1</td>
      </tr>
  </tbody>
</table>
</div>
