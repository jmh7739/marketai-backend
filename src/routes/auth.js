// src/routes/auth.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authJwt');

// 회원가입
router.post('/register', [
  check('email', '유효한 이메일을 입력해주세요').isEmail(),
  check('password', '비밀번호는 6자 이상이어야 합니다').isLength({ min: 6 }),
  check('username', '사용자 이름은 필수입니다').not().isEmpty(),
  check('phone', '유효한 전화번호를 입력해주세요').isMobilePhone('ko-KR'),
  check('isVerified', '전화번호 인증이 필요합니다').equals('true')
], authController.register);

// 로그인
router.post('/login', [
  check('email', '유효한 이메일을 입력해주세요').isEmail(),
  check('password', '비밀번호는 필수입니다').exists()
], authController.login);

// 인증 코드 발송
router.post('/send-verification', [
  check('phone', '유효한 전화번호를 입력해주세요').isMobilePhone('ko-KR')
], authController.sendVerificationSMS);

// 인증 코드 확인
router.post('/verify-code', [
  check('phone', '유효한 전화번호를 입력해주세요').isMobilePhone('ko-KR'),
  check('code', '인증 코드는 필수입니다').not().isEmpty()
], authController.verifyPhoneCode);

// 내 정보 조회
router.get('/me', authMiddleware, authController.getProfile);

// 테스트 라우트
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API is working!' });
});

module.exports = router;