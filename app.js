

const express = require('express')
  , passport = require('passport')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , bodyParser = require('body-parser')
  , config = require('./configuration/config')
  , facebookConfig = require('./configuration/facebookConfig')
  , microsoftConfig = require('./configuration/microsoftConfig')
  , app = express();

var GoogleStrategy = require('passport-google-oauth20').Strategy;

const FacebookStrategy = require('passport-facebook').Strategy;

const MicrosoftStrategy = require('passport-microsoft').Strategy;

passport.use(new GoogleStrategy({
  clientID: config.api_key,
  clientSecret: config.api_secret,
  callbackURL: config.callback_url
},
  function (accessToken, refreshToken, profile, done) {

    // Extract the email from the profile object
    const email = profile.emails[0].value;
    profile.email = email; // Attach the email to the profile object

    console.log(profile);
    return done(null, profile);
  }
));


passport.use(new FacebookStrategy({
  clientID: facebookConfig.api_key,
  clientSecret: facebookConfig.api_secret,
  callbackURL: facebookConfig.callback_url,
  profileFields: ['id', 'emails', 'name'] // Request email field
},

  function (accessToken, refreshToken, profile, done) {

     // Extract the email from the profile object
     const email = profile.emails && profile.emails[0] && profile.emails[0].value;
     profile.email = email; // Attach the email to the profile object

    console.log(profile);

    return done(null, profile);
  }
));



passport.use(new MicrosoftStrategy({
    clientID: microsoftConfig.api_key,
    clientSecret: microsoftConfig.api_secret,
    callbackURL: microsoftConfig.callback_url,
    scope: ['user.read', 'User.ReadBasic.All']
  },
  function(accessToken, refreshToken, profile, done) {
  
    // Extract the email from the profile object
    const email = profile._json.mail || profile._json.userPrincipalName;
    profile.email = email; // Attach email to profile object

    console.log(profile);
    return done(null, profile);
  }
));


// Passport session setup.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index', { user: req.user });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  }
);


app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  
app.get('/auth/microsoft', passport.authenticate('microsoft'));

app.get('/auth/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  function (req, res) {
     // Successful authentication, redirect home.
    res.redirect('/');
});

app.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.listen(8080, () => console.log('Server up'));