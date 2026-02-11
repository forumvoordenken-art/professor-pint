# Professor Pint - Project Instructions

## Git Workflow

### Before pulling from remote
Always stash unstaged changes before pulling with rebase:

```bash
git stash
git pull origin <branch-name> --rebase
git stash pop
```

This prevents the recurring `error: cannot pull with rebase: You have unstaged changes` error.

### Branch
- Development branch: `claude/automate-professor-pint-yJ69L`
- Always push with: `git push -u origin claude/automate-professor-pint-yJ69L`
