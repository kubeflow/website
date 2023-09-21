+++
title =  "Community"
description = "About the Kubeflow community"
weight = 10
aliases = ["/docs/community/"]
+++

## Kubeflow Slack

The Official Kubeflow Slack is used for informal discussions among users and contributors.

<a href="https://invite.playplay.io/invite?team_id=T7QLHSH6U">
  <button class="btn btn-primary py-2 px-5 mb-3">Click to join:<br>Kubeflow Slack</button>
</a>

| Popular Kubeflow Slack Channels |
| --- | --- |
| General Discussion | [#general](https://kubeflow.slack.com/archives/C7REE0ETX)
| Feature Requests | [#feature-requests](https://kubeflow.slack.com/archives/C01A7RYEYMB)
| Job Postings | [#job-postings](https://kubeflow.slack.com/archives/CJ9PJE5FS)
| Kubeflow - Pipelines | [#kubeflow-pipelines](https://kubeflow.slack.com/archives/CE10KS9M4)
| Kubeflow - Notebooks | [#kubeflow-notebooks](https://kubeflow.slack.com/archives/CESP7FCQ7)
| Kubeflow - KFServing | [#kubeflow-kfserving](https://kubeflow.slack.com/archives/CH6E58LNP)
| Kubeflow - Training Operator | [#wg-training](https://kubeflow.slack.com/archives/C018N3M6QKB)
| Kubeflow - AutoML | [#wg-automl](https://kubeflow.slack.com/archives/C018PMV53NW)
| Platform - AWS | [#platform-aws](https://kubeflow.slack.com/archives/CKBA5D0MU)
| Platform - Azure | [#platform-azure](https://kubeflow.slack.com/archives/CUW6SLCPR)
| Platform - GCP | [#platform-gcp](https://kubeflow.slack.com/archives/CKH7V1M7F)
| Users - China | [#users-china](https://kubeflow.slack.com/archives/C93HYNM9C)
| Users - Korea | [#users-korea](https://kubeflow.slack.com/archives/CKPCJB9AP)
| Users - Oceania | [#users-oceania](https://kubeflow.slack.com/archives/C023ZN1R9FC)

## Kubeflow Mailing List

The official Kubeflow mailing list is a Google Group called [kubeflow-discuss](https://groups.google.com/g/kubeflow-discuss).

<a href="https://groups.google.com/g/kubeflow-discuss">
  <button class="btn btn-primary py-2 px-5">Click to join:<br>Kubeflow Mailing List</button>
</a>

## Kubeflow Community Call

The Kubeflow community holds weekly Zoom calls for all users and contributors to discuss issues/proposals and present demos/products.
Kubeflow community calls are held every other Tuesday at `8:00am San Francisco` time.

Joining the [mailing list](#kubeflow-mailing-list) should automatically add these events to your Google Calendar.
Alternatively, you can manually subscribe to the ["Kubeflow Community" calendar](#kubeflow-community-calendars).

| Useful Links |
| --- | --- |
| Kubeflow Community Call - Notes | [Google Doc](https://bit.ly/kf-meeting-notes)
| Kubeflow Community Call - Recordings | [YouTube Playlist](https://www.youtube.com/playlist?list=PLmzRWLV1CK_ypvsQu10SGRmhf2S7mbYL5)

## Kubeflow Community Calendars

The following calendars are maintained by [Kubeflow Working Groups](#kubeflow-working-groups) and contain meetings that you may wish to attend.

| Calendar | Link |
| --- | --- |
| Kubeflow Community | [Google Calendar](https://calendar.google.com/calendar/embed?src=kubeflow.org_7l5vnbn8suj2se10sen81d9428%40group.calendar.google.com) ([iCal](https://calendar.google.com/calendar/ical/kubeflow.org_7l5vnbn8suj2se10sen81d9428%40group.calendar.google.com/public/basic.ics), [Git Repo](https://github.com/kubeflow/community/tree/master/calendar))
| KServe Community | [Google Calendar](https://calendar.google.com/calendar/embed?src=4fqdmu5fp4l0bgdlf4lm1atnsl2j4612%40import.calendar.google.com) ([iCal](https://wiki.lfaidata.foundation/rest/calendar-services/1.0/calendar/export/subcalendar/private/079ecdf0bfab77646c9e00df7b1c28f34f67f852.ics))

This is an aggregated view of the community calendars and should be displayed in your device's timezone.

<div id="calendar-container"></div>
<script type="text/javascript">
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const calender_src_list = [
  // Kubeflow Community
  "kubeflow.org_7l5vnbn8suj2se10sen81d9428%40group.calendar.google.com",
  // KServe Community
  "4fqdmu5fp4l0bgdlf4lm1atnsl2j4612%40import.calendar.google.com",
];
let calender_src = calender_src_list.map(src => `&src=${src}&color=%23A79B8E`).join('');
const html = `<iframe src="https://calendar.google.com/calendar/embed?ctz=${timezone}&height=600&wkst=1&bgcolor=%23ffffff&showPrint=0&showDate=1&mode=AGENDA&showTitle=0${calender_src}" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe>`;
document.getElementById('calendar-container').innerHTML = html;
</script>

## Kubeflow Blog and Other Resources

The Kubeflow project maintains an official blog that can be [found here](https://blog.kubeflow.org).

{{% alert title="Tip" color="info" %}}
To contribute an article for the blog, please raise an issue on the [kubeflow/community](https://github.com/kubeflow/community) GitHub repo or create a thread on the [mailing list](#kubeflow-mailing-list).
Note, articles are published using the [kubeflow/blog](https://github.com/kubeflow/blog) GitHub repo.
{{% /alert %}}

In addition, please check out the community-curated [awesome list of projects and resources related to Kubeflow](https://github.com/terrytangyuan/awesome-kubeflow).

## Kubeflow Trademark

The Kubeflow trademark and logos are registered trademarks of Google, please review the [Kubeflow Brand Guidelines](https://github.com/kubeflow/community/blob/master/KUBEFLOW_BRAND_GUIDELINES.pdf) for more information.

## Kubeflow Working Groups

The Kubeflow project has a number of Working Groups (WGs) who each maintain some aspect of the Kubeflow project.
The following table outlines which components are maintained by each Working Group.

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
