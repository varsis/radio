var db = require('orm').db,
  Person = db.models.persons;
  Images = db.models.pacs_images;
  Record = db.models.radiology_record;
var fs = require('fs');
var    gm = require('gm');
var   temp = require('temp');
User = db.models.users;
FamilyDoctor = db.models.family_doctor;

exports.index = function(req, res){

    Person.all(function(err,persons) {
        FamilyDoctor.all(function(err,doctors) {
        res.render('upload/index',{persons:persons, family_doctors:doctors});
        });
    });
 

};

exports.post = function(req,res) {

    console.log(req.body);

var maxImageId ;
    Images.aggregate(["image_id"]).max("image_id").get(function (err, maxImage) {
        maxImageId = maxImage;
    });
        Record.aggregate(["record_id"]).max("record_id").get(function (err, maxRec) {
                    
        Record.create([{
           record_id:   maxRec + 1,
           patient_id:  req.body.patient,
           doctor_id:   req.body.doctor,
           radiologist_id: res.locals.user.person.person_id,
           test_type:   req.body.testtype,
           prescribing_date: req.body.presdate,
           test_date:    req.body.testdate,
           diagnosis:   req.body.diagnosis, 
           description:   req.body.description }],  function (err, items) {
            if(err) throw (err);
        });
        
        if(req.files.images.path) {
            var image = req.files.images;    
            resize(maxImageId,maxRec + 1, image);
        } else {
        for(var i = 0; i < req.files.images.length; i++) {  
            var image = req.files.images[i];
            resize(maxImageId + i,maxRec + 1, image);
            }
        }
        });

        res.redirect('/upload');
};

// Resize images internal
var resize = function(imageid,recordid,image) {

                gm(image.path).resize(250)
            .toBuffer(function (err, thumbnail) {

                if (err) return handle(err);

            gm(image.path).resize(1024)
                .toBuffer(function (err, medium) {
                    if (err) return handle(err);

                gm(image.path).toBuffer(function (err, full) {
   
                Images.create([{
                record_id:   recordid,
                image_id:    imageid,
                thumbnail:   thumbnail,
                regular_size: medium,
                full_size:    full,}], function (err, items) {
                if(err) throw (err); 
                });
                });
                });
                });

}
