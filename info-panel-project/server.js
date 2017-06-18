// es6 syntax
const express = require('express')
const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
const app = express()  //create server
const http = require('http').Server(app)
const io = require('socket.io')(http)

//start database using file a-sync storage 
// for ease of use, read is synchronous
const db = low('db.json', {
	storage: fileAsync
})

app.use(express.static(__dirname + '/static'))

// Routes
// GET /posts/:id
app.get('/posts/:id', (req, res) => {
	const post = db.get('posts')
	.find({ id: req.params.id })
	.value()
	res.send(post)
})

// POST /posts
app.post('/blocks', (req, res) => {
	db.get('posts')
	.push(req.body)
	.last()
	.assign({ id: Date.now() })
	.write()
	.then(post => res.send(post))
})

// init
db.defaults({posts: []}).write()
.then(()=> {
	http.listen(3000, ()=>{
		console.log('listening on *:3000');
	})
});

// db.set('posts', []).write()
// db.get('posts').push({id: 1, title:'REUNION ASSOCIéS', salle:'SAÔNE'}).write()
// db.get('posts').push({id: 2, title:'ASSEMBLEE EXTRAORDINAIRE', salle:'RHÔNE'}).write()
// db.get('posts').push({id: 2, title:'ASSbgezefqvfqfvXTRAORDINAIRE', salle:'RHÔNE'}).write()
// db.get('posts').push({id: 3, title:'', salle:'éTATS-UNIS'}).write()
// db.get('posts').push({id: 4, title:'', salle:'CROIX-ROUSSE'}).write()
// db.get('posts').push({id: 5, title:'', salle:'FOURVIèRE'}).write()
// db.get('posts').push({id: 6, title:'', salle:'BELLECOUR'}).write()
// db.get('posts').push({id: 7, title:'', salle:'VIEUX-LYON'}).write()
// db.get('posts').push({id: 8, title:'', salle:'TONY GARNIER'}).write()
// db.get('posts').push({id: 9, title:'', salle:'JEAN MOULIN'}).write()
// db.get('posts').push({id: 10, title:'', salle:'FRèRES LUMIèRE'}).write()



io.on('connection', function(socket){
	// when there is a query to update database
	socket.on('new info', function(posts_){
		var newState = {}
		newState.posts = posts_
		db.setState(newState)
		io.emit('update display', db.getState())
	})
})

// when loading display page
app.get('/', function(req, res){
	io.on('connection', function(socket){
		io.emit('update display', db.getState())
	})
	res.sendFile(__dirname + '/display.html')
})

// when loading edit page
app.get('/edit', function (req, res) {
	res.sendFile(__dirname + '/index.html')
})


