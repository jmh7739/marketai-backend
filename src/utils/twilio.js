// marketai-backend/src/utils/twilio.js
const twilio = require('twilio');
require('dotenv').config();

// Twilio 계정 정보
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Twilio 클라이언트 초기화
const client = twilio(accountSid, authToken);

// 인증 코드 발송
const sendVerificationCode = async (phoneNumber) => {
  try {
    // 국제 전화 형식으로 변환 (한국 번호의 경우)
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: formattedNumber, channel: 'sms' });
    
    return {
      success: true,
      status: verification.status
    };
  } catch (error) {
    console.error('인증 코드 발송 오류:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 인증 코드 확인
const verifyCode = async (phoneNumber, code) => {
  try {
    // 국제 전화 형식으로 변환
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: formattedNumber, code });
    
    return {
      success: true,
      valid: verification.status === 'approved',
      status: verification.status
    };
  } catch (error) {
    console.error('인증 코드 확인 오류:', error);
    return {
      success: false,
      valid: false,
      error: error.message
    };
  }
};

// 전화번호 형식 변환 (한국 번호 기준)
const formatPhoneNumber = (phoneNumber) => {
  // 전화번호에서 하이픈 제거
  let cleaned = phoneNumber.replace(/-/g, '');
  
  // 앞에 0이 있으면 제거
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // 국가 코드 추가 (한국: +82)
  return `+82${cleaned}`;
};

module.exports = {
  sendVerificationCode,
  verifyCode
};