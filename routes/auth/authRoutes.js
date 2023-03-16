const express = require('express')
const router = express.Router()
const authController = require('../../controllers/auth/authController')

router.route('/')
	.post(authController.login)

router.route('/register')
	.post(authController.register)

module.exports = router