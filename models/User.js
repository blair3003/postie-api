const mongoose = require('mongoose')

const userSchema = 	new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	pic: {
		type: String,
		required: false
	},
	roles: {
		type: [String],
		default: ["author"]
	},
	active: {
		type: Boolean,
		default: true
	}
},
{
	timestamps: true
})

module.exports = mongoose.model('User', userSchema)