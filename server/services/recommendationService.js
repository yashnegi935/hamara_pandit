/**
 * GemGuide AI - Recommendation Service
 * 
 * Generates gemstone recommendations using separate rule engines
 * and enriches them with descriptions, mantras, and precautions from the database.
 */

const Gemstone = require('../models/Gemstone');
const { evaluateCareer } = require('../rules/careerRules');
const { evaluateWealth } = require('../rules/wealthRules');
const { evaluateRelationship } = require('../rules/relationshipRules');
const { evaluateMarriage } = require('../rules/marriageRules');
const { evaluateEducation } = require('../rules/educationRules');
const { evaluateHealth } = require('../rules/healthRules');

const SIGN_LORDS = {
  'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
  'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
  'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
};

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const PLANET_TO_GEM = {
  'Sun': 'Ruby', 'Moon': 'Pearl', 'Mars': 'Red Coral', 'Mercury': 'Emerald',
  'Jupiter': 'Yellow Sapphire', 'Venus': 'Diamond', 'Saturn': 'Blue Sapphire',
  'Rahu': 'Hessonite', 'Ketu': "Cat's Eye"
};

/**
 * Calculates the lord of a given house number (1-12) based on the Ascendant sign.
 */
const getHouseLord = (houseNum, lagnaSign) => {
  const lagnaIndex = ZODIAC_SIGNS.indexOf(lagnaSign);
  const houseSignIndex = (lagnaIndex + houseNum - 1) % 12;
  const houseSign = ZODIAC_SIGNS[houseSignIndex];
  return SIGN_LORDS[houseSign];
};

/**
 * Evaluates the rules using coordinates, dasha, and transits from the Vedic Astrology API.
 */
