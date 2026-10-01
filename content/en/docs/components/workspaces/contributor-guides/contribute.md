---
title: Contributing to Kubeflow Workspaces
description: How to connect with the community and how to get involved
weight: 10
---

Kubeflow Workspaces is developed as part of the Kubeflow in the
[`kubeflow/notebooks`](https://github.com/kubeflow/notebooks) repository. Whether you want to report
a bug, help triage issues, or contribute code, this page explains how to connect with the community,
our planning process and the different ways you can get involved.

## Joining our community

- **Community meetings:** The Notebooks Working Group meets regularly. Find the schedule and meeting
  invite on the [Kubeflow Community & Meetings](/docs/about/community/#kubeflow-community-meetings)
  page.
- **Slack:** Join the [`#kubeflow-notebooks`](/docs/about/community/#kubeflow-slack-channels),
  introduce yourself and let us know what your skills and what you are interested in working on.

## Run Locally

It is really easy to set up a local development environment for Kubeflow Workspaces, just follow the
[Development Guide](https://github.com/kubeflow/notebooks/blob/notebooks-v2/developing/DEVELOPMENT_GUIDE.md)
in the repository, which walks through setting up the [tilt](https://docs.tilt.dev/)-based workflow.

## Planning process

We track our work in a hierarchy of GitHub issues: **Epics**, **Features** and
**Tasks**, see [How We Plan](/docs/components/workspaces/contributor-guides/planning-process/) for the
full breakdown and filter links.

A good overview over the current task can be obtained via the [Kubeflow Workspaces Project
Board](https://github.com/orgs/kubeflow/projects/62).

## Contributor tracks

There are many ways to contribute to the project, and not all of them involve writing code. The
overview below describe multiple ways of engaging with in our community and potential ways of
growing as contributor and taking on more responsibility over time.

### Contributing as a user of the project

- **ADOPTERS.md**: If you use Kubeflow Workspaces feel free to add yourself to the [adopters
  file](https://github.com/kubeflow/notebooks/blob/main/ADOPTERS.md) to give the project exposure.
- **Bug Reporting**: Report problems you run into by filing clear, reproducible issues or new
  information to already existing issues. Good bug reports are one of the most valuable
  contributions to the project.
- **User Stories**: Share usecases and feature requests for things you would like to Kubeflow
  Workspaces for. Also for any currently ongoing design proposals feel free to share your input.
- **User Advisory Board (future)**: Represent your organization by sharing feedback on features and
  direction. If you run Kubeflow Workspaces and want your use cases heard, express your interest in
  joining. <!-- TODO: link the User Advisory Board interest form when available -->

### Contributor ladder

- **Contributor**: Contribute code, tests, or documentation to one of the modules.
- **Bug Wrangler**: Help triage incoming issues: reproduce reported bugs, add missing details,
  idendtify duplicates, apply labels, and route issues to the right area so maintainers can act on
  them faster.
- **Code Review**: Review pull requests for a part of the ecosystem you're familiar with, i.e. React
  frontend code or the controller logic.

As soon as you become more involved you can potentially take on one of the following
responsibilities if you're interested and sufficiently experienced:

- **Reviewer/Approver**: Take ownership of a specific part of the codebase (for example, the
  frontend, backend, or controller), including its reviews, releases, and roadmap by being added in
  the `OWNERS` file.
- **Proposal/Feature Owner**: Shepherd a complex proposal or feature through the full lifecycle, starting
  from design through delivery.
- **Working Group Lead**: Help steer the overall direction and health of the project.

### Vendor Track

Organizations that build on or distribute Kubeflow Workspaces can contribute by dedicating
engineering time, sponsoring features or maintainers, validating releases against their platforms
and sharing feedback from their users. If your organization would like to get involved at this
level, reach out to the Working Group Leads on Slack or at a community meeting.

## See Also

- [Kubeflow Workspaces Overview page](/docs/components/workspaces/)
- [Notebooks Working Group Overview](https://github.com/kubeflow/community/tree/master/wg-notebooks)
- [`CONTRIBUTING.md` in `kubeflow/notebooks`](https://github.com/kubeflow/notebooks/blob/notebooks-v2/CONTRIBUTING.md)
- [Kubeflow Contribution Guidelines](/docs/about/contributing/)
