const express		= require('express');
const router		= express.Router();

//Get homepage
router.get('/', ( req, res, next ) => {
	res.send('index');
});

module.exports 	= router;