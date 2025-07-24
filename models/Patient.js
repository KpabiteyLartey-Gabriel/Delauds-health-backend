import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  fullName: String,
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  phoneNumber: String,
  emailAddress: String,
  occupation: String,
  address: String,
  diabetes: Boolean,
  hypertension: Boolean,
  asthma: Boolean,
  arthritis: Boolean,
  ulcers: Boolean,
  sicklecell: Boolean,
  cancer: Boolean,
  thyroid: Boolean,
  otherConditions: String,
  currentMedications: String,
  surgeries: String,
  smoking: String,
  alcohol: String,
  exercise: String,
  diet: String,
  otherDiet: String,
  allergies: String,
  submittedAt: { type: Date, default: Date.now },
  appointmentDate: { type: Date, default: null },
  notes: { type: String, default: '' },
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema); 