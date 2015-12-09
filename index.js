var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var env; // config vars
try { // check if we have a local env.js
  env = require('./env'); // local development/testing with env.js
} catch (localEnvJsNotPresentException) { // if not, let's assume we're in production
  env = process.env; // use the environment's config vars
}
// here'a tip for further environment config:
// https://github.com/strongloop/express/wiki/Migrating-from-3.x-to-4.x#appconfigure

mongoose.connect(env.MONGO_SERVER || env.MONGOLAB_URI);

var CityModel = require('./models');

var server = express();
// server.use(bodyParser.json());
var path = require('path'); // needed for path.join function on next line
server.use(express.static(path.join(__dirname, 'public'))); // FIXME

server.listen(env.PORT || 4000, function() {
  if (!env.PORT)
    console.log('Make sure port is included in config vars or env.js. ' +
    'Server listening on port 4000.');
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

var request = require('request');

function wunderJSONtempsToString(forecastItem) {
  return forecastItem.fahrenheit + '(' + forecastItem.celsius + ')';
}

server.get('/weather/:city/:state', function(req, res) {
  var state = req.params.state; //req.params.city_name.split(',')[1];
  var city = req.params.city; //decodeURI(req.params.city_name).split(' ,')[0];
  // var url = 'http://api.wunderground.com/api/' + env.wunderground_key + '/conditions/q/' + state + '/' + city + '.json';
  var url = 'http://api.wunderground.com/api/' + env.WUNDERGROUND_KEY + '/forecast/q/' + state + '/' + city + '.json';
  request(url, function(error, response, body) {
    if ( !error && response.statusCode == 200 ) { // if no error and status is OK
      var forecast = (JSON.parse(body).forecast.txt_forecast.forecastday)[0];
      res.json(forecast);
    }
  });
});
