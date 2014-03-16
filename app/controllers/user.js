var db = require('orm').db,
 Person = db.models.persons;
var User = db.models.users;

exports.index = function(req, res){
        res.render('user/index',{title: req.user.user_name, user: req.user});
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

exports.personInfo = function(req,res) {
    Person.get(res.locals.user.person_id,function(err,person) {
         if(err && err.msg != 'Not found') {
             res.status(404);
             throw new Error(err);
         } 
         var user = req.user;
         res.render('user/index',{ title: user.user_name, user: user, person: person });
    });
}
