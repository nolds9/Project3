var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DashboardItem = new mongoose.Schema({
  partner_message: String,
  partner_link: String,
  city: String
});

module.exports = mongoose.model('DashboardItem', DashboardItem);
