/*
   reports module controller: renders reports page, handles finding reports as needed from the user input
   */

var db = require('orm').db,
    orm = require('orm'),
    Person = db.models.persons;
Record = db.models.radiology_record;

// Display report, or empty reports
exports.index = function(req, res){
    if(res.locals.persons != undefined) {
        res.render('reports/index',{persons:res.locals.persons});
    } else {
        res.render('reports/index');	
    }

};

// Filter the reports as needed
exports.filter = function(req,res,next) {
    var query;
    // above date
    if(req.body.testdate && !req.body.endtestdate) { 
        query = {test_date: orm.gte(req.body.testdate)};
        // below date
    } else if(req.body.endtestdate  && !req.body.testdate) {
        query = {test_date: orm.lte(req.body.endtestdate)};
    }
    // between two dates
    else if(req.body.testdate && req.body.endtestdate) {
        query = {test_date: orm.between(req.body.testdate,req.body.endtestdate)};
        // between two dates and with a diagnosis
    } else {
        // No date
        query = {};
    }

    if(req.body.diagnosis)
        query.diagnosis = req.body.diagnosis;

    //console.log(query);

    // Get the report dates we need
    Record.aggregate(['patient_id'],query).min(['test_date']).groupBy('patient_id').get(function(err,report) {
        //console.log(report);
        var recs = getRecordIds(report);
        if(report.length > 0) {
            Person.find({ or: recs}, function(err,records) {
                if(err) throw new Error(err);
                pushDates(report,records);
                //console.log(records);
                res.locals.persons = records;        
                next();
            });
        } else {
            res.locals.persons = recs;
            next();
        }

    });
}

// Gets the id's only from the report.
var getRecordIds = function(report) {
    var records = Array();
    for(var i = 0; i < report.length; i ++) {
        var obj = new Object();
        obj.person_id = report[i].patient_id;
        records.push(obj);
    }
    return records;

}

// Puts the dates into the record from report.
var pushDates = function(report,records) {
    for(var i = 0; i < report.length; i ++) {
        records[i].test_date = report[i].min_test_date;
    }
}
