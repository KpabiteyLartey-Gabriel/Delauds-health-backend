import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../../models/Admin.js';
import { verifyAdminToken } from '../../middleware/auth.js';

if (!global.mongoose) {
  global.mongoose = mongoose.connect(process.env.MONGO_URI);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://delauds-health.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { error, admin } = verifyAdminToken(req);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  const { currentPassword, newPassword, confirmNewPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: 'Current password and new password are required',
    });
  }

  if (confirmNewPassword && newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: 'New passwords do not match' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      message: 'New password must be at least 8 characters long',
    });
  }

  try {
    const adminDoc = await Admin.findById(admin.id);
    if (!adminDoc) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      adminDoc.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, adminDoc.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: 'New password must be different from the current password',
      });
    }

    adminDoc.password = await bcrypt.hash(newPassword, 10);
    await adminDoc.save();

    res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}
