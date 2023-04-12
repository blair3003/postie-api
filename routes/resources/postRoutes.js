const express = require('express')
const router = express.Router()
const multer = require('multer')
const postController = require('../../controllers/resources/postController')
const postCommentController = require('../../controllers/resources/postCommentController')
const verifyJWT = require('../../middleware/verifyJWT')
const { fileMimeLimiter, fileSizeLimiter } = require('../../middleware/fileLimiter')

const upload = multer()

router.route('/')
	.get(postController.index)
	.post(
		verifyJWT,
		upload.single('thumbnail'),
		fileMimeLimiter,
		fileSizeLimiter,
		postController.store
	)
	.patch(verifyJWT, postController.update)
	.delete(verifyJWT, postController.destroy)

router.route('/:id')
	.get(postController.show)

router.route('/comments')
	.post(verifyJWT, postCommentController.store)
	.delete(verifyJWT, postCommentController.destroy)

module.exports = router