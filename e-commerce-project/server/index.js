const PORT = 8000
const express = require('express')
const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jssonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()

const uri = process.env.MONGO_URI

const app = express()
app.use(cors())
app.use(express.json())

let db
let userCollection
let productsCollection
let ordersCollection

//Connection to MONGODB
async function connectToMongoDB() {
    try {
        const client = new MongoClient(uri)
        await client.connect()
        console.log('Connected to MongoDB')

        db = client.db('gadgetnest')
        usersCollection = db.collection('users')
        productsCollection = db.collection('products')
        ordersCollection = db.collection('orders')

        await usersCollection.createIndex({ email: 1 }, { unique: true })
        await productsCollection.createIndex({ sellerId: 1 })
        await ordersCollection.createIndex({ orderNUmber: 1 }, { unique: true })

    } catch (err) {
        console.error('Error connecting to MongoDB:', err)
        process.exit(1)
    }
}

//JWT Middleware
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

//Role based authentication middleware
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. You do not have permission to perform this action.' })
        }
    }
}



// Default
app.get('/', (req, res) => {
    res.json('Welcome to GadgetNest Server')
})

//AUTH ROUTES
//Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, businessName, phone, address } = req.body//seller

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password and name are required' })
        }

        const existingUser = await usersCollection.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userId = uuidv4();
        //const verificationToken = uuidv4();

        const newUser = {
            userId,
            email,
            password: hashedPassword,
            name,
            businessName: businessName || '',
            phone: phone || '',
            address: address || '',
            role: 'seller',
            status: 'pending',
            //verificationToken,
            //isEmailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        await usersCollection.insertOne(newUser)
        res.status(201).json({ message: 'User registered succesfully. Awaiting admin approval' })
    } catch (err) {
        console.error('Register error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

//Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await usersCollection.findOne({ email })
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
})

app.post('/api/auth/refresh-token', async (req, res) => {
    try {
        const { resfreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' })
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        const user = await usersCollection.findOne({ userId: decoded.id })
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
})

app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        const user = await usersCollection.findOne({ userId: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password)
        if (!validPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await usersCollection.updateOne({ userId: req.user.id }, { $set: { password: hashedPassword }, updatedAt: new Date() })

        res.status(200).json({ message: 'Password updated successfully' })
    } catch (err) {
        console.error('Change password error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})


