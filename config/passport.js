// NHO: Nice job implementing user auth with passport
// NHO: Recommend you run this code through atom's beautifiy package to help with indentation, readbility
var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/user');

 module.exports = function(passport) {
   passport.serializeUser(function(user, callback) {
     callback(null, user.id);
   });
   passport.deserializeUser(function(id, callback){
     User.findById(id, function(err, user){
       callback(err, user);
     });
   });
   passport.use('local-signup', new LocalStrategy({
     usernameField : 'email',
     passwordField : 'password',
     passReqToCallback : true
   }, function(req, email, password, callback) {
     // Find a user with this e-mail
    User.findOne({ 'local.email' :  email }, function(err, user) {
      if (err) return callback(err);

      // If there already is a user with this email
      if (user) {
    return callback(null, false, req.flash('signupMessage', 'This email is already used.'));
      } else {
      // There is no email registered with this email

    // Create a new user
    var newUser            = new User();
    newUser.local.email    = email;
    newUser.local.password = newUser.encrypt(password);

    newUser.save(function(err) {
      if (err) throw err;
      return callback(null, newUser);
    });
      }
    }); // NHO: What's going on here? Would recommend cleaning up indentation to impove readbility
   }));
   passport.use('local-login', new LocalStrategy({
     usernameField: 'email',
     passwordField: 'password',
     passReqToCallback: true
   }, function(req,email, password, callback){
     User.findOne({ 'local.email' :email}, function(err, user){
       if (err){
         return callback(err);
       }
       if(!user){
         return callback(null, false, req.flash('loginMessage', 'No User Found!'))
       }
       if (!user.validPassword(password)) {
         return callback(null, false, req.flash('loginMessage','Oops! Wrong password!'))
       }
       return callback(null, user);
     });
   }));
 }

 //TODO add flash message for dashboard if user tries to click on it without being signed in
//  NHO: Would like to see you get to this, looks like a example of a great low-hanging fruit!
