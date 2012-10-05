
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./settings');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
      secret: settings.cookieSecret,
      store: new MongoStore({db:settings.db})
      }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.get('/signup', routes.signup);
app.get('/login', routes.login);
app.get('/logout', routes.logout);

app.post('/login', routes.doLogin);
app.post('/signup',routes.doSignup);
app.post('/post', routes.post);

app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

routes(app);

