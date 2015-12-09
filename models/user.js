var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var dashboardItems = require('../models/dashboard');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = new mongoose.Schema({
  local : {
    email        : String,
    password     : String,
  },
  dashboardItems : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "DashboardItem"
  }]
});

User.methods.encrypt = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);
