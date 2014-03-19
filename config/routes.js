var passport = require('passport');
var db = require('orm').db;
module.exports = function(app){
	//home route
	var home = require('../app/controllers/home');
    var login = require('../app/controllers/login');
    var user = require('../app/controllers/user');
    var person = require('../app/controllers/person');
    var upload = require('../app/controllers/upload');
    var search = require('../app/controllers/search');
    var reports = require('../app/controllers/reports');
    var analysis = require('../app/controllers/analysis');

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

    // Update the person profile
    app.param('person_id', person.person_id);
    app.post('/person/:person_id', person.update);

   app.param('username', user.username);
    app.post('/user/:username', user.update);
     app.get('/user', user.showAll);

    app.get('/upload', upload.index);

    app.get('/search', search.index);

    app.get('/analysis', analysis.index);

    app.get('/reports', reports.index);


};
