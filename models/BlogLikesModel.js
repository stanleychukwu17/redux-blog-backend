const mongoose = require('mongoose');

const BlogEchLikesSchema = mongoose.Schema({
  blog: {type: String, trim: true},
  likes: {type: Number},
});

const BlogTotLikesSchema = mongoose.Schema({
    totLikes: {type: Number}
});

const blogs_ech_likes = mongoose.model('blogs_ech_likes', BlogEchLikesSchema);
const blogs_tot_likes = mongoose.model('blogs_tot_likes', BlogEchLikesSchema);
module.exports = {blogs_ech_likes, blogs_tot_likes}