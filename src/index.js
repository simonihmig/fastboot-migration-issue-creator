'use strict';

const MergeProvider = require('./providers/merge');
const EmberObserverSearchProvider = require('./providers/emberobserver-search');
const getRepo = require('./github/get-repo');
const hasNoIssue = require('./github/has-no-repo-issue');
const createIssue = require('./github/create-issue');
const Promise = require('bluebird');
const GitHubApi = require("github");

const issueSearchTerm = '"FastBoot 1.0" state:open';

const createIssueTitle = 'Fix FastBoot 1.0';
const createIssueBody = 'bla bla';


let github = new GitHubApi({
  Promise
});

github.authenticate({
  type: "basic",
  username: 'simonihmig',
  password: ''
});

let provider = new MergeProvider([
  new EmberObserverSearchProvider('process.env.EMBER_CLI_FASTBOOT'),
  new EmberObserverSearchProvider('fastboot-filter-initializers')
]);

console.log('Retrieving affected addons...');

// provider.retrieve()
//   .then(addons => addons.filter(addon => addon !== 'ember-x-editable-addon'))
//   .then(addons => {
//     console.log('Found these addons:', addons);
//     return Promise.filter(addons.map(addon => getRepo(addon)), repo => !!repo)
//   })

Promise.resolve(['simonihmig/fastboot-migration-issue-creator-dummy-addon'])
  .then(repos => {
    console.log('Checking for existing FastBoot 1.0 issues...');
    return Promise.filter(repos, repo => {
      return hasNoIssue(github, issueSearchTerm, repo)
        .then(result => {
          if (!result) {
            console.log(`${repo} has an existing issue/PR, skipping...`);
          }
          return result;
        });
    }, { concurrency: 1 });
  })
  .then(repos => {
    console.log('Creating issues for these repos', repos);
    return Promise.map(repos, repo => {
      console.log(`Creating issue in repo ${repo}...`);
      return createIssue(github, repo, createIssueTitle, createIssueBody);
    });
  });