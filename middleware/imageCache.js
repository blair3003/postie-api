const cache = require('memory-cache')

const imageCache = (req, res, next) => {

	const key = `__postie__${req.originalUrl}`
	const cached = cache.get(key)

	if (cached) return res.set('Content-Type', cached.mimetype).send(cached.data)

	res.sendResponse = res.send
	res.send = (image) => {
		cache.put(key, image, 5*60*1000)
		res.set('Content-Type', image.mimetype).sendResponse(image.data)
	}

	next()
}

module.exports = imageCache