let gitinfo = function gitinfo(context, inputs = {}) {
  return new Promise((resolve) => {
    const info = {};
    const tags_match = context.ref.match(/^refs\/tags\/(?<tag>.+)$/);
    const heads_match = context.ref.match(/^refs\/heads\/(?<head>.+)$/);

    if(context.eventName == 'push') {
      info['sha'] = context.sha;
      if (heads_match) {
        info['branch'] = heads_match.groups['head'];
        info['branch_unslashed'] = (info['branch'] || "").replace(/\//,"-");
      }
    } else if(context.eventName == 'pull_request') {
      info['sha'] = context.payload.pull_request.head.sha;
      info['branch'] = process.env.GITHUB_HEAD_REF;
      info['branch_unslashed'] = (info['branch'] || "").replace(/\//,"-");
    }

    info['repository_name'] = context.payload.repository.name;
    info['sha_short'] = info['sha'].substring(0,7);
    if (tags_match) {
      info['tag'] = tags_match.groups['tag'];
      const revision_match = info['tag'].match(/^v?(?<rev>\d.*)$/);
      if (revision_match == null) {
        info['revision'] = info['tag'];
      } else {
        info['revision'] = revision_match.groups['rev'];
      }
    } else {
      info['tag'] = '';
      info['revision'] = info['sha_short'];
    }
    info['is_tag'] = (info['tag'].length > 0);


    if (info['is_tag']) {
      info['maven_revision'] = info['revision'];
      info['artifact_revision'] = info['revision'];
      info['nexus_repo'] = process.env['RELEASES_REPO'] || "releases";
    } else {
      info['maven_revision'] = info['branch_unslashed'] + "-SNAPSHOT";
      info['artifact_revision'] = info['branch_unslashed'];
      info['nexus_repo'] = process.env['SNAPSHOTS_REPO'] || "snapshots";
    }

    const nexus_base_path = inputs['nexus_base_path'] || process.env['NEXUS_BASE_PATH'];
    const maven_group_id = inputs['maven_group_id'] || process.env['MAVEN_GROUP_ID'];
    const maven_artifact_id = inputs['maven_artifact_id'] || process.env['MAVEN_ARTIFACT_ID'];
    const maven_extension = inputs['maven_extension'] || process.env['MAVEN_EXTENSION'] || "war";
    
    if (nexus_base_path && maven_group_id && maven_artifact_id) {
      var params = [
        `repository=${info['nexus_repo']}`,
        `group=${maven_group_id}`,
        `name=${maven_artifact_id}`,
        `maven.extension=${maven_extension}`,
        `sort=version`,
        `direction=desc`
      ]
      if (info['is_tag']) {
        params.push(`version=${info['artifact_revision']}`)
      } else {
        params.push(`version=${info['artifact_revision']}-*`)
      }
      info['nexus_search_url'] = `${nexus_base_path}/service/rest/v1/search/assets?${params.join('&')}`
    }

    resolve(info);
  });
};

module.exports = gitinfo;
