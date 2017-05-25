'use strict';

const request = require('request-promise');

class EmberObserverSearchProvider {

  constructor(searchTerm) {
    this.searchTerm = searchTerm;
  }

  retrieve() {
    return request({
      uri: this.getRequestUrl(),
      json: true
    })
      .then((data) => {
        return data.results.map((item) => item.addon);
      });
  }

  getRequestUrl() {
    return `https://emberobserver.com/api/v2/search/addons?query=${this.searchTerm}&regex=false`;
  }
}

module.exports = EmberObserverSearchProvider;
