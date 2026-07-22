+++
title = "Getting Started"
description = "Get started with Kubeflow MCP Server"
weight = 20
+++

## Install from source

Clone the repository and install the package:

```bash
git clone https://github.com/kubeflow/mcp-server.git
cd mcp-server
pip install .
```

## Run the server

Start Kubeflow MCP Server with its default configuration:

```bash
kubeflow-mcp serve
```

The default transport is HTTP and listens on `http://localhost:8000/mcp`.
Configure authentication before exposing the endpoint outside a local development
environment. See the repository's
[HTTP authentication guidance](https://github.com/kubeflow/mcp-server#kubeflow-mcp-serve)
for the available bearer-token and JWT settings.

## Connect an MCP client

For example, add a local stdio server to Claude Code:

```bash
claude mcp add kubeflow -- kubeflow-mcp serve
```

The repository also includes configuration examples for Cursor and HTTP clients.
Watch the [demo video](https://github.com/kubeflow/mcp-server#demo) for a walkthrough.
Review the project [README](https://github.com/kubeflow/mcp-server#readme) for the
current options, supported personas, and client configuration.
