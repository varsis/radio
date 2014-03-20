var db = require('orm').db,
 Person = db.models.persons;
var User = db.models.users;

exports.index = function(req, res){
        res.render('user/index',{title: req.user.user_name, user: req.user});
};

exports.showAll = function(req, res){
    Person.all(function(err,persons) {
        console.log(persons[1].users);

        res.render('user/list',{persons: persons});
    });
};

exports.username = function(req,res,next,username) {
    User.get(username,function(err,user){

        // TODO: add functionality for ADMIN user(s).
         if(err && err.msg != 'Not found') {
             res.status(404);
             throw new Error(err);
         } 

            req.user = user; 
            next();
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


exports.add = function(req,res) {
var date;
date = new Date();
date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
    ('00' + date.getUTCHours()).slice(-2) + ':' + 
    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + date.getUTCSeconds()).slice(-2);
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


exports.update = function(req,res) {

    User.get(req.user.user_name, function (err, user) {
    // finds person with id = 123
        if(req.body.password != '') {
            console.log(req.body.password);
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


exports.personInfo = function(req,res) {
    Person.get(res.locals.user.person_id,function(err,person) {

     person.getDoctors(function (err, doctors) {
        if (err) throw err;
        console.log(doctors);
                });

          person.getRecords(function (err, records) {
        if (err) throw err;
        console.log(records);
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
