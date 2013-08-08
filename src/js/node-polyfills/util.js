/**
 * Shim for node.js utils
 */
exports.isDate = function(d) {
  return (d instanceof Date);
};

exports.inspect = function(obj) {
  // for now we just return a simple string representation
  return '' + obj;
};

exports.inherits = function(childClass, parentClass) {
  childClass.prototype = Object.create(parentClass.prototype);
};
