const express = require('express')
const router = express.Router()
const Image = require('../../models/Image')

router.route('/:id')
	.get(imageController.show)

module.exports = router