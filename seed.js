var env; // config vars
try {
  env = require('./env'); // local development/testing
} catch (exception) {
  env = process.env; // production
}

var mongoose = require('mongoose');

var mongoConnection = mongoose.connect(env.mongoServer);

// var models = require('./models');
var CityModel = require('./models');  // as of now models is only CityModel

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
