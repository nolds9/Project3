var express = require("express");
// var router = express.Router();
var CityModel = require("../models/city");

function error(response, message){
  response.status(500);
  response.json({error: message})
}

citiesController= {
  index: function(req,res){
    CityModel.find({}, function(err, docs){
        if (err) {
            console.console.log(err);
        }
        res.render("../views/index.hbs", {docs});
        // console.log(docs);
        // res.send(docs);
    });
}
}

module.exports = citiesController
