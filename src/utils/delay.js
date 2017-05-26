module.exports = function delay(t) {
  return new Promise(function(resolve) {
    setTimeout(resolve, t)
  });
};
