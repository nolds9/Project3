var mongoose = require("mongoose");
var CityModel = mongoose.model("City");

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
