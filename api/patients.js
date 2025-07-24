import mongoose from 'mongoose';
import Patient from '../models/Patient.js';
import { verifyAdminToken } from '../middleware/auth.js';

// Ensure MongoDB connection is reused
if (!global.mongoose) {
  global.mongoose = mongoose.connect(process.env.MONGO_URI);
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://delauds-health.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // Public: Submit new patient form
    try {
      const patient = new Patient(req.body);
      await patient.save();
      res.status(201).json(patient);
    } catch (err) {
      res.status(400).json({ message: 'Error saving patient', error: err });
    }
    return;
  }

  if (req.method === 'GET') {
    // Admin only: Get all patients
    const { error, admin } = verifyAdminToken(req);
    if (error) return res.status(error.status).json({ message: error.message });
    try {
      const patients = await Patient.find();
      res.json(patients);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching patients' });
    }
    return;
  }

  res.setHeader('Allow', ['POST', 'GET', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 