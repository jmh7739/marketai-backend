// marketai-backend/src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'marketai',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('데이터베이스 연결 성공');
    connection.release();
    return true;
  } catch (error) {
    console.error('데이터베이스 연결 오류:', error);
    return false;
  }
};

module.exports = { pool, testConnection };