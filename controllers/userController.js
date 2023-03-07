const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/User')
const Post = require('../models/Post')

const index = async (req, res) => {    
	const users = await User.find().select('-password').lean()    
	if (!users?.length) {
		return res.status(400).json({ message: 'No users found' })		
	}
	res.json(users)
}

const store = async (req, res) => {
    const { name, email, password, roles } = req.body
    if (!name || !email || !password || !Array.isArray(roles)) {
		return res.status(400).json({ message: 'Missing required fields' })
	}
    const userExists = await User.findOne({ $or: [{ name }, { email }] }).collation({ locale: 'en', strength: 2 }).lean().exec()
	if (userExists) {
		return res.status(409).json({ message: 'User exists' })
	}
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash, roles })
    if (!user) {
		return res.status(400).json({ message: 'Failed to create user' })
	}
	res.status(201).json({ message: 'New user created', user })	
}

const update = async (req, res) => {
    const { id, name, email, password, roles, active } = req.body
    if (!id || !mongoose.Types.ObjectId.isValid(id) || !name || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
		return res.status(400).json({ message: 'Missing required fields' })
	}
    const [user, userExists] = await Promise.all([
		User.findById(id).exec(),
		User.findOne({ $or: [{ name }, { email }] }).collation({ locale: 'en', strength: 2 }).lean().exec()
	])
    if (!user) {
		return res.status(400).json({ message: 'User not found' })
	}
	if (userExists && userExists?._id.toString() !== id) {
		return res.status(409).json({ message: 'User exists' })
	}
    user.name = name
    user.email = email    
    user.roles = roles
    user.active = active
    if (password) user.password = await bcrypt.hash(password, 10)
    const updated = await user.save()
    if (!updated) {
		return res.status(400).json({ message: 'Failed to update user' })
	}
	res.json({ message: 'User updated', updated })
}

const destroy = async (req, res) => {
    const { id } = req.body
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'User ID required' })
	}
    const [user, post] = await Promise.all([
		User.findById(id).exec(),
		Post.findOne({ "author.id": id }).lean().exec()
	])
    if (!user) {
		return res.status(400).json({ message: 'User not found' })		
	}
	if (post) {
		return res.status(400).json({ message: 'User has posts' })		
	}
    const deleted = await user.deleteOne()
    if (!deleted) {
		return res.status(400).json({ message: 'Failed to delete user' })
	}
	res.json({ message: 'User deleted', deleted })
}

module.exports = { index, store, update, destroy }