+++
title =  "Community"
description = "About the Kubeflow community"
weight = 10
aliases = ["/docs/community/"]
+++

## Slack

Join the official Kubeflow Slack with [this invite link](https://join.slack.com/t/kubeflow/shared_invite/zt-n73pfj05-l206djXlXk5qdQKs4o1Zkg).

{{% alert title="Tip" color="info" %}}
If the above invite has expired, please [raise an issue on the `kubeflow/website` repo](https://github.com/kubeflow/website/issues/new).
{{% /alert %}}

The Kubeflow Slack workspace has many channels, here are a few examples:

| Topic | Slack Channel |
| --- | --- |
| General Discussion | [#general](https://kubeflow.slack.com/archives/C7REE0ETX)
| Feature Requests | [#feature-requests](https://kubeflow.slack.com/archives/C01A7RYEYMB)
| Job Postings | [#job-postings](https://kubeflow.slack.com/archives/CJ9PJE5FS)
| Kubeflow - Pipelines | [#kubeflow-pipelines](https://kubeflow.slack.com/archives/CE10KS9M4)
| Kubeflow - Notebooks | [#kubeflow-notebooks](https://kubeflow.slack.com/archives/CESP7FCQ7)
| Kubeflow - KFServing | [#kubeflow-kfserving](https://kubeflow.slack.com/archives/CH6E58LNP)
| Platform - AWS | [#platform-aws](https://kubeflow.slack.com/archives/CKBA5D0MU)
| Platform - Azure | [#platform-azure](https://kubeflow.slack.com/archives/CUW6SLCPR)
| Platform - GCP | [#platform-gcp](https://kubeflow.slack.com/archives/CKH7V1M7F)
| Users - China | [#users-china](https://kubeflow.slack.com/archives/C93HYNM9C)
| Users - Korea | [#users-korea](https://kubeflow.slack.com/archives/CKPCJB9AP)
| Users - Oceania | [#users-oceania](https://kubeflow.slack.com/archives/C023ZN1R9FC)

## Mailing List

The official Kubeflow mailing list is a Google Group called [kubeflow-discuss](https://groups.google.com/g/kubeflow-discuss).

More detail about the Kubeflow mailing lists:

| Topic | Mailing List |
| --- | --- |
| General Discussion | [kubeflow-discuss](https://groups.google.com/g/kubeflow-discuss)

## Weekly Community Call

The Kubeflow community holds a public call every Tuesday, alternating between `US East/EMEA` and `US West/APAC` friendly times.

{{% alert title="Tip" color="info" %}}
Joining the [kubeflow-discuss](https://groups.google.com/g/kubeflow-discuss) Google Group will automatically send a calendar invitation to your email address.
{{% /alert %}}

More detail about the Kubeflow weekly community call:

| Description | Link |
| --- | --- |
| Meeting Notes | [Google Doc](http://bit.ly/kf-meeting-notes)
| Call Recordings | [YouTube Playlist](https://www.youtube.com/playlist?list=PLmzRWLV1CK_ypvsQu10SGRmhf2S7mbYL5)
| Community Calendar | [Google Calendar](https://calendar.google.com/calendar/embed?src=kubeflow.org_7l5vnbn8suj2se10sen81d9428%40group.calendar.google.com) and [iCal file](https://calendar.google.com/calendar/ical/kubeflow.org_7l5vnbn8suj2se10sen81d9428%40group.calendar.google.com/public/basic.ics)
| Community Calendar Management | [GitHub Repo](https://github.com/kubeflow/community/tree/master/calendar)

## Blog

The official Kubeflow blog is [found here](https://blog.kubeflow.org).

{{% alert title="Tip" color="info" %}}
To contribute an article for the blog, please raise an issue on the [kubeflow/community](https://github.com/kubeflow/community) GitHub repo.
Note that articles are managed on the [kubeflow/blog](https://github.com/kubeflow/blog) GitHub repo.
{{% /alert %}}

## Kubeflow Trademark

The Kubeflow trademark and logos are registered trademarks of Google, please review the [Kubeflow Brand Guidelines](https://github.com/kubeflow/community/blob/master/KUBEFLOW_BRAND_GUIDELINES.pdf) for more information.

## Kubeflow Working Groups

The Kubeflow project has a number of Working Groups (WGs) who each maintain some aspect of the Kubeflow project.

<div class="table-responsive">
<table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Working Group</th>
        <th>Maintained Components</th>
      </tr>
    </thead>
  <tbody>
      <!-- ======================= -->
      <!-- AutoML Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">
          <a href="https://github.com/kubeflow/community/tree/master/wg-automl">AutoML</a> 
        </td>
        <td>
          <a href="https://github.com/kubeflow/katib">Katib</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Deployment Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">
          <a href="https://github.com/kubeflow/community/tree/master/wg-deployment">Deployment</a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/kfctl">kfctl</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Manifests Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">
          <a href="https://github.com/kubeflow/community/tree/master/wg-manifests">Manifests</a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/manifests">Manifests Repository</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Notebooks Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="9" class="align-middle">
          <a href="https://github.com/kubeflow/community/tree/master/wg-notebooks">Notebooks</a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/master/components/admission-webhook">Admission Webhook (PodDefaults)</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/master/components/centraldashboard">Central Dashboard</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/master/components/crud-web-apps/jupyter">Jupyter Web App</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/master/components/access-management">Kubeflow Access Management API (KFAM)</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/master/components/notebook-controller">Notebook Controller</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/master/components/profile-controller">Profile Controller</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/master/components/tensorboard-controller">Tensorboard Controller</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/master/components/crud-web-apps/tensorboards">Tensorboard Web App</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/kubeflow/tree/master/components/crud-web-apps/volumes">Volumes Web App</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Pipelines Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">
          <a href="https://github.com/kubeflow/community/tree/master/wg-pipelines">Pipelines</a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/pipelines">Kubeflow Pipelines</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/kfp-tekton">Kubeflow Pipelines on Tekton</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Serving Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">
          <a href="https://github.com/kubeflow/community/tree/master/wg-serving">Serving</a>
        </td>
        <td>
          <a href="https://github.com/kserve/kserve">KServe (formerly KFServing)</a>
        </td>
      </tr>
      <!-- ======================= -->
      <!-- Training Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="1" class="align-middle">
          <a href="https://github.com/kubeflow/community/tree/master/wg-training">Training</a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/training-operator">Kubeflow Training Operator</a>
        </td>
      </tr>
  </tbody> 
</table>
</div>
