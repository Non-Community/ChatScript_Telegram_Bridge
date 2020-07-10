const net = require('net');

const prefix = 'username\x00harry\x00';

const post   = '\x00'

const client = new net.Socket();

client.connect(1024, '127.0.0.1', (err) => {

   client.write(prefix + ‘some message’ + post);

});

client.on('data', (data) => response.toString());
