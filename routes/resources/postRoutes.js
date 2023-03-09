const express = require('express')
const router = express.Router()
const postController = require('../../controllers/postController')
const postCommentController = require('../../controllers/postCommentController')

router.route('/')
	.get(postController.index)
	.post(postController.store)
	.patch(postController.update)
	.delete(postController.destroy)

router.route('/comments')
	.post(postCommentController.store)
	.delete(postCommentController.destroy)

module.exports = router