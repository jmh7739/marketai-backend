const Product = require('../models/product');

async function createProduct(req, res) {
  const { title, description, condition, startPrice, buyNowPrice, reservePrice, auctionEnd, shippingFee, pickupLocation } = req.body;
  try {
    const product = await Product.create({
      title, description, condition,
      startPrice, buyNowPrice, reservePrice,
      auctionEnd, shippingFee, pickupLocation,
      imageUrls: [], // 나중에 업로드 로직 추가
      sellerId: req.userId
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function listProducts(req, res) {
  const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
  res.json(products);
}

async function getProduct(req, res) {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
  res.json(product);
}

module.exports = { createProduct, listProducts, getProduct };
