var db = require('orm').db,
  Person = db.models.persons;
Record = db.models.radiology_record;

exports.index = function(req, res){
    console.log(res);
    if(res.locals.records !== undefined) {
            res.render('reports/index',{records:res.locals.records});
        } else {

	Person.all(function(err,persons) {
         		Record.all(function(err,records) {
                    res.render('reports/index',{persons:persons, records:records});	
		});
        
	});
        }

};

exports.filter = function(req,res,next) {
    console.log("logging some shit, diagnosis = ",req.body.testdate);

	Record.find({diagnosis: req.body.diagnosis},1).where("test_date >= " + req.body.testdate).order('test_date').all(function(err, records){
		console.log("logging some shit, diagnosis = ",records,req.body.testdate);
        res.locals.records = records;
        next();
    }

    )};
