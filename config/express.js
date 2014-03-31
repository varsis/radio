var express = require('express');

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
var db = require('orm').db;

var User = db.models.users;
var Person = db.models.persons;
var Record = db.models.radiology_record;
var FamilyDoctor = db.models.family_doctor;
var Images = db.models.pacs_images;

// Model Relations
// Each image is associated with one record
Images.hasOne('record', Record, { }, {
    autoFetch: true,
    reverse: 'images',
    mergeTable: 'radiology_record',
    field: 'record_id',
    mergeAssocId: 'record_id'
});

// Each person has many user accounts
Person.hasMany('users', User ,{
}, {
    autoFetch: true,
    autoSave: true,
    mergeTable: 'users',
    mergeId: 'person_id',
    mergeAssocId: 'user_name'

});

// Each person has many records
Person.hasMany('records', Record, { }, {
    autoFetch: true,
    autoSave: true,
    mergeTable: 'radiology_record',
    mergeId: 'patient_id',
    mergeAssocId: 'record_id'
});

// Each record is associated with one person
Record.hasOne('patient', Person, { }, {
    autoFetch: true,
    mergeTable: 'persons',
    field: 'patient_id',
    mergeAssocId: 'person_id'
});

// Each record is assocaited with one doctor
Record.hasOne('doctor', Person, { }, {
    autoFetch: true,
    mergeTable: 'persons',
    field: 'doctor_id',
    mergeAssocId: 'person_id'
});
// Each record is assocaited with one Radiologist
Record.hasOne('radiologist', Person, { }, {
    autoFetch: true,
    mergeTable: 'persons',
    field: 'radiologist_id',
    mergeAssocId: 'person_id'
});

// Each Family doctor is assocaited with a person by the id
FamilyDoctor.hasOne('doctor_person', Person, {}, {
    autoFetch: true,
    mergeTable: 'persons',
    field: 'doctor_id',
    mergeAssocId: 'person_id'
});

// Each user is assocaited with a Person
User.hasOne('person', Person, {}, {
    autoFetch: true,
    mergeTable: 'persons',
    field: 'person_id',
    mergeAssocId: 'person_id'
});

// App Extra Configurations
module.exports = function(app, config) {
    app.configure(function () {
        app.use(express.compress());
        app.use(express.static(config.root + '/public'));
        app.use('/js',express.static(config.root + '/public/js'));
        app.set('port', config.port);
        app.set('views', config.root + '/app/views');
        app.set('view engine', 'jade');
        app.use(express.favicon(config.root + '/app/public/img/favicon.ico'));
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        // Deserialize a User
        passport.deserializeUser(function(user, done) {
            done(null, user);
        });

       // Checking if valid user
        passport.use(new LocalStrategy(
                function(username, passwordin, done) {
                    User.find({user_name: username, password: passwordin} ,
                        function (err, user) {
                            if (err || user.length == 0) { 
                                return done(err);
                            }
                            return done(null,user[0]);
                        });
                }
                ));

        // Serialize the user
        passport.serializeUser(function(user, done) {
            done(null, user);
        });

        // How to get cookie back
        app.use(express.cookieParser() );

        // Tell Express to use sessions
        app.use(express.session({
            secret  : "H83GH8DKLS22239",
            maxAge  : new Date(Date.now() + 3600000), 
            expires : new Date(Date.now() + 3600000) 
        }));

        // Start the Passport Module
        app.use(passport.initialize());

        // Tell passport we are using sessions
        app.use(passport.session());

        // Everytime we call a page add the user into the response.
        app.use(function(req, res, next){
            res.locals.user = req.session.passport.user;
            res.locals.path = req.path;
            next();
        });

        app.use(app.router);

        // Server error handle
        app.use(function(err, req, res, next){
            console.error(err);
            res.render('500',err);
        });


        // Missing Page handle
        app.use(function(req, res) {
            res.status(404).render('404', { title: '404' });
        });

    });      
};
