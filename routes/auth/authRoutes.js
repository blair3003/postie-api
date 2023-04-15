const express = require('express')
const multer = require('multer')
const authController = require('../../controllers/auth/authController')

const router = express.Router()
const upload = multer()

router.route('/')
	.post(
		upload.none(),
		authController.login
	)

router.route('/register')
	.post(
		upload.none(),
		authController.register
	)

router.route('/refresh')
	.get(authController.refresh)

router.route('/logout')
	.post(
		upload.none(),
		authController.logout
	)

module.exports = router