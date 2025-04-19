const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/User')
const { sendRegistrationEmail } = require('../email-service')
require('dotenv').config()

// Register a new user
const register = async (req, res) => {
    try {
        const { email, password, name, businessName, phone, address } = req.body

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password and name are required' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userId = uuidv4()

        const newUser = new User({
            userId,
            email,
            password: hashedPassword,
            name,
            businessName: businessName || '',
            phone: phone || '',
            address: address || '',
            role: 'seller',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await newUser.save()

        await sendRegistrationEmail(newUser)

        res.status(201).json({ message: 'User registered successfully. Awaiting admin approval' })
    } catch (err) {
        console.error('Register error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign({
            id: user.userId,
            email: user.email,
            role: user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        const refreshToken = jwt.sign({
            id: user.userId
        },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            token,
            refreshToken,
            user: {
                id: user.userId,
                email: user.email,
                role: user.role,
            }
        })
    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

// Refresh token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' })
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        const user = await User.findOne({ userId: decoded.id })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const token = jwt.sign({
            id: user.userId,
            email: user.email,
            role: user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        res.status(200).json({ token })
    } catch (err) {
        console.error('Refresh token error:', err)
        res.status(401).json({ message: 'Invalid refresh token' })
    }
}

// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' })
        }

        const user = await User.findOne({ userId: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password)
        if (!validPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword
        user.updatedAt = new Date()
        await user.save()

        res.status(200).json({ message: 'Password updated successfully' })
    } catch (err) {
        console.error('Change password error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

// Initial admin setup
const initialAdminSetup = async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: 'admin' })

        if (adminExists) {
            return res.status(403).json({
                message: 'Initial setup already completed. Use regular admin registration.'
            })
        }

        const { email, password, name, setupCode } = req.body

        if (setupCode !== process.env.INITIAL_SETUP_CODE) {
            return res.status(403).json({ message: 'Invalid setup code' })
        }

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password and name are required' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userId = uuidv4()

        const newAdmin = new User({
            userId,
            email,
            password: hashedPassword,
            name,
            role: 'admin',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await newAdmin.save()
        res.status(201).json({ message: 'Initial admin setup completed successfully' })
    } catch (err) {
        console.error('Initial admin setup error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

// Register admin
const registerAdmin = async (req, res) => {
    try {
        const { email, password, name, phone, adminCode } = req.body

        if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
            return res.status(403).json({ message: 'Invalid admin registration code' })
        }

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password and name are required' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userId = uuidv4()

        const newAdmin = new User({
            userId,
            email,
            password: hashedPassword,
            name,
            phone: phone || '',
            role: 'admin',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await newAdmin.save()
        res.status(201).json({ message: 'Admin registered successfully' })
    } catch (err) {
        console.error('Admin Register error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    changePassword,
    initialAdminSetup,
    registerAdmin
}