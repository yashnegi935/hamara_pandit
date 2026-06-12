/**
 * GemGuide AI - Calculations Test Script
 * 
 * Run using: node backend/utils/testCalculations.js
 */

const { generateBirthChart } = require('./astrologyCalculator');
const { analyzePlanetaryPositions } = require('./planetaryRules');

const testBirthData = {
  name: 'Yash Negi',
  dob: '1995-10-15',
  tob: '14:30',
  pob: 'New Delhi'
};

console.log('--- TESTING ASTROLOGICAL ENGINE ---');
console.log(`Input: Name=${testBirthData.name}, DOB=${testBirthData.dob}, TOB=${testBirthData.tob}, POB=${testBirthData.pob}\n`);

try {
  const chart = generateBirthChart(testBirthData.dob, testBirthData.tob, testBirthData.pob);
  console.log('1. Birth Chart Calculations Result: SUCCESS');
  console.log(`   Lagna (Ascendant): ${chart.chartData.ascendant.sign} at ${chart.chartData.ascendant.degree}°`);
  console.log('   Planetary placements computed:');
  chart.chartData.planets.forEach(p => {
    console.log(`     - ${p.name.padEnd(8)}: ${p.sign.padEnd(12)} (House ${p.house}) ${p.isCombust ? '[COMBUST]' : ''} ${p.isRetrograde ? '[RETROGRADE]' : ''}`);
  });

  const analysisReport = analyzePlanetaryPositions(chart);
  console.log('\n2. BPHS & Lal Kitab Analysis Result: SUCCESS');
  console.log('   Lagna Lord:', analysisReport.recommendations.lifeStone.planet, `(${analysisReport.recommendations.lifeStone.gemstone})`);
  console.log('   Bhagya Lord:', analysisReport.recommendations.luckStone.planet, `(${analysisReport.recommendations.luckStone.gemstone})`);
  console.log('   Punya Lord:', analysisReport.recommendations.intellectStone.planet, `(${analysisReport.recommendations.intellectStone.gemstone})`);
  
  if (analysisReport.recommendations.remedialStones.length > 0) {
    console.log('   Active Transit Alerts:');
    analysisReport.recommendations.remedialStones.forEach(rem => {
      console.log(`     - ${rem.type}: ${rem.remedy}`);
    });
  } else {
    console.log('   Active Transit Alerts: None');
  }

  console.log('\n   Goal Recommendations:');
  Object.keys(analysisReport.recommendations.categoryRecommendations).forEach(cat => {
    const rec = analysisReport.recommendations.categoryRecommendations[cat][0];
    console.log(`     - ${cat.padEnd(15)}: ${rec.gemstone.padEnd(18)} (Planet: ${rec.planet})`);
  });

  console.log('\n--- ALL ASTROLOGY CALCULATIONS PASSED SUCCESSFULLY! ---');
} catch (error) {
  console.error('\n!!! CALCULATIONS TEST FAILED !!!');
  console.error(error);
  process.exit(1);
}
