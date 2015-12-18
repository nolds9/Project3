// NHO: Would recommend you break this file down into natural seperations, i.e. dependencies, then middleware, then routes, etc.
var express = require('express');
var server = express();
var mongoose = require('mongoose');
var request = require("request");
var bodyParser = require('body-parser');
var parseString = require('xml2js').parseString;
//for user authentication we add passport, flash (to display signin messages), morgan, cookieParser, and session
var passport     = require('passport');
var flash        = require('connect-flash');
var hbs = require('hbs');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');
var methodOverride = require('method-override')

server.use(methodOverride('_method'))

// NHO: Nice use of try, catch to handle the flip between enivronments!
var env; // config vars
try { // check if we have a local env.js
  env = require('./env'); // local development/testing with env.js
} catch (localEnvJsNotPresentException) { // if not, let's assume we're in production
  env = process.env; // use the environment's config vars
}
// here'a tip for further environment config:
// https://github.com/strongloop/express/wiki/Migrating-from-3.x-to-4.x#appconfigure

mongoose.connect(env.MONGO_SERVER || env.MONGOLAB_URI); // NHO: Like how you hide the URI and Port using env variables

//  NHO: Considering consolidating middleware into a dedicated section
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

server.listen(env.PORT || 4000, function() {
  if (!env.PORT)
    console.log('Make sure port is included in config vars or env.js. ' +
    'Server listening on port 4000.');
});

server.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next()
});

var routes = require('./config/routes');
server.use(routes);

// NHO: Would love to see this functionality seperated out into a controller, or routes file
server.get('/cities.json', function(req, res) {
    CityModel.find({}, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            res.json(docs);
        }
    });
});

server.get('/city_name', function(req, res) {
    CityModel.find({}, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            res.json(docs);
            for (var i = 0; i < docs.length; i += 1) {}
        }
    });
});

server.get('/glassdoor/:city/:state', function(req, res) {
    var searchTerm = "web developer";
    var jobsReviewsSalariesEmployers = ["jobs", "reviews", "salaries", "employers"];
    var partnerKey = env.GLASSDOOR_KEY;
    var partnerID = env.GLASSDOOR_PARTNER_ID;
    var city = req.params.city;
    var state = req.params.state;
    var url = "http://api.glassdoor.com/api/api.htm?t.p=" + partnerID + "&t.k=" + partnerKey + "&userip=50.200.196.50&useragent=&format=json&v=1&action=" + jobsReviewsSalariesEmployers[3] + "&q=" + encodeURI(searchTerm) + "&city=" + city + "&state=" + state + "&ps=1000/";
    request({
        uri: url,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5
    }, function(error, response, body) {
        var data = JSON.parse(body);
        console.log("Session ID: " + data.jsessionid);
        console.log("User Searched for: " + city + ", " + state);
        res.send(data);
    });
});

server.get('/indeed/:city/:state', function(req, res) {
    var city = req.params.city;
    var state = req.params.state;
    var searchRadius = "25";
    var searchTerm = "web developer";
    var url = "http://api.indeed.com/ads/apisearch?publisher=" + env.INDEED_PUB_ID + "&q=" + encodeURI(searchTerm) + "&l=" + city + "%2C+" + state + "&sort=&radius=" + searchRadius + "&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";
    request({
        uri: url,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5
    }, function(error, response, body) {
        var data;
        parseString(body, function(err, result) {
            if (err) {
                console.log(err);
            };
            data = result;
        });
        res.send(data);
    });
});

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

// Helper function that converts key/values to URI/URL params
function convertToParams( searchParamsAsJson ) {
  var urlParams = '';
  for (var key in searchParamsAsJson) {
    if (urlParams !== '') {
      urlParams += '&';
    }
    urlParams += key + '=' + encodeURIComponent(searchParamsAsJson[key]);
  }
  return urlParams;
}

