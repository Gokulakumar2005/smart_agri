const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    farmLocation: {
      label: { type: String, default: '' },
      lat: { type: Number, default: 0 },
      lon: { type: Number, default: 0 },
    },
    farmingPractice: {
      type: String,
      enum: ['conventional', 'organic', 'natural'],
      default: 'conventional',
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
