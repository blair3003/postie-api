const mongoose = require('mongoose')
const Post = require('../models/Post')
const User = require('../models/User')

const index = async (req, res) => {
    
    // Get post list without comments
	const posts = await Post.find().select('-comments').lean()    
	if (!posts?.length) {
		return res.status(400).json({ message: 'No posts found' })		
	}
	res.json(posts)
}

const store = async (req, res) => {

    // Validate data
    const { title, authorId, body, thumbnail, tags } = req.body
    try {
        if (!title || !body) throw new Error('Missing required fields!')
        if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) throw new Error('Valid author ID required!')
		if (tags && !Array.isArray(tags)) throw new Error('Tags is not an array!')
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }

    // Check for existing author
    const author = await User.findById(authorId).exec()
    if (!author) {
        return res.status(409).json({ message: 'Author does not exist!' })
    }

    // Create post
    const post = await Post.create({ title, author: { id: authorId, name: author.name, pic: author.pic }, body, thumbnail, tags })
    if (!post) {
        return res.status(400).json({ message: 'Failed to create post!' })
    }
    res.status(201).json({ message: 'New post created', post })
}

const update = async (req, res) => { }

const destroy = async (req, res) => { }

module.exports = { index, store, update, destroy }