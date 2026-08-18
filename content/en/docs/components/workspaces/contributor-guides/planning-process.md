---
title: Planning process
description: How the Kubeflow Workspaces community tracks work with Epics, Features, and Tasks
weight: 20
---

We track our work with a hierarchy of GitHub issues, connected via Githubs sub-issue feature:
[**Epics**](/docs/components/workspaces/contributor-guides/planning-process/#epic),
[**Features**](/docs/components/workspaces/contributor-guides/planning-process/#feature), and
[**Tasks**](/docs/components/workspaces/contributor-guides/planning-process/#task). Understanding
this structure makes it easier to find something to work on and to see how a given change fits into
the bigger picture.

Each issue type has its corresponding `kind/plan-*` label, so you can browse the current work
directly on GitHub using the filter links below.

## Project Board

You can see what we are working on, which features are planned to be included in the next release
and what tasks are up for grabs, on our [GitHub project
board](https://github.com/orgs/kubeflow/projects/62).

## Task

A Task is a concrete unit of work that moves a Feature forward. A good Task provides enough context
for someone to pick it up and deliver it and has its own acceptance criteria. Each Task is assigned
to a single contributor who is responsible for delivering it, though they may collaborate with
others. Please only assign yourself after coordinating with the project maintainers on the issue or
in the Slack channel.

[➡️ Browse open Tasks](https://github.com/kubeflow/notebooks/issues?q=is%3Aissue%20state%3Aopen%20label%3Akind%2Fplan-task)

## Feature

A Feature is a functional, often times user-facing unit of work that lives under a single Epic.
Unlike an Epic, a Feature is never perpetual: it defines **acceptance criteria** and is closed once
those criteria are met (not just when the tasks that happen to be defined at the time are complete).
Where applicable, a Feature may include mockups or design notes. Each Feature has an **owner** who
shepherds its delivery and decides who takes on its sub-tasks.

[➡️ Browse open Features](https://github.com/kubeflow/notebooks/issues?q=is%3Aissue%20state%3Aopen%20label%3Akind%2Fplan-feature)

## Epic

An Epic represents a large, ongoing **area** of work, for example, a complex user story or
a core functional area of the project. Epics may be long-lived and are intentionally
high-level: they capture *what* we want to achieve and *why*, without prescribing
implementation details.

[➡️ Browse open Epics](https://github.com/kubeflow/notebooks/issues?q=is%3Aissue%20state%3Aopen%20label%3Akind%2Fplan-epic)

## See Also

- [Contribute to Kubeflow Workspaces](/docs/components/workspaces/contributor-guides/contribute/)
