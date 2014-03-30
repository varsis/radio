/*
login module: renders login/logout pages and handles sessions
*/

var db = require('orm').db,
 Person = db.models.persons;
var User = db.models.users;
var passport = require('passport');

//renders login page
exports.index = function(req, res){
        res.render('login/index');
};

//session handling and rendering logout
exports.logout = function(req,res) {
    req.session.destroy();
    res.render('login/logout'); d
    res.redirect('/');
};
