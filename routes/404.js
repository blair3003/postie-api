const path = require('path')

module.exports = (req, res) => {

	// Set response status to 404
	res.status(404)

	// Return html or json if accepted
	if (req.accepts('html')) return res.sendFile(path.join(__dirname, '..', 'views', '404.html'))
	if (req.accepts('json')) return res.json({ message: '404 Not Found'})

	// Return text otherwise
	res.type('txt').send('404 Not Found')
}