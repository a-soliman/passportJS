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


// Listen
app.listen(port, () => {
	console.log(`Server is runing on port ${port}.`);
});