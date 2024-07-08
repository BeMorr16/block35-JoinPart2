const router = require('express').Router();
const { createProduct, fetchProducts } = require('../controllers/productControllers');

router.get('/', fetchProducts);
router.post('/', createProduct);

module.exports = router;