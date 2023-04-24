const cors = require('cors')

const allowedOrigins = [
	'https://postie.onrender.com'
]

module.exports = cors({
	origin: (origin, callback) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	credentials: true,
	optionsSuccessStatus: 200
})