/*
   Upload module controller: renders the upload page, handles adding records to the db, and resizes images
   */

var db = require('orm').db,
    Person = db.models.persons;
Images = db.models.pacs_images;
Record = db.models.radiology_record;
var fs = require('fs');
var    gm = require('gm');
var   temp = require('temp');
User = db.models.users;
FamilyDoctor = db.models.family_doctor;

// Display the Upload Page
exports.index = function(req, res){

    Person.all(function(err,persons) {
        FamilyDoctor.all(function(err,doctors) {
            res.render('upload/index',{persons:persons, family_doctors:doctors});
        });
    });
};

//add a record with images to Record and reload a new upload page
exports.post = function(req,res) {

    //  console.log(req.body);


    var maxImageId ;
    // get our max id for images
    Images.aggregate(["image_id"]).max("image_id").get(function (err, maxImage) {
        maxImageId = maxImage;
    });

    // Create a record
    Record.aggregate(["record_id"]).max("record_id").get(function (err, maxRec) {           
        Record.create([{
            record_id:   maxRec + 1,
            patient_id:  parseInt(req.body.patient),
            doctor_id:   parseInt(req.body.doctor),
            radiologist_id: res.locals.user.person_id,
            test_type:   req.body.testtype,
            prescribing_date: req.body.presdate,
            test_date:    req.body.testdate,
            diagnosis:   req.body.diagnosis, 
            description:   req.body.description }],  function (err, items) {
                if(err) throw (err);
                // console.log(items[0].patient_id,items[0].doctor_id,items[0].radiologist_id); 
            });

        //checks for resizing
        // Resize each image and add it into the db
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

    res.redirect('/radio/upload');
};

// Resize images internal
var resize = function(imageid,recordid,image) {
    if(imageid == null)
        imageid = 0;

    // Thumbnail
    gm(image.path).resize(250)
        .toBuffer(function (err, thumbnail) {

            if (err) return handle(err);

            // Medium
            gm(image.path).resize(1024)
            .toBuffer(function (err, medium) {
                if (err) return handle(err);

                // Full Size Image
                gm(image.path).toBuffer(function (err, full) {

                    // Add Record to DB
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
