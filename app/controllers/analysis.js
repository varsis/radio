/*
analysis module controller: renders analysis page, deals with the view cube, handles by date, type or name queries
*/

var db = require('orm').db,
    orm = require('orm'),
    Cube = db.models.cube;

// Display Empty Analysis Page
exports.index = function(req, res){
    res.render('analysis/index');    
}

// Update Analysis page based on selected input
exports.update = function(req,res) {
    // Create a table holding needed data
    orm.db.driver.execQuery("DROP VIEW cube; CREATE VIEW cube as SELECT radiology_record.record_id,radiology_record.patient_id,pacs_images.image_id,radiology_record.test_type,radiology_record.test_date FROM radiology_record LEFT JOIN pacs_images ON radiology_record.record_id = pacs_images.record_id;",function(err,returnStuff){

        var dateFormat;
        // using date...
        switch(req.body.date){
            case 'daily': dateFormat = '%Y-%m-%d';
                          break;
            case 'weekly': dateFormat = '%U';
                           break;
            case 'monthly': dateFormat = '%Y-%m';
                            break;
            case 'yearly': dateFormat = '%Y';
                           break;
        }

        // By type and patient
        if(req.body.withtype && req.body.withname){
            orm.db.driver.execQuery("SELECT patient_id,test_type,DATE_FORMAT(test_date,'"+dateFormat+"'),COUNT(image_id) FROM cube GROUP BY patient_id, test_type, date_format(test_date,'"+dateFormat+"');",function(err,returned){
                res.render('analysis/index',{withtype:true, withname:true, results:fixKeys(returned)});        
            });

        }
        // by name
        else if(req.body.withname){
            orm.db.driver.execQuery("SELECT patient_id,DATE_FORMAT(test_date,'"+dateFormat+"'),COUNT(image_id) FROM cube GROUP BY patient_id, date_format(test_date,'"+dateFormat+"');",function(err,returned){
                res.render('analysis/index',{withname:true, results:fixKeys(returned)});        
            });
        }
        // by type
        else if(req.body.withtype){
            orm.db.driver.execQuery("SELECT test_type,DATE_FORMAT(test_date,'"+dateFormat+"'),COUNT(image_id) FROM cube GROUP BY test_type, date_format(test_date,'"+dateFormat+"');",function(err,returned){
                //console.log(returned);
                res.render('analysis/index',{withtype:true, results:fixKeys(returned)});        
            });
            // by date only
        } else {
            orm.db.driver.execQuery("SELECT DATE_FORMAT(test_date,'"+dateFormat+"'),COUNT(image_id) FROM cube GROUP BY date_format(test_date,'"+dateFormat+"');",function(err,returned){
                //console.log(returned);
                res.render('analysis/index',{results:fixKeys(returned)});        
            });

        }
    });
}

// odd error fix
var fixKeys = function(inArray) {
    var keys = ['a','b','c','d'];
    var outArray = [];
    for(var i in inArray) {
        var object = Object();
        for(var key in inArray[i]) {
            if(typeof inArray[i][key] != typeof fixKeys) {
                object[key] = inArray[i][key];
            } else {
                delete inArray[i][key];
            }
        }
        outArray.push(object);
        object = null;
    }
    return outArray;
};
