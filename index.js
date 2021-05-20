const core = require('@actions/core');
const github = require('@actions/github');
const gitinfo = require('./gitinfo');

async function run() {
  try {
    const info = await gitinfo(github.context.payload);

    core.setOutput("sha", info['sha']);
    core.setOutput("sha_short", info['sha_short']);
    core.setOutput("tag", info['tag']);
    core.setOutput("is_tag", info['is_tag']);
    core.setOutput("revision", info['revision']);
    core.setOutput("branch", info['branch']);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
