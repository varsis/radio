var db = require('orm').db,
    Person = db.models.persons;

// Shows the Manage user page for admin
exports.index = function(req, res){
    Person.all(function(err,persons) {
        res.render('manageusers/index',{persons: persons});
    });
};

