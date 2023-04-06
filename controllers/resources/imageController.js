const mongoose = require('mongoose')
const Image = require('../../models/Image')

const show = async (req, res) => {

    // Validate data
    const { id } = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Valid Image ID required' })
    }    
    // Get image
    const image = await Image.findById(id).lean().exec()
    if (!image) {
        return res.status(400).json({ message: 'Image does not exist!' })
    }
    res.json(image)
}

module.exports = { show }