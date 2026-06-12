/**
 * GemGuide AI - Vedic & Lal Kitab Rules Engine
 * 
 * Houses rules for planet lordships, exaltations, debilitations, combustion,
 * and maps planets to life goals while applying Lal Kitab constraints and Sade Sati transit rules.
 */

const { ZODIAC_SIGNS } = require('./astrologyCalculator');

// Mapping of zodiac sign names to sign numbers (1-12)
const SIGN_NAME_TO_NUM = {};
ZODIAC_SIGNS.forEach((name, index) => {
  SIGN_NAME_TO_NUM[name] = index + 1;
});

// Sign Lords mapping (Vedic Astrology)
const SIGN_LORDS = {
  1: 'Mars',      // Aries
  2: 'Venus',     // Taurus
  3: 'Mercury',   // Gemini
  4: 'Moon',      // Cancer
  5: 'Sun',       // Leo
  6: 'Mercury',   // Virgo
  7: 'Venus',     // Libra
  8: 'Mars',      // Scorpio
  9: 'Jupiter',   // Sagittarius
  10: 'Saturn',   // Capricorn
  11: 'Saturn',   // Aquarius
  12: 'Jupiter'    // Pisces
};

// Planet Exaltation and Debilitation Signs
const PLANET_EXALT_DEBIL = {
  'Sun': { exalt: 1, debil: 7 },
  'Moon': { exalt: 2, debil: 8 },
  'Mars': { exalt: 10, debil: 4 },
  'Mercury': { exalt: 6, debil: 12 },
  'Jupiter': { exalt: 4, debil: 10 },
  'Venus': { exalt: 12, debil: 6 },
  'Saturn': { exalt: 7, debil: 1 },
  'Rahu': { exalt: 3, debil: 9 }, // Gemini exalt, Sag debil
  'Ketu': { exalt: 9, debil: 3 }  // Sag exalt, Gemini debil
};

// Gemstone mapping to planets
const PLANET_TO_GEM = {
  'Sun': 'Ruby',
  'Moon': 'Pearl',
  'Mars': 'Red Coral',
  'Mercury': 'Emerald',
  'Jupiter': 'Yellow Sapphire',
  'Venus': 'Diamond',
  'Saturn': 'Blue Sapphire',
  'Rahu': 'Hessonite',
  'Ketu': "Cat's Eye"
};

// Returns sign number for a given sign name
function getSignNumber(signName) {
  return SIGN_NAME_TO_NUM[signName] || 1;
}

// Helper to determine house lord of a birth chart
function getHouseLord(houseNum, ascSignNumber) {
  const signNum = ((ascSignNumber - 1 + houseNum - 1) % 12) + 1;
  return SIGN_LORDS[signNum];
}

/**
 * Analyzes the birth chart and applies BPHS + Lal Kitab rules
 */
