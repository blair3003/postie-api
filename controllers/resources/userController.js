const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../../models/User')
const Post = require('../../models/Post')

const index = async (req, res) => {
	
	// Get user list without passwords
	const users = await User.find().select('-password').lean()    
	if (!users?.length) {
		return res.status(400).json({ message: 'No users found!' })		
	}
	res.json(users)
}

const update = async (req, res) => {
	
	// Validate data
    const { id, name, email, password, roles, active } = req.body
	try {
		if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new Error('Valid User ID required!')
		if (!name || !email) throw new Error('Missing required fields!')
		if (roles && !Array.isArray(roles)) throw new Error('Roles is not an array!')
		if (active && typeof active !== 'boolean') throw new Error('Active is not a boolean!')
	} catch (err) {
		return res.status(400).json({ error: err.message })
	}

	// Get user and check for duplicate
    const [user, userExists] = await Promise.all([
		User.findById(id).exec(),
		User.findOne({ $or: [{ name }, { email }] }).collation({ locale: 'en', strength: 2 }).lean().exec()
	])
	try {
		if (!user) throw new Error('User not found!')
		if (userExists && userExists?._id.toString() !== id) throw new Error('User name or email exists!')
	} catch (err) {
		return res.status(400).json({ error: err.message })
	}

	// Update user properties
    user.name = name
    user.email = email    
    if (roles) user.roles = roles
    if (active) user.active = active
    if (password) user.password = await bcrypt.hash(password, 10)

	// Save user
    const updated = await user.save()
    if (!updated) {
		return res.status(400).json({ message: 'Failed to update user' })
	}
	res.json({ message: 'User updated', updated })
}

const destroy = async (req, res) => {

	// Validate data
    const { id } = req.body
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'Valid User ID required' })
	}

	// Get user and check for dependencies
    const [user, post] = await Promise.all([
		User.findById(id).exec(),
		Post.findOne({ "author.id": id }).lean().exec()
	])
	try {
		if (!user) throw new Error('User not found!')
		if (post) throw new Error('User has posts!')
	} catch (err) {
		return res.status(400).json({ error: err.message })
	}

	// Delete user	
    const deleted = await user.deleteOne()
    if (!deleted) {
		return res.status(400).json({ message: 'Failed to delete user' })
	}
	res.json({ message: 'User deleted', deleted })
}

module.exports = { index, update, destroy }