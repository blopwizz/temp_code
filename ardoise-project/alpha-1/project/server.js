/************************************************************************************ 
ARDOISE APP

server.js
Description:
server-side data management in Node.js

Tools:
Web-app framework: Express (https://expressjs.com/)
Local database: lowdb (https://github.com/typicode/lowdb)
Event-based real-time communication between client and server: 
socket.io (https://socket.io/)

***********************************************************************************/

var express = require('express'); // express server
var app = express(); // create server
var http = require('http').Server(app); // http server

/*---------------------------------------------------------------------------------
            EXPRESS CONFIGURATION & ROUTING
*/


// setting static folder to assets location 
app.use(express.static(__dirname + '/assets'));

// routing http requests to index.html
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/server.js', function(req, res, next) {
	return res.sendFile(__dirname + '/server.js');
});

app.get('/sketch.js', function(req, res, next) {
	return res.sendFile(__dirname + '/sketch.js');
});

app.get('/XImage.js', function(req, res, next) {
	return res.sendFile(__dirname + '/XImage.js');
});

http.listen(3000, function() {});