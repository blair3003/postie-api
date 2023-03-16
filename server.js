require('dotenv').config()
const db = require('./config/db')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const { logEvents, logger } = require('./middleware/logger')
const { errorHandler } = require('./middleware/errorHandler')
const cors = require('./config/cors')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3500

// Connect to MongoDB
db()

// Log requests
app.use(logger)
// Configure CORS
app.use(cors)
// Allow cookie parsing
app.use(cookieParser())
// Allow JSON processing
app.use(express.json())
// Define static files location
app.use(express.static('public'))

// Index route
app.use('/', require('./routes/index'))
// Resource routes
app.use('/users', require('./routes/resources/userRoutes'))
app.use('/posts', require('./routes/resources/postRoutes'))
// Auth routes
app.use('/auth', require('./routes/auth/authRoutes'))
// 404 route
app.all('*', require('./routes/404'))

// Error handler
app.use(errorHandler)

// Do once on db connection open event
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

// Do on every db connection error event 
mongoose.connection.on('error', err => {
    // console.error(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrors.log')
})

