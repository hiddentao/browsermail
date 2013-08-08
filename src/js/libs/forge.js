/**
 * Wrapper around forge TLS library.
 */

var forge = {};

for (var key in forgeComponents.modules) {
  (forgeComponents.require(key))(forge);
}

module.exports = forge;



