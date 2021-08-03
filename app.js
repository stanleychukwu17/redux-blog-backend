require('dotenv').config();
const express			= require('express');
const mongoose			= require('mongoose');
const bcrypt			= require('bcrypt');
const cors              = require('cors');
const app				= express();

// import the user model for registering a new user or Logging into a user account
const UserModel = require('./models/UserModel')
const UdtsModel = require('./models/SessModel'); // for storing of users hash for their login sessions
const BlogsModel = require('./models/BlogsModel')
const LmD = require('./models/BlogLikesModel')
const utFunc = require('./function/andy')

//--start-- connection to the mongodb server
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DEVELOPMENT_DB_DSN, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    app.listen(8080, () => { console.log("Listening on port 8080"); });
});
//--end--

// Config of Middlewares
app.use(cors({origin: '*'}))
app.use(express.static('/public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<p>Welcome home </p>')
});


// for returning of all the blogs posted
app.get('/blogs/all-blogs', (req, res, next) => {
    const ret = [];
    let blogId;

    BlogsModel.find({}, async function (err, docs) {
        if (err) { res.json({'msg':'bad', 'cause':err}); return; }

        // fetches the total likes that this blog has received
        const promises = docs.map(async (ech) => {
            const bambi = {...ech._doc};

            const bcur = await LmD.blogs_ech_likes.find({blog: ech._id}).exec(); // searches the mongodb collection for each blog likes
            bambi.likes = (bcur.length > 0) ? (bcur[0].likes) : 0;

            const buser = await UserModel.findById(ech.uid, 'username').exec();
            if (buser) { bambi.author = buser.username; }

            return bambi;
        })


        Promise.all(promises).then(re => {
            res.json({'msg':'okay', 'dts':re});
        })
    });
});

// for returning of one blog
app.get('/blogs/one-blog/:id', async (req, res, next) => {
    const blogId = req.params.id;

    const blogDts = await BlogsModel.findById(blogId).exec();
    // console.log({...blogDts});
    res.json({'msg':'okay', 'dts':blogDts});
});

// for posting of a new blog by a registered user
app.post('/blogs/new-blog', (req, res, next) => {
    const {title, content, uid, date_p} = req.body;

    const newBlog = new BlogsModel(req.body);
    newBlog.save();
    res.json({'msg':'okay'});
});

// for liking of blogs and updating the total likes of that particular blog
app.post('/blogs/like-new-blog', async (req, res, next) => {
    const {blog_id} = req.body

    const bcur = await LmD.blogs_ech_likes.find({blog: blog_id}).exec();
    if (bcur.length > 0) {
        const newLikes = bcur[0].likes + 1;
        const res = await LmD.blogs_ech_likes.updateOne({blog:blog_id}, { likes:newLikes});
    } else {
        const bcl = new LmD.blogs_ech_likes({'blog':blog_id, 'likes':1});
        const saved = await bcl.save();
    }

    res.json({'msg':'okay'})
});


// for users to login into their accounts
app.post('/users/login', (req, res, next) => {
    const {username, password} = req.body

	UserModel.findOne({username: username}, function (err, user) {
		if (err) { res.json({'msg':'bad', 'cause':err}); return next(); }
		if (!user) { res.json({'msg':'bad', 'cause':'incorrect username received'}); return next(); }

		bcrypt.compare(password, user.password, function (err, checked) {
			if (err) { res.json({'msg':'bad', 'cause':err}); return next(); }
			if (checked === false) { res.json({'msg':'bad', 'cause':'Incorrect password'}); return next(); }

            const date = new Date();
            const toHash = date.getTime()+''+username;
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(toHash, salt);
    
            // Store hash in the session table for the user verification
            const udts = new UdtsModel({'uid':user._id, 'shash':user.password})
            udts.save()
			res.json({'msg':'okay', 'hash':hash, 'uid':user._id});
		});
	});
});

// for registering of new users 
app.post('/users/register', (req, res, next) => {
    const {username, password} = req.body;

    UserModel.findOne({username: username}, function (err, dts) {
        if (dts) { res.json({'msg':'error', 'cause':'The usename already exists in our database'}) }
        else {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) return next(err);
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) return next(err);
                    
                    const newUser = new UserModel({username, 'password': hash});
                    newUser.save();
                    res.json({'msg':'okay'})
                });
            });
        }
    });
});