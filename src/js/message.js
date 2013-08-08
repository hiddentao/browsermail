var Message = function(msg) {
  var self = this;
  
  self.seqno = msg.seqno;
  self.headers = {};
  self.uid = msg.uid;
  self.flags = msg.flags;
  self.date = msg.date;
  self.body = '';

  msg.on('headers', function(hdrs) {
    self.headers = hdrs;
  });
  msg.on('data', function(chunk) {
    self.body += chunk.toString('utf8');
  });
  msg.on('attributes', function(attributes) {
    self.attributes  = attributes;
  });

};


module.exports = Message;
