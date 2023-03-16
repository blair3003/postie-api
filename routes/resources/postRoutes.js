const express = require('express')
const router = express.Router()
const postController = require('../../controllers/resources/postController')
const postCommentController = require('../../controllers/resources/postCommentController')

router.route('/')
	.get(postController.index)
	.post(postController.store)
	.patch(postController.update)
	.delete(postController.destroy)

router.route('/:id')
	.get(postController.show)

router.route('/comments')
	.post(postCommentController.store)
	.delete(postCommentController.destroy)

module.exports = router