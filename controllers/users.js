// NHO: Feels like you could refactor this to be one big object and export just that object similar to how you did with dashboard
var passport = require("passport")

// GET /signup
function getSignup(request, response) {
  response.render('signup.hbs', {message: request.flash('signupMessage')});
}

// POST /signup
  function postSignup(request, response){
    var signupStrategy = passport.authenticate('local-signup', {
      successRedirect: '/partners',
      failureRedirect: '/partners/signup',
      failureFlash: true
    });
    return signupStrategy(request, response);
  };

// GET /login
function getLogin(request, response) {
  response.render('login.hbs', { message: request.flash('loginMessage') });
}

// POST /login
function postLogin(request, response) {
  var loginProperty = passport.authenticate('local-login', {
    successRedirect: '/partners',
    failureRedirect: '/partners/login',
    failureFlash: true
  });
  return loginProperty(request, response);
}

// GET /logout
function getLogout(request, response) {
  request.logout();
  response.redirect('/partners');
}

module.exports = {
  getLogin: getLogin,
  postLogin: postLogin,
  getSignup: getSignup,
  postSignup: postSignup,
  getLogout: getLogout,
}
