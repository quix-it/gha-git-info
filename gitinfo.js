let gitinfo = function gitinfo(payload) {
  return new Promise((resolve) => {
    const info = {};

    info['sha'] = payload.head_commit.id;
    info['sha_short'] = info['sha'].substring(0,7);

    const tags_match = payload.ref.match(/^refs\/tags\/(?<tag>.+)$/);
    if (tags_match) {
      info['tag'] = tags_match.groups['tag'];
      info['revision'] = info['tag'];
    } else {
      info['tag'] = '';
      info['revision'] = info['sha_short'];
    }
    info['is_tag'] = (info['tag'].length > 0);

    const heads_match = payload.ref.match(/^refs\/heads\/(?<head>.+)$/);
    if (heads_match) {
      info['branch'] = heads_match.groups['head'];
    }

    resolve(info);
  });
};

module.exports = gitinfo;
