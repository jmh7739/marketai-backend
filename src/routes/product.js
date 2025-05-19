const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middlewares/authJwt');
const { createProduct, listProducts, getProduct } = require('../controllers/productController');

router.post('/',   verifyToken, createProduct);
router.get('/',    listProducts);
router.get('/:id', getProduct);

module.exports = router;
