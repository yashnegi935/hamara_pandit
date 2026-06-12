/**
 * GemGuide AI - Geocoding & Astrology API Integration Test Script
 * 
 * Run using: node backend/utils/testApiIntegration.js
 */

const dotenv = require('dotenv');
const path = require('path');
const { geocodePlace } = require('../services/geocodingService');
const { getAstrologyReport } = require('../services/astrologyService');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testBirthData = {
  name: 'Yash Negi',
  dob: '2004-08-15',
  tob: '14:32',
  pob: 'Dehradun',
  gender: 'male'
};

const runTest = async () => {
  console.log('--- TESTING GEOCODING & ASTROLOGY API INTEGRATION ---');
  console.log(`Input: Name=${testBirthData.name}, DOB=${testBirthData.dob}, TOB=${testBirthData.tob}, POB=${testBirthData.pob}\n`);

  try {
    // 1. Test Geocoding Service
    console.log('1. Testing Geocoding Service...');
    const geoResult = await geocodePlace(testBirthData.pob, testBirthData.dob, testBirthData.tob);
    console.log('   RESULT: SUCCESS');
    console.log(`   Latitude : ${geoResult.latitude}`);
    console.log(`   Longitude: ${geoResult.longitude}`);
    console.log(`   Timezone : ${geoResult.timezone} (Offset: GMT${geoResult.timezone >= 0 ? '+' : ''}${geoResult.timezone})`);
    console.log(`   Timezone Name: ${geoResult.timezoneName}\n`);

    // 2. Check Astrology API Credentials
    const apiKey = process.env.ASTROLOGY_API_KEY;
    if (!apiKey || apiKey.startsWith('your_') || apiKey === '') {
      console.log('2. Testing Astrology API Service...');
      console.log('   SKIPPED: ASTROLOGY_API_KEY is not defined in backend/.env.');
      console.log('   Please add a valid VedicAstroAPI key to run the live calculations test.');
      console.log('\n--- GEOCODING PASSED SUCCESSFULLY (Astrology API key missing) ---');
      return;
    }

    // 3. Test Live Astrology Service
    console.log('2. Testing Live Astrology API Service...');
    const report = await getAstrologyReport(testBirthData);
    console.log('   RESULT: SUCCESS');
    console.log(`   Ascendant (Lagna): ${report.chartData.ascendant.sign} at ${report.chartData.ascendant.degree}°`);
    console.log(`   Moon Sign: ${report.moonSign}`);
    console.log(`   Nakshatra: ${report.nakshatra}`);
    console.log(`   Mahadasha: ${report.currentDasha.mahadasha}`);
    console.log(`   Antardasha: ${report.currentDasha.antardasha}`);
    
    console.log('\n   Planets Placements Mapped:');
    report.chartData.planets.forEach(p => {
      console.log(`     - ${p.name.padEnd(8)}: ${p.sign.padEnd(12)} (House ${p.house}) ${p.isCombust ? '[COMBUST]' : ''} ${p.isRetrograde ? '[RETROGRADE]' : ''} ${p.nakshatra ? `(${p.nakshatra})` : ''}`);
    });

    console.log('\n   Primary Stones Recommendations:');
    console.log(`     - Life Stone     : ${report.recommendations.lifeStone.gemstone} (${report.recommendations.lifeStone.planet})`);
    console.log(`     - Luck Stone     : ${report.recommendations.luckStone.gemstone} (${report.recommendations.luckStone.planet})`);
    console.log(`     - Intellect Stone: ${report.recommendations.intellectStone.gemstone} (${report.recommendations.intellectStone.planet})`);

    console.log('\n   Specific Life Goal Recommendations:');
    Object.keys(report.recommendations.categoryRecommendations).forEach(cat => {
      const rec = report.recommendations.categoryRecommendations[cat][0];
      console.log(`     - ${cat.padEnd(15)}: ${rec.gemstone.padEnd(18)} (Planet: ${rec.planet})`);
    });

    console.log('\n--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
  } catch (error) {
    console.error('\n!!! INTEGRATION TEST FAILED !!!');
    console.error(error.message || error);
    process.exit(1);
  }
};

runTest();
