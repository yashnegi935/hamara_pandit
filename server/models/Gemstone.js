const mongoose = require('mongoose');

const GemstoneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. Ruby
  sanskritName: { type: String, required: true }, // e.g. Manikya
  hindiName: { type: String, required: true }, // e.g. Manik
  rulingPlanet: { type: String, required: true }, // e.g. Sun
  deity: { type: String, required: true }, // e.g. Surya
  metal: { type: String, required: true }, // e.g. Gold / Copper
  finger: { type: String, required: true }, // e.g. Ring Finger
  day: { type: String, required: true }, // e.g. Sunday Morning
  mantra: { type: String, required: true }, // Vedic Mantra
  color: { type: String, required: true }, // Hex code or description
  description: { type: String, required: true },
  benefits: [{ type: String }],
  precautions: [{ type: String }],
  weightRule: { type: String, required: true }, // e.g. 1 Carat per 10 kg of body weight
  wearingInstructions: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gemstone', GemstoneSchema);
