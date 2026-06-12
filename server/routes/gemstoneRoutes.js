const express = require('express');
const router = express.Router();
const {
  getAllGemstones,
  getGemstoneByName
} = require('../controllers/gemstoneController');

router.get('/', getAllGemstones);
router.get('/:name', getGemstoneByName);

module.exports = router;
