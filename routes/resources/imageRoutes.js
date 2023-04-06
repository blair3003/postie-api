const express = require('express')
const router = express.Router()
const imageController = require('../../controllers/resources/imageController')

router.route('/:id')
	.get(imageController.show)

module.exports = router