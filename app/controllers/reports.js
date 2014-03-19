var db = require('orm').db,
  Person = db.models.persons;
User = db.models.users;

exports.index = function(req, res){
res.render('reports/index');
};

