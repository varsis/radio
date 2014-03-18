var passport = require('passport');
var db = require('orm').db;
module.exports = function(app){
	//home route
	var home = require('../app/controllers/home');
    var login = require('../app/controllers/login');
    var user = require('../app/controllers/user');

    // Check if the user is logged in other wise redirect user
function loggedIn(req, res, next) {
res.user = 'TEST';
 // already logged in and login page, redirect to main page
if(req.session.passport.user !== undefined && req.path == '/login') {
    res.redirect('/');
    return;
}

// logged in and either login, or not
      if (req.session.passport.user !== undefined || req.path == '/login') {
       next();
     } else {
       res.redirect('/login');
      } 
 }
    
    // Check for all paths if user is logged in.
    app.all('*', loggedIn);

    // CHECK IF ADMIN
    app.all('/user*',user.isAdmin);


    // We can use something like this for checking path
    //app.all('/path/*', authAdmin);

    
	app.get('/', home.index);
    app.get('/login', login.index);
    app.get('/logout', login.logout);
    //app.post('/login', login.login);
    app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }));

    app.get('/profile', user.profile, user.personInfo);
    app.post('/profile', user.updateProfile);
   app.param('username', user.username);
    app.get('/user/:username', user.index);
     app.get('/user', user.showAll);
};
