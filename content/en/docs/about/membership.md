+++
title = "Community Membership"
description = "Guidelines for contributing to Kubeflow"
weight = 30
aliases = ["/docs/membership/"]
+++

This document outlines the various responsibilities of contributor roles in Kubeflow. Kubeflow is divided into working groups that have stewardship over different subprojects/repositories

Responsibilities for most roles are scoped to these repositories.

<div class="table-responsive">
<div class="table table-bordered">

| Role | Responsibilities | Requirements | Defined by |
| -----| ---------------- | ------------ | -------|
| Member | Active contributor in the community | Sponsored by 2 Kubeflow members and multiple contributions to the project | Kubeflow GitHub org member|
| Reviewer | Review contributions from other members | History of review and authorship in a repository | [OWNERS](/docs/about/contributing/#owners) file reviewer entry |
| Approver | Contributions acceptance approval| Highly experienced active reviewer and contributor to a repository | [OWNERS](/docs/about/contributing/#owners) file approver entry|
| WG Lead  | Provides technical leadership for a Working Group | Have sufficient domain knowledge to provide effective technical leadership | [wgs.yaml] entry |
| WG Chair | Provides overall leadership for a Working Group | Have sufficient domain knowledge to provide effective leadership | [wgs.yaml] entry |
| Kubeflow Steering Commitee Member | The KSC provides leadership for the overall Kubeflow project | [Details](https://github.com/kubeflow/community/blob/master/KUBEFLOW-STEERING-COMMITTEE.md#charter) | [Members](https://github.com/kubeflow/community/blob/master/KUBEFLOW-STEERING-COMMITTEE.md#charter) |

</div>
</div>

{{< note >}}
Detailed documentation for Working Group structure and responsibilities can be found at [wg-governance.md](https://github.com/kubeflow/community/blob/master/wgs/wg-governance.md)
{{< /note >}}

## New contributors

[New contributors] should be welcomed to the community by existing members, helped with PR workflow, and directed to the relevant documentation and communication channels.

## Established community members

Established community members are expected to demonstrate their adherence to the principles in this document, familiarity with project organization, roles, policies, procedures, conventions, etc., and technical and/or writing ability. Role-specific expectations, responsibilities, and requirements are enumerated below.

## Member

Members are *[continuously active]* contributors in the community. They can have issues and PRs assigned to them and tests are automatically run for their PRs. Members are expected to remain active contributors to the community.

**Defined by:** Member of the Kubeflow GitHub organization

### Requirements

- Enabled two-factor authentication on their GitHub account
- Have made **at least** 2-3 [code contributions] or [non-code contributions] to the project or community.
- Have read the [contributor guide].
- Sponsored by 2 Kubeflow members. **Note the following requirements for sponsors**:
- **[Open an issue with the membership template][membership template] against the kubeflow/internal-acls repo**
  - Ensure your sponsors are @mentioned on the issue
- **Open a pull request against the kubeflow/internal-acls repo**
  - Complete every item on the checklist ([preview the current version of the template][membership template])
  - Make sure that the list of contributions included is representative of your work on the project.
- Have your sponsoring reviewers reply confirmation of sponsorship
- Once your sponsors have responded, your request will be reviewed by the Kubeflow team. Any missing information will be requested
- After your PR is merged, you will get an email (to your GitHub-associated email address) inviting you to the Kubeflow GitHub org. Follow the instructions to accept your membership.
- To confirm that the membership acceptance process has completed, you can search for your GitHub username at https://github.com/orgs/kubeflow/people.

### Responsibilities

- Responsive to issues and PRs assigned to them
- Active participants in the Kubeflow community by participating in:
  - Working Group Meetings
  - Slack Discussions
  - Project Discussions
- Responsive to mentions of any teams they may be members of
- Active owner of code they have contributed (unless ownership is explicitly transferred)
  - Code is well tested
  - Tests consistently pass
  - Addresses bugs or issues discovered after code is accepted
- Subscribed to <https://groups.google.com/g/kubeflow-discuss>

{{< note >}}
Members who frequently contribute code are expected to proactively perform code reviews and work towards becoming a primary *reviewer* for the subproject that they are active in.
{{< /note >}}

### Privileges

- Members can do `/lgtm` on open PRs.
- They can be assigned to issues and PRs, and people can ask members for reviews with a `/cc @username`.
- They are eligible to be appointed as a Kubeflow release manager
- Tests can be run against their PRs automatically. No `/ok-to-test` needed.
- Members can do `/ok-to-test` for PRs that have a `needs-ok-to-test` label, and use commands like `/close` to close PRs as well. A complete list of commands can be found in [the Prow documentation](https://prow.k8s.io/command-help)

## Reviewer

Reviewers are able to review code for quality and correctness on some part of a subproject. They are knowledgeable about both the codebase and software engineering principles.

**Defined by:** *reviewers* entry in an `OWNERS` file in a repo owned by the Kubeflow organization.

Reviewer status can be scoped to either parts of the codebase or the root directory for the entire codebase.

{{< note >}}
Acceptance of code contributions requires at least one approver in addition to the assigned reviewers.
{{< /note >}}

### Requirements

The following apply to the part of codebase for which one would be a reviewer in an [OWNERS](/docs/about/contributing/#owners) file.

- Demonstrated consistent contributions for at least 3 months
- Primary reviewer for at least 5 PRs to the codebase
- Reviewed or merged at least 15 substantial PRs to the codebase
- Knowledgeable about the codebase
- Active engagement with the commmunity by answering user questions in GitHub issues and Slack
- Sponsored by a subproject approver
  - With no objections from other approvers
  - Done through PR to update the OWNERS file
- May either self-nominate or be nominated by an approver in this subproject

{{< note >}}
Working Group Leads may nominate and approve `Reviewers` that don't meet these requirements due to exceptional circumstances. While acceptable in the short term, Working Group Leads should ensure that these `Reviewers` eventually meet the requirements
{{< /note >}}

The following apply to the part of codebase for which one would be a reviewer in an [OWNERS](/docs/about/contributing/#owners) file.

### Responsibilities

- All responsiblities that community members have
- Responsible for project quality control via code reviews
  - Focus on code quality and correctness, including testing and factoring
  - May also review for more holistic issues, but not a requirement
- Expected to be responsive to review requests
- Expected to actively engage with the community by answering questions in GitHub issues and Slack
- Assigned PRs to review related to subproject of expertise
- Assigned test bugs related to subproject of expertise

### Privileges

- All Privileges that community members have
- Code reviewer status may be a precondition to accepting large code contributions
- May get a badge on PR and issue comments

## Approver

Code approvers are able to both review and approve code contributions. While
code review is focused on code quality and correctness, approval is focused on
holistic acceptance of a contribution including: backwards / forwards
compatibility, adhering to API and flag conventions, subtle performance and
correctness issues, interactions with other parts of the system, overall code test coverage, etc.

**Defined by:** *approvers* entry in an OWNERS file in a repo owned by the Kubeflow organization.

Approver status can be scoped to either parts of the codebase or the root directory for the entire codebase.

### Requirements

The following apply to the part of codebase for which one would be an approver in an [OWNERS](/docs/about/contributing/#owners) file.

- Have met the responsibilities of the `Reviewer` role (as defined above) of the codebase for at least 3 months
- Primary reviewer for at least 10 substantial PRs to the codebase
- Reviewed or merged at least 30 PRs to the codebase
- Nominated by a WG Lead or Chair
  - With no objections from other Leads or Chairs
  - Done through PR to update the relevant OWNERS file

{{< note >}}
Working Group Leads may nominate and approve `Approvers` that don't meet these requirements due to exceptional circumstances. While acceptable in the short term, Working Group Leads should ensure that these `Approvers` eventually meet the requirements
{{< /note >}}

### Responsibilities

The following apply to the part of codebase for which one would be an approver in an [OWNERS](/docs/about/contributing/#owners) file.

- All responsibilities that reviewers have
- Approver status may be a precondition to accepting large architectural contributions
- Demonstrate sound technical judgement
- Responsible for project quality control via code reviews
  - Focus on holistic acceptance of contribution such as dependencies with other features, backwards / forwards
    compatibility, API and flag definitions, etc
- Expected to be responsive to review requests
- Expected to be responsive to merge requests for pull requests when reviewed
- Mentor contributors and reviewers

### Privileges

- All privileges that reviewers have
- May approve code contributions for acceptance

## Inactive members

*Members are continuously active contributors in the community.*

A core principle in maintaining a healthy community is encouraging active
participation. It is inevitable that people's focuses will change over time and
they are not expected to be actively contributing forever.

However, being a member of one of the Kubeflow GitHub organizations comes with
an elevated set of permissions. These capabilities should not be used by those
that are not familiar with the current state of the Kubeflow organization.

Therefore members with an extended period (1 year) away from the organization with no activity
will be removed from the Kubeflow GitHub Organizations and will be required to
go through the org membership process again after re-familiarizing themselves
with the current state.

If anyone listed in OWNERS files should become inactive, here is what we will do:

- If the person is in reviewers section, their GitHub id will be removed from the section.
- If the person is in approvers section, their GitHub id will be moved
  [the `emeritus_approvers` section](/docs/about/contributing/#emeritus).

### How inactivity is measured

Inactive members are defined as members of one of the Kubeflow Organizations with **no** technical and non-technical contributions across any organization within 12 months. [DevStats](https://kubeflow.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=Last%20year&var-metric=contributions&var-repogroup_name=All&var-country_name=All&var-companies=All) offers an easy way to determine contributions to Kubeflow

After an extended period away from the project with no activity those members would need to re-familiarize themselves with the current state before being able to contribute effectively.

## Credit

This set of guidelines is heavily inspired by the [Kubernetes membership guidelines](https://github.com/kubernetes/community/blob/master/community-membership.md?plain=1#community-membership).

[code contributions]: https://contribute.cncf.io/contributors/getting-started/#code-contributors
[non-code contributions]: https://contribute.cncf.io/contributors/getting-started/#non-code-contributors
[contributor guide]: https://www.kubeflow.org/docs/about/contributing/
[membership template]: https://github.com/kubeflow/internal-acls/blob/master/.github/ISSUE_TEMPLATE/join_org.md
[New contributors]: /docs/about/contributing/
[continuously active]: #inactive-members
[wgs.yaml]: https://github.com/kubeflow/community/blob/master/wgs.yaml
