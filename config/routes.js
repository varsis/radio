var passport = require('passport');

module.exports = function(app){
	//home route
	var home = require('../app/controllers/home');
    var login = require('../app/controllers/login');


    // Check if the user is logged in other wise redirect user
function loggedIn(req, res, next) {

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

    // We can use something like this for checking path
    //app.all('/path/*', authAdmin);

    
	app.get('/', home.index);
    app.get('/login', login.index);
    //app.post('/login', login.login);
    app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }));
};
