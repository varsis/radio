var db = require('orm').db,
  Person = db.models.persons;
User = db.models.users;
FamilyDoctor = db.models.family_doctor;
exports.index = function(req, res){
    Person.all(function(err,persons) {
        FamilyDoctor.all(function(err,doctors) {
            console.log(doctors);
        res.render('upload/index',{persons:persons, family_doctors:doctors});
        });
    });
 

};

exports.post = function(req,res) {
        console.log(req.files.images);
res.render('upload/index');
};
