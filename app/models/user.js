// Example model

var db = require('orm').db;

var User = db.define('users', {
        user_name: String,
        password: String,
        'class': String,
        person_id: Number,
        date_registered: Date
}, {
    id   : "user_name",
    autoFetch: true
} , {
  methods: {
    example: function(){
      // return example;
    }
  }
});
