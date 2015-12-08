var env = require('./env');
var mongoose = require('mongoose');

var mongoConnection = mongoose.connect(env.mongoServer);

// var models = require('./models');
var CityModel = require('./models');  // as of now models is only CityModel
var User = require('./models/user');
var DashboardItem = require('./models/user');

CityModel.remove( {}, function(err) {
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
});
DashboardItem.create({
  partner_message: "Join us today!",
  partner_link: "www.facebook.com",
  city: "Chicago"
}).then(function(err, DashboardItem){
  daniel.dashboardItems.push(DashboardItem);
  daniel.save();
  console.log(err)
  console.log(DashboardItem);
})
