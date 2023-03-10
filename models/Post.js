const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
	id: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		ref: 'User'
	},
	name: {
		type: String,
		required: false
	},
	pic: {
		type: String,
		required: false
	}
})

const commentsSchema = new mongoose.Schema({
	author: authorSchema,
	body: {
		type: String,
		required: false
	},
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		ref: 'Comment'
	},
	removed: {
		type: Boolean,
		required: false
	}			
},
{
	timestamps: true
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