var mongoose = require('mongoose'); // Importing mongoose for MongoDB object modeling
var Schema = mongoose.Schema; // Creating a Schema object

// Defining the schema for the user collection
userSchema = new Schema( {
	username: String, // Field for storing the username
	password: String // Field for storing the password
}),

// Creating a model based on the user schema
user = mongoose.model('user', userSchema);

module.exports = user; // Exporting the user model