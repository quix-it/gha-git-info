const core = require('@actions/core');
const github = require('@actions/github');
const gitinfo = require('./gitinfo');

async function run() {
  try {
    const inputs = {};
    inputs['nexus_base_path'] = core.getInput('nexus_base_path');
    inputs['maven_group_id'] = core.getInput('maven_group_id');
    inputs['maven_artifact_id'] = core.getInput('maven_artifact_id');
    inputs['maven_extension'] = core.getInput('maven_extension');
    inputs['maven_classifier'] = core.getInput('maven_classifier');
    inputs['releases_repo'] = core.getInput('releases_repo');
    inputs['snapshots_repo'] = core.getInput('snapshots_repo');
    const quiet = (core.getInput('quiet') == 'true');

    const info = await gitinfo(github.context, inputs);

    core.setOutput("sha", info['sha']);
    core.setOutput("sha_short", info['sha_short']);
    core.setOutput("tag", info['tag']);
    core.setOutput("is_tag", info['is_tag']);
    core.setOutput("revision", info['revision']);
    core.setOutput("branch", info['branch']);
    core.setOutput("branch_unslashed", info['branch_unslashed']);
    core.setOutput("repository_name", info['repository_name']);
    core.setOutput("maven_revision", info['maven_revision']);
    core.setOutput("artifact_revision", info['artifact_revision']);
    core.setOutput("nexus_repo", info['nexus_repo']);
    core.setOutput("nexus_search_url", info['nexus_search_url']);

    if (!quiet) console.log(info);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
