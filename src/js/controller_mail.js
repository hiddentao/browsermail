/**
 * Make a connection
 */


var alerts = require('alerts'),
  Imap = require('imap'),
  Message = require('message');


var jqMailContent = $('#mail'),
  jqMailTab = jqMailContent.prev().find('a'),
  jqFetchProgressMeter = $('.loading', jqMailContent).find('span.meter'),
  jqFetchText = $('.loading', jqMailContent).find('p.msg');


var showProgress = function(percent, text) {
  if (null !== percent)
    jqFetchProgressMeter.css('width', percent + '%');
  if (text)
    jqFetchText.html(text);
};


var fetchFailed = function(err) {
  alerts.err(err.toString());
  return false;
};


var htmlEncode = function(str) {
  return $("<div/>").text(str).html();
}


var showMessages = function(messages) {
  jqMailContent.children('div').hide();

  var viewerDiv = jqMailContent.find('.viewer'),
    mailboxList = $('ul', viewerDiv),
    messageDiv = $('.message', viewerDiv);

  mailboxList.empty();

  messages.forEach(function(message) {
    var li = $('<li></li>');
    li.append('<p class="from">' + htmlEncode(message.headers.from[0]) + '</p>');
    li.append('<p class="date">' + moment(message.headers.date[0]).format('MMMM Do, YYYY') + '</p>');
    li.append('<p class="subject">' + htmlEncode(message.headers.subject[0]) + '</p>');

    mailboxList.append(li);

    li.click(function() {
      $('li', mailboxList).removeClass('selected');
      li.addClass('selected');

      messageDiv.text(message.body);
    });
  });

  if (0 < messages.length) {
    $('li:first-child', mailboxList).click();
  } else {
    messageDiv.text('No messages found, sorry!');
  }

  viewerDiv.show();
};




exports.connect = function(options) {

  // set mail tab and switch to it
  jqMailTab.text(options.email).trigger('click');

  jqMailContent.children('div').hide();

  showProgress(0, 'Fetching mail for ' + options.email + '...');
  jqMailContent.children('div.loading').show();

  var messages = [];

  var imap = new Imap({
    user: options.username,
    password: options.password,
    host: options.hostname,
    port: options.port,
    secure: true,
    debug: (undefined !== window.app.log ? window.app.log : console.log)
  });

  imap.connect(function(err) {
    if (err) return fetchFailed(err);

    showProgress(10, 'Opening INBOX...');

    imap.openBox('INBOX', true, function(err, mailbox) {
      if (err) return fetchFailed(err);

      var total_to_fetch = (options.max_to_fetch > mailbox.messages.total ? mailbox.messages.total : options.max_to_fetch);

      showProgress(10, 'Fetching latest ' + total_to_fetch + ' messages...');

      var fetched = 0;

      imap.seq.fetch('1:' + total_to_fetch, {
          struct: true
        },
        { headers: 'from to subject date',
          body: true,
          cb: function(fetch) {
            fetch.on('message', function(msg) {
              showProgress(null, 'Fetching message no. ' + msg.seqno);

              messages.push(new Message(msg));

              msg.on('end', function() {
                fetched++;
                showProgress(10 + fetched * 90.0 / total_to_fetch, 'Fetched message no. ' + msg.seqno);
              });
            });
          }
        }, function(err) {
          if (err) return fetchFailed(err);

          imap.logout();

          showProgress(100, 'Done fetching ' + fetched + ' messages!');

          // render messages
          showMessages(messages);
        }
      );

    });
  });

};



