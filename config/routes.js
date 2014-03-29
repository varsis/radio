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
    var images = require('../app/controllers/image');

    var Image = db.models.pacs_images;


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
    app.post('/admin/person/update', person.update);
    app.post('/admin/person/add', person.add);

    app.post('/admin/person/adddoc', person.adddoc);
    app.post('/admin/person/removedoc', person.removedoc);




  // app.param('username', user.username);
    app.post('/admin/user/update', user.update);
     app.get('/admin/users', user.showAll);
    app.post('/admin/user/add', user.add);
    app.post('/admin/user/remove', user.remove);

    app.get('/upload', upload.index);
    app.post('/upload', upload.post);
    app.get('/search', search.index);
    app.post('/search', search.post);

    app.get('/admin/analysis', analysis.index);
    app.post('/admin/analysis', analysis.update);

    app.get('/admin/reports', reports.index);
    app.post('/admin/reports/filter', reports.filter,reports.index);

    app.param('recordid', function(req, res, next, id){
            req.recid = id;
            next();
    });


    app.param('imageid', function(req, res, next, id){

        Image.find({image_id:id, record_id: req.recid},1, function(err,image){
            if (err) throw err;
            req.image = image[0];
            next();
        });
    });


    app.param('imageidView', function(req, res, next, id){
        req.imageid = id;
        next();
    });


    app.param('type', function(req, res, next, imageType){
        var data;
        if(imageType == 'thumbnail') {
            data = (req.image).thumbnail;
        } else if(imageType == 'regular') {
            data = (req.image).regular_size;
        } else if(imageType == 'full'){
            data = (req.image).full_size;
        }
            req.imagedata = data;
            next();

    });

    app.param('typeView', function(req, res, next, imageType){
        req.imagetype = imageType;
        next();

    });


    app.get('/img/:recordid/:imageid/:type',images.file);
    app.get('/view/img/:recordid/:imageidView/:typeView',images.index);
};
