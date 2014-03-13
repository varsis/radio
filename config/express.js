var express = require('express');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  var db = require('orm').db,
    User = db.models.users;

module.exports = function(app, config) {
  app.configure(function () {
    app.use(express.compress());
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.favicon(config.root + '/app/public/img/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
 function loggedIn(req, res, next) {
     if(req.path != '/login') {
      if (req.user) {
       next();
     } else {
       res.redirect('/login');
      } } else {
          next();
      }}

    app.use(loggedIn);


    passport.use(new LocalStrategy(
  function(username, passwordin, done) {
    User.find({user_name: username} , function (err, user) {
    
      if (err || user.length == 0) { 
          return done(err);
      }
          return done(null,user[0]);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.user_name);
});

passport.deserializeUser(function(username, done) {
  User.find({user_name: username}, function (err, user) {
    done(err, user);
  });
});


        app.use(express.cookieParser() );
        app.use(express.session({ secret: 'H8HIJHHGJ788GV' }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);


    app.use(function(req, res) {
      res.status(404).render('404', { title: '404' });
    });

  });      
};
