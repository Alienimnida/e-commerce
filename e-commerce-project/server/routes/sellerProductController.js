const { v4: uuidv4 } = require('uuid')
const Product = require('../models/Product')

//Create new product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            marketPrice,
            sellingPrice,
            quantity,
            category,
            images = []
        } = req.body

        if (!name || !sellingPrice || quantity === undefined) {
            return res.status(400).json({ message: 'Product name, selling price, and quantity are required' })
        }

        const productId = uuidv4()
        const sellerId = req.user.id
        const batchId = uuidv4()
        const existingProduct = await Product.findOne({
            name,
            sellerId
        })

        if (existingProduct) {
            existingProduct.batches.push({
                batchId,
                quantity,
                marketPrice: marketPrice || price,
                sellingPrice,
                createdAt: new Date()
            })

            if (description) existingProduct.description = description
            if (category) existingProduct.category = category
            if (images.length > 0) existingProduct.images = images

            existingProduct.updatedAt = new Date()
            await existingProduct.save()

            res.status(201).json({
                message: 'New batch added to existing product successfully',
                product: existingProduct
            })
        } else {
            const newProduct = new Product({
                productId,
                name,
                description: description || '',
                price: sellingPrice,
                images,
                category: category || 'uncategorized',
                sellerId,
                batches: [{
                    batchId,
                    quantity,
                    marketPrice: marketPrice || sellingPrice,
                    sellingPrice,
                    createdAt: new Date()
                }],
                createdAt: new Date(),
                updatedAt: new Date()
            })

            await newProduct.save()
            res.status(201).json({
                message: 'Product created successfully with initial batch',
                product: newProduct
            })
        }
    } catch (err) {
        console.error('Create product error:', err);
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
}

