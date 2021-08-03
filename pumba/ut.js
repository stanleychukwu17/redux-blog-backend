const LmD = require('../models/BlogLikesModel')

const bt = {
    get_likes_of_this_blog : async (blogId = 0) => {
        const bcur = await LmD.blogs_ech_likes.find({blog: blogId}).exec(); // searches the mongodb collection for the blog likes
        const likes = (bcur.length > 0) ? (bcur[0].likes) : 0;
        return likes
    }
}

module.exports = bt;