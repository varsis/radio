/*
person class: handles changes to persons, such as adding, updating information and modifying doctors of the person
*/

var db = require('orm').db,
    Person = db.models.persons,
    FamilyDoctor = db.models.family_doctor;


// add a person to the req
// Calls the next function
exports.person_id = function(req,res,next,person_id) {
    Person.get(person_id,function(err,person){

        if(err && err.msg != 'Not found') {
            res.status(404);
            throw new Error(err);
        } 
        req.person = person; 
        next();
    });
};

// Update a person
exports.update = function(req,res) {
    Person.get(req.body.personid, function (err, person) {
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
            res.redirect('/admin/users');
        });
    });

};


// Add a person to the database with data from our form
exports.add = function(req,res) {

    Person.aggregate(["person_id"]).max("person_id").get(function (err, max) {
        Person.create([
            {
                person_id: max + 1,
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone
            }], function (err, items) {
                if(err) throw (err);
                // err - description of the error or null
                // items - array of inserted items
                res.redirect('/admin/users'); }) });
}

// add a doctor to a person in the database
exports.adddoc = function(req,res) {

    FamilyDoctor.create([ {
        doctor_id: req.body.doctorid,
    patient_id: req.body.personid
    }], function (err, items) {
        if(err) throw (err);
        // err - description of the error or null
        // items - array of inserted items
        res.redirect('/admin/users');
    }) 

}

// Remove a doctor from a person in the database
exports.removedoc = function(req,res) {

    FamilyDoctor.find({ doctor_id: req.body.doctorid, patient_id: req.body.personid}).remove(function (err) {
        if(err) throw (err);
        // err - description of the error or null
        // items - array of inserted items
        res.redirect('/admin/users');
    }) 

}



