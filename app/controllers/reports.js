var db = require('orm').db,
  Person = db.models.persons;
Record = db.models.radiology_record;

exports.index = function(req, res){
	Person.add(function(err,persons) {
		Record.add(function(err,records) {
			console.log(records);
		res.render('reports/index',{persons:persons, radiology_record:records});	
		});
	});

};
