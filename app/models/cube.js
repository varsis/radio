// Example model

var db = require('orm').db;

var record_image_cube = db.define('cube', {
   record_id:   Number,
   patient_id:  Number,
   image_id:    Number,
   test_type:   String,
   test_date:    Date
    }, {
    id   : ['record_id','patient_id','image_id']
} , {
  methods: {
  }
});

