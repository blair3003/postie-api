const mongoose = require('mongoose')
const Post = require('../../models/Post')
const User = require('../../models/User')
const Image = require('../../models/Image')

const index = async (req, res) => {
    
    // Get post list without comments
	const posts = await Post.aggregate([{
        $project: { 
            commentCount: { $size: '$comments' },
            title: 1,
            author: 1,
            thumbnail: 1,
            createdAt: 1
        }
    }, {
        $sort: {
            createdAt: -1
        }        
    }])
	if (!posts?.length) {
		return res.status(400).json({ message: 'No posts found' })		
	}
    // Update post list to include author information
    const postsWithAuthor = await Promise.all(
        posts.map(async post => {
            const author = await User.findById(post.author).lean().exec()
            return {
                ...post,
                author: {
                    id: author._id,
                    name: author.name,
                    pic: author.pic
                }
            }
        })
    )
	res.json(postsWithAuthor)
}

const show = async (req, res) => {

    // Validate data
    const { id } = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Valid Post ID required' })
    }
    // Get post
    const post = await Post.findById(id).lean().exec()
    if (!post) {
        return res.status(400).json({ message: 'Post does not exist!' })
    }

    // Update comments to include author information
    const commentsWithAuthor = await Promise.all(
        post.comments.map(async comment => {
            const author = await User.findById(comment.author).lean().exec()
            return {
                ...comment,
                author: {
                    id: author._id,
                    name: author.name,
                    pic: author.pic
                }
            }
        })
    )
    // Get author
    const author = await User.findById(post.author).lean().exec()

    // Update post to include author information
    const postWithAuthor = {
        ...post,
        author: {
            id: author._id,
            name: author.name,
            pic: author.pic
        },
        comments: commentsWithAuthor
    }

    res.json(postWithAuthor)
}

const store = async (req, res) => {

    // Validate data
    const { roles: authRoles } = req.user
    const { title, authorId, body } = req.body
    const thumbnail = req.file ?? null
    const tags = req.body.tags?.split(',')

    try {
        if (!authRoles.includes('admin') && !authRoles.includes('author')) throw new Error('Unauthorized!')
        if (!title || !body || !thumbnail) throw new Error('Missing required fields!')
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

    // Upload image
    const data = new Buffer.from(thumbnail.buffer, 'base64')
    const mimetype = thumbnail.mimetype
    const image = await Image.create({ data, mimetype })
    if (!image) {
        return res.status(400).json({ message: 'Failed to upload image!' })
    }

    // Create post
    const post = await Post.create({
        title,
        author: authorId,
        body,
        thumbnail: `https://postie-api.onrender.com/images/${image._id}`,
        tags
    })
    if (!post) {
        return res.status(400).json({ message: 'Failed to create post!' })
    }
    res.status(201).json({ message: 'New post created', post })
}

const update = async (req, res) => {

    // Validate data
    const { id: authID, roles: authRoles } = req.user
    const { id, title, authorId, body } = req.body
    const tags = req.body.tags?.split(',')

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
        if (authID !== post.author.toString() && !authRoles.includes('admin')) throw new Error('Unauthorized!')
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }

    // Update post properties
    post.title = title
    post.body = body    
    post.author = authorId
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
    const { id: authID, roles: authRoles } = req.user
    const { id } = req.body
    try {
		if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new Error('Valid Post ID required!')
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
    
	// Get post
    const post = await Post.findById(id).exec()

    try {
        if (!post) throw new Error('Post does not exist!')
        if (authID !== post.author.toString() && !authRoles.includes('admin')) throw new Error('Unauthorized!')
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }

    // Get image
    const image = await Image.findById(post.thumbnail.split('/').slice(-1)[0]).exec()

    // Delete image
    const deletedImage = await image.deleteOne()
    if (!deletedImage) {
        return res.status(400).json({ message: 'Failed to delete image' })
    }

	// Delete post	
    const deleted = await post.deleteOne()
    if (!deleted) {
		return res.status(400).json({ message: 'Failed to delete post' })
	}
	res.json({ message: 'Post deleted', deleted })
}

module.exports = { index, show, store, update, destroy }