// API endpoint/proxy for Zillow region charts
server.get('/zillow/:city/:state', function(req, res) {
  var searchParams = {
    'zws-id': env.ZILLOW_KEY,
    'city': req.params.city,
    'state': req.params.state,
    'unit-type': 'dollar',
    'chartDuration': '5years'
  };

  // endpoint: http://www.zillow.com/webservice/GetRegionChart.htm
  // Docs: http://www.zillow.com/howto/api/GetRegionChart.htm
  var url = 'http://www.zillow.com/webservice/GetRegionChart.htm?' + convertToParams(searchParams);
  console.log(url);
  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200 ) {
      parseString(body, function(error, result) {
        if ( error ) {
          console.log(error);
        } else {
          var jsonSnippet = result['RegionChart:regionchart'].response;
          res.json({
            'chart_url': jsonSnippet[0].url[0],
            'ref_link': jsonSnippet[0].link[0]
          });
        }
      });
    } else {
      console.log(error);
    }
  });
});

// needed for Trulia API calls TODO move me up with the other requires
var dateFormat = require('dateformat');

// API endpoint/proxy for Trulia requests to get average 2-bedroom listing prices
server.get('/trulia/:city/:state', function(req, res) {

  var today = new Date();
  var weekAgo = new Date(today.valueOf() - 60000 * 60 * 24 * 7);

  var searchParams = {
    'library' : 'TruliaStats',
    'function' : 'getCityStats',
    'city' : req.params.city,
    'state' : req.params.state,
    'startDate' : dateFormat(weekAgo, 'yyyy-mm-dd'),
    'endDate' : dateFormat(today, 'yyyy-mm-dd'),
    'statType' : 'listings',
    'apikey' : env.TRULIA_KEY,
  };

  // Docs: http://developer.trulia.com/docs/read/TruliaStats/getCityStats
  // Example call: http://api.trulia.com/webservices.php?library=TruliaStats&function=getCityStats&city=New York&state=NY&startDate=2009-02-06&endDate=2009-02-07&apikey=abc123
  var url = 'http://api.trulia.com/webservices.php?' + convertToParams(searchParams);
  // var url = 'http://api.trulia.com/webservices.php?library=TruliaStats&function=getCityStats&city=New York&state=NY&startDate=2015-02-06&endDate=2015-02-07&apikey=' + env.TRULIA_KEY;
  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200 ) {
      // res.send(response);
      parseString(body, function(error, result) {
        if ( error ) {
          console.log(error);
        } else {
          var jsonSnippet = result.TruliaWebServices.response[0].TruliaStats[0];
          var twoBedroomStats = jsonSnippet.listingStats[0].listingStat[0].listingPrice[0].subcategory[2];
          // res.json(twoBedroomStats.averageListingPrice);
          res.json({
            'dataSource' : ' 2-bedroom avg/median home listing prices by Trulia',
            'searchResultsURL' : jsonSnippet.location[0].searchResultsURL[0],
            'medianListing' : twoBedroomStats.medianListingPrice[0],
            'avgListing': twoBedroomStats.averageListingPrice[0]
          });
        }
      });
    } else {
      console.log(error);
    }
  });
});

// API proxy/endpoint for citybik.es data on bicycle share stats
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

// github jobs
server.get('/githubjobs/:city/:state', function(req, res) {
  var state = req.params.state;
  var city = req.params.city;
  var url = 'https://jobs.github.com/positions.json?description=web%20developer&location=' + city + ', ' + state;
  request(url, function(error, response, body) {
    if ( !error && response.statusCode == 200 ) { // if no error and status is OK
      var jobs = JSON.parse(body).map(function(job) {
        return {
          title: job.title,
          company: job.company,
          url: job.url
        };
      });
      res.json(jobs);
    }
  });

});

var DashboardItem = require('./models/dashboard');
// Get partner messages by city
server.get('/partners/messages/all', function(req, res) {
  // var ci = req.params.state;
  // var city = req.params.city;
  DashboardItem.find({}, function(err, docs) {
    if (err) {
        console.log(err);
    } else {
      res.json(docs);
    }
  });
});

// probably delete later, this returns all partner messages
server.get('/partners/messages/all', function(req, res) {
  // var ci = req.params.state;
  // var city = req.params.city;
  DashboardItem.find({}, function(err, docs) {
    if (err) {
        console.log(err);
    } else {
      res.json(docs);
    }
  });
});

server.get('/partners/:cityName', function(req, res) {
  var city = req.params.cityName;
  var DashboardItem = require('./models/dashboard');
  DashboardItem.find( {city: decodeURI(city)}, function(err, docs) {
    if (err) {
        console.log(err);
    } else {
      console.log(docs);
      res.json(docs);
    }
  });
});
// NHO: Seriously, lets seperate our concerns!
