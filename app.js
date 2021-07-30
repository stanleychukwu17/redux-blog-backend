require('dotenv').config();
const express			= require('express');
const mongoose			= require('mongoose');
const bcrypt			= require('bcrypt');
const cors              = require('cors');
const app				= express();

// import the user model for registering a new user or Logging into a user account
const UserModel = require('./models/UserModel')
const UdtsModel = require('./models/SessModel')
const BlogsModel = require('./models/BlogsModel')

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

    BlogsModel.find({}, function (err, docs) {
        if (err) { res.json({'msg':'bad', 'cause':err}); return; }
        ret.push(...docs);
        res.json({'msg':'okay', 'dts':ret});
    });
});

// for posting of a new blog by a registered user
app.post('/blogs/new-blog', (req, res, next) => {
    const {title, content, uid, date_p} = req.body;

    const newBlog = new BlogsModel(req.body);
    newBlog.save();
    res.json({'msg':'okay'});
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