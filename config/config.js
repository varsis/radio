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
  // db: 'mysql://checkte_391:pa$$word@varsisstudio.com/checkte_391'
        db: 'mysql://test:test@localhost/rsi_dev'
  },

  test: {
    root: rootPath,
    app: {
      name: 'radiologyinformationsystem'
    },
    port: 3000,
  // db: 'mysql://checkte_391:pa$$word@varsisstudio.com/checkte_391'
        db: 'mysql://test:test@localhost/rsi_dev'
  },

  production: {
    root: rootPath,
    app: {
      name: 'radiologyinformationsystem'
    },
    port: 3000,
  // db: 'mysql://checkte_391:pa$$word@varsisstudio.com/checkte_391'
        db: 'mysql://test:test@localhost/rsi_dev'
  }
};

module.exports = config[env];
