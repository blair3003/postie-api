require('dotenv').config()
const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers.Authorization || req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
        console.log('JWT not fine')
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.user = decoded.user
            next()
        }
    )

}

module.exports = verifyJWT