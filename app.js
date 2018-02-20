const express			= require('express');
const path				= require('path');
const cookieParser		= require('cookie-parser');
const bodyParser		= require('body-parser');
const exphbs			= require('express-handlebars');
const expressValidator	= require('express-validator');
const flash 			= require('connect-flash');
const session			= require('express-session');
const passport 			= require('passport');
const localStrategy 	= require('passport-local').Strategy;
const mongo				= require('mongodb');
const mongoose			= require('mongoose');

mongoose.connect('mongodb://ahmed_soliman:123456@ds143778.mlab.com:43778/passport-auth');
const db 				= mongoose.connection;

// Routes
const routes 			= require('./routes/index');
const users				= require('./routes/users');

// Init App
const app = express();
const port = process.env.PORT || 3000;

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser);


// Public Folder
app.use(express.static(path.join(__dirname, 'public')));


// Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// ExpressValidator
app.use(expressValidator({
	errorFormatter: function( param, msg, value ) {
		var namespace	= param.split('.'),
			root		= namespace.shift(),
			formParam	= root;

		while ( namespace.length ) {
			formParam += '[' + namespace.shift() + ']';
		}

		return {
			param 	: formParam,
			msg		: msg,
			value	: value 
		};
	}
}));

// Listen
app.listen(port, () => {
	console.log(`Server is runing on port ${port}.`);
});