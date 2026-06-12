const Gemstone = require('../models/Gemstone');

/**
 * @desc    Get all gemstones details
 * @route   GET /api/gemstones
 * @access  Public
 */
const getAllGemstones = async (req, res, next) => {
  try {
    const gemstones = await Gemstone.find({}).sort({ name: 1 });
    res.json(gemstones);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details of a single gemstone by name
 * @route   GET /api/gemstones/:name
 * @access  Public
 */
const getGemstoneByName = async (req, res, next) => {
  try {
    const gemstone = await Gemstone.findOne({ name: { $regex: new RegExp(`^${req.params.name}$`, 'i') } });
    
    if (!gemstone) {
      res.status(404);
      throw new Error(`Gemstone '${req.params.name}' not found`);
    }

    res.json(gemstone);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGemstones,
  getGemstoneByName
};
