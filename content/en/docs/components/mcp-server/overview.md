+++
title = "Overview"
description = "An overview of Kubeflow MCP Server"
weight = 10
+++

## What is Kubeflow MCP Server

The [Kubeflow MCP Server](https://github.com/kubeflow/mcp-server) exposes Kubeflow Trainer
operations as [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) tools, built on
top of the Kubeflow SDK's `TrainerClient`. It lets AI agents (Claude, Cursor, Claude Code, or
any custom agent) plan, submit, monitor, and manage training jobs conversationally — without
users needing to learn Kubernetes or the Kubeflow SDK directly.

It is developed and released as a separate project from the SDK — see
[KEP-936](https://github.com/kubeflow/community/tree/master/proposals/936-kubeflow-mcp-server)
for the design proposal.

### Key Benefits

- **Agent-Native** — Tools are auto-discovered via MCP, with no manual API wiring
- **Guided Workflow** — Phase ordering with next-step hints (Plan → Discover → Train → Monitor)
- **Preview-Before-Submit** — Every mutating operation requires explicit confirmation
- **Security-First** — Persona gating, namespace enforcement, input validation, bearer/JWT auth
- **Multi-Platform** — Auto-detects OpenShift, EKS, and GKE with platform-specific guidance
- **Token-Efficient** — Progressive/semantic modes compress 23 tools into 2–3 meta-tools
- **Extensible** — Plugin architecture for additional Kubeflow clients (optimizer and hub planned)

## How It Works

1. **Connect** — The server loads Kubeflow SDK clients (`trainer`, with `optimizer` and `hub`
   planned) and registers their operations as MCP tools
2. **Filter by persona** — The active persona (`readonly`, `data-scientist`, `ml-engineer`,
   `platform-admin`) determines which tools are visible to the caller
3. **Preview, then confirm** — Mutating tools return a preview when called without
   `confirmed=True`, and only apply the change on a confirmed follow-up call
4. **Guide by phase** — Tool responses include next-step hints so agents follow the
   Plan → Discover → Train → Monitor workflow instead of guessing what to call next

## Quick Start

Install the MCP server:

```bash
pip install kubeflow-mcp
```

Start the server (defaults to `stdio` transport):

```bash
kubeflow-mcp serve
```

For Claude Code, register it directly:

```bash
claude mcp add kubeflow -- kubeflow-mcp serve
```

For the HTTP transport (e.g. Docker image):

```bash
kubeflow-mcp serve --transport http --auth-token my-secret-token
```

Or run the pre-built multi-arch image published to GHCR:

```bash
docker run --rm -p 8000:8000 \
  -e KUBEFLOW_MCP_AUTH_TOKEN=my-secret-token \
  ghcr.io/kubeflow/mcp-server:latest
```

## Example: Fine-Tune a Model via AI Agent

Once connected, your AI agent can run a complete training workflow through natural language:

```text
User: "Fine-tune Llama 3.2 1B on the alpaca dataset"

Agent calls: check_compatibility()        → ✅ K8s 1.29, Trainer CRD installed
Agent calls: get_cluster_resources()      → 4x A100 GPUs available
Agent calls: estimate_resources(...)      → needs ~8GB GPU, 1x A100
Agent calls: list_runtimes()              → torchtune-llama3.2-1b, ...
Agent calls: fine_tune(                   → preview config (confirmed=False)
    model="hf://meta-llama/Llama-3.2-1B",
    dataset="hf://tatsu-lab/alpaca",
    runtime="torchtune-llama3.2-1b"
)
Agent calls: fine_tune(..., confirmed=True) → TrainJob "train-llama-abc" created
Agent calls: get_training_logs(...)        → training progress...
```

Every mutating tool requires `confirmed=True` — agents always preview before submitting.

## Tool Catalog

The MCP Server organizes tools by workflow phase:

| Phase | Tools | Description |
|-------|-------|-------------|
| Planning | `pre_flight`, `check_compatibility`, `get_cluster_resources`, `estimate_resources` | Environment validation and resource estimation |
| Discovery | `list_training_jobs`, `get_training_job`, `list_runtimes`, `get_runtime` | Browse jobs and available runtimes |
| Training | `fine_tune`, `run_custom_training`, `run_container_training` | Submit LoRA/QLoRA fine-tuning, custom scripts, or container jobs |
| Monitoring | `get_training_logs`, `get_training_events`, `wait_for_training` | Track progress and debug failures |
| Lifecycle | `delete_training_job`, `update_training_job` | Manage existing jobs (ownership-guarded) |
| Platform | `inspect_crd`, `inspect_controller`, `patch_runtime`, `create_runtime`, `delete_runtime` | Cluster inspection and runtime management |
| Health | `health_check`, `get_server_logs` | Server diagnostics |

## Next Steps

- Read the full documentation on the [SDK website](https://sdk.kubeflow.org/en/latest/mcp-server/index.html)
  for configuration, authentication, and tool discovery modes
- Watch the [demo walkthrough (OSS India)](https://youtu.be/cZ2BP5hQjc8)
- Visit the [GitHub repository](https://github.com/kubeflow/mcp-server) for source code,
  roadmap, and contributing guidelines
