const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')

router.route('/')
	.get(userController.index)
	.post(userController.store)
	.patch(userController.update)
	.delete(userController.destroy)

module.exports = router