var passport = require('passport');
var db = require('orm').db;
module.exports = function(app){
	//home route
	var home = require('../app/controllers/home');
    var login = require('../app/controllers/login');
    var user = require('../app/controllers/user');
    var manageusers = require('../app/controllers/manageusers');
    var person = require('../app/controllers/person');
    var upload = require('../app/controllers/upload');
    var search = require('../app/controllers/search');
    var reports = require('../app/controllers/reports');
    var analysis = require('../app/controllers/analysis');
    var images = require('../app/controllers/image');
    var help = require('../app/controllers/help');
    var profile = require('../app/controllers/profile');



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
    app.all('/admin*',user.isAdmin);
    app.all('/radio*',user.isRadio);

    // We can use something like this for checking path
    //app.all('/path/*', authAdmin);

    
    // Show Main Page
	app.get('/', home.index);

    // Login Stuff
    app.get('/login', login.index);
    app.get('/logout', login.logout);
    app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: false }));

    // Help View
    app.get('/help', help.index);

    // Profile View
    app.get('/profile', profile.getInfo, profile.index);
    app.post('/profile', profile.updateProfile);

    // Update the person as admin
    app.post('/admin/person/update', person.update);
    app.post('/admin/person/add', person.add);
    app.post('/admin/person/adddoc', person.adddoc);
    app.post('/admin/person/removedoc', person.removedoc);

    // User Updates for Admin
    app.post('/admin/user/update', user.update);
    app.get('/admin/users', manageusers.index);
    app.post('/admin/user/add', user.add);
    app.post('/admin/user/remove', user.remove);

    // Radiologist Upload Module
    app.get('/radio/upload', upload.index);
    app.post('/radio/upload', upload.post);

    // Search Module
    app.get('/search', search.index);
    app.post('/search', search.post);

    // Admin Analysis module
    app.get('/admin/analysis', analysis.index);
    app.post('/admin/analysis', analysis.update);

    // Admin Reports Module
    app.get('/admin/reports', reports.index);
    app.post('/admin/reports/filter', reports.filter,reports.index);

    // Image Displaying
    app.param('recordid', function(req, res, next, id){
            req.recid = id;
            next();
    });
    app.param('imageid', images.getImage);
    app.param('imageidView', images.getImageId);
    app.param('type', images.imageType);
    app.param('typeView', function(req, res, next, imageType){
        req.imagetype = imageType;
        next();});
    app.get('/img/:recordid/:imageid/:type',images.file);
    app.get('/view/img/:recordid/:imageidView/:typeView',images.index);
};
