const { test, expect } = require('@jest/globals');
const gitinfo = require('./gitinfo');
const fs = require('fs');

const filename = "./test/commit-context.json";
const encoding = "utf8";

const commit_data = fs.readFileSync(filename, { encoding: encoding });
const commit_context = JSON.parse(commit_data);

test('test SHAs', async () => {
  const info = await gitinfo(commit_context);
  expect(info['sha']).toBe('637c03eddbc22e3ea878beb07cf3abd6988cf3d3');
  expect(info['sha_short']).toBe('637c03e');
});

test('test tag/revision', async () => {
  const info = await gitinfo(commit_context);
  expect(info['tag']).toBe('');
  expect(info['is_tag']).toBe(false);
  expect(info['revision']).toBe('637c03e');
});

test('test branch', async () => {
  const info = await gitinfo(commit_context);
  expect(info['branch']).toBe('fix/v1');
  expect(info['branch_unslashed']).toBe('fix-v1');
});

const tagged_contents = {
  ref: "refs/tags/v1.0",
  eventName: "push",
  sha: "0123456",
  payload: {
    repository: {
      name: "gha-git-info"
    }
  }
};

test('test v-tags', async () => {
  const info = await gitinfo(tagged_contents);
  expect(info['tag']).toBe('v1.0');
  expect(info['revision']).toBe('1.0');
  expect(info['repository_name']).toBe('gha-git-info');
});

test('test maven info on commit', async () => {
  const info = await gitinfo(commit_context);
  expect(info['maven_revision']).toBe('0.0.0-fix-v1-SNAPSHOT');
  expect(info['artifact_revision']).toBe('fix-v1');
  expect(info['nexus_repo']).toBe('snapshots');
});

test('artifact_always vs ARTIFACT_ALWAYS', async () => {
  const inputs = {
    artifact_always: false
  }
  process.env.ARTIFACT_ALWAYS = "true";
  const info = await gitinfo(commit_context, inputs);

  expect(info['is_tag']).toBeFalsy();
  expect(info['make_artifact']).toBeFalsy();
  delete process.env.ARTIFACT_ALWAYS;
});

test('no tag and ARTIFACT_ALWAYS true', async () => {
  process.env.ARTIFACT_ALWAYS = "true";
  const info = await gitinfo(commit_context);

  expect(info['is_tag']).toBeFalsy();
  expect(info['make_artifact']).toBeTruthy();
  delete process.env.ARTIFACT_ALWAYS;
});

test('artifact_events unset', async () => {
  const info = await gitinfo(commit_context);

  expect(info['is_tag']).toBeFalsy();
  expect(info['make_artifact']).toBeFalsy();
});

test('artifact_events = "push,pull_request"', async () => {
  const inputs = {
    artifact_events: "push,pull_request"
  }
  const info = await gitinfo(commit_context, inputs);

  expect(info['is_tag']).toBeFalsy();
  expect(info['make_artifact']).toBeTruthy();
});
