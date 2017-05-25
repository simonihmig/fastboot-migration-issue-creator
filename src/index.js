'use strict';

const MergeProvider = require('./providers/merge');
const EmberObserverSearchProvider = require('./providers/emberobserver-search');
const promisify = require('bluebird').promisify;
const getRepo = promisify(require('get-repository-url'));

let provider = new MergeProvider([
  new EmberObserverSearchProvider('process.env.EMBER_CLI_FASTBOOT'),
  new EmberObserverSearchProvider('fastboot-filter-initializers')
]);

provider.retrieve()
  .then(addons => addons.filter(addon => addon !== 'ember-x-editable-addon'))
  .then(addons => Promise.all(addons.map(addon => getRepo(addon))))
  .then(repos => {
    console.log(repos);
  });