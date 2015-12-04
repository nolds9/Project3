var express = require("express");
// var router = express.Router();
var CityModel = require("../models/city");

function error(response, message){
  response.status(500);
  response.json({error: message})
}

citiesController= {
    index: function(req, res){
      CityModel.find({}, function(err, docs){
        res.render("../views/index", {cities: docs})
      })
    }
}

module.exports = citiesController
