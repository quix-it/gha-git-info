let gitinfo = function gitinfo(context) {
  return new Promise((resolve) => {
    const info = {};
    const tags_match = context.ref.match(/^refs\/tags\/(?<tag>.+)$/);
    const heads_match = context.ref.match(/^refs\/heads\/(?<head>.+)$/);

    if(context.eventName == 'push') {
      info['sha'] = context.sha;
    } else if(context.eventName == 'pull_request') {
      info['sha'] = context.payload.pull_request.head.sha;
    }

    info['sha_short'] = info['sha'].substring(0,7);
    if (tags_match) {
      info['tag'] = tags_match.groups['tag'];
      info['revision'] = info['tag'];
    } else {
      info['tag'] = '';
      info['revision'] = info['sha_short'];
    }
    info['is_tag'] = (info['tag'].length > 0);

    if (heads_match) {
      info['branch'] = heads_match.groups['head'];
    }

    resolve(info);
  });
};

module.exports = gitinfo;
