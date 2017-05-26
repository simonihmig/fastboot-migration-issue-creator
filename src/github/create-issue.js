"use strict";
const rateLimit = require('./rate-limit');

module.exports = function createIssue(github, repoSpec, title, body) {
  let [owner, repo] = repoSpec.split('/');
  return github.issues.create({
    owner,
    repo,
    title,
    body
  })
    .then(result => {
      console.log(`Created issue in ${repo} repo: ${result.data.html_url}`);
      let count = result.data.total_count;
      return rateLimit(result)
        .then(() => count === 0);
    })
    .catch((e) => {
      console.error(`Could not create issue for repo ${repo}: ${e}`);
      return false;
    });
};
