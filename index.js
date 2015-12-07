var express = require('express');
var mongoose = require('mongoose');
// var bodyParser = require('body-parser');

var env = require('./env');
mongoose.connect(env.mongoServer);

var CityModel = require('./models');
var Glassdoor = require('./glassdoorApi');

var server = express();
// server.use(bodyParser.json());
var path = require('path'); // needed for path.join function on next line
server.use(express.static(path.join(__dirname, 'public'))); // FIXME

server.listen(4000, function() {
  console.log('Server listening on port 4000');
});

server.get('/cities.json', function(req, res) {
  CityModel.find( {}, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
});

server.get('/city_name', function(req, res) {
  CityModel.find( {}, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
      for ( var i = 0; i < docs.length; i += 1 ) {
      }
    }
  });
});

server.get('/glassdoor/:city/:state', function(req, res){
        res.send(Glassdoor(req.params.city, req.params.state));
});
