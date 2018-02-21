const express			= require('express');
const passport			= require('passport');
const LocalStrategy		= require('passport-local').Strategy;
const GoogleStrategy	= require('passport-google-oauth20');
const router			= express.Router();
const User 				= require('../models/user');


passport.use(new LocalStrategy(
  	function(username, password, done) {
    	User.getUserByUsername(username, ( err, user ) => {
    		if ( err ) throw err;
    		if ( !user ) {
    			return done(null, false, { message: 'Unknown User.' })
    		}

    		User.comparePassword(password, user.password, ( err, isMatch ) => {
    			if ( err ) throw err;
    			if( isMatch ) {
    				return done(null, user);
    			}
    			else {
    				return done(null, false, { message: 'Invalid Password.'});
    			}
    		})
    	});
}));

passport.use(
	new GoogleStrategy({
		// options for the google start
		callbackURL: '/users/google/redirect/',
		clientID: '821782046594-352pdc9ttf5j884p2sb8ml1e4peh20dr.apps.googleusercontent.com',
		clientSecret: 'TJrlAv6Mr0wPk2NCinEZKtBS'
	}, ( accessToken, refreshToken, profile, done ) => {
		// passport callback function
		let newUser = new User({
			username: profile.displayName,
			googleId: profile.id,
			email: profile.emails[0].value
		})
		
		//check if user already exists
		User.findOne({googleId: profile.id}).then((currentUser) => {
			if( currentUser ) {
				// already have the user
				console.log('=== this user already exists ===');
				done(null, currentUser);
			} else {
				newUser.save().then((newUser) => {
					console.log('NewUser created, ', newUser);
					done(null, newUser);
				})
			}
		})
	})
)


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


// GET Login
router.get('/login', ( req, res ) => {
	res.render('login');
});

router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

router.get('/google/redirect', passport.authenticate('google'), ( req, res ) => {
 res.redirect('/')
});

// POST Login
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }), ( req, res ) => {
	req.flash('success_msg', 'You are now logged In.');
	res.redirect('/');
})

// GET Register
router.get('/register', ( req, res ) => {
	res.render('register');
});

// POST Register
router.post('/register', ( req, res ) => {
	let name 		= req.body.name;
	let email 		= req.body.email;
	let username 	= req.body.username;
	let password	= req.body.password;
	let password2	= req.body.password2;

	// validation
	req.checkBody('name', 'Name field is required.').notEmpty();
	req.checkBody('email', 'Email field is required.').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords Do not match').equals(req.body.password)

	let errors = req.validationErrors();

	if( errors ) {
		return res.render('register', { errors });
	}
	
	let newUser = new User({ name, email, username, password });

	User.createUser(newUser, ( err, user ) => {
		if ( err ) throw err;

		console.log(user);
	});

	req.flash('success_msg', 'You are registered and can login');
	res.redirect('/users/login');
});

// Logout
router.get('/logout', ( req, res ) => {
	req.logout();

	req.flash('success_msg', 'You are logged out.');
	res.redirect('/users/login')
})
module.exports 	= router;