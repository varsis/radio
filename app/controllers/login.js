var db = require('orm').db,
 Person = db.models.persons;
var User = db.models.users;
var passport = require('passport');

exports.index = function(req, res){
        res.render('login/index');

  Person.find(function(err, persons,users){
    if(err) throw new Error(err);
 
  });


};
