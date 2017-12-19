var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http, {
  serveClient: false,
  wsEngine: 'ws'
});

import Server from './Server';

const port = process.env.PORT || 3000;

app.use('/assets', express.static(path.resolve('build/assets/')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('build/index.html'));
});

io.on('connection', s => {
  console.log('connection');
  let server = new Server();
  s.on('disconnect', () => {
    console.log('disconnect')
  })
});

http.listen(port, () => {
  console.log('listening on *:3000'); 
});