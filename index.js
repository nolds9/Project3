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




server.get('/citybikes/:city/:state', function(req, res) {
  // Docs: http://api.citybik.es/
  var cityState = [req.params.city, req.params.state].join(', ');
  var networkIndexUrl = 'http://api.citybik.es/networks.json';

  var match;

  request(networkIndexUrl, function(error, response, body) {
    if ( !error && response.statusCode == 200 ) { // if no error and status is OK

      var cityBikesJson = JSON.parse(body); // gets list of city bikeshare systems
      // if the given city is in that json, assign it to match

      // var match = cityBikesJson.find( function(el) {
      //   return [cityState, 'Pittsburgh', 'San Francisco Bay Area, CA'].indexOf(el.city) >= 0;
      // });
      for ( var i = 0; i < cityBikesJson.length; i += 1 ) {
        if ( cityBikesJson[i].city == cityState ) {
          match = cityBikesJson[i];
        }
      }
      if ( cityState == 'San Francisco, CA') {
        match = cityBikesJson.find( function(city) {
          return city.city == 'San Francisco Bay Area, CA';
        });
      } if ( cityState == 'Pittsburgh, PA' ) {
        match = cityBikesJson.find( function(city) {
          return city.city == 'Pittsburgh';
        });
      }
      console.log(match);
      if (match) {
        var sysUrl = match.url;
        // var sysUrl = 'http://api.citybik.es/' + '.json'
        request(sysUrl, function(e, r, b) {
          if ( !e && r.statusCode == 200 ) {
            var sysJson = JSON.parse(b);
            // var bikesFree = sysJson.reduce( function (a, b) {
            //   return a.free + b.free;
            // }); // not sure why reduce doesn't work
            var bikesFree = 0;
            for ( var i = 0; i < sysJson.length; i += 1 ) {
              bikesFree += sysJson[i].free;
            }
            var output = {
              'name': match.name,
              'bike_stations' : sysJson.length,
              'bikes_free' : bikesFree
            };
            // console.log(JSON.stringify(output));
            res.json(output);
          } else { console.log('Error:', sysUrl, e); }
        });
      } else { // nothing found
        res.json({'nada': 'Nothing found'});
      }
    } else { console.log('Error:', error); }
  });
});
