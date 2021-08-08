const LmD = require('../models/BlogLikesModel')
const blogs_comments = require('../models/Bcomments')

const bt = {
    get_likes_of_this_blog : async (blogId = 0) => {
        const bcur = await LmD.blogs_ech_likes.find({blog: blogId}).exec(); // searches the mongodb collection for the blog likes
        const likes = (bcur.length > 0) ? (bcur[0].likes) : 0;
        return likes
    },

    // gets the total comments on a blog using the id received
    get_comments_on_dis_blog : async (blogId) => {
        const bcur = await blogs_comments.find({blogId}).exec();
        return {'total':bcur.length, 'comments':bcur}
    }
}

module.exports = bt;