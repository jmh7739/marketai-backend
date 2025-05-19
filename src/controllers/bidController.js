const Bid = require('../models/bid');

async function placeBid(req, res) {
  const { productId, amount } = req.body;
  const bidderId = req.userId;
  const highest = await Bid.max('amount', { where: { productId } }) || 0;
  if (amount <= highest) return res.status(400).json({ error: '현재가보다 높게 입찰하세요.' });
  if (amount - highest < 500) return res.status(400).json({ error: '최소 500원 이상 증액해야 합니다.' });
  const bid = await Bid.create({ productId, bidderId, amount });
  res.status(201).json(bid);
}

async function listBids(req, res) {
  const bids = await Bid.findAll({
    where: { productId: req.params.productId },
    order: [['amount', 'DESC']]
  });
  res.json(bids);
}

module.exports = { placeBid, listBids };
