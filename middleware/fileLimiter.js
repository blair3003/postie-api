const FILE_MIME_LIMIT = ['image/png', 'image/jpg', 'image/jpeg']
const FILE_SIZE_LIMIT = 1 * 1024 * 1024

const fileMimeLimiter = (req, res, next) => {
	if (!FILE_MIME_LIMIT.includes(req.file.mimetype)) {
		return res.status(422).json({ message: 'Wrong file type' })
	}
	next()
}

const fileSizeLimiter = (req, res, next) => {
    if (req.file.size > FILE_SIZE_LIMIT) {
    	return res.status(413).json({ message: 'File over size limit' })
    }
    next()
}

module.exports = { fileMimeLimiter, fileSizeLimiter }