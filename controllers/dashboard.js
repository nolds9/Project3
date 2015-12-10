var DashboardItem = require('../models/dashboard')
var User            = require('../models/user');

var dashboardController = {

new: function(request, response){
  request.user.populate("dashboardItems", function (){
    response.render('dashboard.hbs')
  })
},

create: function (request, response) {
  var newDash = new DashboardItem({
    partner_message: request.body.partner_message,
    partner_link: request.body.partner_link,
    city: request.body.city
  });
  newDash.save()
    User.findOne({_id: request.user._id}, function(err, doc){
      doc.dashboardItems.push(newDash)
        doc.save(function(){
          response.redirect('/partners/dashboard')
        })
      });
  },

index: function (request, response){
  // User.find({}, function(err, docs){
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     response.render('/partners/dashboard', "banana"})
  //   }
  }

  // response.render('dashboard.hbs', Users.findOne({_id: request.user._id}, function(err, doc) {
    // doc.dashboardItems
// })
// )

}
module.exports = dashboardController;


// DashboardItem.find({city: "Seattle"}).then(function(err, dbitems){
//
// })
