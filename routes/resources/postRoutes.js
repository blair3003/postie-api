const express = require('express')
const router = express.Router()
const postController = require('../../controllers/postController')

router.route('/')
	.get(postController.index)
	.post(postController.store)
	.patch(postController.update)
	.delete(postController.destroy)

module.exports = router