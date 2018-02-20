const express		= require('express');
const router		= express.Router();

//Get homepage
router.get('/', ( req, res ) => {
	res.render('users');
});

module.exports 	= router;