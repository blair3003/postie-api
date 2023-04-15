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
	.patch(
		verifyJWT,
		upload.none(),
		postController.update
	)
	.delete(
		verifyJWT,
		upload.none(),
		postController.destroy
	)

router.route('/:id')
	.get(postController.show)

router.route('/comments')
	.post(
		verifyJWT,
		upload.none(),
		postCommentController.store
	)
	.delete(
		verifyJWT,
		upload.none(),
		postCommentController.destroy
	)

module.exports = router