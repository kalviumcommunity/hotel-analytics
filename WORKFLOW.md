# Team GitHub Workflow

## Branching Strategy

* main contains stable and releasable code only
* Feature branches follow the naming pattern feature/[description]
* Branches are deleted after merge

## Commit Message Convention

Format:

[type]: [description]

Types used:

* feat
* fix
* docs
* refactor
* chore

Why:

* Creates a clear project history
* Improves collaboration
* Supports future changelog generation

## Pull Request Review Process

* Every PR requires review before merge
* Reviews focus on correctness, clarity, data integrity, and maintainability
* Commit messages are reviewed as part of code review

## Issue Tracking

* Every feature or fix begins with a GitHub Issue
* Issues contain labels, descriptions, and assignees
* Issues are closed when the related PR is merged
