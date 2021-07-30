const mongoose = require('mongoose');

const BlogsSchema = mongoose.Schema({
  uid: {type: String},
  title: {type: String, trim: true},
  content: {type: String, trim: true},
  date_p: {type: String, trim: true},
});

module.exports = mongoose.model('Blogs', BlogsSchema);