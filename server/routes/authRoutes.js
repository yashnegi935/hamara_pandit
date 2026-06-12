const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  saveBirthProfile,
  deleteBirthProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/profiles', protect, saveBirthProfile);
router.delete('/profiles/:id', protect, deleteBirthProfile);

module.exports = router;
