var db = require('orm').db,
     orm = require('orm'),
  Person = db.models.persons;
Record = db.models.radiology_record;

exports.index = function(req, res){
    if(res.locals.records != undefined) {
            res.render('reports/index',{records:res.locals.records});
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
     if(req.body.testdate) { 
        query = {test_date: orm.gte(req.body.testdate)};
     } else if(req.body.endtestdate) {
         query = {test_date: orm.lte(req.body.endtestdate)};
     }
     else if(req.body.testdate && req.body.endtestdate) {
            query = {test_date: orm.between(req.body.testdate,req.body.endtestdate)};
     } else if(req.body.testdate && req.body.endtestdate && req.body.diagnosis) {
         query = {diagnosis: req.body.diagnosis, test_date: orm.between(req.body.testdate,req.body.endtestdate)};
     } else {
         query = {};
     }
   
        Record.aggregate(["patient_id","record_id"],query).groupBy('patient_id').min('test_date').get(function(err,report) {
            console.log(report);
            var recs = getRecordIds(report);
            Record.find({ or: recs}, function(err,records) {
                if(err) throw new Error(err);
                console.log(records);
                res.locals.records = records;        
                next();
            });

    });
    }

var getRecordIds = function(report) {
                var records = Array();
            for(var i = 0; i < report.length; i ++) {
                var obj = new Object();
                obj.record_id = report[i].record_id;
                records.push(obj);
            }

            console.log(records);
            return records;

}
