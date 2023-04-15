const express = require('express')
const multer = require('multer')
const userController = require('../../controllers/resources/userController')
const verifyJWT = require('../../middleware/verifyJWT')
const { fileMimeLimiter, fileSizeLimiter } = require('../../middleware/fileLimiter')

const router = express.Router()
const upload = multer()

router.route('/')
	.get(verifyJWT, userController.index)
	.patch(
		verifyJWT,
		upload.single('pic'),
		fileMimeLimiter,
		fileSizeLimiter,
		userController.update
	)
	.delete(
		verifyJWT,
		upload.none(),
		userController.destroy
	)

router.route('/:id')
	.get(userController.show)

module.exports = router