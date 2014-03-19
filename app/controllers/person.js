var db = require('orm').db,
 Person = db.models.persons;


exports.person_id = function(req,res,next,person_id) {
    Person.get(person_id,function(err,person){

        // TODO: add functionality for ADMIN user(s).
         if(err && err.msg != 'Not found') {
             res.status(404);
             throw new Error(err);
         } 
            req.person = person; 
            next();
    });
};

exports.update = function(req,res) {

     Person.get(req.person.person_id, function (err, person) {

        if(req.body.firstname != '') {
            person.first_name = req.body.firstname;
        }
        if(req.body.lastname != '') {
            person.last_name = req.body.lastname;
        }
        if(req.body.address != '') {
            person.address= req.body.address;
        }

       if(req.body.email != '') {
            person.email = req.body.email;
        }

       if(req.body.phone != '') {
            person.phone = req.body.phone;
        }

        person.save(function (err) {
            // err.msg = "under-age";
        });
     });

    res.redirect('/user/');
};