function analyzePlanetaryPositions(chart) {
  const { ascendant, planets } = chart.chartData;
  const ascSignName = ascendant.sign;
  const ascSignNum = getSignNumber(ascSignName);
  const lagnaLord = SIGN_LORDS[ascSignNum];

  // 1. Identify lords of core houses
  const lords = {
    1: lagnaLord,
    2: getHouseLord(2, ascSignNum),
    4: getHouseLord(4, ascSignNum),
    5: getHouseLord(5, ascSignNum), // Intellect/Education Lord
    7: getHouseLord(7, ascSignNum), // Marriage/Partnership Lord
    9: getHouseLord(9, ascSignNum), // Luck/Bhagya Lord
    10: getHouseLord(10, ascSignNum), // Career/Karma Lord
    11: getHouseLord(11, ascSignNum), // Gains/Wealth Lord
    12: getHouseLord(12, ascSignNum)
  };

  // 2. Identify Yogakaraka (lord of both a Kendra (1,4,7,10) and Trikona (5,9))
  let yogakaraka = null;
  if (ascSignNum === 2) yogakaraka = 'Saturn'; // Taurus (owns 9, 10)
  else if (ascSignNum === 4) yogakaraka = 'Mars'; // Cancer (owns 5, 10)
  else if (ascSignNum === 5) yogakaraka = 'Mars'; // Leo (owns 4, 9)
  else if (ascSignNum === 7) yogakaraka = 'Saturn'; // Libra (owns 4, 5)
  else if (ascSignNum === 10) yogakaraka = 'Venus'; // Capricorn (owns 5, 10)
  else if (ascSignNum === 11) yogakaraka = 'Venus'; // Aquarius (owns 4, 9)

  // 3. Classify planets based on BPHS
  const functionalBenefics = new Set([lagnaLord, lords[5], lords[9]]);
  if (yogakaraka) functionalBenefics.add(yogakaraka);

  const functionalMalefics = new Set();
  const dusthanaLords = [getHouseLord(6, ascSignNum), getHouseLord(8, ascSignNum), getHouseLord(12, ascSignNum)];
  dusthanaLords.forEach(lord => {
    // If it's the lagna lord or a trikona lord, it stays benefic or neutral
    if (!functionalBenefics.has(lord)) {
      functionalMalefics.add(lord);
    }
  });

  // Rahu and Ketu generally follow their house lord's nature but can be malefic if placed poorly
  functionalMalefics.add('Rahu');
  functionalMalefics.add('Ketu');

  // 4. Map planets details
  const analyzedPlanets = planets.map(p => {
    const pSignNum = getSignNumber(p.sign);
    const statusInfo = PLANET_EXALT_DEBIL[p.name];
    let dignity = 'Neutral';

    if (statusInfo) {
      if (statusInfo.exalt === pSignNum) dignity = 'Exalted';
      else if (statusInfo.debil === pSignNum) dignity = 'Debilitated';
    }

    const isBenefic = functionalBenefics.has(p.name);
    const isMalefic = functionalMalefics.has(p.name);

    return {
      ...p,
      dignity,
      isFunctionalBenefic: isBenefic,
      isFunctionalMalefic: isMalefic,
      lordOfHouses: Object.keys(lords).filter(k => lords[k] === p.name).map(Number)
    };
  });

  // 5. Generate Gemstone Recommendations
  // Primary Auspicious Stones (Anukul Stones)
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

  // Apply Lal Kitab restrictions and health warnings
  const applyRestrictions = (stoneObj) => {
    const planetData = analyzedPlanets.find(p => p.name === stoneObj.planet);
    if (!planetData) return stoneObj;

    const warnings = [];
    const cautions = [];

    // Lal Kitab Rule: Gemstone of planet in 8th house must not be worn (causes sudden obstacles/death)
    if (planetData.house === 8) {
      warnings.push(`Lal Kitab Warning: ${stoneObj.planet} is placed in the 8th House. Wearing its gemstone (${stoneObj.gemstone}) is strictly prohibited as it can trigger sudden obstacles, losses, or health crises.`);
    }

    // Lal Kitab Rule: Gemstone of planet in 6th house (debts/enemies) can increase conflicts
    if (planetData.house === 6) {
      cautions.push(`Lal Kitab Caution: ${stoneObj.planet} is in the 6th House. Wearing ${stoneObj.gemstone} may increase conflicts, disputes, or debts unless worn under expert supervision.`);
    }

    // Combust Rule
    if (planetData.isCombust) {
      cautions.push(`Astrology Note: ${stoneObj.planet} is combust (burned by the Sun). Wearing ${stoneObj.gemstone} is highly recommended to restore the depleted energy of this planet.`);
    }

    // Debilitated Rule
    if (planetData.dignity === 'Debilitated') {
      cautions.push(`Astrology Note: ${stoneObj.planet} is in its debilitated sign (${planetData.sign}). Wearing ${stoneObj.gemstone} can support its weak state, but consult an astrologer to ensure it doesn't amplify negative traits.`);
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

  // 6. Sade Sati / Transit calculations (Transit Saturn relation to Natal Moon)
  const natalMoon = analyzedPlanets.find(p => p.name === 'Moon');
  const transitRemedies = [];
  if (natalMoon) {
    const moonSignNum = getSignNumber(natalMoon.sign);
    // Simulating Saturn transit. In June 2026, Saturn is transiting Pisces (Sign 12).
    // Sade Sati occurs when Saturn is in 12th, 1st, or 2nd house from natal Moon.
    // In terms of signs: Pisces is sign 12.
    // If natal Moon is in Aquarius (11), Pisces (12), or Aries (1), the user is undergoing Sade Sati.
    const transitSaturnSign = 12; // Pisces
    
    // Difference between Saturn transit sign and Moon sign
    const diff = (transitSaturnSign - moonSignNum + 12) % 12;
    
    if (diff === 11) {
      transitRemedies.push({
        type: 'Transit (Sade Sati - Rising Phase)',
        planet: 'Saturn',
        remedy: 'Wear Amethyst or an Iron Ring on the middle finger, perform Shani Daan.',
        description: 'Saturn is transiting the 12th house from your natal Moon. You are experiencing the first phase of Sade Sati. Avoid wearing Blue Sapphire directly unless Saturn is a strong benefic. Wear an Iron Ring on Saturday.'
      });
    } else if (diff === 0) {
      transitRemedies.push({
        type: 'Transit (Sade Sati - Peak Phase)',
        planet: 'Saturn',
        remedy: 'Recite Hanuman Chalisa daily, donate black sesame seeds, avoid Blue Sapphire.',
        description: 'Saturn is transiting over your natal Moon (Peak Sade Sati). Highly sensitive emotional period. Perform charitable donations on Saturday.'
      });
    } else if (diff === 1) {
      transitRemedies.push({
        type: 'Transit (Sade Sati - Setting Phase)',
        planet: 'Saturn',
        remedy: 'Wear Amethyst, light a mustard oil lamp under a Peepal tree on Saturdays.',
        description: 'Saturn is transiting the 2nd house from your natal Moon. This is the final phase of Sade Sati, representing recovery and financial restoration.'
      });
    }
    // Dhayya: 4th or 8th house from Moon
    else if (diff === 3) { // 4th house from Moon
      transitRemedies.push({
        type: 'Transit (Saturn Dhayya)',
        planet: 'Saturn',
        remedy: 'Donate black blanket, chant Shani mantra.',
        description: 'Saturn is transiting the 4th house from your natal Moon (Shani Dhayya). Focus on domestic harmony and health.'
      });
    } else if (diff === 7) { // 8th house from Moon
      transitRemedies.push({
        type: 'Transit (Saturn Dhayya)',
        planet: 'Saturn',
        remedy: 'Perform Rudrabhishek, wear an iron ring.',
        description: 'Saturn is transiting the 8th house from your natal Moon (Ashtam Shani). Exercise caution in career decisions.'
      });
    }
  }

  // 7. Life Goal Recommendations
  // We recommend gemstones based on which planets rule the houses associated with those goals
  // AND make sure they are functional benefics and not severely restricted.
  const getGoalStone = (goalName, primaryHouseLords, fallbackPlanets) => {
    // Collect potential planets
    const potentialPlanets = [...primaryHouseLords];
    
    // Add yogakaraka as a strong helper if not already in list
    if (yogakaraka && !potentialPlanets.includes(yogakaraka)) {
      potentialPlanets.push(yogakaraka);
    }
    
    // Add fallbacks
    fallbackPlanets.forEach(p => {
      if (!potentialPlanets.includes(p)) potentialPlanets.push(p);
    });

    // Find the first planet that is a functional benefic and has NO 8th house placement
    for (const pName of potentialPlanets) {
      const pData = analyzedPlanets.find(p => p.name === pName);
      if (pData && pData.house !== 8 && pData.house !== 12 && !functionalMalefics.has(pName)) {
        return {
          planet: pName,
          gemstone: PLANET_TO_GEM[pName],
          reason: `Recommended because ${pName} rules key houses for ${goalName} in your chart and acts as a supportive benefic energy.`
        };
      }
    }

    // If no perfect benefic, recommend the Lagna lord stone as it is always safe
    return {
      planet: lagnaLord,
      gemstone: PLANET_TO_GEM[lagnaLord],
      reason: `As a protective measure, your Life Stone (${PLANET_TO_GEM[lagnaLord]}) is recommended to strengthen your chart overall and support your ${goalName}.`
    };
  };

  const categoryRecommendations = {
    career: [getGoalStone('Career', [lords[10], 'Sun'], [lagnaLord])],
    business: [getGoalStone('Business', [lords[7], 'Mercury'], [lagnaLord])],
    wealth: [getGoalStone('Wealth', [lords[2], lords[11]], ['Jupiter', lagnaLord])],
    marriage: [getGoalStone('Marriage', [lords[7], 'Venus'], ['Jupiter', lagnaLord])],
    relationships: [getGoalStone('Relationships', [lords[5], 'Moon'], [lagnaLord])],
    education: [getGoalStone('Education', [lords[5], lords[4]], ['Mercury', 'Jupiter'])],
    health: [getGoalStone('Health', [lagnaLord, 'Sun'], ['Mars'])],
    spirituality: [getGoalStone('Spiritual Growth', [lords[9], 'Jupiter'], ['Ketu', lagnaLord])]
  };

  return {
    analysis: {
      ascendantSign: ascSignName,
      lagnaLord,
      yogakaraka,
      functionalBenefics: Array.from(functionalBenefics),
      functionalMalefics: Array.from(functionalMalefics),
      planets: analyzedPlanets
    },
    recommendations: {
      lifeStone: finalLifeStone,
      luckStone: finalLuckStone,
      intellectStone: finalIntellectStone,
      remedialStones: transitRemedies,
      categoryRecommendations
    }
  };
}

module.exports = {
  analyzePlanetaryPositions
};
