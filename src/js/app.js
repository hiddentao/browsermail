'use strict';

var util = require('util');


/* initialize foundation */
$(document).foundation();


/** Setup logging */
window.app.log = console.log = (function() {
  var _console_log = console.log;
  return function() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (undefined === arguments) args = [undefined];
    $('#log').html($('#log').html() + '<p>' + args.join(', ') + '</p>');
    $("#log").scrollTop($("#log")[0].scrollHeight);
  }
})();


/* IMAP lib expects some Node globals */
window.Buffer = require('buffer').Buffer;
window.process = require('process');


/* Get started */
require('controller_connection');



