var orm = require('orm'),
  Records = orm.db.models.radiology_record;

exports.index = function(req, res){
res.render('search/index');
};

exports.sort = function(req, res) {
    console.log("Sort called");
    if(type == "ascending") {
        return record1.test_date < record1.test_date;
    } else if(type == "descedning") {
        return record1.test_date < record1.test_date;
    }
};

exports.post = function(req, res, next){

    // Get the keys
    var type = req.body.sort;
    if(req.body.keys)
        var keys = reqKeyString.split(" ");


    if(type != 'default') {
        var sortVar;
        if(type == 'ascending') {
            sortVar = "test_date";
        } else {
            sortVar = "-test_date";
        }

    // Keys and or date
    if(keys && req.body.startdate && req.body.enddate) {
     Records.find({test_date: orm.between(req.body.startdate,req.body.enddate),
                    or: [{ diagnosis: orm.like(keys) }, { description: orm.like(keys) }]}).order(sortVar).all(function(err,records){
            res.render('search/index',{records: records});
         });
    } else if(keys && req.body.startdate) {
     Records.find({test_date: orm.gt(req.body.startdate),
                    or: [{ diagnosis: orm.like(keys) }, { description: orm.like(keys) }]}).order(sortVar).all(function(err,records){
            res.render('search/index',{records: records});
         });
    } else if(keys && req.body.enddate) {
     Records.find({test_date: orm.lt(req.body.enddate),
                    or: [{ diagnosis: orm.like(keys) }, { description: orm.like(keys) }]}).order(sortVar).all(function(err,records){
            res.render('search/index',{records: records});
         });
    } else if(req.body.startdate && req.body.enddate){
        // no key search
     Records.find({test_date: orm.between(req.body.startdate,req.body.enddate)}).order(sortVar).all(function(err,records){
            res.render('search/index',{records: records});
         });
    } else if(req.body.startdate){
        // no key search
     Records.find({test_date: orm.gt(req.body.startdate)}).order(sortVar).all(function(err,records){
            res.render('search/index',{records: records});
         });
    } else if(req.body.enddate){
        // no key search
     Records.find({test_date: orm.lt(req.body.enddate)}).order(sortVar).all(function(err,records){
            res.render('search/index',{records: records});
         });
    } else if(keys){
        // no key search
     Records.find({ or: [{ diagnosis: orm.like(keys) }, { description: orm.like(keys) }]}).order(sortVar).all(function(err,records){
            res.render('search/index',{records: records});
         });
    } else {
        Records.all().order(sortVar).all(function(err,records){
            console.log('<img alt="sample" src="data:image/png;base64,' + records[0].images.thumbnail + '">');
            res.render('search/index',{records: records});
         });
    }
    } else {
        // DEFAULT SORT
           var sortAlg = function(record1,record2){ 
            var date1 = new Date(record1.test_date);
            var date2 = new Date(record2.test_date);
            if(type == 'ascending') {
        return date1 < date2;
            } else if(type == 'descending') {
        return date1 > date2;
            }};


    // Keys and or date
    if(keys && req.body.startdate && req.body.enddate) {
     Records.find({test_date: orm.between(req.body.startdate,req.body.enddate),
                    or: [{ diagnosis: orm.like(keys) }, { description: orm.like(keys) }]}).each().sort(sortAlg).get(function(records){
            res.render('search/index',{records: records});
         });
    } else if(keys && req.body.startdate) {
     Records.find({test_date: orm.gt(req.body.startdate),
                    or: [{ diagnosis: orm.like(keys) }, { description: orm.like(keys) }]}).each().sort(sortAlg).get(function(records){
            res.render('search/index',{records: records});
         });
    } else if(keys && req.body.enddate) {
     Records.find({test_date: orm.lt(req.body.enddate),
                    or: [{ diagnosis: orm.like(keys) }, { description: orm.like(keys) }]}).each().sort(sortAlg).get(function(records){
            res.render('search/index',{records: records});
         });
    } else if(req.body.startdate && req.body.enddate){
        // no key search
     Records.find({test_date: orm.between(req.body.startdate,req.body.enddate)}).each().sort(sortAlg).get(function(records){
            res.render('search/index',{records: records});
         });
    } else if(req.body.startdate){
        // no key search
     Records.find({test_date: orm.gt(req.body.startdate)}).each().sort(sortAlg).get(function(records){
            res.render('search/index',{records: records});
         });
    } else if(req.body.enddate){
        // no key search
     Records.find({test_date: orm.lt(req.body.enddate)}).each().sort(sortAlg).get(function(records){
            res.render('search/index',{records: records});
         });
    } else if(keys){
        // no key search
     Records.find({ or: [{ diagnosis: orm.like(keys) }, { description: orm.like(keys) }]}).each().sort(sortAlg).get(function(records){
            res.render('search/index',{records: records});
         });
    } else {
        Records.all().each().sort(sortAlg).get(function(records){
            res.render('search/index',{records: records});
         });
    }

    }
    };
