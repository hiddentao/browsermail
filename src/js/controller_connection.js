/**
 * Connection tab
 */

var alerts = require('alerts');


// when email input gets updated auto-set the username
$('input#email').change(function() {

  var val = $('input#email').val(),
    tokens = val.split('@');

  if (2 === tokens.length) {
    $('input#username').val(tokens[0]);
  }
});


// when form is submitted check and then fetch!
$('#connection > form').submit(function(e) {
  e.preventDefault();

  var email = $('input#email').val(),
    username = $('input#username').val(),
    password = $('input#password').val(),
    hostname = $('input#hostname').val(),
    port = parseInt($('input#port').val(), 10),
    max_to_fetch = parseInt($('input#max_to_fetch').val(), 10);

  if ("" == email || "" == username || "" == password || "" == hostname || 0 >= port || 0 >= max_to_fetch) {
    return alerts.err('Please fill in all fields correctly');
  }

  require('controller_mail').connect({
    email: email,
    hostname: hostname,
    port: port,
    username: username,
    password: password,
    max_to_fetch: max_to_fetch
  });

  return false;
});