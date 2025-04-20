const express = require('express')
const router = express.Router()
const sellerProductController = require('../routes/sellerProductController')
const { authenticationToken, authorize } = require('../middleware/auth')

router.use(authenticationToken)
router.use(authorize(['seller']))

router.post('/', sellerProductController.createProduct)
router.get('/', sellerProductController.getAllProducts)
router.get('/:productId', sellerProductController.getProduct)
router.put('/:productId', sellerProductController.updateProduct)
router.delete('/:productId', sellerProductController.deleteProduct)
router.patch('/:productId/status', sellerProductController.updateProductStatus)
router.post('/:productId/images', sellerProductController.uploadProductImages)
router.delete('/:productId/images/:imageIndex', sellerProductController.deleteProductImage)
router.post('/bulk-action', sellerProductController.bulkProductAction)
router.get('/categories/list', sellerProductController.getProductCategories)
router.post('/order/process', sellerProductController.processOrder)
router.post('/:productId/batch', sellerProductController.addProductBatch)
router.get('/:productId/batches', sellerProductController.getProductBatches)

module.exports = router