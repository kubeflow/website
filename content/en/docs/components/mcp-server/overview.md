+++
title = "Overview"
description = "An overview of Kubeflow MCP Server"
weight = 10
+++

## What is Kubeflow MCP Server?

Kubeflow MCP Server exposes Kubeflow training operations as
[Model Context Protocol](https://modelcontextprotocol.io/) tools. MCP-compatible
AI assistants can use these tools to inspect a cluster, plan training workloads,
submit jobs, monitor progress, and manage existing jobs.

The server currently integrates with Kubeflow Trainer. Its tools are organized
around planning, discovery, training, monitoring, lifecycle management, platform
administration, and health checks.

Mutating tools require explicit confirmation before they change cluster state.
The server also supports namespace enforcement, persona-based tool access, input
validation, and authentication for HTTP deployments.

## Next steps

- Follow the [Getting Started guide](../getting-started/) to run the server.
- Review the [Kubeflow MCP Server repository](https://github.com/kubeflow/mcp-server)
  for configuration, architecture, and contribution details.
