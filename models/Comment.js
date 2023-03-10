const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
	id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	name: {
		type: String,
		required: true
	},
	pic: {
		type: String,
		required: false
	}
})

const commentSchema = new mongoose.Schema({
	author: authorSchema,
	body: {
		type: String,
		required: true
	},
	comments: [this]
},
{
	timestamps: true
})

module.exports = mongoose.model('Comment', commentSchema)