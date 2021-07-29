require('dotenv').config();
const express			= require('express');
const session			= require('express-session');
const mongoose			= require('mongoose');
const passport			= require('passport');
const localStrategy		= require('passport-local').Strategy;
const bcrypt			= require('bcrypt');
const cors              = require('cors');
const app				= express();

// import the user model for registering a new user or Logging into a user account
const UserModel = require('./models/UserModel')

//--start-- connection to the mongodb server
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DEVELOPMENT_DB_DSN, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('connected to the mongo db cloud')
    app.listen(8080, () => { console.log("Listening on port 8080"); });
});
//--end--

// Config of Middlewares
app.use(cors({origin: '*'}))
app.use(express.static('/public'));
app.use(session({secret: "verygoodsecret", resave: false, saveUninitialized: true}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//--start-- for passport
app.use(passport.initialize());
app.use(passport.session());
//--end--

app.get('/', (req, res) => {
    res.send('<p>Welcome home </p>')
});

// for users to login into their accounts
app.post('/users/login', (req, res, next) => {});

// for registering of new users 
app.post('/users/register', (req, res, next) => {
    const {name:username, password} = req.body;

    // using callback
    UserModel.findOne({ username: username }, function (err, dts) {
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