const generateRecommendations = (chartData, dashaData, transitData, navPlanets) => {
  const { ascendant, planets } = chartData;
  const ascSignName = ascendant.sign;
  const lagnaLord = SIGN_LORDS[ascSignName];
  
  // Calculate house lords for analysis
  const lords = {
    1: lagnaLord,
    2: getHouseLord(2, ascSignName),
    4: getHouseLord(4, ascSignName),
    5: getHouseLord(5, ascSignName),
    7: getHouseLord(7, ascSignName),
    9: getHouseLord(9, ascSignName),
    10: getHouseLord(10, ascSignName),
    11: getHouseLord(11, ascSignName),
    12: getHouseLord(12, ascSignName)
  };

  // Identify Yogakaraka
  const ascSignNum = ZODIAC_SIGNS.indexOf(ascSignName) + 1;
  let yogakaraka = null;
  if (ascSignNum === 2) yogakaraka = 'Saturn';
  else if (ascSignNum === 4) yogakaraka = 'Mars';
  else if (ascSignNum === 5) yogakaraka = 'Mars';
  else if (ascSignNum === 7) yogakaraka = 'Saturn';
  else if (ascSignNum === 10) yogakaraka = 'Venus';
  else if (ascSignNum === 11) yogakaraka = 'Venus';

  // Identify Benefics & Malefics
  const functionalBenefics = [lagnaLord, lords[5], lords[9]];
  if (yogakaraka) functionalBenefics.push(yogakaraka);

  const functionalMalefics = [];
  const dusthanaLords = [
    getHouseLord(6, ascSignName),
    getHouseLord(8, ascSignName),
    getHouseLord(12, ascSignName)
  ];
  dusthanaLords.forEach(lord => {
    if (!functionalBenefics.includes(lord) && !functionalMalefics.includes(lord)) {
      functionalMalefics.push(lord);
    }
  });
  if (!functionalMalefics.includes('Rahu')) functionalMalefics.push('Rahu');
  if (!functionalMalefics.includes('Ketu')) functionalMalefics.push('Ketu');

  // Compute Dignity (Exaltation/Debilitation) based on Sign
  const PLANET_EXALT_DEBIL = {
    'Sun': { exalt: 1, debil: 7 },
    'Moon': { exalt: 2, debil: 8 },
    'Mars': { exalt: 10, debil: 4 },
    'Mercury': { exalt: 6, debil: 12 },
    'Jupiter': { exalt: 4, debil: 10 },
    'Venus': { exalt: 12, debil: 6 },
    'Saturn': { exalt: 7, debil: 1 },
    'Rahu': { exalt: 3, debil: 9 },
    'Ketu': { exalt: 9, debil: 3 }
  };

  const planetsWithDignity = planets.map(p => {
    const pSignNum = ZODIAC_SIGNS.indexOf(p.sign) + 1;
    const statusInfo = PLANET_EXALT_DEBIL[p.name];
    let dignity = 'Neutral';

    if (statusInfo) {
      if (statusInfo.exalt === pSignNum) dignity = 'Exalted';
      else if (statusInfo.debil === pSignNum) dignity = 'Debilitated';
    }

    return {
      ...p,
      dignity
    };
  });

  const analysisData = {
    ascendantSign: ascSignName,
    lagnaLord,
    yogakaraka,
    functionalBenefics,
    functionalMalefics,
    planets: planetsWithDignity
  };

  // Core Anukul Stones (Life, Luck, Intellect)
  const lifeStone = {
    planet: lagnaLord,
    gemstone: PLANET_TO_GEM[lagnaLord],
    type: 'Life Stone (Lagna Lord)',
    reason: `Lagna Lord represents your health, personality, and overall life path. Wearing a ${PLANET_TO_GEM[lagnaLord]} strengthens your self-confidence, physical vitality, and immunity.`
  };

  const luckStone = {
    planet: lords[9],
    gemstone: PLANET_TO_GEM[lords[9]],
    type: 'Luck Stone (Bhagya Lord)',
    reason: `The 9th house lord represents luck, fortune, and spiritual inclinations. Wearing a ${PLANET_TO_GEM[lords[9]]} activates your luck, brings opportunities, and enhances spiritual growth.`
  };

  const intellectStone = {
    planet: lords[5],
    gemstone: PLANET_TO_GEM[lords[5]],
    type: 'Intellect Stone (Punya Lord)',
    reason: `The 5th house lord rules intelligence, memory, education, and creative talents. Wearing an ${PLANET_TO_GEM[lords[5]]} improves concentration, academic success, and decision-making.`
  };

  // Helper to apply Lal Kitab restrictions
  const applyRestrictions = (stoneObj) => {
    const planetData = planetsWithDignity.find(p => p.name === stoneObj.planet);
    if (!planetData) return stoneObj;

    const warnings = [];
    const cautions = [];

    if (planetData.house === 8) {
      warnings.push(`Lal Kitab Warning: ${stoneObj.planet} is placed in the 8th House. Wearing its gemstone (${stoneObj.gemstone}) is strictly prohibited as it can trigger sudden obstacles, losses, or health crises.`);
    }
    if (planetData.house === 6) {
      cautions.push(`Lal Kitab Caution: ${stoneObj.planet} is in the 6th House. Wearing ${stoneObj.gemstone} may increase conflicts, disputes, or debts.`);
    }
    if (planetData.isCombust) {
      cautions.push(`Astrology Note: ${stoneObj.planet} is combust (burned by the Sun). Wearing ${stoneObj.gemstone} is recommended to restore its depleted energy.`);
    }
    if (planetData.isRetrograde) {
      cautions.push(`Astrology Note: ${stoneObj.planet} is retrograde. Wearing ${stoneObj.gemstone} helps direct its energy more smoothly.`);
    }
    if (planetData.dignity === 'Debilitated') {
      cautions.push(`Astrology Note: ${stoneObj.planet} is debilitated in your chart. Wearing ${stoneObj.gemstone} can support its weak state, but consult an astrologer to ensure it doesn't amplify negative traits.`);
    }

    return {
      ...stoneObj,
      warnings: warnings.length > 0 ? warnings : null,
      cautions: cautions.length > 0 ? cautions : null,
      isAllowed: warnings.length === 0
    };
  };

  const finalLifeStone = applyRestrictions(lifeStone);
  const finalLuckStone = applyRestrictions(luckStone);
  const finalIntellectStone = applyRestrictions(intellectStone);

  // Transit Saturn remedies (Sade Sati / Dhayya)
  const transitRemedies = [];
  if (transitData && transitData.sadeSatiActive) {
    transitRemedies.push({
      type: 'Transit (Sade Sati Active)',
      planet: 'Saturn',
      remedy: 'Recite Hanuman Chalisa daily, donate black sesame seeds, and wear an Iron Ring on your middle finger on Saturdays.',
      description: 'Saturn is currently transiting a sensitive house (12th, 1st, or 2nd) from your natal Moon. Recommending charitable acts and prayers to ward off mental stress.'
    });
  }

  // Business and Spirituality helper rules
  const getGoalStone = (goalName, primaryHouseLords, fallbackPlanets) => {
    const potentialPlanets = [...primaryHouseLords];
    if (yogakaraka && !potentialPlanets.includes(yogakaraka)) {
      potentialPlanets.push(yogakaraka);
    }
    fallbackPlanets.forEach(p => {
      if (!potentialPlanets.includes(p)) potentialPlanets.push(p);
    });

    for (const pName of potentialPlanets) {
      const pData = planetsWithDignity.find(p => p.name === pName);
      if (pData && pData.house !== 8 && pData.house !== 12 && !functionalMalefics.includes(pName)) {
        return {
          planet: pName,
          gemstone: PLANET_TO_GEM[pName],
          reason: `Recommended because ${pName} rules key houses for ${goalName} in your chart and acts as a supportive benefic energy.`,
          isAllowed: true
        };
      }
    }

    return {
      planet: lagnaLord,
      gemstone: PLANET_TO_GEM[lagnaLord],
      reason: `As a protective measure, your Life Stone (${PLANET_TO_GEM[lagnaLord]}) is recommended to strengthen your chart overall and support your ${goalName}.`,
      isAllowed: true
    };
  };

  // Run the 6 separated rule engines
  const careerRec = evaluateCareer(analysisData, dashaData, transitData);
  const wealthRec = evaluateWealth(analysisData, dashaData, transitData);
  const relationshipRec = evaluateRelationship(analysisData, dashaData, transitData);
  const marriageRec = evaluateMarriage(analysisData, dashaData, transitData, navPlanets);
  const educationRec = evaluateEducation(analysisData, dashaData, transitData);
  const healthRec = evaluateHealth(analysisData, dashaData, transitData);

  const businessRec = getGoalStone('Business', [lords[7], 'Mercury'], [lagnaLord]);
  const spiritualityRec = getGoalStone('Spiritual Growth', [lords[9], 'Jupiter'], ['Ketu', lagnaLord]);

  const categoryRecommendations = {
    career: [careerRec],
    business: [businessRec],
    wealth: [wealthRec],
    marriage: [marriageRec],
    relationships: [relationshipRec],
    education: [educationRec],
    health: [healthRec],
    spirituality: [spiritualityRec]
  };

  return {
    lifeStone: finalLifeStone,
    luckStone: finalLuckStone,
    intellectStone: finalIntellectStone,
    remedialStones: transitRemedies,
    categoryRecommendations,
    analysis: {
      ascendantSign: ascSignName,
      lagnaLord,
      yogakaraka,
      functionalBenefics,
      functionalMalefics,
      planets
    }
  };
};

