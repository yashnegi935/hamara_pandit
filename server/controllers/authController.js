const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'gemguide_ai_secret_key_12345', {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please enter all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile details
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save a birth profile to user dashboard
 * @route   POST /api/auth/profiles
 * @access  Private
 */
const saveBirthProfile = async (req, res, next) => {
  try {
    const { name, dob, tob, pob, gender } = req.body;

    if (!name || !dob || !tob || !pob) {
      res.status(400);
      throw new Error('Missing required birth details');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Add profile
    user.savedProfiles.push({ name, dob, tob, pob, gender });
    await user.save();

    res.status(201).json({
      message: 'Birth profile saved successfully',
      profiles: user.savedProfiles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a saved birth profile
 * @route   DELETE /api/auth/profiles/:id
 * @access  Private
 */
const deleteBirthProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Remove by profile ID
    user.savedProfiles = user.savedProfiles.filter(p => p._id.toString() !== req.params.id);
    await user.save();

    res.json({
      message: 'Profile removed successfully',
      profiles: user.savedProfiles
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  saveBirthProfile,
  deleteBirthProfile
};
