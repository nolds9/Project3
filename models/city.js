require("../db/schema");
var mongoose = require("mongoose");
var CityModel = mongoose.model("City");

function City(info) {
    this.name = info.name;
    this.gifUrl = info.gifUrl;
    this.averageSalary = info.averageSalary;
    this.numJobs = info.numJobs;
    this.costOfLiving = info.costOfLiving;
    this.livability = info.livability;
}

City.prototype = {
    getWeather: function(){
        var url = "http://api.wunderground.com/api/45d833eecf376b21/conditions/q/CA/San_Francisco.json";
        $.getJSON(url).then(function(response){
            console.log(response.current_observation.weather);
            return response.current_observation.weather;
        });
    },
    getIndeedApi: function() {
        var url = "http://api.indeed.com/ads/apisearch?publisher=" + env.indeed + "&q=web+developer&l=" + encodeURI(this.name) + "&sort=&radius=25&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";
        $.getJSON(url, function(response) {
            city.numJobs = response.totalresults;
            return response.totalresults;
        })
    },
    getGlassdoorApi: function(){

    },
    getLivability: function(){

    }
}

module.exports = CityModel;

//TODO replace with .info and move to public
// function City(name, gifUrl, averageSalary, numJobs, costOfLiving, livability) {
//     this.name = name;
//     this.gifUrl = gifUrl;
//     this.averageSalary = averageSalary;
//     this.numJobs = numJobs;
//     this.costOfLiving = costOfLiving;
//     this.livability = livability;
// }

// module.exports = City;
//
// var cities = ["Seattle",
// "LA",
// "Detroit",
// "Atlanta",
// "NY",
// "San Francisco",
// "DC",
// "Boston",
// "Chicago",
// "Raleigh",
// "Charlotte",
// "Austin",
// "Miami",
// "Denver",
// "Boulder",
// "St. Louis",
// "Madison" ,
// "San Jose",
// "Huntsville",
// "Dallas",
// "Cedar Rapids",
// "Colorado Springs",
// "Trenton",
// "Colombus",
// "Minneapolis"
// ]
