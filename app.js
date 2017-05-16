
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , session = require('express-session')
  , mongo = require("./routes/util.mongo")
  , aws = require("./routes/aws.manager.js")
  , stats = require("./routes/website.stats.js")

var mongoSessionConnectURL = "mongodb://mak:mak@ds137891.mlab.com:37891/sprouts";
var mongoStore = require("connect-mongo")(session);

var app = express();

app.use(session({
	secret: 'eBay_client_session',
	resave : false,
	saveUninitialized : false,
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({  
		url: mongoSessionConnectURL})
	})
);


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);



app.post('/cluster', aws.createCluster);
app.get('/instances', aws.getInstancesDetails);
app.get('/metric', aws.getMetricStatisticsForInstance);
app.post('/stop/cluster',aws.stopCluster);
app.post('/start/cluster',aws.startCluster);
app.get('/users/stats',stats.getUserStats);
app.get('/moderators/stats',stats.getModeratorStats);

mongo.connect(mongoSessionConnectURL, function(){  
	console.log('Connected to mongo at: ' + mongoSessionConnectURL); 
	http.createServer(app).listen(app.get('port'), function(){  
		console.log('Express server listening on port ' + app.get('port'));  
	});  
});