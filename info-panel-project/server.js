/* 
server.js

Description:
server-side data management in Node.js

Tools:
Web-app framework: Express (https://expressjs.com/)
Local database: lowdb (https://github.com/typicode/lowdb)
Event-based real-time communication between client and server: 
socket.io (https://socket.io/)

*/

var express = require('express');
var app = express(); //create server
var http = require('http').Server(app);
var io = require('socket.io')(http);
var low = require('lowdb');
var fileAsync = require('lowdb/lib/storages/file-async');
var SocketIOFile = require('socket.io-file');
var fs = require('fs');


/* start database ... 
using file a-sync storage. 
For ease of use, read is synchronous.*/
var db = low('db.json', {
    storage: fileAsync
});

// assets location 
app.use(express.static(__dirname + '/static'));

// when loading display page
app.get('/', function(req, res) {
    io.on('connection', function(socket) {
        socket.emit('update display', db.getState());
    });
    res.sendFile(__dirname + '/display.html');
});


// when loading edit page
app.get('/edit', function(req, res) {
    io.on('connection', function(socket) {
        socket.emit('update display', db.getState());
        var files = fs.readdirSync('static/assets/images/logo/');
        while (files.length > 10) {
            var i = files.length - 1;
            fs.unlink('static/assets/images/logo/' + files[i]);
            files.splice(i, 1);
        }
        io.emit('update logo gallery', files);
    });
    res.sendFile(__dirname + '/index.html');
});


app.get('/server.js', function(req, res, next) {
    return res.sendFile(__dirname + '/server.js');
});

app.get('/socket.io.js', function(req, res, next) {
    return res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

app.get('/socket.io-file-client.js', function(req, res, next) {
    return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
});

// Routes
app.get('/posts/:id', function(req, res) {
    var post = db.get('posts')
        .find({ id: req.params.id })
        .value();
    res.send(post);
});

app.post('/blocks', function(req, res) {
    db.get('posts')
        .push(req.body)
        .last()
        .assign({ id: Date.now() })
        .write()
        .then(function(post) {
            res.send(post);
        });
});

// database init
db.defaults({ posts: [] }).write()
    .then(function() {
        http.listen(3000, function() {
        });
    });



io.on('connection', function(socket) {
    var uploader = new SocketIOFile(socket, {
        uploadDir: 'static/assets/images/logo', // simple directory 
        accepts: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'], // chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg' 
        maxFileSize: 4194304, // 4 MB. default is undefined(no limit) 
        chunkSize: 10240, // default is 10240(1KB) 
        transmissionDelay: 0, // delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay) 
        overwrite: true, // overwrite file if exists, default is true. 
    });
    uploader.on('start', function(fileInfo) {
        console.log('Start uploading');
        console.log(fileInfo);
    });
    uploader.on('stream', function(fileInfo) {
        console.log('${fileInfo.wrote} / ${fileInfo.size} byte(s)');
    });
    uploader.on('complete', function(fileInfo) {
        console.log('Upload Complete.');
        console.log(fileInfo);
    });
    uploader.on('error', function(err) {
        console.log('Error!', err);
    });
    uploader.on('abort', function(fileInfo) {
        console.log('Aborted: ', fileInfo);
    });
    // when there is a query to update database
    socket.on('new info', function(posts_) {
        var newState = {};
        newState.posts = posts_;
        db.setState(newState);
        io.emit('update display', db.getState());
    });

    socket.on('new logo', function(msg) {
        var files = fs.readdirSync('static/assets/images/logo/');
        while (files.length > 10) {
            var i = files.length - 1;
            fs.unlink('static/assets/images/logo/' + files[i]);
            files.splice(i, 1);
        }
        io.emit('update logo gallery', files);
        io.emit('update logo gallery', files);
    });
});
