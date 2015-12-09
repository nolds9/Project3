var DashboardItem = require('../models/dashboard')
var User            = require('../models/user');

var dashboardController = {

new: function(request, response){
  response.render('dashboard.hbs')
},

create: function (request, response) {
  var newDash = new DashboardItem({
    partner_message: request.body.partner_message,
    partner_link: request.body.partner_link,
    city: request.body.city
  });
  newDash.save().then(User.findOne({_id: request.user._id})).then(function(user){
    user.dashboardItems.push(newDash).then(
      user.save(function(err){
        if(!err){
          response.redirect('/partners/dashboard');
        };
      }));
    });
  },

// show: function (request, response) {
//   response.send('hi')
// }
}

module.exports = dashboardController;

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
