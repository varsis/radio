var express = require('express'),

  orm = require('orm'),
  fs = require('fs'),
  gm = require('gm')
  config = require('./config/config');
  var fts = require("orm-mysql-fts");

orm.settings.set("instance.cache", false);
orm.db = orm.connect(config.db, function(err, db){
    db.use(fts);
  if(err){
    console.log("Something is wrong with the connection", err);
    return ;
  }
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var app = express();

require('./config/express')(app, config);
require('./config/routes')(app);

app.listen(config.port);
