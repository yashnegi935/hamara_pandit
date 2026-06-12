const mongoose = require('mongoose');

const RecommendationLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for guests
  },
  birthData: {
    name: { type: String, required: true },
    dob: { type: String, required: true },
    tob: { type: String, required: true },
    pob: { type: String, required: true },
    gender: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number },
    timezone: { type: Number }
  },
  chartData: {
    ascendant: {
      sign: { type: String },
      degree: { type: Number },
      house: { type: Number }
    },
    planets: [{
      name: { type: String },
      sign: { type: String },
      degree: { type: Number },
      house: { type: Number },
      isCombust: { type: Boolean },
      isRetrograde: { type: Boolean }
    }]
  },
  recommendations: {
    lifeStone: { type: Object }, // Lagna Lord
    luckStone: { type: Object },  // 9th Lord
    intellectStone: { type: Object }, // 5th Lord
    remedialStones: [{ type: Object }], // Lal Kitab or transit remedies
    categoryRecommendations: {
      career: [{ type: Object }],
      business: [{ type: Object }],
      wealth: [{ type: Object }],
      marriage: [{ type: Object }],
      relationships: [{ type: Object }],
      education: [{ type: Object }],
      health: [{ type: Object }],
      spirituality: [{ type: Object }]
    }
  },
  rawApiResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RecommendationLog', RecommendationLogSchema);
