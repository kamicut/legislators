var restify = require('restify');
var routes  = require('./routes.js');

var server = restify.createServer({name: 'legislators-api'});

server
.use(restify.fullResponse())
.use(restify.queryParser({ mapParams: false }));


function dataHandler(res, next) {
	'use strict';
	return function(err, data) {
			if (err) {
				return next(err);
			}
			res.send(data);
			return next();
		};
}

function list(routeName) {
	'use strict';
	return function(req, res, next) {
		res.charSet('utf-8');
		routes[routeName](dataHandler(res, next));
	};
}

//Routes
server.get('/api/search', function(req, res, next) {
	'use strict';
	res.charSet('utf-8');
	if (req.query && Object.keys(req.query).length > 0) {
		routes.search(req.query, dataHandler(res, next));
	} else {
		return next(new restify.InvalidArgumentError('Params must be supplied'));
	}
});

server.get('/api/districts', list('districts'));
server.get('/api/names', list('names'));
server.get('/api/parties', list('parties'));

server.listen(process.env.PORT || 5000);

