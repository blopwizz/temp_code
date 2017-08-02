/************************************************************************************ 
DYNAMIC SIGNAGE APP running on RPI 3

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
var io = require('socket.io')(http); // socket.io real-time event handler
var low = require('lowdb'); // low database
var fileAsync = require('lowdb/lib/storages/file-async'); // asynchronous file handler
var SocketIOFile = require('socket.io-file'); // file upload with socket.io
var fs = require('fs'); // file 

/*---------------------------------------------------------------------------------
            EXPRESS CONFIGURATION & ROUTING
*/
// setting static folder to assets location 
app.use(express.static(__dirname + '/static'));

// routing http requests from display.html
app.get('/', function(req, res) {
    io.on('connection', function(socket) {
        socket.emit('update display', db.getState());
    });
    res.sendFile(__dirname + '/display.html');
});


// routing http requests from index.html
app.get('/edit', function(req, res) {
    io.on('connection', function(socket) {
        // fix db state with default state for corrupted paths
        var posts = db.getState().posts;
        for (var i = 0; i < posts.length; i++) {
            if (!fs.existsSync('static/' + posts[i].logosrc)) {
                posts[i].logosrc = 'assets/images/CISL.png';
            }
        }
        // update database
        var newState = {};
        newState.posts = posts;
        db.setState(newState);
        // launch event update display with current db state
        socket.emit('update display', db.getState());
        var files = fs.readdirSync('static/assets/images/logo/');
        socket.emit('update logo gallery', files);
    });
    res.sendFile(__dirname + '/index.html');
});

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

app.get('/server.js', function(req, res, next) {
    return res.sendFile(__dirname + '/server.js');
});

app.get('/socket.io.js', function(req, res, next) {
    return res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

app.get('/socket.io-file-client.js', function(req, res, next) {
    return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
});

/*----------------------------------------------------------------------------
                DATABASE INITIALIZATION
With asynchronous file storage.
(for ease of use, read is synchronous)
*/

// link json file asynchronously
var db = low('db.json', {
    storage: fileAsync
});

// set some defaults if JSON is empty
db.defaults({ posts: [] }).write()
    .then(function() {
        http.listen(3000, function() {});
    });


/*---------------------------------------------------------------------------
                SOCKET IO SET UP
*/

io.on('connection', function(socket) {

    //................. UPLOADER.............................................
    var uploader = new SocketIOFile(socket, {
        uploadDir: 'static/assets/images/logo', // upload directory 
        accepts: ['image/jpg',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/svg'
        ],
        maxFileSize: 4194304,                   // 4 MB file size limit
        chunkSize: 10240,                       // default is 10240(1KB) 
        transmissionDelay: 0,                   // delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay) 
        overwrite: true,                        // overwrite file if exists, default is true. 
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


    //.................. EVENT LISTENERS...................................
    // update database with new info
    socket.on('new info', function(posts_) {
        var newState = {};
        newState.posts = posts_;
        db.setState(newState);
        io.emit('update display', db.getState());
    });

    // update database with new logo
    socket.on('new logo', function(msg) {
        var files = fs.readdirSync('static/assets/images/logo/');
        while (files.length > 10) {
            var i = files.length - 1;
            fs.unlink('static/assets/images/logo/' + files[i]);
            files.splice(i, 1);
        }
        io.emit('update logo gallery', files);
        io.emit('update logo gallery', files); // temporary bug fix ... (clicking 2 times work)
    });

    // update database with logo del
    socket.on('del logo', function(srcLogo) {
        var pathLogoTODEL = 'static/' + srcLogo;
        console.log(pathLogoTODEL);
        if (fs.existsSync(pathLogoTODEL)) { // check if file path exists
            fs.unlink(pathLogoTODEL); // delete the logo
            files = fs.readdirSync('static/assets/images/logo'); // update files list
            io.emit('update logo gallery', files); // query for update

        }
    });
});