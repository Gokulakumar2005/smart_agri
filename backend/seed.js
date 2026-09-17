import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Crop from './models/Crop.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminName = process.env.ADMIN_NAME || 'Admin';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@smartagri.local';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartagri';
  await mongoose.connect(mongoUri);
};

const seedDefaultData = async () => {
  const cropsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'crops.json'), 'utf8'));

  const existingCropCount = await Crop.countDocuments();
  if (existingCropCount === 0) {
    await Crop.insertMany(cropsData);
    console.log('Default crop data inserted.');
  }

  const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      farmingPractice: 'conventional',
    });
    console.log('Default admin user created.');
  }
};

const seed = async () => {
  await connectDB();
  await seedDefaultData();
  console.log('Seed complete. Default admin user created or updated.');
  process.exit(0);
};

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  seed().catch((error) => {
    console.error('Seeding error:', error);
    process.exit(1);
  });
}

export { seedDefaultData, seed };
