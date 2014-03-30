exports.file = function(req, res){
    res.send(req.imagedata);
};

// Returns an image on a page
exports.index = function(req, res){
    res.render('image/index',{imageid: req.imageid, imagetype:req.imagetype, recordid:req.recid});
};


