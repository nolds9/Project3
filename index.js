var express = require('express');
var mongoose = require('mongoose');
// var bodyParser = require('body-parser');
var request = require("request");
var env = require('./env');
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
        console.log("Acutal Search Location: " + data.response.lashedLocation.longName);
        var numEmployers = data.response.totalRecordCount.toString();
        console.log("number of Employers looking for Web Developers: " + data.response.totalRecordCount);
        console.log("length of employer results: " + data.response.employers.length);
        res.send(data);
    });
});
server.get('/indeed/:city/:state', function(req, res){
    var city = req.params.city;
    var state = req.params.state;
    var searchRadius = "25";
    var url = "http://api.indeed.com/ads/apisearch?publisher=" + env.indeed + "&q=" + encodeURI(searchTerm) + "&l=" + city + "%2C+" + state + "&sort=&radius=" + searchRadius + "&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";
    request({
        uri: url,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5
    }, function(error, response, body){

    });
});
