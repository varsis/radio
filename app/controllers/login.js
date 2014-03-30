var db = require('orm').db,
 Person = db.models.persons;
var User = db.models.users;
var passport = require('passport');

// Show login page
exports.index = function(req, res){
        res.render('login/index');
};

// Log a user out
exports.logout = function(req,res) {
    req.session.destroy();
    res.render('login/logout'); d
    res.redirect('/');
};
