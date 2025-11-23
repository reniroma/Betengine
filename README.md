# BetEngine

Utility script added to automatically resolve merge conflicts by choosing either the incoming or current branch changes.

## Automatically resolve conflicts
Run the helper from the repository root whenever a merge stops with conflicts:

```bash
./scripts/auto-resolve-merge-conflicts.sh           # defaults to keeping current branch (Codex) changes
./scripts/auto-resolve-merge-conflicts.sh --theirs  # keep incoming branch changes instead
```

The script resolves all conflicted files, stages them, and reports what was updated.
