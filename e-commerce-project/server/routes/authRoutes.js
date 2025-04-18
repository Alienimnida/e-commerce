const express = require('express')
const router = express.Router()
const { authenticationToken } = require('../middleware/auth')
const {
    register,
    login,
    refreshToken,
    changePassword,
    initialAdminSetup,
    registerAdmin
} = require('../routes/authController')

// Auth routes
router.post('/register', register)
router.post('/login', login)
router.post('/refresh-token', refreshToken)
router.put('/change-password', authenticationToken, changePassword)
router.post('/initial-admin-setup', initialAdminSetup)
router.post('/register-admin', registerAdmin)

module.exports = router