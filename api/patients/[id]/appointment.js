import mongoose from 'mongoose';
import Patient from '../../../models/Patient.js';
import { verifyAdminToken } from '../../../middleware/auth.js';

if (!global.mongoose) {
  global.mongoose = mongoose.connect(process.env.MONGO_URI);
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://delauds-health.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'PUT') {
    // Admin only: Update appointment for a patient
    const { error, admin } = verifyAdminToken(req);
    if (error) return res.status(error.status).json({ message: error.message });
    const { appointmentDate, notes } = req.body;
    const id = req.query.id;
    try {
      const patient = await Patient.findByIdAndUpdate(
        id,
        { appointmentDate, notes },
        { new: true }
      );
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (err) {
      res.status(400).json({ message: 'Error updating appointment', error: err });
    }
    return;
  }

  res.setHeader('Allow', ['PUT', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 