const mongoose = require('mongoose');

const BlogsSchema = mongoose.Schema({
  title: {type: String, trim: true, minlength: 3},
  content: {type: String, trim: true, minlength: 3},
  date_p: {type: String, trim: true, minlength: 3},
  uid: {type: String},
}, { timestamps: true });

module.exports = mongoose.model('Blogs', BlogsSchema);