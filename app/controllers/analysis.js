var db = require('orm').db,
     orm = require('orm'),
  Person = db.models.persons;
Record = db.models.radiology_record;

exports.index = function(req, res){

                    res.render('analysis/index');    
    }

exports.update = function(req,res) {

 var query;
 query = {test_date: orm.between(req.body.startdate,req.body.enddate)};

 if(req.body.withtype && req.body.withname){
       console.log("ITS IN THE both IF STATEMENT");
       Person.aggregate(['first_name'],query).count(['images']).groupBy('test_type').get(function(err,report){
            res.render('analysis/index',{withtypewithname:persons})
            console.log("some stuff", report)
       });  
    }
 else if(req.body.withname){
    console.log("ITS IN THE name IF STATEMENT");
        Person.aggregate(['first_name'],query).count(['images']).groupBy('person_id').get(function(err,report){
            res.render('analysis/index',{withname:persons})
            console.log("some stuff", report)
       });   
    }
 else if(req.body.withtype){
    console.log("ITS IN THE type IF STATEMENT");
       Person.aggregate(['test_type'],query).count(['images']).groupBy('test_type').get(function(err,report){
            res.render('analysis/index',{withtype:persons})
            console.log("some stuff", report)
       });   
    }
 else {
        Record.images.count(query, function(err,report){
            console.log("some stuff", report);
            res.render('analysis/index',{justdate:report})
       });  
    }


}
