+++
title = "Support"
description = "Where to go with questions and suggestions"
weight = 110
+++

This page describes the Kubeflow resources and support options that you can
explore when you encounter a problem, have a question, or want to make a
suggestion about Kubeflow.

TODO: This page currently mentions an "alpha" status whereas the version policy
uses "experimental". I'm proposing a change to "alpha". If we decide to keep
"experimental", I'll change this page.

## Levels of support

Kubeflow applications offer various levels of support, based on the application
status. To see the status of each application, refer to the 
[Kubeflow application 
matrix](/docs/reference/version-policy/#kubeflow-application-matrix) on the
version policies page.

The following table describes the level of support that you can expect based on
the status of an application:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Application status</th>
        <th>Level of support</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Stable</td>
        <td>TODO What are the expectations here? Some examples:
          <ul>
            <li><a href="https://github.com/kubeflow/community/blob/master/proposals/issue_triage.md>">Issue
              triage</a> within 48 hours.</li>
            <li>Response to question on Slack or the kubeflow-discuss mailing
              list within 24 hours.</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Beta</td>
        <td>TODO What are the expectations here? Some examples:
          <ul>
            <li><a href="https://github.com/kubeflow/community/blob/master/proposals/issue_triage.md>">Issue
              triage</a> within 48 hours.</li>
            <li>Response to question on Slack or the kubeflow-discuss mailing
              list within 72 hours.</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Alpha</td>
        <td>The response differs per application in alpha status, depending on
          the size of the community for that application and the current level
          of active development of the application.</td>
      </tr>
    </tbody>
  </table>
</div>

## Support from a cloud provider

If you're using the services of a cloud provider to host Kubeflow, the cloud
provider may be able to help you diagnose and solve a problem.

Consult the support page for the cloud service that you're using:

* [Amazon Web Services (AWS)](https://aws.amazon.com/contact-us/)
* [Google Cloud Platform (GCP)](https://cloud.google.com/support-hub/)
* [IBM Cloud Private](https://www.ibm.com/cloud/support)
* [Microsoft Azure](https://azure.microsoft.com/en-au/support/options/)

## Support from the Kubeflow community

Kubeflow has an active and helpful community of users and contributors. You
can ask questions and make suggestions in the following places:

* **Slack** for online chat and messaging. See details of Kubeflow's 
  [Slack workspace and channels](/docs/about/community/#slack).

* **Kubeflow discuss** for email-based group discussion. Join the
  [kubeflow-discuss](https://groups.google.com/forum/#!forum/kubeflow-discuss) 
  group.

* **Kubeflow documentation** for overviews and how-to guides. In particular,
  refer to the following documents when troubleshooting a problem:

  * [Kubeflow installation and setup](/docs/started/getting-started/)
  * [Kubeflow components](/docs/components/)
  * [Further setup and troubleshooting](/docs/other-guides/)

* **Kubeflow issue trackers** for known issues, questions, and feature requests.
  Search the open issues to see if someone else has already logged the problem 
  that you're encountering and learn about any workarounds to date. If no-one
  has logged your problem, create a new issue to describe the problem.

    Each Kubeflow application has its own issue tracker within the [Kubeflow
    organization on GitHub](https://github.com/kubeflow). To get you started,
    here are the primary issue trackers:

  * [Kubeflow core](https://github.com/kubeflow/kubeflow/issues)
  * [kfctl command-line tool](https://github.com/kubeflow/kfctl/issues)
  * [Kustomize manifests](https://github.com/kubeflow/manifests/issues)
  * [Kubeflow Pipelines](https://github.com/kubeflow/pipelines/issues)
  * [Katib hyperparameter tuning](https://github.com/kubeflow/katib/issues)
  * [Metadata](https://github.com/kubeflow/metadata/issues)
  * [Fairing notebook SDK](https://github.com/kubeflow/fairing/issues)
  * [TensorFlow training (TFJob)](https://github.com/kubeflow/tf-operator/issues)
  * [PyTorch training (PyTorchJob)](https://github.com/kubeflow/pytorch-operator/issues)
  * [KFServing](https://github.com/kubeflow/kfserving/issues)
  * [Examples](https://github.com/kubeflow/examples/issues)
  * [Documentation](https://github.com/kubeflow/website/issues)

## Support from partners

TODO Shall we include a partners section like this?

The following organizations offer advice and support for Kubeflow deployments:

* [Arrikto](https://www.arrikto.com). Contacts: TODO We need a point of contact.
  Should we list some or all of the contacts that 
  are currently in the [org list](https://github.com/kubeflow/community/blob/master/member_organizations.yaml#L42)?

* TODO Are there any other partners we should add?

## Other places to ask questions

You can also try searching for answers or asking a question on Stack Overflow. 
See the [questions tagged with
“kubeflow”](https://stackoverflow.com/questions/tagged/kubeflow).

## Getting involved in the Kubeflow community

You can get involved with Kubeflow in many ways. For example, you can
contribute to the Kubeflow code or documentation. You can join the community
meetings to talk to maintainers about a specific topic. See the
[Kubeflow community page](/docs/about/community/) for further information.

## Following the news

Keep up with Kubeflow news:

* The [Kubeflow blog](https://medium.com/kubeflow) is the primary channel for
  announcement of new releases, events, and technical walkthroughs.
* Follow [Kubeflow on Twitter](https://twitter.com/kubeflow) for shared
  technical tips.
* The release notes give details of the latest updates for each Kubeflow 
  application.

    Each Kubeflow application has its own repository within the [Kubeflow
    organization on GitHub](https://github.com/kubeflow). Some of the 
    applications publish release notes. To get you started,
    here are the release notes for the primary applications:

  * [Kubeflow core](https://github.com/kubeflow/kubeflow/releases)
  * [Kubeflow Pipelines](https://github.com/kubeflow/pipelines/releases)
  * [Katib hyperparameter tuning](https://github.com/kubeflow/katib/releases)
  * [Metadata](https://github.com/kubeflow/metadata/releases)
  * [Fairing notebook SDK](https://github.com/kubeflow/fairing/releases)
  * [TensorFlow training (TFJob)](https://github.com/kubeflow/tf-operator/releases)
  * [PyTorch training (PyTorchJob)](https://github.com/kubeflow/pytorch-operator/releases)
  * [KFServing](https://github.com/kubeflow/kfserving/releases)
