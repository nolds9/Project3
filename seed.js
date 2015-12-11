var env; // config vars
try {
  env = require('./env'); // local development/testing with env.js
} catch (exception) {
  env = process.env; // production
}

var mongoose = require('mongoose');

var mongoConnection = mongoose.connect(env.MONGO_SERVER || env.MONGOLAB_URI);

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
  partner_message: "Feast on Holiday Bootcamps",
  partner_link: "https://generalassemb.ly/",
  city: "Washington, DC"
});
var dashboardItem2 = new DashboardItem({
  partner_message: 'The One Way You Should Be Using Nutella',
  partner_link: 'http://www.buzzfeed.com/emilyhorng/the-one-way-you-should-be-using-nutella#.vbDbl9exE',
  city: 'Atlanta, GA'
});
var dashboardItem3 = new DashboardItem({
  partner_message: '21 Reasons You Should Follow "Dogs Taking Dumps" On Instagram',
  partner_link: 'http://www.buzzfeed.com/jelenaa/21-reasons-why-you-should-follow-dogs-taking-dumps-g2wy',
  city: "Chicago, IL"
});
var dashboardItem4 = new DashboardItem({
  partner_message: 'All Your Search History Data Are Belong to Us',
  partner_link: 'http://www.google.com/about/careers/',
  city: 'San Francisco, CA'
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
