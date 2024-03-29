const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
	data: {
		type: Buffer,
		required: true
	},
	mimetype: {
		type: String,
		required: true
	}
},
{
	timestamps: true
})

module.exports = mongoose.model('Image', imageSchema)