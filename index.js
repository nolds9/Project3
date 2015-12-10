var express = require('express');
var server = express();
var mongoose = require('mongoose');
//for user authentication we add passport, flash (to display signin messages), morgan, cookieParser, and session
var passport     = require('passport');
var flash        = require('connect-flash');
var hbs = require('hbs');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');
// var connect        = require('connect')
var methodOverride = require('method-override')

server.use(methodOverride('_method'))

var env = require('./env');
mongoose.connect(env.mongoServer);

// server.use(bodyParser.json());
server.use(morgan('dev'));
server.use(cookieParser());
server.use(bodyParser());

var CityModel = require('./models');

server.set('view engine', 'hbs');
server.set("views","./views");

server.use(session({ secret: 'WDI-GENERAL-ASSEMBLY-EXPRESS' }));
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());

require('./config/passport')(passport);

var path = require('path'); // needed for path.join function on next line
server.use(express.static(path.join(__dirname, 'public'))); // FIXME

server.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next()
});

var routes = require('./config/routes');
server.use(routes);


server.get('/cities.json', function(req, res) {
  CityModel.find( {}, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
});

server.listen(4000, function() {
  console.log('Server listening on port 4000');
});

// server.get('/city_name', function(req, res) {
//   CityModel.find( {}, function(err, docs) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(docs);
//       for ( var i = 0; i < docs.length; i += 1 ) {
//       }
//     }
//   });
// });
