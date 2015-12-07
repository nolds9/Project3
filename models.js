require('./schema');
var mongoose = require('mongoose');

var CityModel = mongoose.model('City');
module.exports = CityModel;
