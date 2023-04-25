const express = require('express')
const router = express.Router()
const imageController = require('../../controllers/resources/imageController')
const imageCache = require('../../middleware/imageCache')

router.route('/:id')
	.get(
		imageCache,
		imageController.show
	)

module.exports = router