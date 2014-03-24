var orm = require('orm'),
  Records = orm.db.models.radiology_record;

exports.index = function(req, res){
res.render('search/index');
};

exports.post = function(req, res){
    if(req.body.keys) {
     Records.find({test_date: orm.between(req.body.startdate,req.body.enddate),
                    or: [{ diagnosis: orm.like(req.body.keys) }, { description: orm.like(req.body.keys) }]}, function(err,records){
            res.render('search/index',{records: records});
         });
    } else {
        // no key search
     Records.find({test_date: orm.between(req.body.startdate,req.body.enddate)}, function(err,records){
            res.render('search/index',{records: records});
         });

    }
};
