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
        fullTextSearch(keys,{record_id:null, test_date: orm.between(req.body.startdate,req.body.enddate)},res,sort);
    } else if(keys && req.body.startdate) {
        fullTextSearch(keys,{record_id:null, test_date: orm.gt(req.body.startdate)},res,sort);
    } else if(keys && req.body.enddate) {
        fullTextSearch(keys,{record_id:null, test_date: orm.lt(req.body.enddate)},res,sort);
    } else if(req.body.startdate && req.body.enddate){
        fullTextSearch(keys,{test_date: orm.between(req.body.startdate,req.body.enddate)},res,sort);       
    } else if(req.body.startdate){
        fullTextSearch(keys,{test_date: orm.gt(req.body.startdate)},res,sort);       
    } else if(req.body.enddate){
        fullTextSearch(keys,{test_date: orm.lt(req.body.enddate)},res,sort);    
    } else if(keys){
        fullTextSearch(keys,{record_id:null},res,sort);
    } else {
        if(sort == '') {
            Records.all(function(err,records){
                console.log(records);
                res.render('search/index',{records: records});
            });
        } else {
            Records.find().order(sort).all(function(err,records){
                res.render('search/index',{records: records});
            });
        }
    }
};

var fullTextSearch =  function(keys,query,res,sort){

    if(keys) {
        orm.db.driver.execQuery("SELECT record.record_id, ((MATCH (persons.first_name,persons.last_name) AGAINST (?)) * 6 + (MATCH (record.diagnosis) AGAINST (?)) * 3 + (MATCH(record.description) AGAINST (?))) as score FROM persons INNER JOIN radiology_record record ON persons.person_id = record.patient_id WHERE MATCH (diagnosis,description) AGAINST (?) OR MATCH (first_name,last_name) AGAINST (?) ORDER BY score DESC;",
                [keys, keys,keys,keys,keys],
                function (err, data) {

                    // Get the Order of all the record_id's
                    var array = Array();
                    for(var i = 0; i < data.length; i ++) {
                        array.push(data[i].record_id);
                    }

                    query.record_id = array;
                    keySearch(array,query,res,sort);
                })
    } else {
        keySearch(null,query,res,sort);
    }
};

var keySearch = function(array,query,res,sort) {
    if(sort == '') {
        Records.find(query,function(err,records){
            // IF sort is default
            if(array != null)
            records = reorder(array,records);

        res.render('search/index',{records:records});
        });
    } else {
        Records.find(query).order(sort).all(function(err,records){
            res.render('search/index',{records:records});
        });
    }
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
