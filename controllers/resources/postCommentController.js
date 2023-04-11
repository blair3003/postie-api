const mongoose = require('mongoose')
const Post = require('../../models/Post')
const User = require('../../models/User')

const store = async (req, res) => {

    // Validate data
    const { postId, authorId, body, parentId } = req.body
    try {
        if (!body) throw new Error('Missing required fields!')
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) throw new Error('Valid post ID required!')
        if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) throw new Error('Valid author ID required!')
        if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) throw new Error('Valid parent comment ID required!')
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }

    // Check for existing post and author
    const [post, author] = await Promise.all([
        Post.findById(postId).exec(),
        User.findById(authorId).exec()
    ])
    try {
        if (!post) throw new Error('Post does not exist!')
        if (!author) throw new Error('Author does not exist!')
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }

    // Add comment to post
    post.comments.push({
        author: authorId,
        body,
        parent: parentId
    })

    // Save post
    const updated = await post.save()
    if (!updated) {
        return res.status(400).json({ message: 'Failed to add comment!' })
    }
    res.json({ message: 'Comment added to post', updated })
}

const destroy = async (req, res) => {

	// Validate data
    const { id: authID, roles: authRoles } = req.user
    const { id, postId } = req.body
    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new Error('Valid Post ID required!')
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) throw new Error('Valid post ID required!')
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }

    // Get post
    const post = await Post.findById(postId).exec()
    if (!post) {
        return res.status(400).json({ message: 'Post does not exist!' })
    }
    
    // If comment has children, remove content only, otherwise remove comment
    const comment = post.comments.id(id)
    try {
        if (!comment) throw new Error('Comment does not exist!')
        if (authID !== comment.author.toString() && !authRoles.includes('admin')) throw new Error('Unauthorized!')
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
    if (post.comments.some(comment => comment.parent?.toString() === id)) {
        comment.author = undefined
        comment.body = undefined
        comment.removed = true
    } else {        
        post.comments.pull(id)
        // TODO - recursively remove childless  removed ancestors
    }

    // Save post
    const updated = await post.save()
    if (!updated) {
        return res.status(400).json({ message: 'Failed to remove comment!' })
    }
    res.json({ message: 'Comment removed', updated })
}

module.exports = { store, destroy }