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
 * Evaluates career rules and returns career gemstone recommendations.
 */
const evaluateCareer = (analysisData, dashaData, transitData) => {
  const { ascendantSign, lagnaLord, functionalBenefics, functionalMalefics, planets } = analysisData;
  const tenthLord = getHouseLord(10, ascendantSign);
  
  // Find planet placements
  const tenthLordPlanet = planets.find(p => p.name === tenthLord);
  const lagnaLordPlanet = planets.find(p => p.name === lagnaLord);
  const sunPlanet = planets.find(p => p.name === 'Sun');
  
  const recommendations = [];
  const warnings = [];
  const cautions = [];
  let isAllowed = true;
  
  // 1. Check strict 8th/12th house placements (Lal Kitab rule: do not wear gemstone of 8th house planet)
  if (tenthLordPlanet && tenthLordPlanet.house === 8) {
    warnings.push(`Career Lord (${tenthLord}) is placed in the 8th House. Wearing ${PLANET_TO_GEM[tenthLord]} is prohibited as it may trigger sudden career disruptions or business loss.`);
    isAllowed = false;
  }
  if (tenthLordPlanet && tenthLordPlanet.house === 12) {
    warnings.push(`Career Lord (${tenthLord}) is in the 12th House (House of Loss). Wearing its gemstone is restricted to prevent financial leakage.`);
    isAllowed = false;
  }

  // 2. Check combustion & retrograde
  if (tenthLordPlanet && tenthLordPlanet.isCombust) {
    cautions.push(`Your career lord (${tenthLord}) is combust (burnt by the Sun). Wearing a ${PLANET_TO_GEM[tenthLord]} is recommended to revive its weakened professional energies.`);
  }
  if (tenthLordPlanet && tenthLordPlanet.isRetrograde) {
    cautions.push(`Your career lord (${tenthLord}) is retrograde. It represents delayed success in career. Wearing ${PLANET_TO_GEM[tenthLord]} helps in smooth progress.`);
  }

  // 3. Evaluate Yogas
  let yogaFound = null;
  if (tenthLordPlanet && lagnaLordPlanet && tenthLordPlanet.house === 1) {
    yogaFound = 'Dharma Karma Adhipati Yoga connection';
  }
  if (tenthLord === 'Jupiter' && tenthLordPlanet && tenthLordPlanet.house === 10) {
    yogaFound = 'Hamsa Mahapurusha Yoga in 10th House';
  } else if (tenthLord === 'Saturn' && tenthLordPlanet && tenthLordPlanet.house === 10) {
    yogaFound = 'Sasa Mahapurusha Yoga in 10th House';
  } else if (tenthLord === 'Mercury' && tenthLordPlanet && tenthLordPlanet.house === 10) {
    yogaFound = 'Bhadra Mahapurusha Yoga in 10th House';
  }

  // 4. Current Dasha context
  let dashaInfluence = '';
  if (dashaData && (dashaData.mahadasha === tenthLord || dashaData.antardasha === tenthLord)) {
    dashaInfluence = `You are currently undergoing the ${dashaData.mahadasha}-${dashaData.antardasha} Dasha. Activating the Career Lord (${tenthLord}) during its operating period is highly effective.`;
  }

  // 5. Current Transit context
  let transitInfluence = '';
  if (transitData && transitData.jupiterHouse === 10) {
    transitInfluence = 'Jupiter is currently transiting your 10th house of career, magnifying career growth opportunities. Wearing the Career gemstone now will amplify this benefic transit.';
  }

  // Recommendation construction
  let reason = `Recommended to strengthen the 10th House Lord (${tenthLord}) which governs career, profession, status, and recognition.`;
  if (yogaFound) reason += ` It activates the auspicious ${yogaFound} present in your chart.`;
  if (dashaInfluence) reason += ` ${dashaInfluence}`;
  if (transitInfluence) reason += ` ${transitInfluence}`;

  // Fallback to Lagna Lord if the 10th lord is blocked (malefic or in 8th/12th)
  if (!isAllowed || functionalMalefics.includes(tenthLord)) {
    return {
      planet: lagnaLord,
      gemstone: PLANET_TO_GEM[lagnaLord],
      reason: `Your Career Lord (${tenthLord}) is unfavorable or blocked. We recommend your Life Stone (${PLANET_TO_GEM[lagnaLord]}) to overall strengthen the chart and clear career obstacles.`,
      warnings: warnings.length > 0 ? warnings : null,
      cautions: cautions.length > 0 ? cautions : null,
      isAllowed: true
    };
  }

  return {
    planet: tenthLord,
    gemstone: PLANET_TO_GEM[tenthLord],
    reason,
    warnings: warnings.length > 0 ? warnings : null,
    cautions: cautions.length > 0 ? cautions : null,
    isAllowed
  };
};

module.exports = {
  evaluateCareer
};
