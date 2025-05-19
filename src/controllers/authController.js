// src/controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sendVerificationCode, verifyCode } = require('../utils/twilio');

// JWT 토큰 생성
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '7d' }
  );
};

// 사용자 등록
exports.register = async (req, res) => {
  try {
    // 입력 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password, username, phone, isVerified } = req.body;
    
    // 전화번호 인증 확인
    if (!isVerified) {
      return res.status(400).json({ message: '전화번호 인증이 필요합니다.' });
    }
    
    // 이메일 중복 확인
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }
    
    // 전화번호 중복 확인
    const existingPhone = await User.findByPhone(phone);
    if (existingPhone) {
      return res.status(400).json({ message: '이미 등록된 전화번호입니다.' });
    }
    
    // 사용자 생성
    const userId = await User.create({ email, password, username, phone });
    
    // 토큰 생성
    const token = generateToken(userId);
    
    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: userId,
        email,
        username
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '서버 오류가 발생했습니다.' 
    });
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    // 입력 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    
    // 사용자 확인
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }
    
    // 비밀번호 확인
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }
    
    // 토큰 생성
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '서버 오류가 발생했습니다.' 
    });
  }
};

// 전화번호 인증 코드 발송
exports.sendVerificationSMS = async (req, res) => {
  try {
    // 입력 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ 
        success: false,
        message: '전화번호를 입력해주세요.' 
      });
    }
    
    // 인증 코드 발송
    const result = await sendVerificationCode(phone);
    
    if (!result.success) {
      return res.status(500).json({ 
        success: false,
        message: '인증 코드 발송에 실패했습니다.', 
        error: result.error 
      });
    }
    
    res.status(200).json({
      success: true,
      message: '인증 코드가 발송되었습니다.',
      status: result.status
    });
  } catch (error) {
    console.error('인증 코드 발송 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '서버 오류가 발생했습니다.' 
    });
  }
};

// 인증 코드 확인
exports.verifyPhoneCode = async (req, res) => {
  try {
    // 입력 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ 
        success: false,
        message: '전화번호와 인증 코드를 모두 입력해주세요.' 
      });
    }
    
    // 인증 코드 확인
    const result = await verifyCode(phone, code);
    
    if (!result.success) {
      return res.status(500).json({ 
        success: false,
        message: '인증 코드 확인에 실패했습니다.', 
        error: result.error 
      });
    }
    
    if (!result.valid) {
      return res.status(400).json({ 
        success: false,
        message: '유효하지 않은 인증 코드입니다.', 
        status: result.status 
      });
    }
    
    res.status(200).json({
      success: true,
      message: '전화번호 인증이 완료되었습니다.',
      verified: true,
      status: result.status
    });
  } catch (error) {
    console.error('인증 코드 확인 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '서버 오류가 발생했습니다.' 
    });
  }
};

// 사용자 정보 조회
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: '사용자를 찾을 수 없습니다.' 
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '서버 오류가 발생했습니다.' 
    });
  }
};