+++
title = "LFX Mentorship 2026 Term 3"
description = "LFX Mentorship 2026 Term 3 (September - November)"
icon = "fas fa-calendar-day"

+++

---

The Kubeflow Community is participating in the [**LFX Mentorship Program 2026 Term 3 (September - November)**](https://mentorship.lfx.linuxfoundation.org/).
This page aims to help you participate in LFX Mentorship with Kubeflow.

## What is LFX Mentorship?

The [LFX Mentorship Program](https://lfx.linuxfoundation.org/tools/mentorship/) is run by the Linux Foundation and CNCF to help developers begin their open source journey.
Mentees work with experienced project maintainers on real-world projects and receive a stipend upon successful completion.

For more information, see the [CNCF mentoring repository](https://github.com/cncf/mentoring) and the [LFX Mentee Guide](https://docs.linuxfoundation.org/lfx/mentorship/mentee-guide).

## How can I participate?

Thank you for your interest in participating in LFX Mentorship with Kubeflow!

### Key Dates

Here are the key dates for LFX Mentorship 2026 Term 3, the [full timeline](https://github.com/cncf/mentoring/tree/main/programs/lfx-mentorship/2026/03-Sep-Nov) is available on the CNCF mentoring page:

<div class="table-responsive">
<div class="table table-bordered">

| Event                       | Date                          |
| --------------------------- | ----------------------------- |
| **Applications Open**       | August 3 @ 00:00 UTC          |
| **Applications Deadline**   | August 18 @ 23:59 UTC         |
| **Application Review**      | August 19 - September 1       |
| **Selection Notifications** | September 2 - 4               |
| **Mentorship Begins**       | September 7                   |
| **Midterm Evaluations**     | October 20 @ 18:00 UTC        |
| **Final Evaluations**       | November 24 @ 18:00 UTC       |
| **Mentorship Ends**         | November 27                   |

</div>
</div>

### Steps

1. Review the [Term 3 timeline](https://github.com/cncf/mentoring/tree/main/programs/lfx-mentorship/2026/03-Sep-Nov) on the CNCF mentoring page.
2. Join the [Kubeflow Slack](/docs/about/community/#kubeflow-slack-channels):
   - **NOTE:** please **do not** reach out privately to mentors, instead, start a thread in the [`#kubeflow-contributors`](https://cloud-native.slack.com/archives/C0742LBR5BM) channel so others can see the response.
3. Learn about Kubeflow:
   - Read the [Introduction to Kubeflow](/docs/started/introduction/)
   - Review the [Architecture Overview](/docs/started/architecture/)
   - Consider [trying out Kubeflow](/docs/started/installing-kubeflow/)
4. Review the [projects](#projects) below to decide which ones you are interested in.
5. Apply through the [LFX Mentorship portal](https://mentorship.lfx.linuxfoundation.org/) with following the prerequisites listed on respective LFX project.

## Projects

### Project 1: Abstracting Pod Lifecycle Diagnostics for Kubeflow Pipelines

**Components:** [kubeflow/pipelines](https://github.com/kubeflow/pipelines)

**Mentors:** [Alyssa Goins](https://github.com/alyssacgoins), [Matt Prahl](https://github.com/mprahl)

**Details:**

Improve the Kubeflow Pipelines (KFP) user experience by surfacing Kubernetes pod lifecycle failures directly in the UI. The project spans the frontend (TypeScript), backend (Go), Kubernetes APIs, and Argo Workflows to make debugging much easier for ML engineers.

**Skills Required/Preferred:**

- Go
- TypeScript
- Kubernetes and pod debugging experience
- Kubeflow (preferred)

**Links:**

- [LFX Mentorship Project](https://mentorship.lfx.linuxfoundation.org/project/aba3293b-593c-4afd-a22d-27d70fc50ff8)
- [Proposal Issue: cncf/mentoring#1928](https://github.com/cncf/mentoring/issues/1928)

### Project 2: Evolve SparkClient into Kubeflow's Unified Data Processing Layer

**Components:** [kubeflow/sdk](https://github.com/kubeflow/sdk) (SparkClient), [kubeflow/spark-operator](https://github.com/kubeflow/spark-operator)

**Mentors:** [Shekhar Rajak](https://github.com/Shekharrajak), [Tariq Hasan](https://github.com/tariq-hasan), [Rishabh Singh](https://github.com/RobuRishabh)

**Details:**

Extend SparkClient with observability, scheduled and streaming execution, deeper Kubeflow integration, and end-to-end Spark → Trainer workflows, making it the unified data-processing layer within Kubeflow.

**Skills Required/Preferred:**

- Python, Java
- Apache Spark
- Kubernetes
- Distributed data processing and ML workflows
- DataFusion/Arrow and Prometheus/observability tools (optional)

**Links:**

- [LFX Mentorship Project](https://mentorship.lfx.linuxfoundation.org/project/01d5da81-e5d6-4693-920c-e0e6f4fbc9a8)
- [Proposal Issue: cncf/mentoring#1975](https://github.com/cncf/mentoring/issues/1975)

### Project 3: OptimizationJob: HPO Engine for Kubeflow Trainer

**Components:** [kubeflow/katib](https://github.com/kubeflow/katib), [kubeflow/trainer](https://github.com/kubeflow/trainer), [kubeflow/sdk](https://github.com/kubeflow/sdk)

**Mentors:** [Tariq Hasan](https://github.com/tariq-hasan), [Aniket Shaha](https://github.com/aniket2405), [Akshay Chitneni](https://github.com/akshaychitneni), [Andrey Velichkevich](https://github.com/andreyvelich)

**Details:**

Build the next-generation Hyperparameter Optimization runtime for Kubeflow Trainer by implementing the OptimizationJob controller, Katib compatibility, stateless suggestion service, metrics processing, and production-quality testing.

**Skills Required/Preferred:**

- Go
- Python
- Kubernetes controllers and CRDs
- HPO frameworks

**Links:**

- [LFX Mentorship Project](https://mentorship.lfx.linuxfoundation.org/project/6a3ba49c-5202-4231-b86f-90b798e84997)
- [Proposal Issue: cncf/mentoring#2013](https://github.com/cncf/mentoring/issues/2013)
