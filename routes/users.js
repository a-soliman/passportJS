const express		= require('express');
const router		= express.Router();
const User 			= require('../models/user');

// GET Login
router.get('/login', ( req, res ) => {
	res.render('login');
});

// POST Login
router.post('/login', ( req, res ) => {
	//get the data
	let username = req.body.username.trim();
	let password = req.body.password.trim();

	console.log(username, password)
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
})
module.exports 	= router;