var redis = require('redis');
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {
	no_ready_check: true
});
var express = require('express');
var io = require('socket.io')

client.auth(redisURL.auth.split(":")[1]);

io.configure(function() {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
});

// Setup the Express.js server
var app = express.createServer();
app.use(express.logger());

if (process.argv[2] === 'dist') {
	app.use(express.static(__dirname + "/dist"));
} else {
	app.use(express.static(__dirname + "/app"));
	app.use(express.static(__dirname + "/.tmp"));
}

io.sockets.on('connection', function(socket) {
	socket.emit('message', {
		message: 'connected to validator'
	});
	socket.on('validate', function(data) {
		client.sismember('engdict', data.value, function(err, reply) {
			socket.emit( 'message', { reply })
			console.log(reply.toString()); // Will print `bar`
		});
	});
});

var port = process.env.PORT || 3000;
console.log("listening on http://localhost:" + port);
io.listen(app.listen(port));