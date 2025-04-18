const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied. You do not have permission to perform this action.'
            })
        }
        next()
    }
}

module.exports = { authenticationToken, authorize }