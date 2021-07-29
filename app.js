require('dotenv').config();
const express			= require('express');
// const session			= require('express-session');
const mongoose			= require('mongoose');
// const passport			= require('passport');
// const localStrategy		= require('passport-local').Strategy;
const bcrypt			= require('bcrypt');
const cors              = require('cors');
const app				= express();

// import the user model for registering a new user or Logging into a user account
const UserModel = require('./models/UserModel')

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

//--start-- for passport
// app.use(session({secret: "verygoodsecret", resave: false, saveUninitialized: true}));
//--end--

app.get('/', (req, res) => {
    res.send('<p>Welcome home </p>')
});

app.use(function(req, res, next) {
    console.log(req.session);
    next();
});

// for users to login into their accounts
app.post('/users/login', (req, res, next) => {
    const {username, password} = req.body

	UserModel.findOne({username: username}, function (err, user) {
		if (err) res.json({'msg':'bad', 'cause':err});
		if (!user) res.json({'msg':'bad', 'cause':'incorrect username received'});

		bcrypt.compare(password, user.password, function (err, res) {
			if (err) res.json({'msg':'bad', 'cause':err});
			if (res === false) res.json({'msg':'bad', 'cause':'Incorrect password'});

			res.json({'msg':'okay'})
		});
	});
});

// for registering of new users 
// app.post('/users/register', (req, res, next) => {
//     const {username, password} = req.body;

//     UserModel.findOne({username: username}, function (err, dts) {
//         if (dts) { res.json({'msg':'error', 'cause':'The usename already exists in our database'}) }
//         else {
//             bcrypt.genSalt(10, function (err, salt) {
//                 if (err) return next(err);
//                 bcrypt.hash(password, salt, function (err, hash) {
//                     if (err) return next(err);
                    
//                     const newUser = new UserModel({username, 'password': hash});
//                     newUser.save();
//                     res.json({'msg':'okay'})
//                 });
//             });
//         }
//     });
// });