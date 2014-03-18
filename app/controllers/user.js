var db = require('orm').db,
 Person = db.models.persons;
var User = db.models.users;

exports.index = function(req, res){
        res.render('user/index',{title: req.user.user_name, user: req.user});
};

exports.showAll = function(req, res){
        res.render('user/list');
};

exports.username = function(req,res,next,username) {
    User.get(username,function(err,user){

        // TODO: add functionality for ADMIN user(s).
         if(err && err.msg != 'Not found') {
             res.status(404);
             throw new Error(err);
         } 

         if(res.locals.user.user_name == username) {
            req.user = user; 
            next();
         } else {
            res.redirect('/user/'+ res.locals.user.user_name);
         }
    });
};

exports.profile = function(req,res,next) {
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

exports.personInfo = function(req,res) {
    Person.get(res.locals.user.person_id,function(err,person) {

     person.getDoctors(function (err, doctors) {
        if (err) throw err;
        console.log(doctors);
                });
         if(err && err.msg != 'Not found') {
             res.status(404);
             throw new Error(err);
         } 
         var user = req.user;
         res.render('user/index',{ title: user.user_name, user: user, person: person });
    });
};

exports.isAdmin = function(req,res,next) {
        var user = req.user;
        if(user.class == 'a') {
            console.log("%s class",user.class);
            next();
        } else {
            res.render('user/unauthorized');
        }
};
