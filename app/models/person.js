// Example model

var db = require('orm').db;

var Person = db.define('persons', {
        person_id: Number,
        first_name: String,
        last_name: String,
        address: String,
        email: String,
        phone: String,
        }, {
    id   : "person_id"
} , {
  methods: {
    example: function(){
      // return example;
    }
  }
});

