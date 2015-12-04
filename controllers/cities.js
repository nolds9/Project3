var express = require("express");
var router = express.Router();
var City = require("../models/city");

function error(response, message){
  response.status(500);
  response.json({error: message})
}

citiesController= {
  index: function(req,res){
    res.send("hi")
  }
}

module.exports = citiesController
