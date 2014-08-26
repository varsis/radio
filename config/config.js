var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'radiologyinformationsystem'
    },
    port: 3000,

        db: 'mysql://test:test@localhost/rsi_dev'
  },

  test: {
    root: rootPath,
    app: {
      name: 'radiologyinformationsystem'
    },

        db: 'mysql://test:test@localhost/rsi_dev'
  },

  production: {
    root: rootPath,
    app: {
      name: 'radiologyinformationsystem'
    },
    port: 80,

        db: 'mysql://radio:HAdxH4Ww@localhost/radio'
  }
};


//Database=radio;Data Source=us-cdbr-azure-northcentral-a.cleardb.com;User Id=b8e8de0ff6cbc7;Password=50357e27
module.exports = config[env];
