var assert = module.exports = function(bool) {
  assert.ok(bool);
};


assert.ok = function(bool) {
  if (!bool) {
    console.log('Assertion error!');
  }
};

