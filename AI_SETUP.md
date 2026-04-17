# AI / Copilot Setup

This repository now uses an Octocode-first AI setup for codebase research:

- repo-wide guidance in `.github/copilot-instructions.md`
- path-scoped instructions in `.github/instructions/`
- reusable slash prompts in `.github/prompts/`
- an architecture map in `ARCHITECTURE.md`
- workspace MCP servers in `.vscode/mcp.json`

## MCP servers

- GitHub: `https://api.githubcopilot.com/mcp`
  - Use for GitHub repository, PR, issue, and code context, including VS Code repository lookups.
- Context7: `https://mcp.context7.com/mcp`
  - Use for current library and API docs plus examples.
- Microsoft Learn: `https://learn.microsoft.com/api/mcp?maxTokenBudget=4000`
  - Use for official Microsoft docs and code samples.
- Octocode: `sh tools/octocode/run-mcp.sh`
  - Primary codebase research surface for AI. Exposes semantic search, file signatures, GraphRAG relationships, and structural search through Octocode's MCP server.
- Memory: `npx -y @modelcontextprotocol/server-memory`
  - Zero-setup local fallback memory. Uses `.vscode/memory.jsonl` for repo-local persistence and is intended for cross-step task context, not source-of-truth project data.

This workspace now uses a mix of hosted MCP servers, local wrappers, and optional local services. Octocode is the default code-intelligence path.

## Octocode setup

This repo expects Octocode to be the default AI research tool.

### Install

Choose one:

- `brew install muvon/tap/octocode`
- `curl -fsSL https://raw.githubusercontent.com/Muvon/octocode/master/install.sh | sh`

If you use the upstream installer on macOS, the binary is typically installed to `~/.local/bin/octocode`. The workspace wrapper script under `tools/octocode/run-mcp.sh` checks both `PATH` and that default install location.

### Local-only configuration

No API keys are required for the local embedding setup currently used in this workspace:

```bash
octocode config \
  --code-embedding-model "fastembed:Xenova/all-MiniLM-L6-v2" \
  --text-embedding-model "fastembed:intfloat/multilingual-e5-small" \
  --graphrag-enabled true
```

### Index the repo

Run from the repository root:

```bash
npm run octo:index
```

For a full rebuild of the local index:

```bash
npm run octo:reindex
```

For continuous reindexing during active work:

```bash
npm run octo:watch
```

These convenience scripts all route through the wrapper scripts in `tools/octocode/`, so they work whether `octocode` is on `PATH` or installed at `~/.local/bin/octocode`.

The wrappers use Octocode's `--no-git` mode consistently for indexing, watch, and MCP operations so uncommitted local edits are included during active development and the MCP server reads the same local store that `npm run octo:index` builds.

### Recommended AI usage pattern

1. Use Octocode search first to locate likely files.
2. Use Octocode view/signatures to inspect those files without reading full sources immediately.
3. Use GraphRAG when relationship or flow questions cross file boundaries.
4. Read source files directly only after Octocode narrows the target set.

## Prompt files

- `/trace-tab-events` for raw tab and group event debugging plus plan-aligned fixes.
- `/add-tab-integration-test` for resolved-event integration tests.
- `/map-architecture` for quick Octocode-backed structural mapping before edits.

## Repo-specific guidance

For tab and group change work:

- use `npm run analyze:events` when the question is about raw VS Code event order or duplication
- keep observation, compression, replay, and resolution concerns separate
- avoid live snapshot fallbacks in reducer-style code unless the task explicitly requires them