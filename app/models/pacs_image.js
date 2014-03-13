// Example model

var db = require('orm').db;

var pacs_image = db.define('pacs_images', {
        record_id:   Number,
   image_id:    Number,
   thumbnail:   Buffer,
   regular_size: Buffer,
   full_size:    Buffer,
        }, {
    id   : ['record_id','image_id']
} , {
  methods: {
    example: function(){
      // return example;
    }
  }
});

