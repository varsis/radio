var db = require('orm').db,
  Person = db.models.persons;
User = db.models.users;

exports.index = function(req, res){
  Person.find(function(err, persons){
    if(err) throw new Error(err);
    res.render('home/index', {
      title: 'Generator-Express MVC', 
            persons: persons
    });
  });



};
