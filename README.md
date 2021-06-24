# Git info

![unit-test](https://github.com/quix-it/gha-update-env-file/actions/workflows/test.yml/badge.svg?branch=v1)

This is a GitHub Actions action used for manipulating info from `github` context and exposing them for being consumed by subsequent steps/jobs in a workflow.

The idea behind this action is to provide a simple and standard way to define a revision name for the artifacts produced by a workflow run.
For example, if the workflow is triggered by a branch push event, the `revision` output parameter is set to the short SHA of the last commit being pushed, whilst if the trigger is a tagging operation the revision is set to the tag name.

## Inputs

The action requires no explicit inputs as it just reads the current `github` context, although a few inputs may be provided in order to adjust the action's behaviour.

| Name | Mandatory | Default | Description |
| - | - | - | - |
| quiet | `false` | `false` | If `true` the outputs will just be made available within the job and not printed out during action execution |

If the workflow produces some Maven artifact and needs to interact with a Nexus artifactory appliance, it is possible to get the `nexus_search_url` for searching the newly created artifacts by providing a few parameters, namely:

| Name | Mandatory | Default | Description |
| - | - | - | - |
| nexus_base_path | `true` | | Base URL to the Nexus artifactory appliance (overrides NEXUS_BASE_PATH environment variable) |
| maven_group_id | `true` | | Group ID of the artifact as defined in pom.xml (overrides MAVEN_GROUP_ID environment variable) |
| maven_artifact_id | `true` | | Artifact name as defined in pom.xml (overrides MAVEN_ARTIFACT_ID environment variable) |
| maven_extension | `false` | `"war"` | Maven extension of the artifact to search for (overrides MAVEN_EXTENSION environment variable) |
| maven_classifier | `false` | | Maven classifier to search for (overrides MAVEN_CLASSIFIER environment variable) |
| releases_repo | `false` | `"releases"` | Releases repository name (overrides RELEASES_REPO environment variable) |
| snapshots_repo | `false` | `"snapshots"` | Snapshots repository name (overrides SNAPSHOTS_REPO environment variable) |

If the mandatory parameters are not provided no `nexus_search_url` output get produced.

## Outputs

| Name | Description |
| - | - |
| sha | Long commit id |
| sha_short | Short commit id (as in `git rev-parse --short HEAD`) |
| tag | Tag name if the workflow has been triggered by a tag |
| is_tag | Boolean set to `true` if `tag` is defined |
| revision | Equals `tag` if `is_tag`, `sha_short` otherwise |
| branch | Name of the current branch (if not `is_tag`) |
| branch_unslashed | Name of the current branch with `/`s replaced by `-`s |
| repository_name | Name of the current repository |
| maven_revision | Revision to be used within Maven's pom.xml: `revision` for tags, `branch_unslashed` plus `"-SNAPSHOT"` otherwise |
| artifact_revision | Asset version to search Nexus artifactory for (must not include `-SNAPSHOT`): `revision` for tags, `branch_unslashed` otherwise |
| nexus_repo | Either `releases_repo` or `snapshots_repo` from inputs depending on whether the workflow trigger was a push tag event or not |
| nexus_search_url | The URL to the Nexus API to search for the produced artifacts |

## Usage

```yaml
...
    - uses: quix-it/gha-git-info@v1
      id: info
      env:
        NEXUS_BASE_PATH: https://nexus.local/nexus
        MAVEN_GROUP_ID: it.quix.app
        MAVEN_ARTIFACT_ID: my-artifact
    - run: |
        echo "sha=${{ steps.info.outputs.sha }}"
        echo "sha_short=${{ steps.info.outputs.sha_short }}"
        echo "tag=${{ steps.info.outputs.tag }}"
        echo "is_tag=${{ steps.info.outputs.is_tag }}"
        echo "revision=${{ steps.info.outputs.revision }}"
        echo "branch=${{ steps.info.outputs.branch }}"
        echo "repository_name=${{ steps.info.outputs.repository_name }}"
        echo "nexus_search_url=${{ steps.info.outputs.nexus_search_url }}"
...
```
