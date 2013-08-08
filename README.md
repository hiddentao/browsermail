An IMAP Email client for modern browsers _(Chrome only, for now)_.

This is only possible in browsers which allow raw TCP socket access.


## Building

TODO: grunt

## Installation

TODO: chrome extension

## Submodule dependencies

The following projects are used to make this possible:

* IMAP client - https://github.com/hiddentao/node-imap.git
* TLS implementation - https://github.com/hiddentao/forge.git
* Node.js-style buffer - https://github.com/toots/buffer-browserify.git
  * Although included as a submodule, we currently copy the code and modify it slightly into buffer.js to make it easy to build.

## TODO

* Don't include 'process' module in node-imap - provide a 'process' global instead
* Replace EventEmitter with better one which has `.once()`
* Replace Weber with a Grunt plugin which does the same (and possibly automates the Buffer lib usage too)
* Grunt task to create Chrome extension

Future stuff:

* Replies
* Attachments
* PGP encryption
* Firefox extension
* Folder listing
* Multiple accounts
* Offline usage



