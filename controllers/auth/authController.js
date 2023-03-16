const bcrypt = require('bcrypt')
const User = require('../../models/User')

const register = async (req, res) => {

	// Validate data
    const { name, email, password } = req.body
	try {
		if (!name || !email || !password) throw new Error('Missing required fields!')
	} catch (err) {
		return res.status(400).json({ message: err.message })
	}

	// Check for existing user
    const userExists = await User.findOne({ $or: [{ name }, { email }] }).collation({ locale: 'en', strength: 2 }).lean().exec()
	if (userExists) {
		return res.status(409).json({ message: 'User name or email exists!' })
	}

	// Hash password and create user
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash })
    if (!user) {
		return res.status(500).json({ message: 'Failed to register user!' })
	}
	res.status(201).json({ message: 'New user registered', user })

}

const login = async (req, res) => {

    res.json({ message: 'Hello from the login method' })
    
}

module.exports = { register, login }