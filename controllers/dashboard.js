var DashboardItem = require('../models/dashboard');
var User            = require('../models/user');
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;

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
//
// index: function (request, response){
//   // User.find({}, function(err, docs){
//   //   if (err) {
//   //     console.log(err);
//   //   } else {
//   //     response.render('/partners/dashboard', "banana"})
//   //   }
//   }
destroy: function(request, response){
  // find the dashboard item
  var dbItems = request.user.dashboardItems
  console.log(request.user)
  console.log(dbItems)
  db.dbItems.update(
    { _id: request.body.id },
    { $pull: { _id: request.body.id } }
  );
  // dbItems.remove(function(err){
  //   if (err){
  //     console.log(err)
  //   } else {
  //     response.redirect('/partners/dashboard')
  //   }
  // });
  response.redirect('/partners/dashboard')
  //
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
