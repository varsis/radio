// Example model

var db = require('orm').db;

var radiology_record = db.define('radiology_record', {
        record_id:   Number,
   patient_id:  Number,
   doctor_id:   Number,
   radiologist_id: Number,
   test_type:   String,
   prescribing_date: Date,
   test_date:    Date,
   diagnosis:   String, 
   description:   String        }, {
    id   : "record_id"
} , {
  methods: {
    example: function(){
      // return example;
    }
  }
});

