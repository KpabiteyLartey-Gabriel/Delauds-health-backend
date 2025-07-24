const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

// Submit new patient form
router.post('/', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: 'Error saving patient', error: err });
  }
});

// Get all patients (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Update appointment for a patient (admin only)
router.put('/:id/appointment', auth, async (req, res) => {
  try {
    const { appointmentDate, notes } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { appointmentDate, notes },
      { new: true }
    );
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: 'Error updating appointment' });
  }
});

module.exports = router; 