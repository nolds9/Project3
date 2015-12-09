var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var dashboardItems = require('../models/dashboard');
var Schema = mongoose.Schema
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


// localhost:3000/users/abc123456
// app.get("/users/:id", function(req, res){
//   User.findOneById(req.params.id).then(function(err, user){
//
//   });
// });

// Getting the current user
// User.findOneById(req.user._id).then(function(err, user){
//   user.dashboardItems
// });

// User.find({email: "bob@bob.com"}).then(function(err, users){
//   users
// });
//
// DashboardItem.find({city: "Seattle"}).then(function(err, dbitems){
//
// })

User.methods.encrypt = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);
