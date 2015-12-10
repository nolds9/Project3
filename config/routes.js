var express = require('express');
var router = express.Router();
// Parses information from POST
var bodyParser = require('body-parser');
// Used to manipulate POST methods
var methodOverride = require('method-override');
var passport = require("passport");
var usersController = require('../controllers/users');
var staticsController = require('../controllers/statics');
var dashboardController = require('../controllers/dashboard');
var User            = require('../models/user');
// var dashboardItems = require('../models/dashboard');


function authenticatedUser(req, res, next) {
    // If the user is authenticated, then we continue the execution
    if (req.isAuthenticated()) return next();

    // Otherwise the request is always redirected to the home page
    res.redirect('/partners');
  }

router.route('/partners')
  .get(staticsController.home)

router.route('/partners/signup')
  .get(usersController.getSignup)
  .post(usersController.postSignup)

router.route('/partners/login')
  .get(usersController.getLogin)
  .post(usersController.postLogin)

router.route("/partners/logout")
  .get(usersController.getLogout)

router.route('/partners/dashboard')
  .get(authenticatedUser, dashboardController.new)
  .post(dashboardController.create)

router.route('/partners/dashboard/:id')
  .delete(dashboardController.destroy)

module.exports = router;
