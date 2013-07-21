var redis = require('redis');
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {
	no_ready_check: true
});
// Setup the Express.js server
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.logger());

client.auth(redisURL.auth.split(":")[1]);

io.configure(function() {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
});



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
			socket.emit( 'message', { 'value': reply.toString() })
			console.log(reply.toString()); // Will print `bar`
		});
	});
});

var port = process.env.PORT || 3000;
console.log("listening on http://localhost:" + port);
app.listen(port);