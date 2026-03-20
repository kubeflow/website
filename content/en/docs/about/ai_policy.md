+++
title = "AI Policy"
description = "Guidelines for using AI and coding agents"
weight = 30
aliases = ["/docs/ai-policy/"]
+++

Please review the Kubeflow [contributing](contributing.md) guide first.

The use of AI to generate code or documentation is permitted, but contributors must adhere to the following guidelines.

- **Verification:** Do not blindly submit AI outputs. All AI-generated code must be locally built, linted, and tested against the Kubeflow test suite before a PR is opened.
- **Explainability:** You must be able to explain and justify any AI-generated logic during the review process. If you can't explain it, don't submit it.
- **Disclosure:** If a contribution is substantially generated or refactored by AI (e.g., Claude, Codex, Cursor), include a note in the PR description or use a footer in the commit message: `Assisted-by: [Agent Name]`, or `Co-authored-by: [Agent Name]`.
- **Quality:** Maintainers reserve the right to close PRs that appear to be low-effort, mass-generated AI content that adds technical debt or lacks proper context.
- **Authentic Communication:** AI should be used for code and technical drafting, not for automated responses to maintainer feedback or community discussions. We value human-to-human collaboration.




