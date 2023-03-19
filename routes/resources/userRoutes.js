const express = require('express')
const router = express.Router()
const userController = require('../../controllers/resources/userController')
const verifyJWT = require('../../middleware/verifyJWT')

router.route('/')
	.get(verifyJWT, userController.index)
	.patch(verifyJWT, userController.update)
	.delete(verifyJWT, userController.destroy)

module.exports = router