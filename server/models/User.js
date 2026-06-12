const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BirthProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true }, // YYYY-MM-DD
  tob: { type: String, required: true }, // HH:MM
  pob: { type: String, required: true }, // City name
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true },
  savedProfiles: [BirthProfileSchema],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
