require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function createAdmin() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI must be set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }
  let admin = await Admin.findOne({ email });
  if (admin) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const hashed = await bcrypt.hash(password, 10);
  admin = new Admin({ email, password: hashed });
  await admin.save();
  console.log('Admin created:', email);
  process.exit(0);
}

createAdmin(); 