var db = require('orm').db,
     orm = require('orm'),
  Person = db.models.persons;
Record = db.models.radiology_record;

exports.index = function(req, res){

 if(req.body.records && req.body.persons){
        Person.all(function(err,persons) {
                Record.all(function(err,records) {
                    res.render('analysis/index',{personsrecords:persons});    
        });
        });
    }
 else if(req.body.persons){
        Person.all(function(err,persons) {
                Record.all(function(err,records) {
                    res.render('analysis/index',{persons:persons});    
        });
        });
    }
 else if(req.body.records){
        Person.all(function(err,persons) {
                Record.all(function(err,records) {
                    res.render('analysis/index',{records:persons});    
        });
        });
    }
 else {
        Person.all(function(err,persons) {
                Record.all(function(err,records) {
                    res.render('analysis/index',{justdate:persons});    
        });
      });
    }
}

exports.update = function(req,res,next) {

 var query;
 query = {test_date: orm.between(req.body.startdate,req.body.enddate)};

 if(req.body.records && req.body.persons){
       Person.aggregate(['first_name'],query).count(['images']).groupBy('test_type').get(function(err,report){
            res.render('analysis/index',{personsrecords:persons})
       });  
    }
 else if(req.body.persons){
        Person.aggregate(['first_name'],query).count(['images']).groupBy('test_type').get(function(err,report){
            res.render('analysis/index',{persons:persons})
       });   
    }
 else if(req.body.records){
       Person.aggregate(['first_name'],query).count(['images']).groupBy('test_type').get(function(err,report){
            res.render('analysis/index',{records:persons})
       });   
    }
 else {
        Record.aggregate(query).count().get(function(err,report){
            console.log("some stuff", report);
            //res.render('analysis/index',{justdate:persons})
       });  
    }


}
