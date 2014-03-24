var db = require('orm').db,
     orm = require('orm'),
  Person = db.models.persons;
Record = db.models.radiology_record;

exports.index = function(req, res){
    if(res.locals.records !== undefined) {
            res.render('analysis/index',{records:res.locals.records});
        } else {

	Person.all(function(err,persons) {
         		Record.all(function(err,records) {
                    res.render('analysis/index',{persons:persons, records:records});	
		});
        
	});
        }

};

exports.update = function(req,res,next) {
    console.log("logging some shit, diagnosis = ",req.body.testdate);

	Record.find({diagnosis: req.body.diagnosis, test_date: orm.gte(req.body.testdate)},1,function(err, records){
		console.log("logging some shit, diagnosis = ",records,req.body.testdate);
        res.locals.records = records;
        next();
    }

    )};
