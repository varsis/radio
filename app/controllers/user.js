/*
user module controller: renders the manage user page, handles adding and editing users as an admin
*/

var db = require('orm').db,
    Person = db.models.persons;
var User = db.models.users;

// Adds a user to the req
exports.username = function(req,res,next,username) {
    User.get(username,function(err,user){
        if(err && err.msg != 'Not found') {
            res.status(404);
            throw new Error(err);
        } 

        req.user = user; 
        next();
    });
};

// Add a user to the users table, using the request
exports.add = function(req,res) {
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);

    if(req.body.username.length > 0 && req.body.password.length > 0 && req.body.class.length == 1 && req.body.personid.length > 0) {

        User.create([
                {
                    user_name: req.body.username,
            password: req.body.password,
            'class': req.body.class,
            person_id: req.body.personid,
            date_registered: date
                }], function (err, items) {
                    if(err) throw (err);
                    // err - description of the error or null
                    // items - array of inserted items
                    res.redirect('/admin/users');
                });
    } else {
        res.redirect('/admin/users');
    }
};

// Remove a user from the users table
exports.remove = function(req,res){
    User.find({ user_name: req.body.username}).remove(function (err) {
        if(err) throw (err);
        // err - description of the error or null
        // items - array of inserted items
        res.redirect('/admin/users');
    }) 
}


// Update a User in the users table
exports.update = function(req,res) {

    User.get(req.body.username, function (err, user) {
        // finds person with id = 123
        if(req.body.password != '') {
            user.password = req.body.password;
        }

        if(req.body.class != '') {
            user.class = req.body.class;
        }

        if(req.body.dateregistered != '') {
            user.date_registered = req.body.dateregistered;
        }

        user.save(function (err) {
            // err.msg = "under-age";
            res.redirect('/admin/users');

        });
    });

};

exports.isAdmin = function(req,res,next) {
    var user = req.user;
    if(user.class == 'a') {
        next();
    } else {
        res.render('unauthorized');
    }
};

exports.isRadio = function(req,res,next) {
    var user = req.user;
    if(user.class == 'r') {
        next();
    } else {
        res.render('unauthorized');
    }
};
