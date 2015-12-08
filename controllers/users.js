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

//Probably won't use this, meant to show all the users.
  // function showUsers(request, response){
  //   users.find({}, function(err, docs){
  //     console.log(users)
  //     response.render("/partners", {users: docs})
  //   })
  // };


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

// GET dashboard
function showDashboardForm(request, response){
  response.render('dashboard.hbs')
}

//post dashboard
function postDashboard(request, response) {
  response.send('hi')
}

module.exports = {
  getLogin: getLogin,
  postLogin: postLogin,
  getSignup: getSignup,
  postSignup: postSignup,
  getLogout: getLogout,
  showUsers: showUsers
}
