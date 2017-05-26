"use strict";
const delay = require('../utils/delay');

module.exports = function rateLimit(apiResult) {
  if (apiResult
  && apiResult.meta
  && parseInt(apiResult.meta['x-ratelimit-remaining']) <= 1) {
    let reset = parseInt(apiResult.meta['x-ratelimit-reset']) * 1000;
    let d = reset - Date.now() + 1000;

    console.warn(`Delaying github API requests for ${d}ms because of rate limit...`);
    return delay(d);
  }
  return Promise.resolve();
};
