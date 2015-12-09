var User            = require('../models/user');
var DashboardItems = require('../models/dashboard')

var dashboardController = {

new: function(request, response){
  response.render('dashboard.hbs')
},

create: function (request, response) {
  User.findById(request.params.id, function (err, docs){
    docs.DashboardItems.push(new DashboardItemModel(
      {partner_message: request.body.partner_message},
      {partner_link: request.body.partner_link},
      {city: request.body.city}
    ))
    docs.save(function(err){
      if(!err){
        response.redirect('dashboard.hbs')
      }
    })
  })
},

show: function (request, response) {
  response.send('hi')
}
}

module.exports = dashboardController;
