var restify = require('restify');
var routes  = require('./routes.js');

var server = restify.createServer({name: 'legislators-api'});

server
.use(restify.gzipResponse())
.use(restify.fullResponse())
.use(restify.queryParser({ mapParams: false }));

function dataHandler(res, next) {
	'use strict';
	return function(err, data) {
		if (err) {
			return next(err);
		}
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
		res.end(JSON.stringify(data, null, 2));
		return next();
	};
}

function list(routeName) {
	'use strict';
	return function(req, res, next) {
		routes[routeName](dataHandler(res, next));
	};
}

//Routes
server.get('/search', function(req, res, next) {
	'use strict';
	res.charSet('utf-8');
	if (req.query && Object.keys(req.query).length > 0) {
		routes.search(req.query, dataHandler(res, next));
	} else {
		return next(new restify.InvalidArgumentError('Params must be supplied'));
	}
});

server.get('/districts', list('districts'));
server.get('/names', list('names'));
server.get('/parties', list('parties'));

server.listen(process.env.PORT || 5000);