var mongoose = require('mongoose');
var Schema = mongoose.Schema;

bookSchema = new Schema( {
	name: String,
	description: String,
    category: String,
	image: String,
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
book = mongoose.model('book', bookSchema);

module.exports = book;