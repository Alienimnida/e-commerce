const express = require('express')
const router = express.Router()
const { authenticationToken, authorize } = require('../middleware/auth')
const {
    getPendingSellers,
    approveSeller,
    suspendSeller
} = require('../routes/adminController')

// Admin routes
router.get('/pending-sellers', authenticationToken, authorize(['admin']), getPendingSellers)
router.put('/approve-seller/:userId', authenticationToken, authorize(['admin']), approveSeller)
router.put('/suspend-seller/:userId', authenticationToken, authorize(['admin']), suspendSeller)

module.exports = router