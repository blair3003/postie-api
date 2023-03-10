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

const commentsSchema = new mongoose.Schema({
	id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	},
	author: authorSchema,
	body: {
		type: String,
		required: true
	},
	comments: [this]			
})

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	author: authorSchema,
	body: {
		type: String,
		required: true
	},
	thumbnail: {
		type: String,
		required: false
	},
	tags: {
		type: [String],
		default: []
	},
	comments: [commentsSchema]
},
{
	timestamps: true
})

module.exports = mongoose.model('Post', postSchema)