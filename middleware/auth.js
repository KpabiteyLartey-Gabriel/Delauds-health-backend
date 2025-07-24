import jwt from 'jsonwebtoken';

export function verifyAdminToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return { error: { status: 401, message: 'No token, authorization denied' } };
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { admin: decoded };
  } catch (err) {
    return { error: { status: 401, message: 'Token is not valid' } };
  }
} 