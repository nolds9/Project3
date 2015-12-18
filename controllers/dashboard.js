var DashboardItem = require('../models/dashboard');
var User          = require('../models/user');
var CityModel     = require('../models')
var mongodb = require('mongodb');

var dashboardController = {

  new: function(request, response){
    request.user.populate("dashboardItems", function (){
      CityModel.find({}, function (err, cities){
      response.render('dashboard.hbs', {cities: cities})
      })
    })
  },

  create: function (request, response) {
    var newDash = new DashboardItem({
      partner_message: request.body.partner_message,
      partner_link: request.body.partner_link,
      city: request.body.city
    });
    newDash.save()
      User.findOne({_id: request.user.id}, function(err, doc){
        doc.dashboardItems.push(newDash)
          doc.save(function(){
            response.redirect('/partners/dashboard')
          })
        });
    },

  destroy: function(request, response){
    // find the dashboard item
    var dbItem = DashboardItem.findOne({_id: request.params.id}, function(err, doc){
      if (!err){
        doc.remove(function(err){
          response.redirect('/partners/dashboard')
        })
      } else {
        console.log(err)
      }

    })
  }

}
module.exports = dashboardController;
