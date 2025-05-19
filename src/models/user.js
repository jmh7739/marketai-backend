// marketai-backend/src/models/user.js
const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // 기존 코드들...

  // 전화번호로 사용자 찾기
  static async findByPhone(phone) {
    const query = `SELECT * FROM users WHERE phone = ?`;
    
    try {
      const [rows] = await pool.execute(query, [phone]);
      return rows[0];
    } catch (error) {
      throw new Error(`사용자 검색 오류: ${error.message}`);
    }
  }

  // 다른 메서드들...
}

module.exports = User;