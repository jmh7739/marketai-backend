// src/app.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { pool } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    await pool.getConnection();
    console.log('DB connected');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// 라우트
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/auth', authRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'MarketAI API 서버에 오신 것을 환영합니다!' });
});

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || '서버 오류가 발생했습니다.'
  });
});

// 서버 시작
const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;