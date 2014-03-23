var db = require('orm').db,
  Person = db.models.persons;
User = db.models.users;
Record = db.models.radiology_record;

exports.index = function(req, res){
	Person.add(function(err,persons) {
		Record.add(function(err,records) {
			console.log(records);
		res.render('reports/index',{persons:persons, radiology_record:records});	
		});
	});

};
