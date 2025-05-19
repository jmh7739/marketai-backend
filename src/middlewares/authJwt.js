const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Authorization header required' });
  const token = h.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = { verifyToken };
