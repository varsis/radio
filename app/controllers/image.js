/*
image module: loads images
*/

var db = require('orm').db;
var Image = db.models.pacs_images;

exports.file = function(req, res){
    res.send(req.imagedata);
};

// Returns an image on a page
exports.index = function(req, res){
    res.render('image/index',{imageid: req.imageid, imagetype:req.imagetype, recordid:req.recid});
};

// Finds the Image in the database
// Adds it to the Request and calls the next function
exports.getImage = function(req, res, next, id){

        Image.find({image_id:id, record_id: req.recid},1, function(err,image){
            if (err) throw err;
            req.image = image[0];
            next();
        });
    };

// Gets the image id from "path"
// Adds it to the request
// Next Function is called
exports.getImageId = function(req, res, next, id){
        req.imageid = id;
        next();
    };

// Checks what type of image we are trying to load
// Calls next once we add it to the request
exports.imageType = function(req, res, next, imageType){
        var data;
        if(imageType == 'thumbnail') {
            data = (req.image).thumbnail;
        } else if(imageType == 'regular') {
            data = (req.image).regular_size;
        } else if(imageType == 'full'){
            data = (req.image).full_size;
        }
            req.imagedata = data;
            next();

}
