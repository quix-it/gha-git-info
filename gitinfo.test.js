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
  expect(info['branch']).toBe('v1');
});