// Process order - reduce quantity from oldest batches first
const processOrder = async (req, res) => {
    try {
        const { productId, orderQuantity } = req.body

        if (!productId || orderQuantity === undefined || orderQuantity <= 0) {
            return res.status(400).json({ message: 'Product ID and valid order quantity are required' })
        }

        const product = await Product.findOne({ productId })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        const totalAvailable = product.batches.reduce((sum, batch) => sum + batch.quantity, 0)

        if (totalAvailable < orderQuantity) {
            return res.status(400).json({
                message: 'Insufficient quantity available',
                available: totalAvailable,
                requested: orderQuantity
            })
        }

        let remainingToFulfill = orderQuantity
        const fulfilledBatches = []

        product.batches.sort((a, b) => a.createdAt - b.createdAt)

        for (let i = 0; i < product.batches.length && remainingToFulfill > 0; i++) {
            const batch = product.batches[i]

            if (batch.quantity <= 0) continue

            const quantityFromBatch = Math.min(batch.quantity, remainingToFulfill)
            batch.quantity -= quantityFromBatch
            remainingToFulfill -= quantityFromBatch

            fulfilledBatches.push({
                batchId: batch.batchId,
                quantityTaken: quantityFromBatch,
                sellingPrice: batch.sellingPrice
            })
        }

        product.batches = product.batches.filter(batch => batch.quantity > 0)

        product.updatedAt = new Date()
        await product.save()

        res.status(200).json({
            message: 'Order processed successfully',
            fulfilledBatches,
            remainingBatches: product.batches
        })
    } catch (err) {
        console.error('Process order error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

// Get all products for a seller
const getAllProducts = async (req, res) => {
    try {
        const sellerId = req.user.id
        const {
            page = 1,
            limit = 10,
            sort = 'createdAt',
            order = 'desc',
            status,
            category,
            search
        } = req.query;

        const query = { sellerId }

        if (status && ['active', 'inactive'].includes(status)) {
            query.status = status
        }

        if (category) {
            query.category = category
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        const sortOption = { [sort]: order === 'desc' ? -1 : 1 };

        const skip = (parseInt(page) - 1) * parseInt(limit)
        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))

        const totalProducts = await Product.countDocuments(query)

        res.status(200).json({
            products,
            total: totalProducts,
            page: parseInt(page),
            pages: Math.ceil(totalProducts / parseInt(limit))
        })
    } catch (err) {
        console.error('Get all products error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

//Get product by ID
const getProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const sellerId = req.user.id
        const product = await Product.findOne({ productId, sellerId })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json(product)
    } catch (err) {
        console.error('Get product error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

//Update product by ID
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const sellerId = req.user.id
        const { name, description, price, category, images } = req.body
        const product = await Product.findOne({ productId, sellerId })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        if (name) product.name = name
        if (description !== undefined) product.description = description
        if (price) product.price = price
        if (category) product.category = category
        if (images) product.images = images

        product.updatedAt = new Date()
        await product.save()

        res.status(200).json({
            message: 'Product updated successfully',
            product
        })
    } catch (err) {
        console.error('Update product error', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

// Add a new batch to an existing product
const addProductBatch = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity, marketPrice, sellingPrice } = req.body
        const sellerId = req.user.id

        if (!quantity || quantity <= 0 || !sellingPrice) {
            return res.status(400).json({ message: 'Valid quantity and selling price are required' })
        }

        const product = await Product.findOne({ productId, sellerId })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        const batchId = uuidv4()

        product.batches.push({
            batchId,
            quantity,
            marketPrice: marketPrice || sellingPrice,
            sellingPrice,
            createdAt: new Date()
        })

        product.updatedAt = new Date()
        await product.save()

        res.status(201).json({
            message: 'New batch added successfully',
            batch: product.batches[product.batches.length - 1],
            product
        })
    } catch (err) {
        console.error('Add product batch error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

// Get product batches
const getProductBatches = async (req, res) => {
    try {
        const { productId } = req.params
        const sellerId = req.user.id

        const product = await Product.findOne({ productId, sellerId })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        product.batches.sort((a, b) => a.createdAt - b.createdAt)

        res.status(200).json({
            productName: product.name,
            batches: product.batches,
            totalQuantity: product.batches.reduce((sum, batch) => sum + batch.quantity, 0)
        })
    } catch (err) {
        console.error('Get product batches error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

//Delete product by ID
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const sellerId = req.user.id
        const product = await Product.findOne({ productId, sellerId })

        if (!productId) {
            return res.status(404).json({ message: 'Product not found' })
        }

        await Product.deleteOne({ productId })

        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (err) {
        console.error('Delete product error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

//Update product status
const updateProductStatus = async (req, res) => {
    try {
        const { productId } = req.params
        const { status } = req.body
        const sellerId = req.user.id

        if (!status || !['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' })
        }

        const product = await Product.findOne({ productId, sellerId })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.status = status
        product.updatedAt = new Date()
        await product.save()

        res.status(200).json({
            message: `Product ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
            product
        })
    } catch (err) {
        console.error('Update product status error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

//Upload product images
const uploadProductImages = async (req, res) => {
    try {
        const { productId } = req.params
        const { images } = req.body
        const sellerId = req.user.id

        if (!images || !Array.isArray(images)) {
            return res.status(400).json({ message: 'Images array is required' })
        }
        const product = await Product.findOne({ productId, sellerId })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        product.images = [...product.images, ...images]
        product.updatedAt = new Date()
        await product.save()

        res.status(200).json({
            message: 'Product images uploaded successfully',
            images: product.images
        })
    } catch (err) {
        console.error('Upload product images error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

//Delete product images
const deleteProductImage = async (req, res) => {
    try {
        const { productId, imageIndex } = req.params
        const sellerId = req.user.id

        const product = await Product.findOne({ productId, sellerId })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        const index = parseInt(imageIndex);

        if (isNaN(index) || index < 0 || index >= product.images.length) {
            return res.status(400).json({ message: 'Invalid image index' })
        }

        product.images.splice(index, 1)
        product.updatedAt = new Date()
        await product.save()

        res.status(200).json({
            message: 'Product image deleted successfully',
            images: product.images
        });
    } catch (err) {
        console.error('Delete product image error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

//Bulk product actions
const bulkProductAction = async (req, res) => {
    try {
        const { action, productIds } = req.body
        const sellerId = req.user.id

        if (!action || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: 'Action and product IDs array are required' })
        }

        let result

        switch (action) {
            case 'activate':
                result = await Product.updateMany(
                    { productId: { $in: productIds }, sellerId },
                    { $set: { status: 'active', updatedAt: new Date() } }
                )
                break
            case 'deactivate':
                result = await Product.updateMany(
                    { productId: { $in: productIds }, sellerId },
                    { $set: { status: 'inactive', updatedAt: new Date() } }
                )
                break
            case 'delete':
                result = await Product.deleteMany(
                    { productId: { $in: productIds }, sellerId }
                )
                break
            default:
                return res.status(400).json({ message: 'Invalid action. Use activate, deactivate, or delete' })
        }

        res.status(200).json({
            message: `Bulk ${action} completed successfully`,
            affected: result.modifiedCount || result.deletedCount || 0
        })
    } catch (err) {
        console.error('Bulk product action error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

//Get product categories
const getProductCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category')

        res.status(200).json(categories)
    } catch (err) {
        console.error('Get product categories error:', err)
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    uploadProductImages,
    deleteProductImage,
    bulkProductAction,
    getProductCategories,
    processOrder,
    addProductBatch,
    getProductBatches
}