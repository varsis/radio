// Example model

var db = require('orm').db;

var family_doctor = db.define('family_doctor', {
        doctor_id: Number,
        patient_id: Number,
        }, {
    id   : ['doctor_id','patient_id']
} , {
  methods: {
    example: function(){
      // return example;
    }
  }
});

