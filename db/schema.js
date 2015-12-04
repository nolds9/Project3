var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/city_fighter");

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CitySchema = new Schema(
  {
    name: String,
    gifURL: String,
    averageSalary: String,
    livability: String,
    costOfLiving: String,
    numJobs: String
  }
  {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
  }
);
//TODO wait and see if we need this
// CitySchema.virtual("id").get(function(){
//   return this._id;
// });



mongoose.model("City", CitySchema);
