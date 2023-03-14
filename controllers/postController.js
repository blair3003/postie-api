const mongoose = require('mongoose')
const Post = require('../models/Post')
const User = require('../models/User')

const index = async (req, res) => {
    
    // Get post list without comments
	const posts = await Post.aggregate([{
        $project: { 
            commentCount: { $size: '$comments' },
            title: 1,
            author: 1,
            thumbnail: 1
        }
    }])
	if (!posts?.length) {
		return res.status(400).json({ message: 'No posts found' })		
	}
	res.json(posts)
}

const show = async (req, res) => {

    // Validate data
    const { id } = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Valid Post ID required' })
    }    
    // Get post
    const post = await Post.findById(id).exec()
    if (!post) {
        return res.status(400).json({ message: 'Post does not exist!' })
    }
    res.json(post)
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

const update = async (req, res) => {

    // Validate data
    const { id, title, authorId, body, thumbnail, tags } = req.body
    try {
		if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new Error('Valid Post ID required!')
        if (!title || !body) throw new Error('Missing required fields!')
        if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) throw new Error('Valid author ID required!')
        if (tags && !Array.isArray(tags)) throw new Error('Tags is not an array!')
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }

    // Check for existing post and author
    const [post, author] = await Promise.all([
        Post.findById(id).exec(),
        User.findById(authorId).exec()
    ])
    try {
        if (!post) throw new Error('Post does not exist!')
        if (!author) throw new Error('Author does not exist!')
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }

    // Update post properties
    post.title = title
    post.body = body    
    post.author.id = authorId    
    post.author.name = author.name    
    post.author.pic = author.pic
    if (thumbnail) post.thumbnail = thumbnail
    if (tags) post.tags = tags

    // Save post
    const updated = await post.save()
    if (!updated) {
        return res.status(400).json({ message: 'Failed to update post' })
    }
    res.json({ message: 'Post updated', updated })
}

const destroy = async (req, res) => {

	// Validate data
    const { id } = req.body
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'Valid Post ID required' })
	}
    
	// Get post
    const post = await Post.findById(id).exec()
    if (!post) {
		return res.status(400).json({ message: 'Post does not exist!' })
	}

	// Delete post	
    const deleted = await post.deleteOne()
    if (!deleted) {
		return res.status(400).json({ message: 'Failed to delete post' })
	}
	res.json({ message: 'Post deleted', deleted })
}

module.exports = { index, show, store, update, destroy }