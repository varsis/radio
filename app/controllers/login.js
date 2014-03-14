var db = require('orm').db,
 Person = db.models.persons;
var User = db.models.users;
var passport = require('passport');

exports.index = function(req, res){
        res.render('login/index');
};

exports.logout = function(req,res) {
    req.session.destroy();
    res.render('login/logout'); d
    res.redirect('/');
};
