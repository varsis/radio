var db = require('orm').db,
    Person = db.models.persons;
var User = db.models.users;

// Get a person info
exports.index = function(req,res) {
    Person.get(res.locals.user.person_id,function(err,person) {
        if(err && err.msg != 'Not found') {
            res.status(404);
            throw new Error(err);
        } 
        var user = req.user;
        res.render('profile/index',{ title: user.user_name, user: user, person: person });
    });
};

// Loads the data for the profile page into the request
exports.getInfo = function(req,res,next) {
    User.get(res.locals.user.user_name,function(err,user){

        // TODO: add functionality for ADMIN user(s).
        if(err && err.msg != 'Not found') {
            res.status(404);
            throw new Error(err);
        } 
        req.user = user;
        next();
    });
};

// Update a user profile (Users table and Persons table)
exports.updateProfile = function(req,res) {

    User.get(req.user.user_name, function (err, user) {
        // finds person with id = 123
        if(req.body.password != '') {
            user.password = req.body.password;
        }

        user.save(function (err) {
            // err.msg = "under-age";
        });
    });

    Person.get(req.user.person_id, function (err, person) {

        if(req.body.firstname != '') {
            person.first_name = req.body.firstname;
        }
        if(req.body.lastname != '') {
            person.last_name = req.body.lastname;
        }
        if(req.body.address != '') {
            person.address= req.body.address;
        }

        if(req.body.email != '') {
            person.email = req.body.email;
        }

        if(req.body.phone != '') {
            person.phone = req.body.phone;
        }

        person.save(function (err) {
            // err.msg = "under-age";
        });
    });

    res.redirect('/profile');
};
