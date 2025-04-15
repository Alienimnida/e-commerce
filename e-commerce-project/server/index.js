const PORT = 8000
const express = require('express')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()

const uri = process.env.MONGO_URI

const app = express()
app.use(cors())
app.use(express.json())

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    businessName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    role: { type: String, enum: ['seller', 'admin'], default: 'seller' },
    status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: String, default: 'uncategorized' },
    sellerId: { type: String, required: true, index: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    products: [{
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

async function connectToMongoDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB with Mongoose');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
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
        next();
    }
}

// Default
app.get('/', (req, res) => {
    res.json('Welcome to GadgetNest Server')
})

//AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
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

        const userId = uuidv4();

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
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully. Awaiting admin approval' })
    } catch (err) {
        console.error('Register error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

app.post('/api/auth/login', async (req, res) => {
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
})

app.post('/api/auth/refresh-token', async (req, res) => {
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
})

app.put('/api/auth/change-password', authenticationToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        const user = await User.findOne({ userId: req.user.id })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password)
        if (!validPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword;
        user.updatedAt = new Date();
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' })
    } catch (err) {
        console.error('Change password error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

//ADMIN ROUTES

app.post('/api/auth/initial-admin-setup', async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            return res.status(403).json({
                message: 'Initial setup already completed. Use regular admin registration.'
            });
        }

        const { email, password, name, setupCode } = req.body;

        // Verify setup code from environment variable
        if (setupCode !== process.env.INITIAL_SETUP_CODE) {
            return res.status(403).json({ message: 'Invalid setup code' });
        }

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password and name are required' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = uuidv4();

        const newAdmin = new User({
            userId,
            email,
            password: hashedPassword,
            name,
            role: 'admin',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Initial admin setup completed successfully' });
    } catch (err) {
        console.error('Initial admin setup error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.post('/api/auth/register-admin', async (req, res) => {
    try {
        const { email, password, name, phone, adminCode } = req.body;

        // Verify admin registration code
        if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
            return res.status(403).json({ message: 'Invalid admin registration code' });
        }

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password and name are required' });
        }

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = uuidv4();

        const newAdmin = {
            userId,
            email,
            password: hashedPassword,
            name,
            phone: phone || '',
            role: 'admin',
            status: 'active', // Admins are active by default
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await usersCollection.insertOne(newAdmin);
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        console.error('Admin Register error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.get('/api/admin/pending-sellers', authenticationToken, authorize(['admin']), async (req, res) => {
    try {
        const pendingSellers = await User.find({
            role: 'seller',
            status: 'pending'
        }).select('-password'); // Mongoose way to exclude password

        res.status(200).json(pendingSellers);
    } catch (err) {
        console.error('Get pending sellers error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.put('/api/admin/approve-seller/:userId', authenticationToken, authorize(['admin']), async (req, res) => {
    try {
        const { userId } = req.params;
        const seller = await User.findOne({ userId, role: 'seller' });

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        seller.status = 'active';
        seller.updatedAt = new Date();
        await seller.save();

        res.status(200).json({ message: 'Seller approved successfully' });
    } catch (err) {
        console.error('Approve seller error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.put('/api/admin/suspend-seller/:userId', authenticationToken, authorize(['admin']), async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const seller = await User.findOne({ userId, role: 'seller' });

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        seller.status = 'suspended';
        seller.suspensionReason = reason || 'No reason provided';
        seller.updatedAt = new Date();
        await seller.save();

        res.status(200).json({ message: 'Seller suspended successfully' });
    } catch (err) {
        console.error('Suspend seller error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


connectToMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}).catch(err => {
    console.error('Failed to start server:', err)
})