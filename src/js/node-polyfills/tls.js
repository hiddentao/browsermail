/**
 * Simulate node's TLS wrapper using Forge
 */
var EventEmitter = require('events').EventEmitter;

var forge = require('forge');


var TlsSocket = function(options) {
  var self = this;

  var CLIENT_TO_SERVER = 1;
  var SERVER_TO_CLIENT = 2;

  self._socket = options.socket;

  self.id = self._socket.id;
  self.writable = false;


  // create TLS connection
  self._tlsConnection = forge.tls.createConnection({
    server: false,
    sessionId: options.sessionId || null,
    caStore: options.caStore || [],
    sessionCache: options.sessionCache || null,
    cipherSuites: options.cipherSuites || null,
    virtualHost: options.virtualHost,
    verify: options.verify,
    getCertificate: options.getCertificate,
    getPrivateKey: options.getPrivateKey,
    getSignature: options.getSignature,
    deflate: options.deflate,
    inflate: options.inflate,
    verify: function(conn, verified, depth, certs) {
      return true;
    },
    connected: function(conn) {
      options.debug && self._trace('Handshake successful');

      // first handshake complete, call handler
      if(conn.handshakes === 1) {
        self.writable = true;
        self.emit('connected');
      }
    },
    tlsDataReady: function(conn) {
      var bytes = conn.tlsData.getBytes();
      options.debug && self._trace(bytes, CLIENT_TO_SERVER, 'enc');

      // send TLS data over socket
      self._socket.write(bytes, 'binary', function(err) {
        if (err) {
          self.emit('error', err);
        }
      });
    },
    dataReady: function(conn) {
      var received = conn.data.getBytes();

      options.debug && self._trace(received, SERVER_TO_CLIENT, 'plain');

      // indicate application data is ready
      self.emit('data', new Buffer(received, 'binary'));
    },
    closed: function() {
      self.writable = false;
    },
    error: function(conn, e) {
      options.debug && self._trace('Error: ' + e.message || e);

      // send error, close socket
      self.emit('error', e);
      self._socket.close();
    }
  });

  // handle doing handshake after connecting
  self._socket.once('connect', function() {
    options.debug && self._trace('Socket connected. Handshaking...');

    self._tlsConnection.handshake(options.sessionId);
  });

  self._socket.on('close', function(had_err) {
    if(self._tlsConnection.open && self._tlsConnection.handshaking) {
      self.emit('error', new Error('Connection closed during handshake.'));
    }

    self._tlsConnection.close();

    // call socket handler
    self.emit('close', had_err);
  });

  // handle error on socket
  self._socket.on('error', function(e) {
    options.debug && self._trace('Socket error: ' + (e.message || e));

    // error
    self.emit('error', e);
  });

  // handle receiving raw TLS data from socket
  self._socket.on('data', function(data) {
    var bytes = data.toString('binary');
    options.debug && self._trace(bytes, SERVER_TO_CLIENT, 'enc');

    self._tlsConnection.process(bytes);
  });

  /**
   * Destroys this socket.
   */
  self.destroy = function() {
    self._socket.destroy();
  };

  /**
   * Connects this socket.
   */
  self.connect = function(port, host) {
    options.debug && self._trace('Connecting to ' + host + ':' + port);

    self._socket.connect(port, host);
  };

  /**
   * Closes this socket.
   */
  self.close = function() {
    options.debug && self._trace('Closing connection');

    self._tlsConnection.close();
  };


  /**
   * Close this socket.
   * @type {Function}
   */
  self.end = self.close;


  /**
   * Determines if the socket is connected or not.
   *
   * @return true if connected, false if not.
   */
  self.isConnected = function() {
    return self._tlsConnection.isConnected;
  };

  /**
   * Writes bytes to this socket.
   *
   * @param bytes the bytes (as a string) to write.
   *
   * @return true on success, false on failure.
   */
  self.write = function(bytes) {
    options.debug && self._trace(bytes, CLIENT_TO_SERVER);

    return self._tlsConnection.prepare(bytes);
  };


  self._trace = function(msg, direction, contentType) {
    switch (direction) {
      case CLIENT_TO_SERVER:
        direction = '{c -> S}: ';
        break;
      case SERVER_TO_CLIENT:
        direction = '{S -> c}: ';
        break;
      default:
        direction = '';
    }
    msg = ('enc' !== contentType ? msg : '(enc) ' + forge.util.bytesToHex(msg));
    console.log('[TLS Socket] ' + direction + msg);
  }
};
TlsSocket.prototype = Object.create(EventEmitter.prototype);


module.exports = {
  connect: function(options, onconnect) {
    // TODO: remove this later
    options.debug = true;

    var tlsSocket = new TlsSocket(options);
    tlsSocket.on('connected', onconnect);
    return tlsSocket;
  }
};

