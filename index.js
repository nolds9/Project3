var express = require('express');
var mongoose = require('mongoose');
var request = require("request");
var bodyParser = require('body-parser');
var env = require('./env');
var parseString = require('xml2js').parseString;
mongoose.connect(env.mongoServer);

var CityModel = require('./models');

var server = express();
// server.use(bodyParser.json());
var path = require('path'); // needed for path.join function on next line
server.use(express.static(path.join(__dirname, 'public'))); // FIXME

server.listen(4000, function() {
    console.log('Server listening on port 4000');
});

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
    var partnerKey = env.glassdoorKey;
    var partnerID = env.glassdoorPartnerID;
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
    var url = "http://api.indeed.com/ads/apisearch?publisher=" + env.indeed + "&q=" + encodeURI(searchTerm) + "&l=" + city + "%2C+" + state + "&sort=&radius=" + searchRadius + "&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";
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
    var url = 'http://api.wunderground.com/api/' + env.wunderground_key + '/forecast/q/' + state + '/' + city + '.json';
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var forecast = (JSON.parse(body).forecast.txt_forecast.forecastday)[0];
            res.json(forecast);
        }
    });
});
