const mongoose = require('mongoose')

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
    suspensionReason: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)