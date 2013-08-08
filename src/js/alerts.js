/**
 * User alerts
 * @param msg
 */

_alert = function(type, msg) {
  var classes = 'alert-box round ';
  switch (type) {
    case 'error':
      classes += 'alert';
  }
  var a = $('<div class="' + classes + '">' + msg + '</div>');
  $('#alerts').append(a);
  setTimeout(function() {
    a.fadeOut(500);
  }, 2000);
};


exports.err = function(msg) {
  _alert('error', msg);
};


