
/**
 * Module dependencies
 */
var express = require('express'),
  redis = require('redis'),
  url = require('url'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {
	no_ready_check: true
});

/**
 * Configuration
 */
 // console.log( redisURL );
 // client.auth(redisURL.auth.split(":")[1]);

// io.configure(function() {
// 	io.set("transports", ["xhr-polling"]);
// 	io.set("polling duration", 10);
// });

// all environments
app.set('port', process.env.PORT || 3000);
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
// app.use(express.static(path.join(__dirname, 'app')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
  app.use(express.static(__dirname + "/app"));
  app.use(express.static(__dirname + "/.tmp"));
}

// production only
if (app.get('env') === 'production') {
  // TODO
  app.use(express.static(__dirname + "/dist"));
};


/**
 * Routes
 */

// serve index and view partials
// app.get('/', routes.index);
// app.get('/partials/:name', routes.partials);

// // JSON API
// app.get('/api/name', api.name);

// // redirect all others to the index (HTML5 history)
// app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', function(socket) {
	socket.emit('message', {
		message: 'connected to validator'
	});
	socket.on('validate', function(data) {
		client.sismember('engdict', data.value, function(err, reply) {

			// TODO: No idea why this is throwing such a fit, if I store the 
			// boolean in a variable it doesn't cooperate. So just having the statement
			// twice for now
			if( reply.toString() == 0 ){
				socket.emit( 'validator', { 'value': false });
			} else {
				socket.emit( 'validator', { 'value': true });
			}
			
		});
	});
});

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});