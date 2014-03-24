var db = require('orm').db,
  Person = db.models.persons;
Record = db.models.radiology_record;

exports.index = function(req, res){
	Person.all(function(err,persons) {
		Record.all(function(err,records) {
			console.log(records);
		res.render('reports/index',{persons:persons, radiology_record:records});	
		});
	});

};

exports.filter = function(req,res) {
	Person.aggregate({diagnosis: req.body.diagnosis}).min(req.body.testdate).get(function(err, diagnosis, testdate){
		console.log("logging some shit, diagnosis = %s and the test date = %d", diagnosis, testdate);
	}
)};