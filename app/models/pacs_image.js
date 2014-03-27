// Example model

var db = require('orm').db;

var pacs_image = db.define('pacs_images', {
        record_id:   Number,
   image_id:    Number,
   thumbnail:   { type: "binary", big: true },
   regular_size: { type: "binary", big: true },
   full_size:     { type: "binary", big: true }
        }, {
    id   : ['record_id','image_id']
} , {
  methods: {
  }
});

