/* 
server.js

Description:
server-side data management in Node.js

Tools:
Web-app framework: Express (https://expressjs.com/)
Local database: lowdb (https://github.com/typicode/lowdb)
Event-based real-time communication between client and server: 
socket.io (https://socket.io/)

Note:
This script is written with ES6 syntax
*/

const express = require('express')
const app = express() //create server
const http = require('http').Server(app)
const io = require('socket.io')(http)
const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')

/* start database ... 
using file a-sync storage. 
For ease of use, read is synchronous.*/
const db = low('db.json', {
    storage: fileAsync
})

// assets location 
app.use(express.static(__dirname + '/static'))

// Routes
app.get('/posts/:id', (req, res) => {
    const post = db.get('posts')
        .find({ id: req.params.id })
        .value()
    res.send(post)
})

app.post('/blocks', (req, res) => {
    db.get('posts')
        .push(req.body)
        .last()
        .assign({ id: Date.now() })
        .write()
        .then(post => res.send(post))
})

// database init
db.defaults({ posts: [] }).write()
    .then(() => {
        http.listen(3000, () => {
            console.log('listening on *:3000');
        })
    });

io.on('connection', (socket) => {
    // when there is a query to update database
    socket.on('new info', (posts_) => {
        var newState = {}
        newState.posts = posts_
        db.setState(newState)
        io.emit('update display', db.getState())
    })
})

// when loading display page
app.get('/', function(req, res) {
    io.on('connection', (socket) => {
        socket.emit('update display', db.getState())
    })
    res.sendFile(__dirname + '/display.html')
})

// when loading edit page
app.get('/edit', (req, res) => {
    io.on('connection', (socket) => {
        socket.emit('update display', db.getState())
    })
    res.sendFile(__dirname + '/index.html')
})
