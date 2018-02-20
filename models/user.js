const mongoose		= require('mongoose');
const bcrypt		= require('bcryptjs');

mongoose.connect('mongodb://ahmed_soliman:123456@ds143778.mlab.com:43778/passport-auth');
const db 			= mongoose.connection;

// User Schema

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});


const User = module.exports = mongoose.model('User', UserSchema);

// the needed function
module.exports.createUser = ( newUser, callback ) => {
	bcrypt.genSalt(10, ( err, salt ) => {
		bcrypt.hash(newUser.password, salt, ( err, hash ) => {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.getUserByUsername = ( username, callback ) {
	let query = { username };
	User.findOne(query, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback ) => {
	bcrypt.compare(candidatePassword, hash, ( err, isMatch ) => {
		if ( err ) throw err;
		callback(null, isMatch);
	})
}