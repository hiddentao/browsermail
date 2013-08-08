/*
 * Shim for node's events module
 */

exports.EventEmitter = EventEmitter;
exports.EventEmitter.prototype.once = exports.EventEmitter.prototype.on;





