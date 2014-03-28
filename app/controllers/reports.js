var db = require('orm').db,
     orm = require('orm'),
  Person = db.models.persons;
Record = db.models.radiology_record;

exports.index = function(req, res){
    if(res.locals.persons != undefined) {
            res.render('reports/index',{persons:res.locals.persons});
        } else {

	Person.all(function(err,persons) {
         		Record.all(function(err,records) {
                    res.render('reports/index',{persons:persons});	
		});
        
	});
        }

};

exports.filter = function(req,res,next) {
    var query;
     if(req.body.testdate && !req.body.endtestdate) { 
        query = {test_date: orm.gte(req.body.testdate)};
     } else if(req.body.endtestdate  && !req.body.testdate) {
         query = {test_date: orm.lte(req.body.endtestdate)};
     }
     else if(req.body.testdate && req.body.endtestdate) {
            query = {test_date: orm.between(req.body.testdate,req.body.endtestdate)};
     } else if(req.body.testdate && req.body.endtestdate && req.body.diagnosis) {
         console.log(query);
         query = {diagnosis: req.body.diagnosis, test_date: orm.between(req.body.testdate,req.body.endtestdate)};
     } else {
         query = {};
     }

     console.log(query);
   
        Record.aggregate(['patient_id'],query).min(['test_date']).groupBy('patient_id').get(function(err,report) {
            console.log(report);
            var recs = getRecordIds(report);
            Person.find({ or: recs,}, function(err,records) {
                if(err) throw new Error(err);
                pushDates(report,records);
                console.log(records);
                res.locals.persons = records;        
                next();
            });

    });
    }

var getRecordIds = function(report) {
                var records = Array();
            for(var i = 0; i < report.length; i ++) {
                var obj = new Object();
                obj.person_id = report[i].patient_id;
                records.push(obj);
            }
            return records;

}

var pushDates = function(report,records) {
            for(var i = 0; i < report.length; i ++) {
                records[i].test_date = report[i].min_test_date;
            }
}
