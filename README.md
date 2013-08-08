A Javascript IMAP Email client for browsers _(Chrome only, for now)_.

At the moment this is just a proof-of-concept project to show that an IMAP email client is possible within the browser, in pure JS.

This only fetches the latest messages for your inbox and shows them. Email body text is not yet parsed. Another limitation is that only SSL/TLS connections are supported.


## Running it

1. Download and unzip [release/browsermail.zip](https://raw.github.com/hiddentao/browsermail/master/release/browsermail.zip).
2. Load the output folder into [chrome://extensions](chrome://extensions) as an unpacked extension.

_This was built and tested successfully with Chromium 29 against a gmail.com account_

## Building from source

It uses [Compass](http://compass-style.org/) and [Foundation](http://foundation.zurb.com/) for the styling so you'll need Ruby installed.

    $ bundle install
    $ npm install
    $ bower install

Load the `build` folder into Chrome as an unpackaged extension. Notice that JS minification is turned off in `weber.json`
as otherwise the Chrome developer tools console seems to crash.

## Technical info

This is only possible in browsers which allow raw TCP socket access. For Chrome this means creating a [packaged app](http://developer.chrome.com/apps/about_apps.html) with the [socket permissions](http://developer.chrome.com/apps/socket.html).

All I had to was grab an existing IMAP client (see below) for node and simulate Node's `Socket`, `TLS` and `Buffer` classes.

The following projects are used to make this possible:

* IMAP client - [https://github.com/mscdex/node-imap](https://github.com/mscdex/node-imap)
* TLS implementation - [https://github.com/digitalbazaar/forge](https://github.com/digitalbazaar/forge)
* Node.js-style buffer - [https://github.com/toots/buffer-browserify](https://github.com/toots/buffer-browserify) - some modifications made to this to get it working

## Future stuff

I don't have plans to keep working on this for now, but technically speaking the following should all be possible:

* Replies
* Attachments
* PGP encryption
* Firefox extension
* Folder listing
* Multiple accounts
* Offline cacheing and usage (`localStorage`, etc.)

Possible codebase improvements:

* Replace EventEmitter with better one which has `.once()`
* Replace Weber with a Grunt plugin which does the same (and possibly automates the Buffer lib usage too)
* Grunt task to create Chrome extension
* Automated tests


## License

Licensed under [AGPL](http://www.gnu.org/licenses/agpl-3.0.html), see `LICENSE.md`.



