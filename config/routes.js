var passport = require('passport');

module.exports = function(app){
	//home route
	var home = require('../app/controllers/home');
    var login = require('../app/controllers/login');

 function loggedIn(req, res, next) {
     console.log(req.session);
      if (req.session.passport.user !== undefined || req.path == '/login') {
       next();
     } else {
       res.redirect('/login');
      } 
 }



    app.all('*', loggedIn);
    
	app.get('/', home.index);
    app.get('/login', login.index);
    //app.post('/login', login.login);
    app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }));
};