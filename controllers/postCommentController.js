const mongoose = require('mongoose')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')

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

    const findParent = (parent, id) => {
        for (let comment of parent.comments) {
            console.log(comment._id?.toString())
            if (comment._id?.toString() === id) {
                return comment
            }
            const nested = findParent(comment, id)
            if (nested) {
                return nested
            }
        }
        return null
    }

    const parent = (parentId) ? findParent(post, parentId) : post

    console.log(post.comments)
    console.log(parentId)

    // Add comment to post
    const comment = {
        _id: new mongoose.Types.ObjectId(),
        author: {
            id: author.id,
            name: author.name,
            pic: author.pic
        },
        body,
        createdAt: new Date()
    }

    parent.comments.push(comment)

    // Save post
    const updatedPost = await post.save()
    if (!updatedPost) {
        return res.status(400).json({ message: 'Failed to add comment' })
    }
    res.json({ message: 'Comment added to post', updatedPost })
}

const destroy = async (req, res) => {}

module.exports = { store, destroy }