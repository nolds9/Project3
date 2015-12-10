var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CitySchema = new Schema({
  name: String,
  gifUrl: String,
  averageSalary: String,
  numJobs: String,
  costOfLiving: String
});

mongoose.model('City', CitySchema);