/**
 * Enriches calculated recommendations with detailed gemstone data from the database.
 */
const enrichRecommendations = async (rawRecommendations) => {
  const recommendedGems = new Set();
  
  if (rawRecommendations.lifeStone?.gemstone) {
    recommendedGems.add(rawRecommendations.lifeStone.gemstone);
  }
  if (rawRecommendations.luckStone?.gemstone) {
    recommendedGems.add(rawRecommendations.luckStone.gemstone);
  }
  if (rawRecommendations.intellectStone?.gemstone) {
    recommendedGems.add(rawRecommendations.intellectStone.gemstone);
  }

  Object.values(rawRecommendations.categoryRecommendations).forEach(categoryList => {
    categoryList.forEach(rec => {
      if (rec.gemstone) recommendedGems.add(rec.gemstone);
    });
  });

  const gemstoneDataList = await Gemstone.find({
    name: { $in: Array.from(recommendedGems) }
  });

  const gemstoneMap = {};
  gemstoneDataList.forEach(gem => {
    gemstoneMap[gem.name] = gem;
  });

  const enrich = (stoneObj) => {
    if (!stoneObj || !stoneObj.gemstone) return stoneObj;
    const dbData = gemstoneMap[stoneObj.gemstone];
    if (!dbData) return stoneObj;

    return {
      ...stoneObj,
      details: {
        sanskritName: dbData.sanskritName,
        hindiName: dbData.hindiName,
        deity: dbData.deity,
        metal: dbData.metal,
        finger: dbData.finger,
        day: dbData.day,
        mantra: dbData.mantra,
        color: dbData.color,
        description: dbData.description,
        benefits: dbData.benefits,
        precautions: dbData.precautions,
        weightRule: dbData.weightRule,
        wearingInstructions: dbData.wearingInstructions
      }
    };
  };

  const lifeStone = enrich(rawRecommendations.lifeStone);
  const luckStone = enrich(rawRecommendations.luckStone);
  const intellectStone = enrich(rawRecommendations.intellectStone);

  const categoryRecommendations = {};
  for (const [category, recList] of Object.entries(rawRecommendations.categoryRecommendations)) {
    categoryRecommendations[category] = recList.map(rec => enrich(rec));
  }

  return {
    lifeStone,
    luckStone,
    intellectStone,
    remedialStones: rawRecommendations.remedialStones,
    categoryRecommendations
  };
};

module.exports = {
  generateRecommendations,
  enrichRecommendations
};
