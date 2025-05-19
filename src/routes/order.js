const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middlewares/authJwt');
const { createOrder, confirmDeposit, listOrders } = require('../controllers/orderController');

router.post('/',        verifyToken, createOrder);
router.post('/confirm', verifyToken, confirmDeposit);
router.get('/',         verifyToken, listOrders);

module.exports = router;
