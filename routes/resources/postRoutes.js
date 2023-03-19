const express = require('express')
const router = express.Router()
const postController = require('../../controllers/resources/postController')
const postCommentController = require('../../controllers/resources/postCommentController')
const verifyJWT = require('../../middleware/verifyJWT')

router.route('/')
	.get(postController.index)
	.post(verifyJWT, postController.store)
	.patch(verifyJWT, postController.update)
	.delete(verifyJWT, postController.destroy)

router.route('/:id')
	.get(postController.show)

router.route('/comments')
	.post(verifyJWT, postCommentController.store)
	.delete(verifyJWT, postCommentController.destroy)

module.exports = router