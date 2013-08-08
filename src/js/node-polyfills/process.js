/**
 * Shim for node's process
 */

exports.version = '0.10.0';


exports.nextTick = function(cb) {
  setTimeout(cb, 0);
};



