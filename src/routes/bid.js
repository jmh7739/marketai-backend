const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middlewares/authJwt');
const { placeBid, listBids } = require('../controllers/bidController');

router.post('/',                  verifyToken, placeBid);
router.get('/:productId',         listBids);

module.exports = router;
