require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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

	// Validate data
    const { email, password } = req.body
	if (!email || !password) return res.status(400).json({ message: 'Missing required fields!' })

	// Find user
	const user = await User.findOne({ email }).exec()
    if (!user || !user.active) return res.status(401).json({ message: 'Unauthorized!' })

	// Check password
	const match = await bcrypt.compare(password, user.password)
	if (!match) return res.status(401).json({ message: 'Unauthorized!' })

	// Create access token
	const accessToken = jwt.sign(
		{ 
			"user": {
				"name": user.name,
				"email": user.email,
				"pic": user.pic,
				"roles": user.roles
			}
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '30s' }
	)

	// Create refresh token
	const refreshToken = jwt.sign(
		{ "email": user.email },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: '1d' }
	)

	// Create secure cookie with refresh token
	res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
    })

	// Approve login
	res.json({ message: 'Successful login', accessToken })    
}

module.exports = { register, login }