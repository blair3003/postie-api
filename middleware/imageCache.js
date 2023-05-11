const cache = require('memory-cache')

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000

const imageCache = (req, res, next) => {

	const key = `__postie__${req.originalUrl}`
	const cached = cache.get(key)

	if (cached) {
		console.log(`returning cached - ${key}`)
		return res.set('Content-Type', cached.mimetype).send(cached.data)
	}

	res.sendResponse = res.send
	res.send = (image) => {
		cache.put(key, image, CACHE_DURATION)
		console.log(`image cached - ${key}`)
		res.set('Content-Type', image.mimetype).sendResponse(image.data)
	}

	next()
}

module.exports = imageCache