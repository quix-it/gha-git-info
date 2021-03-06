# Git info

![unit-test](https://github.com/quix-it/gha-update-env-file/actions/workflows/test.yml/badge.svg)

This is a GitHub Actions action used for manipulating info from `github` context and exposing them for being consumed by subsequent steps/jobs in a workflow.

The idea behind this action is to provide a simple and standard way to define a revision name for the artifacts produced by a workflow run.
For example, if the workflow is triggered by a branch push event, the `revision` output parameter is set to the short SHA of the last commit being pushed, whilst if the trigger is a tagging operation the revision is set to the tag name.

## Inputs

The action requires no explicit inputs as it just reads the current `github` context.

## Outputs

| Name | Description |
| - | - |
| sha | Long commit id |
| sha_short | Short commit id (as in `git rev-parse --short HEAD`) |
| tag | Tag name if the workflow has been triggered by a tag |
| is_tag | Boolean set to `true` if `tag` is defined |
| revision | Equals `tag` if `is_tag`, `sha_short` otherwise |
| branch | Name of the current branch (if not `is_tag`) |
