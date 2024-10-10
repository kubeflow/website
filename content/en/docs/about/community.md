+++
title =  "Community"
description = "About the Kubeflow community"
weight = 10
aliases = ["/docs/community/"]
+++

## Contributing

If you are interested in learning more about how to participate in and contribute to the Kubeflow community, take a look at [Contributing](/docs/about/contributing/)!

## Kubeflow Slack Channels

Kubeflow is part of the vibrant CNCF community, we use the [CNCF Slack](https://slack.cncf.io/) for informal discussions among users and contributors.
Please join the [Kubeflow channels](#slack-channels) to join the conversation and get help from the community.

<a href="https://slack.cncf.io/">
  <button class="btn btn-primary py-2 px-5 mb-3">Click to join:<br><b>CNCF Slack</b></button>
</a>

### Slack Channels

The following table lists official Kubeflow channels which are hosted on the **CNCF Slack**:

| Description                             | Link                                                                              |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| Announcements                           | [#kubeflow-announcements](https://app.slack.com/client/T08PSQ7BQ/C01EV0FV154)     |
| GSoC Participants                       | [#kubeflow-gsoc-participants](https://app.slack.com/client/T08PSQ7BQ/C0742LBR5BM) |
| Katib                                   | [#kubeflow-katib](https://app.slack.com/client/T08PSQ7BQ/C073N7AS48P)             |
| Model Registry                          | [#kubeflow-model-registry](https://app.slack.com/client/T08PSQ7BQ/C073N7B6K3R)    |
| Notebooks                               | [#kubeflow-notebooks](https://app.slack.com/client/T08PSQ7BQ/C073W562HFY)         |
| Pipelines                               | [#kubeflow-pipelines](https://app.slack.com/client/T08PSQ7BQ/C073N7BMLB1)         |
| Platform Manifests and Release Planning | [#kubeflow-platform](https://app.slack.com/client/T08PSQ7BQ/C073W572LA2)          |
| Spark Operator                          | [#kubeflow-spark-operator](https://app.slack.com/client/T08PSQ7BQ/C074588U7EG)    |
| Training Operator and MPI Operator      | [#kubeflow-training](https://app.slack.com/client/T08PSQ7BQ/C0742LDFZ4K)          |
| KServe                                  | [#kserve](https://app.slack.com/client/T08PSQ7BQ/C06AH2C3K8B)                     |

## Kubeflow Mailing List

The official Kubeflow mailing list is a Google Group called [kubeflow-discuss](https://groups.google.com/g/kubeflow-discuss).

<a href="https://groups.google.com/g/kubeflow-discuss">
  <button class="btn btn-primary py-2 px-5">Click to join:<br>Kubeflow Mailing List</button>
</a>

## Kubeflow Community Meetings

The Kubeflow community holds various meetings to all users and contributors to discus
issues/proposals and present demos/products.

### Subscribe to the Kubeflow Calendar

Joining the [kubeflow-discuss mailing list](#kubeflow-mailing-list) should automatically add
the Kubeflow community meetings to your Google calendar. If you still can't see the invites,
manually add [the Kubeflow calendar using this name](https://calendar.google.com/calendar/u/0/r/settings/addcalendar):

```shell
kubeflow.org_7l5vnbn8suj2se10sen81d9428@group.calendar.google.com
```

<img src="/docs/about/images/google-calendar.png"
      alt="Google Calendar"
      class="mt-3 mb-3">

### List of Available Meetings

The following list shows available Kubeflow community meetings with the corresponding meeting notes and recordings.

| Meeting Name                    | Meeting Notes                                        | Recordings                                                                                   |
| ------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Kubeflow community call         | [Google Doc](https://bit.ly/kf-meeting-notes)        | [YouTube playlist](https://www.youtube.com/playlist?list=PLmzRWLV1CK_ypvsQu10SGRmhf2S7mbYL5) |
| Kubeflow AutoML and Training WG | [Google Doc](https://bit.ly/2PWVCkV)                 | [YouTube playlist](https://www.youtube.com/playlist?list=PLmzRWLV1CK_xAiAY-3Vw94lrUs4xeNZ3j) |
| Kubeflow Model Registry call    | [Google Doc](https://bit.ly/kf-model-registry-notes) | [YouTube playlist](https://www.youtube.com/playlist?list=PLmzRWLV1CK_ymLhMu0UMeaWPsLDPIjNnW) |
| Kubeflow Notebooks WG           | [Google Doc](https://bit.ly/kf-notebooks-wg-notes)   |                                                                                              |
| Kubeflow Platform WG            | [Google Doc](https://bit.ly/kf-wg-manifests-notes)   |                                                                                              |
| Kubeflow Pipelines WG           | [Google Doc](http://bit.ly/kfp-meeting-notes)        |                                                                                              |
| Kubeflow Release meeting        | [Google Doc](https://bit.ly/kf-release-team-notes)   |                                                                                              |
| Kubeflow Spark Operator call    | [Google Doc](https://bit.ly/3VGzP4n)                 | [YouTube playlist](https://www.youtube.com/playlist?list=PLmzRWLV1CK_xXuM6gALgBG8vDZHFCNxce) |
| KServe call                     | [Google Doc](https://bit.ly/3NlKFb3)                 |                                                                                              |

### Kubeflow Community Calendar |

This is an aggregated view of the Kubeflow community calendar and should be displayed in your
device's timezone.

<style>
#calendar-container {
   overflow: auto;
}
</style>
<div id="calendar-container"></div>
<script type="text/javascript">
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const calender_src_list = [
  // Kubeflow Community
  "kubeflow.org_7l5vnbn8suj2se10sen81d9428%40group.calendar.google.com",
];
let calender_src = calender_src_list.map(src => `&src=${src}&color=%23A79B8E`).join('');
const html = `<iframe src="https://calendar.google.com/calendar/embed?ctz=${timezone}&height=600&wkst=1&bgcolor=%23ffffff&showPrint=0&showDate=1&mode=AGENDA&showTitle=0${calender_src}" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe>`;
document.getElementById('calendar-container').innerHTML = html;
</script>

## Kubeflow on Social Media

- [Official Kubeflow YouTube Channel](https://www.youtube.com/@Kubeflow) for the
  announcements and project updates.
- [Kubeflow Community YouTube Channel](https://www.youtube.com/@KubeflowCommunity) for the working
  group and community meeting recordings.
- Join [LinkedIn](https://www.linkedin.com/company/kubeflow/) for latest news in Kubeflow.
- Follow us on X formerly known as [Twitter](https://twitter.com/kubeflow) for latest news on Kubeflow.

## Kubeflow Blog and Other Resources

The Kubeflow project maintains an official blog that can be [found here](https://blog.kubeflow.org).

{{% alert title="Tip" color="info" %}}
To contribute an article for the blog, please raise an issue on the [kubeflow/community](https://github.com/kubeflow/community) GitHub repo or create a thread on the [mailing list](#kubeflow-mailing-list).
Note, articles are published using the [kubeflow/blog](https://github.com/kubeflow/blog) GitHub repo.
{{% /alert %}}

In addition, please check out the community-curated [awesome list of projects and resources related to Kubeflow](https://github.com/terrytangyuan/awesome-kubeflow).

## Kubeflow Trademark

The Kubeflow trademark and logos are registered trademarks of Google, please review the [Kubeflow Brand Guidelines](https://www.linuxfoundation.org/legal/trademark-usage) for more information.

## Kubeflow Steering Committee

The [Kubeflow Steering Committee (KSC)](https://github.com/kubeflow/community/blob/master/KUBEFLOW-STEERING-COMMITTEE.md) is the governing body of the Kubeflow project, providing decision-making and oversight pertaining to the Kubeflow project policies, sub-organizations, and financial planning, and defines the project values and structure.

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
      <!-- Data Working Group -->
      <!-- ======================= -->
      <tr>
        <td rowspan="2" class="align-middle">
          <a href="https://github.com/kubeflow/community/tree/master/wg-data">Data</a>
        </td>
        <td>
          <a href="https://github.com/kubeflow/model-registry">Model Registry</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/kubeflow/spark-operator">Spark Operator</a>
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
          <a href="https://github.com/kubeflow/training-operator">Training Operator</a>
        </td>
      </tr>
  </tbody>
</table>
</div>
