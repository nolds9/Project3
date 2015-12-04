require("./schema");
var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost/city_fighter");
var CityModel = require("../models/city")
var cityData = require("./city_data");

CityModel.remove({}, function(err){

});

for ( var i = 0; i < cityData.length; i += 1 ) {
  new CityModel(cityData[i]).save( function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('City data saved.');
    }
  })
}

// db.on("error", function(err){
//   console.log("Oops! Mongo threw an error. Is `mongod` running?");
//   console.log(err.message);
//   process.exit();
// });
//
// db.once("open", function(){
//   console.log("Connected to the database.");
//   var City = require("../models/city");
