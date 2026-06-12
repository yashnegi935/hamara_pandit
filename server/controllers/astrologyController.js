const RecommendationLog = require('../models/RecommendationLog');
const astrologyService = require('../services/astrologyService');
const recommendationService = require('../services/recommendationService');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Helper to optionally parse a JWT token from headers if present
 */
const getOptionalUser = async (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gemguide_ai_secret_key_12345');
      return await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Ignore errors for guest requests
      return null;
    }
  }
  return null;
};

/**
 * @desc    Generate birth chart, analyze planets, and recommend gemstones
 * @route   POST /api/astrology/recommend
 * @access  Public (Optionally authenticated)
 */
const generateRecommendation = async (req, res, next) => {
  try {
    const { name, dob, tob, pob, gender } = req.body;

    if (!name || !dob || !tob || !pob) {
      res.status(400);
      throw new Error('Please enter all required fields (Name, DOB, TOB, POB)');
    }

    // 1. Generate core report (chart and basic planetary calculations from external API)
    const report = await astrologyService.getAstrologyReport({ name, dob, tob, pob, gender });

    // 2. Enrich recommendations with full gemstone details from Database
    const enrichedRecs = await recommendationService.enrichRecommendations(report.recommendations);
    report.recommendations = enrichedRecs;

    // 3. Save to Recommendation Logs
    const optionalUser = await getOptionalUser(req);
    const logData = {
      user: optionalUser ? optionalUser._id : null,
      birthData: { 
        name, 
        dob, 
        tob, 
        pob, 
        gender,
        latitude: report.birthInfo.latitude,
        longitude: report.birthInfo.longitude,
        timezone: report.birthInfo.timezone
      },
      chartData: report.chartData,
      recommendations: enrichedRecs,
      rawApiResponse: report.rawApiResponse
    };

    const savedLog = await RecommendationLog.create(logData);

    // Return the report along with the saved log ID
    res.json({
      logId: savedLog._id,
      ...report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recommendation history logs for current user
 * @route   GET /api/astrology/history
 * @access  Private
 */
const getUserHistory = async (req, res, next) => {
  try {
    const history = await RecommendationLog.find({ user: req.user._id })
      .select('birthData createdAt')
      .sort({ createdAt: -1 });
    
    res.json(history);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed report for a specific calculation log
 * @route   GET /api/astrology/report/:id
 * @access  Public
 */
const getReportDetails = async (req, res, next) => {
  try {
    const log = await RecommendationLog.findById(req.params.id);
    if (!log) {
      res.status(404);
      throw new Error('Report log not found');
    }

    // Reconstruct the report response from the stored DB document (saving API quota)
    const report = {
      logId: log._id,
      birthInfo: {
        name: log.birthData.name,
        dob: log.birthData.dob,
        tob: log.birthData.tob,
        pob: log.birthData.pob,
        gender: log.birthData.gender,
        latitude: log.birthData.latitude,
        longitude: log.birthData.longitude,
        timezone: log.birthData.timezone
      },
      chartData: log.chartData,
      recommendations: log.recommendations,
      rawApiResponse: log.rawApiResponse
    };

    if (log.rawApiResponse) {
      report.currentDasha = log.rawApiResponse.dasha || { mahadasha: 'Unknown', antardasha: 'Unknown' };
      report.transitData = log.rawApiResponse.transit || { sadeSatiActive: false };
      report.navPlanets = log.rawApiResponse.navPlanets || [];
      
      // Calculate analysis on-the-fly from stored data
      const { generateRecommendations } = require('../services/recommendationService');
      const recResults = generateRecommendations(log.chartData, report.currentDasha, report.transitData, report.navPlanets);
      report.analysis = recResults.analysis;
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateRecommendation,
  getUserHistory,
  getReportDetails
};
