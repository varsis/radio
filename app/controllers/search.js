var orm = require('orm'),
    Records = orm.db.models.radiology_record;
var fts = require("orm-mysql-fts");

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

    // Sort type
    var sort = req.body.sort;
    if(sort != 'default') {
        if(sort == 'ascending') {
            sort = "test_date";    
        } else {
            sort = "-test_date";
        }
    } else {
        sort = "";
    }

    if(req.body.keys) {
        var reqKeyString = req.body.keys;
        var keys = reqKeyString;//reqKeyString.split(" ");
    }

    // Keys and or date
    if(keys && req.body.startdate && req.body.enddate) {
        fullTextSearch(keys,findBetweenKeys,res,req,sort);
    } else if(keys && req.body.startdate) {
        fullTextSearch(keys,findGreaterThanKeys,res,req,sort);
    } else if(keys && req.body.enddate) {
        fullTextSearch(keys,findLessThanKeys,res,req,sort);
    } else if(req.body.startdate && req.body.enddate){
        findBetweenNoKeys(null,res,req,sort);
    } else if(req.body.startdate){
        findGreatThanNoKeys(null,res,req,sort);
    } else if(req.body.enddate){
        findLessThanNoKeys(null,res,req,sort);
    } else if(keys){
        fullTextSearch(keys,findKeysOnly,res,req,sort);
    } else {
         if(sort == '') {
               Records.all(function(err,records){
            res.render('search/index',{records: records});
        });
         } else {
        Records.find().order(sort).all(function(err,records){
            res.render('search/index',{records: records});
        });
         }
    }
};


var findLessThanKeys =  function(array,res,req,sort) {
    if(sort == '') {
        Records.find({record_id:array, test_date: orm.lt(req.body.enddate)},function(err,records){
            // IF sort is default
            records = reorder(array,records);
            res.render('search/index',{records:records});
        });
    } else {
        Records.find({record_id:array, test_date: orm.lt(req.body.enddate)}).order(sort).all(function(err,records){
            res.render('search/index',{records:records});
        });
    }
}



var findGreaterThanKeys =  function(array,res,req,sort) {

    if(sort == '') {
        Records.find({record_id:array, test_date: orm.gt(req.body.startdate)},function(err,records){
            // IF sort is default
            records = reorder(array,records);
            res.render('search/index',{records:records});
        });
    } else {
        Records.find({record_id:array, test_date: orm.gt(req.body.startdate)}).order(sort).all(function(err,records){
            res.render('search/index',{records:records});
        });
    }
}


var findBetweenKeys = function(array,res,req,sort) {
    if(sort == '') {
        Records.find({record_id:array, test_date: orm.between(req.body.startdate,req.body.enddate)},function(err,records){
            // IF sort is default
            records = reorder(array,records);
            res.render('search/index',{records:records});
        });
    } else {
        Records.find({record_id:array, test_date: orm.between(req.body.startdate,req.body.enddate)}).order(sort).all(function(err,records){
            res.render('search/index',{records:records});
        });
    }
};


var findLessThanNoKeys =  function(array,res,req,sort) {

    if(sort == '') {
        Records.find({test_date: orm.lt(req.body.enddate)},function(err,records){
            res.render('search/index',{records:records});
        });
    } else {
        Records.find({test_date: orm.lt(req.body.enddate)}).order(sort).all(function(err,records){
            res.render('search/index',{records:records});
        });
    }
}



var findGreaterThanNoKeys =  function(array,res,req,sort) {


    if(sort == '') {
        Records.find({test_date: orm.gt(req.body.startdate)},function(err,records){
            res.render('search/index',{records:records});
        });
    } else {
        Records.find({test_date: orm.gt(req.body.startdate)}).order(sort).all(function(err,records){
            res.render('search/index',{records:records});
        });
    }
}

var findBetweenNoKeys = function(array,res,req,sort) {

    if(sort == '') {
        Records.find({test_date: orm.between(req.body.startdate,req.body.enddate)},function(err,records){
            res.render('search/index',{records:records});
        });
    } else {
        Records.find({test_date: orm.between(req.body.startdate,req.body.enddate)}).order(sort).all(function(err,records){
            res.render('search/index',{records:records});
        });
    }
}


var findKeysOnly = function(array,res,req,sort) {
    if(sort == '') {
        Records.find({record_id:array},function(err,records){
            // Find reorders them by id, so order by our array
            // IF sort is default
            if(sort == '')
                records = reorder(array,records);

        res.render('search/index',{records:records});
        });
    } else {
        Records.find({record_id:array}).order(sort).all(function(err,records){
            res.render('search/index',{records:records});
        });
    }}


var fullTextSearch =  function(keys,findFunction,res,req,sort){orm.db.driver.execQuery("SELECT record.record_id, ((MATCH (persons.first_name,persons.last_name) AGAINST (?)) * 6 + (MATCH (record.diagnosis) AGAINST (?)) * 3 + (MATCH(record.description) AGAINST (?))) as score FROM persons INNER JOIN radiology_record record ON persons.person_id = record.patient_id WHERE MATCH (diagnosis,description) AGAINST (?) OR MATCH (first_name,last_name) AGAINST (?) ORDER BY score DESC;",
        [keys, keys,keys,keys,keys],
        function (err, data) {

            // Get the Order of all the record_id's
            var array = Array();
            for(var i = 0; i < data.length; i ++) {
                array.push(data[i].record_id);
            }
            findFunction(array,res,req,sort);
        })
};

var reorder = function(array,records) {
    var result = Array();

    if(!records)
        return result;

    array.forEach(function(key) {
        var found = false;
        records = records.filter(function(item) {
            if(!found && item.record_id == key) {
                result.push(item);
                found = true;
                return false;
            } else 
            return true;
        })
    })
    return result;
}
