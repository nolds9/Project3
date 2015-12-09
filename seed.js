var env = require('./env');
var mongoose = require('mongoose');

var mongoConnection = mongoose.connect(env.mongoServer);

// var models = require('./models');
var CityModel = require('./models');  // as of now models is only CityModel
var User = require('./models/user');
var DashboardItem = require('./models/dashboard');

CityModel.remove( {}, function(err) {
  console.log("city removal")
});
User.remove({}, function(err){
  console.log("user removal")
});
DashboardItem.remove({}, function(err){
  console.log("db removal")
});

var cityJsonData = require('./seed.json');

for ( var i = 0; i < cityJsonData.length; i += 1 ) {
  new CityModel(cityJsonData[i]).save( function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('City data saved.');
    }
  })
}

var daniel = new User({
  local : {
    email: "daniel@email.com",
    password: "password"
  }
})
var james = new User({
  local : {
    email: "james@email.com",
    password: "password"
  }
})
var dashboardItem1 = new DashboardItem({
  partner_message: "Join us today!",
  partner_link: "www.facebook.com",
  city: "Chicago"
});
var dashboardItem2 = new DashboardItem({
  partner_message: "We got jobs!",
  partner_link: "www.facebook.com",
  city: "Seattle"
});
var dashboardItem3 = new DashboardItem({
  partner_message: "We got jobs!",
  partner_link: "www.facebook.com",
  city: "Los Angeles"
});
var dashboardItem4 = new DashboardItem({
  partner_message: "We got jobs!",
  partner_link: "www.facebook.com",
  city: "Boston"
});

var users = [daniel, james];
var dashboardItems = [dashboardItem1, dashboardItem2, dashboardItem3, dashboardItem4];

for(var i = 0; i < users.length; i++){
  users[i].dashboardItems.push(dashboardItems[i], dashboardItems[i+2])
  dashboardItems[i].save(function(err){
    if(err){
      console.log(err)
    }else {
      console.log("dbitem saved")
    }
  });
  dashboardItems[i + 2].save(function(err){
    if(err){
      console.log(err)
    }else {
      console.log("dbitem saved")
    }
  });
  users[i].save(function(err){
    if (err){
      console.log(err)
    }else {
      console.log("user was saved")
    }
  })
}
