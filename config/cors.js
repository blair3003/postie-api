const cors = require('cors')

const allowedOrigins = [
<<<<<<< Updated upstream
	'http://localhost:5173',
=======
	'http://localhost:3000',
	'http://localhost:5173',
	'http://127.0.0.1:5173'
>>>>>>> Stashed changes
]

module.exports = cors({
	origin: (origin, callback) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	credentials: false,
	optionsSuccessStatus: 200
})