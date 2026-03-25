+++
title = "AI Policy"
description = "Guidelines for using AI and coding agents"
weight = 30
aliases = ["/docs/ai-policy/"]
+++

Please review the Kubeflow [contributing](contributing.md) guide first. If an [AGENTS.md](https://agents.md/) or [copilot-instructions.md](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) file is present, please configure your agent to read them for additional context.

The use of AI to generate code or documentation is permitted, but contributors must adhere to the following guidelines.

- **Verification:** Do not blindly submit AI outputs. All AI-generated code must be locally built, linted, and tested against the Kubeflow test suite before a PR is opened.
- **Explainability:** You must be able to explain and justify any AI-generated logic during the review process. If you can't explain it, don't submit it.
- **Disclosure:** If a contribution is substantially generated or refactored by AI (e.g., Claude, Codex, Cursor), include a note in the PR description or use a footer in the commit message: `Assisted-by: [Agent Name]`, or `Co-authored-by: [Agent Name]`.
- **Quality:** All contributions must still meet Kubeflow’s quality and security standards and comply with [DCO](https://developercertificate.org/), the [Apache-2.0](https://github.com/kubeflow/kubeflow/blob/master/LICENSE) license, and third-party IP/licensing requirements.
- **Authentic Communication:** AI should be used for code and technical drafting, not for automated responses to maintainer feedback or community discussions. We value human-to-human collaboration.




