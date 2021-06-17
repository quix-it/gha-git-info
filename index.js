const core = require('@actions/core');
const github = require('@actions/github');
const gitinfo = require('./gitinfo');

async function run() {
  try {
    const info = await gitinfo(github.context);

    const quiet = (core.getInput('quiet') == 'true');

    core.setOutput("sha", info['sha']);
    core.setOutput("sha_short", info['sha_short']);
    core.setOutput("tag", info['tag']);
    core.setOutput("is_tag", info['is_tag']);
    core.setOutput("revision", info['revision']);
    core.setOutput("branch", info['branch']);
    core.setOutput("repository_name", info['repository_name']);

    if (!quiet) console.log(info);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
