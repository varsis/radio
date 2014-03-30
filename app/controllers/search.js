var orm = require('orm'),
    Records = orm.db.models.radiology_record,
    FamilyDoctor = orm.db.models.family_doctor;
var fts = require("orm-mysql-fts");

exports.index = function(req, res){
    res.render('search/index');
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
        fullTextSearch(keys,{record_id:null, test_date: orm.between(req.body.startdate,req.body.enddate)},res,sort,req.user);
    } else if(keys && req.body.startdate && !req.body.enddate) {
        fullTextSearch(keys,{record_id:null, test_date: orm.gt(req.body.startdate)},res,sort,req.user);
    } else if(keys && req.body.enddate && !req.body.startdate) {
        fullTextSearch(keys,{record_id:null, test_date: orm.lt(req.body.enddate)},res,sort,req.user);
    } else if(req.body.startdate && req.body.enddate && !keys){
        fullTextSearch(keys,{test_date: orm.between(req.body.startdate,req.body.enddate)},res,sort,req.user);       
    } else if(req.body.startdate && !keys && !req.body.enddate){
        fullTextSearch(keys,{test_date: orm.gt(req.body.startdate)},res,sort,req.user);       
    } else if(req.body.enddate && !keys && !req.body.startdate){
        fullTextSearch(keys,{test_date: orm.lt(req.body.enddate)},res,sort,req.user);    
    } else if(keys && !req.body.startdate && !req.body.enddate){
        fullTextSearch(keys,{record_id:null},res,sort,req.user);
    } else {
        fullTextSearch(keys,{},res,sort,req.user);
    }
};

var fullTextSearch =  function(keys,query,res,sort,user){

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

                    keySearch(array,query,res,sort,user);
                })
    } else {
        keySearch(null,query,res,sort,user);
    }
};

var keySearch = function(array,query,res,sort,user) {

    var access = user.class;
    if(access == 'a') {
        // do nothing
        // ADMIN
        findRecords(query,sort,array,res);
    } else if(access == 'p') {
        // patient
        query.patient_id = user.person.person_id;
        findRecords(query,sort,array,res);
    } else if(access == 'd') {
        // doctor
        //query.doctor_id = user.person.person_id;
        FamilyDoctor.find({doctor_id:user.person.person_id},function(err,patients) {
            console.log(patients);
            var patientIds = [];
            for(index in patients) {
               patientIds.push(patients[index].patient_id);
            }
            query.patient_id = patientIds;
            console.log(query);
            findRecords(query,sort,array,res);
        });
    } else if(access == 'r') {
        query.radiologist_id = user.person.person_id;
        findRecords(query,sort,array,res);
    } else {
        throw "Unknown user class";
    }
    
    
};

var findRecords = function(query,sort,array,res) {
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
}

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
