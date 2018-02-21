const express		= require('express');
const router		= express.Router();

//Get homepage
router.get('/', ensureAuthenticated, ( req, res, next ) => {
	res.render('index');
});

function ensureAuthenticated ( req, res, next ) {
	if ( req.isAuthenticated() ) {
		return next();
	}
	else {
		req.flash('error_msg', 'You are not loggedin.');
		res.redirect('/users/login');
	}
}

module.exports 	= router;