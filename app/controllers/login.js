/*
login module: renders login/logout pages and handles sessions
*/

var db = require('orm').db,
 Person = db.models.persons;
var User = db.models.users;
var passport = require('passport');

<<<<<<< HEAD
//renders login page
=======
// Show login page
>>>>>>> f48452da9feb93fc0fcb56d1c7f61a374a309b6a
exports.index = function(req, res){
        res.render('login/index');
};

<<<<<<< HEAD
//session handling and rendering logout
=======
// Log a user out
>>>>>>> f48452da9feb93fc0fcb56d1c7f61a374a309b6a
exports.logout = function(req,res) {
    req.session.destroy();
    res.render('login/logout'); d
    res.redirect('/');
};
