"use strict";
const promisify = require('bluebird').promisify;
const getRepoUrl = promisify(require('get-repository-url'));
const parseRepoUrl = require('parse-github-repo-url');

module.exports = function getRepoFromPackage(pkg) {
  return getRepoUrl(pkg)
    .then(url => url ? parseRepoUrl(url).slice(0,2).join('/') : null);
};
