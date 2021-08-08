const mongoose = require('mongoose');

const BlogsComments = mongoose.Schema({
  blogId: {type: String, trim: true},
  userId: {type: String, trim: true},
  comment: {type: String, trim: true}
}, { timestamps: true });

module.exports = mongoose.model('blogs_comments', BlogsComments);