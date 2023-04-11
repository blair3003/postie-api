const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
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
	author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
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