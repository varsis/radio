var express = require('express');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  var db = require('orm').db;

var User = db.models.users;
var Person = db.models.persons;
var Record = db.models.radiology_record;
var FamilyDoctor = db.models.family_doctor;
var Images = db.models.pacs_images;

Images.hasOne('record', Record, { }, {
    autoFetch: true,
    reverse: 'images',
    mergeTable: 'radiology_record',
    field: 'record_id',
    mergeAssocId: 'record_id'
});

Person.hasMany('users', User ,{
}, {
    autoFetch: true,
    autoSave: true,
    mergeTable: 'users',
    mergeId: 'person_id',
    mergeAssocId: 'user_name'

});

Person.hasMany('records', Record, { }, {
    autoFetch: true,
    autoSave: true,
    mergeTable: 'radiology_record',
    mergeId: 'patient_id',
    mergeAssocId: 'record_id'
});

Record.hasOne('patient', Person, { }, {
    autoFetch: true,
    mergeTable: 'persons',
    field: 'patient_id',
    mergeAssocId: 'person_id'
});

Record.hasOne('doctor', Person, { }, {
    autoFetch: true,
    mergeTable: 'persons',
    field: 'doctor_id',
    mergeAssocId: 'person_id'
});

Record.hasOne('radiologist', Person, { }, {
    autoFetch: true,
    mergeTable: 'persons',
    field: 'radiologist_id',
    mergeAssocId: 'person_id'
});

FamilyDoctor.hasOne('doctor_person', Person, {}, {
    autoFetch: true,
    mergeTable: 'persons',
    field: 'doctor_id',
    mergeAssocId: 'person_id'
});

User.hasOne('person', Person, {}, {
    autoFetch: true,
    mergeTable: 'persons',
    field: 'person_id',
    mergeAssocId: 'person_id'
});

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

passport.deserializeUser(function(user, done) {
    done(null, user);
});

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

passport.serializeUser(function(user, done) {
  done(null, user);
});


        app.use(express.cookieParser() );
        app.use(express.session({
    secret  : "H83GH8DKLS22239",
    maxAge  : new Date(Date.now() + 3600000), //1 Hour
    expires : new Date(Date.now() + 3600000) //1 Hour
}));
        app.use(passport.initialize());
        app.use(passport.session());
        
app.use(function(req, res, next){
    res.locals.user = req.session.passport.user;
    res.locals.path = req.path;
    next();
  });

        app.use(app.router);


    app.use(function(req, res) {
      res.status(404).render('404', { title: '404' });
    });

  });      
};
