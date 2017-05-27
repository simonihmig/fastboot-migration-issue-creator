'use strict';

const MergeProvider = require('./providers/merge');
const EmberObserverSearchProvider = require('./providers/emberobserver-search');
const hasNoIssue = require('./github/has-no-repo-issue');
const createIssue = require('./github/create-issue');
const getRepo = require('./github/get-repo');
const Promise = require('bluebird');
const GitHubApi = require("github");

const issueSearchTerm = '"FastBoot 1.0" state:open';

const createIssueTitle = 'Fix breaking changes in FastBoot 1.0';
const createIssueBody =
  'The current `ember-cli-fastboot` 1.0.0-rc.1 release introduces breaking changes. ' +
  'These will most likely break your FastBoot implementation.' +
  '\n\n' +
  'See https://github.com/ember-fastboot/ember-cli-fastboot/issues/387 for more information and a guide on how to fix your addon.' +
  '\n\n' +
  '*Note: this issue has been created automatically.*';

let args = require('minimist')(process.argv.slice(2));
let username = args.u;
let password = args.p;
let testMode = args.t;
let dummyAddon = args.d;

let github = new GitHubApi({
  Promise
});

if (username && password) {
  github.authenticate({
    type: "basic",
    username,
    password
  });
}

let provider = new MergeProvider([
  new EmberObserverSearchProvider('process.env.EMBER_CLI_FASTBOOT'),
  new EmberObserverSearchProvider('fastboot-filter-initializers')
]);

if (testMode) {
  console.log('Running in TEST MODE!');
}
console.log('Retrieving affected addons...');

let repos;
if (dummyAddon) {
  repos = Promise.resolve(['simonihmig/fastboot-migration-issue-creator-dummy-addon'])
} else {
  repos = provider.retrieve()
    .then(addons => {
      console.log('Found these addons:', addons);
      return Promise.filter(addons.map(addon => getRepo(addon).catch(() => {})), repo => !!repo)
    });
}

repos
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
    if (!testMode) {
      return Promise.map(repos, repo => {
        console.log(`Creating issue in repo ${repo}...`);
        return createIssue(github, repo, createIssueTitle, createIssueBody);
      });
    }
  });