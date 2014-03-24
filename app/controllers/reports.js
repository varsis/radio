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
    console.log("logging some shit, diagnosis = ",req.body.testdate);

	Record.find({diagnosis: req.body.diagnosis}).where("test_date >= " + req.body.testdate).all(function(err, records){
		console.log("logging some shit, diagnosis = ",records,req.body.testdate);
        res.render('reports/index',{records:records});
	}

    )};
