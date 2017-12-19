import Server from './Server';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http, {
  serveClient: false,
  wsEngine: 'ws'
});

const port = process.env.PORT || 7777;
app.use('/assets', express.static(path.resolve('build/assets/')));

let server = new Server();

app.get('/', (req, res) => {
  res.sendFile(path.resolve('build/index.html'));
});

io.on('connection', s => {
  server.newSocket(s);
});

http.listen(7777, () => {
  console.log('listening on *:3000'); 
});