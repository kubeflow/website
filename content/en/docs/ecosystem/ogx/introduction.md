+++
title = "Introduction"
description = "A brief introduction to OGX"
weight = 1
+++

## What is OGX?

[OGX](https://github.com/ogx-ai/ogx), formerly Llama Stack, provides an open-source API layer for building agentic AI applications on user-controlled infrastructure. 

It exposes OpenAI-compatible APIs for chat completions, Responses, vector stores, files, tools, and retrieval-augmented generation, while supporting multiple model and infrastructure backends.

<img src="https://raw.githubusercontent.com/ogx-ai/ogx/ebaaff8b17b8e3a7190c7b26565eda111659336c/docs/static/img/architecture-animated.svg" alt="ogx-architecture">

### What you get
- Chat Completions & Embeddings — standard /v1/chat/completions, /v1/completions, and /v1/embeddings endpoints, compatible with any OpenAI client
- Responses API — server-side agentic orchestration with tool calling, MCP server integration, and built-in file search (RAG) in a single API call (learn more)
- Vector Stores & Files — /v1/vector_stores and /v1/files for managed document storage and search
- Batches — /v1/batches for offline batch processing
- Skills — /v1alpha/skills for managing versioned skill bundles (zip archives with SKILL.md manifests) that agents can invoke
- Open Responses conformant — the Responses API implementation passes the Open Responses conformance test suite
- Multi-SDK support — use the Anthropic SDK (/v1/messages) or Google GenAI SDK (/v1alpha/interactions) natively alongside the OpenAI API

## How to use OGX with Kubeflow?
OGX integrates with Kubeflow Pipelines / Data Science Pipelines through multiple RAG demos that ingest multimodal data into OGX/Llama Stack vector stores. These pipelines process source data, upload files with the Llama Stack client, create vector stores, attach files, and make the resulting indexes available for RAG queries through the Responses file_search API.

Concrete examples:

- [PDF ingestion pipeline](https://github.com/opendatahub-io/rag/tree/main/demos/kubeflow-pipelines/pdf-conversion)
- [ASR/audio ingestion pipeline](https://github.com/opendatahub-io/rag/tree/main/demos/kubeflow-pipelines/asr-conversion)
- [OCR/image ingestion pipeline](https://github.com/opendatahub-io/rag/tree/main/demos/kubeflow-pipelines/ocr-image-conversion)
- [Spreadsheet ingestion pipeline](https://github.com/opendatahub-io/rag/tree/main/demos/kubeflow-pipelines/spreadsheets-conversion)
- [End-to-end bank RAG demo](https://github.com/opendatahub-io/rag/tree/main/demos/redbank-demo)

## Next Steps

- Visit the <a href="https://github.com/ogx-ai/ogx" target="_blank">OGX GitHub Repository</a>
- See the <a href="https://ogx-ai.github.io/docs" target="_blank">OGX Documenation</a>