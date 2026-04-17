---
description: Build a quick architecture map using Octocode-backed code intelligence, repo docs, and MCP-backed references.
agent: agent
---

Read [AI_SETUP.md](../../AI_SETUP.md), [README.md](../../README.md) first.

Use this prompt when you need structural context before making a change:

1. Map the relevant runtime surface: extension host, webview, tests, or analyzer tooling.
2. Use Octocode first:
	- `semantic_search` to locate the most likely files
	- `view_signatures` to inspect structure before reading full files
	- `graphrag` when the question is about relationships or flow across modules
3. Verify behavior-sensitive details with direct file reads after Octocode narrows the target set.
4. Use MCP-backed docs and repository context when the task depends on external APIs, VS Code behavior, or GitHub repository details.
5. Return a focused change map: entry points, state owners, data flow, and the minimum files that should change.