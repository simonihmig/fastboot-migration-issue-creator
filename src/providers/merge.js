'use strict';

class MergeProvider {
  constructor(providers) {
    this.providers = providers;
  }

  retrieve() {
    return Promise.all(this.providers.map(provider => provider.retrieve()))
      .then(results => {
        let addonList = results.reduce((addons, result) => result.concat(addons), []);
        return addonList.filter((elem, pos, arr) => {
          return arr.indexOf(elem) === pos;
        });
      });
  }
}

module.exports = MergeProvider;
