const User = require('../models/User')
const { sendSellerApprovalEmail, sendSellerSuspensionEmail } = require('../email-service')

// Get pending sellers
const getPendingSellers = async (req, res) => {
    try {
        const pendingSellers = await User.find({
            role: 'seller',
            status: 'pending'
        }).select('-password')

        res.status(200).json(pendingSellers)
    } catch (err) {
        console.error('Get pending sellers error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

// Approve seller
const approveSeller = async (req, res) => {
    try {
        const { userId } = req.params
        const seller = await User.findOne({ userId, role: 'seller' })

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' })
        }

        seller.status = 'active'
        seller.updatedAt = new Date()
        await seller.save()

        await sendSellerApprovalEmail(seller)

        res.status(200).json({ message: 'Seller approved successfully' })
    } catch (err) {
        console.error('Approve seller error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

// Suspend seller
const suspendSeller = async (req, res) => {
    try {
        const { userId } = req.params
        const { reason } = req.body

        const seller = await User.findOne({ userId, role: 'seller' })

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' })
        }

        seller.status = 'suspended'
        seller.suspensionReason = reason || 'No reason provided'
        seller.updatedAt = new Date()
        await seller.save()

        await sendSellerSuspensionEmail(seller, seller.suspensionReason)

        res.status(200).json({ message: 'Seller suspended successfully' })
    } catch (err) {
        console.error('Suspend seller error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

module.exports = {
    getPendingSellers,
    approveSeller,
    suspendSeller
}