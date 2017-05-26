"use strict";
const rateLimit = require('./rate-limit');

module.exports = function hasNoRepoIssue(github, searchTerm, repo) {
  return github.search.issues({
    q: `${searchTerm} repo:${repo}`
  })
    .then(result => {
      let count = result.data.total_count;
      return rateLimit(result)
        .then(() => count === 0);
    })
    .catch((e) => {
      console.error(`Could not search issues for repo ${repo}: ${e}`);
      return false;
    });
};
