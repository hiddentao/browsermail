/**
 * Simulate node's Socket class using Chrome sockets
 */
var EventEmitter = require('events').EventEmitter,
  Buffer = require('buffer').Buffer;


var Socket = function(options) {
  var self = this;

  self._options = options;

  chrome.socket.create('tcp', {}, function(createInfo) {
    self._socketId = createInfo.socketId;
    console.log('Socket id: ' + self._socketId);
  });
};
Socket.prototype = Object.create(EventEmitter.prototype);


Socket.prototype._onceSocketCreated = function(caller, cb) {
  var self = this;

  if (1 === arguments.length) {
    caller = null;
    cb = caller;
  }

  if (!self._socketId) {
    console.log('Waiting for Chrome socket to be created...' + (caller ? '[' + caller + ']' : ''));
    setTimeout(function() {
      self._onceSocketCreated(caller, cb);
    }, 500);
  } else {
    cb.call(self);
  }
};




Socket.prototype.setKeepAlive = function(val) {
  var self = this;

  self._onceSocketCreated('setKeepAlive', function() {
    chrome.socket.setKeepAlive(self._socketId, val, 0, function() {});
  });
};


Socket.prototype.setTimeout = function(val) {
  this._timeout = val;
};


Socket.prototype.destroy = function() {
  var self = this;

  self._onceSocketCreated('destroy', function() {
    chrome.socket.destroy(self._socketId);
    self._socketId = null;
  });
};


Socket.prototype.end = function() {
  var self = this;

  self._onceSocketCreated('end', function() {
    chrome.socket.disconnect(self._socketId);
    self.emit('close');
  });

};
Socket.prototype.close = Socket.prototype.end;


Socket.prototype.write = function(bufOrString, encoding, cb) {
  var self = this;

  self._onceSocketCreated('write', function() {
    if ('string' !== typeof bufOrString) {
      if (!encoding) encoding = 'binary';
      bufOrString = bufOrString.toString(encoding);
    }

    var buf = new ArrayBuffer(bufOrString.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=bufOrString.length; i<strLen; i++) {
      bufView[i] = bufOrString.charCodeAt(i);
    }

    chrome.socket.write(this._socketId, buf, function(writeInfo) {
      if (0 > writeInfo.bytesWritten) {
        var err = new Error('Write error: ' + writeInfo.bytesWritten);

        if (cb) {
          cb(err);
        } else {
          self.emit('error', err);
        }
      }
    });
  });
};


/**
 * Read data from socket.
 *
 * This will call itself again automatically once data has been read.
 * @private
 */
Socket.prototype._read = function() {
  var self = this;

  setTimeout(function() {
    self._onceSocketCreated('read', function() {
      chrome.socket.read(self._socketId, null, function(readInfo) {
        if (0 > readInfo.resultCode) {
          self.emit('error', 'Read error: ' + readInfo.resultCode);
        } else {
          var str = String.fromCharCode.apply(null, new Uint8Array(readInfo.data));
          self.emit('data', new Buffer(str, 'binary'));
          self._read();
        }
      })
    });
  }, 0);
};


Socket.prototype.removeAllListeners = function() {
// events: connect, end, close, error, ready, data
  this.removeEvent('connect');
  this.removeEvent('end');
  this.removeEvent('close');
  this.removeEvent('error');
  this.removeEvent('ready');
  this.removeEvent('data');
};



Socket.prototype.connect = function(port, host) {
  var self = this;

  self._onceSocketCreated('connect', function() {
    chrome.socket.connect(self._socketId, host, port, function(result) {
      if (0 !== result) {
        self.emit('error', 'connection error: ' + result);
      } else {
        self.emit('connect');
        self._read();
      }
    });
  });
};


module.exports = Socket;



