const express = require('express')
const router = express.Router()
const userController = require('../../controllers/resources/userController')

router.route('/')
	.get(userController.index)
	.patch(userController.update)
	.delete(userController.destroy)

module.exports = router