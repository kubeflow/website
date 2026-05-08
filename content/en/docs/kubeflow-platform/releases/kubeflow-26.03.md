+++
title = "Kubeflow AI reference platform 26.03"
description = "Information about the Kubeflow AI reference platform 26.03 release"
weight = 89
+++

{{% alert title="Note" color="warning" %}}
We are transitioning to a Calendar Versioning model to provide a more predictable and automated release schedule. For more details on the upcoming phases, please refer to the [Release Handbook](https://github.com/kubeflow/manifests/blob/master/releases/kubeflow-ai-reference-platform-release-handbook.md).
{{% /alert %}}

## Kubeflow AI reference platform 26.03

<div class="table-responsive">
<table class="table table-bordered">
  <tbody>
    <tr>
      <th class="table-light">Release Date</th>
      <td>
        2026-03-22
      </td>
    </tr>
    <tr>
      <th class="table-light">Media</th>
      <td>
        <b>Blog:</b> 
          To be published
      </td>
    </tr>
    <tr>
      <th class="table-light">Manifests</th>
      <td>
        <b>Release:</b> 
          <a href="https://github.com/kubeflow/manifests/releases/tag/26.03">26.03</a>
        <br>
        <b>Branch:</b>
          <a href="https://github.com/kubeflow/manifests/tree/26.03">26.03</a>
      </td>
    </tr>
    <tr>
      <th class="table-light">Release Team</th>
      <td>
        <b>Release Manager: </b> Tarek Abouzeid (<a href="https://github.com/tarekabouzeid">@tarekabouzeid</a>)
        <br>
        <b>Release Manager Shadow: </b> Dominik Kawka (<a href="https://github.com/dominikkawka">@dominikkawka</a>)
        <br>
        <b>Release Manager Shadow: </b> Milind Dethe (<a href="https://github.com/milinddethe15">@milinddethe15</a>)
        <br>
        <b>Release Manager Shadow: </b> Dhanisha Phadate (<a href="https://github.com/dhanishaphadate">@dhanishaphadate</a>)
        <br>
        <b>Release Manager Shadow: </b> Alok Dangre (<a href="https://github.com/alokdangre">@alokdangre</a>)
        <br>
        <b>Product Manager: </b> Dhanisha Phadate (<a href="https://github.com/dhanishaphadate">@dhanishaphadate</a>)
        <br>
        <b>AutoML/Katib and Training WG Liaison: </b> Anya Kramar (<a href="https://github.com/kramaranya">@kramaranya</a>)
        <br>
        <b>Notebooks/Central Dashboard WG Liaison: </b> Andy Stoneberg (<a href="https://github.com/andyatmiami">@andyatmiami</a>)
        <br>
        <b>Platform WG Liaison: </b> Tarek Abouzeid (<a href="https://github.com/tarekabouzeid">@tarekabouzeid</a>)
        <br>
        <b>Pipelines WG Liaison: </b> Alyssa Goins (<a href="https://github.com/alyssacgoins">@alyssacgoins</a>)
        <br>
        <b>Spark Operator WG: </b> Milos Grubjesic (<a href="https://github.com/milosjava">@milosjava</a>)
        <br>
        <b>Model Registry WG: </b> Matteo Mortari (<a href="https://github.com/tarilabs">@tarilabs</a>)
        <br> 
        <b>Model Registry WG: </b> Adysen Rothman (<a href="https://github.com/adysenrothman">@adysenrothman</a>)
        <br> 
        <b>KServe Liaison: </b> Vraj Bhatt (<a href="https://github.com/vrajjbhatt">@vrajjbhatt</a>)
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
        <td rowspan="2" class="align-middle">AutoML Working Group</td>
        <td>Katib</td>
        <td>
          <a href="https://github.com/kubeflow/katib/releases/tag/v0.19.0">v0.19.0</a>
        </td>
        </tr>
        <tr>
        <td>Kubeflow SDK</td>
        <td>
          <a href="https://github.com/kubeflow/sdk/releases/tag/0.3.0">v0.3.0</a>
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
        <td>Jupyter Web Application</td>
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
        <td>Tensorboard Web Application</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/crud-web-apps/tensorboards">v1.10.0</a>
        </td>
      </tr>
      <tr>
        <td>Volumes Web Application</td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/v1.10.0/components/crud-web-apps/volumes">v1.10.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Pipelines Working Group</td>
        <td>Kubeflow Pipelines</td>
        <td>
          <a href="https://github.com/kubeflow/pipelines/releases/tag/2.16.0">v2.16.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">Serving Working Group</td>
        <td>KServe</td>
        <td>
          <a href="https://github.com/kserve/kserve/releases/tag/v0.16.0">v0.16.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Training Working Group</td>
        <td>Training Operator</td>
        <td>
          <a href="https://github.com/kubeflow/training-operator/releases/tag/v1.9.2">v1.9.2</a>
        </td>
      </tr>
      <tr>
        <td>Trainer</td>
        <td>
          <a href="https://github.com/kubeflow/trainer/releases/tag/v2.1.0">v2.1.0</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Data Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">Data Working Group</td>
        <td>Model Registry</td>
        <td>
          <a href="https://github.com/kubeflow/hub/releases/tag/v0.3.7">v0.3.7</a>
        </td>
      </tr>
      <tr>
        <td>Spark Operator</td>
        <td>
          <a href="https://github.com/kubeflow/spark-operator/releases/tag/v2.5.0">v2.5.0</a>
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
        <td>1.34+</td>
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
        <td>1.29.0</td>
      </tr>
      <!-- ======================= -->
      <!-- cert-manager  -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://cert-manager.io/">cert-manager</a>
        </td>
        <td>1.19.4</td>
      </tr>
      <!-- ======================= -->
      <!-- dex  -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://dexidp.io/">dex</a>
        </td>
        <td>2.45.0</td>
      </tr>
      <!-- ======================= -->
      <!-- Kustomize  -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://kustomize.io/">Kustomize</a>
        </td>
        <td>5.8.1</td>
      </tr>
      <!-- ======================= -->
      <!-- Knative Serving -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://knative.dev/docs/">Knative</a>
        </td>
        <td>1.21.1</td>
        <td rowspan="1" class="align-middle">
          <i>Knative is only needed when using the optional <a href="https://kserve.github.io/website/">KServe Component</a>.</i>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- OAuth2-proxy -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://github.com/oauth2-proxy/oauth2-proxy/releases/tag/v7.10.0">OAuth2 Proxy</a>
        </td>
        <td>7.14.3</td>
      </tr>
      <!-- ======================= -->
      <!-- Argo Workflows -->
      <!-- ======================= -->
      <tr>
        <td>
          <a href="https://argo-workflows.readthedocs.io/en/release-3.7/">Argo Workflows</a>
        </td>
        <td>3.7.3</td>
      </tr>
  </tbody>
</table>
</div>
