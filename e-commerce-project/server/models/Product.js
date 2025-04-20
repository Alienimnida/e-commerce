const mongoose = require('mongoose')

const batchSchema = new mongoose.Schema({
    batchId: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    marketPrice: { type: Number },
    sellingPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
})

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: String, default: 'uncategorized' },
    sellerId: { type: String, required: true, index: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    batches: [batchSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Product', productSchema)