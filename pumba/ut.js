const LmD = require('../models/BlogLikesModel')
const blogs_comments = require('../models/Bcomments')
const all_activities = require('../models/aActivities')
const UserModel = require('../models/UserModel')

const bt = {
    get_likes_of_this_blog : async (blogId = 0) => {
        const bcur = await LmD.blogs_ech_likes.find({blog: blogId}).exec(); // searches the mongodb collection for the blog likes
        const likes = (bcur.length > 0) ? (bcur[0].likes) : 0;
        return likes
    },

    // using the id of a user to fetch the username of that user
    get_this_user_details : async (userId) => {
        const buser = await UserModel.findById(userId, 'username').exec();
        return {userId, 'name':buser.username}
    },

    // gets the total comments on a blog using the id received
    get_comments_on_dis_blog : async (blogId) => {
        const bcur = await blogs_comments.find({blogId}).sort({createdAt: -1}).exec();
        if (bcur.length > 0) return {'total':bcur.length, 'comments':bcur}
        return {'total':0, 'comments':[]}
    },

    saveThisActivity : async (obj) => {
        const newActivity = new all_activities(obj);
        return newActivity.save();
    }
}

module.exports = bt;