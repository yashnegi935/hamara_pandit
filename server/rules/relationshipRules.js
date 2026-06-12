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
 * Evaluates relationship rules and returns gemstone recommendations.
 */
const evaluateRelationship = (analysisData, dashaData, transitData) => {
  const { ascendantSign, lagnaLord, functionalBenefics, functionalMalefics, planets } = analysisData;
  
  // 5th house governs relationships, emotions, love
  const fifthLord = getHouseLord(5, ascendantSign);
  const fifthLordPlanet = planets.find(p => p.name === fifthLord);
  const moonPlanet = planets.find(p => p.name === 'Moon');
  
  let chosenPlanet = null;
  const warnings = [];
  const cautions = [];

  // Determine if 5th Lord is safe
  const isFifthSafe = fifthLordPlanet && fifthLordPlanet.house !== 8 && fifthLordPlanet.house !== 12;

  if (isFifthSafe && functionalBenefics.includes(fifthLord)) {
    chosenPlanet = fifthLord;
  } else if (moonPlanet && moonPlanet.house !== 8 && moonPlanet.house !== 12) {
    chosenPlanet = 'Moon'; // Moon represents emotional harmony and stability
  } else {
    chosenPlanet = lagnaLord; // Fallback to Life Stone
  }

  const chosenPlanetDetails = planets.find(p => p.name === chosenPlanet);

  // Check Lal Kitab restrictions
  if (chosenPlanetDetails && chosenPlanetDetails.house === 8) {
    warnings.push(`Lal Kitab Restriction: Relationship planet ${chosenPlanet} is in the 8th House. Wearing ${PLANET_TO_GEM[chosenPlanet]} is not recommended.`);
  }

  // Yogas
  let yogaDescription = '';
  // Check if Gaja Kesari Yoga exists (Moon and Jupiter in Kendra houses 1, 4, 7, 10 relative to each other)
  if (moonPlanet && planets.find(p => p.name === 'Jupiter')) {
    const jupiterPlanet = planets.find(p => p.name === 'Jupiter');
    const houseDiff = Math.abs(jupiterPlanet.house - moonPlanet.house);
    if ([0, 3, 6, 9].includes(houseDiff)) { // 1st, 4th, 7th, 10th difference
      yogaDescription = 'Auspicious Gaja Kesari Yoga is present between your Moon and Jupiter, boosting emotional maturity.';
    }
  }

  // Dasha
  let dashaInfluence = '';
  if (dashaData && (dashaData.mahadasha === chosenPlanet || dashaData.antardasha === chosenPlanet)) {
    dashaInfluence = `Currently in the ${dashaData.mahadasha}-${dashaData.antardasha} Dasha. Strengthening ${chosenPlanet} during this time helps bring peace, joy, and emotional resolution.`;
  }

  // Transit (Sade Sati)
  let transitInfluence = '';
  if (transitData && transitData.sadeSatiActive) {
    transitInfluence = `Note: You are currently undergoing Sade Sati. Recommending a Pearl (${PLANET_TO_GEM['Moon']}) is highly helpful to calm the mind and ease relationship anxieties.`;
  }

  let reason = `Recommended to strengthen your relationship and emotional harmony lord (${chosenPlanet}). This planet rules your social connections, emotional well-being, and mutual understanding.`;
  if (yogaDescription) reason += ` ${yogaDescription}`;
  if (dashaInfluence) reason += ` ${dashaInfluence}`;
  if (transitInfluence) reason += ` ${transitInfluence}`;

  return {
    planet: chosenPlanet,
    gemstone: PLANET_TO_GEM[chosenPlanet],
    reason,
    warnings: warnings.length > 0 ? warnings : null,
    cautions: cautions.length > 0 ? cautions : null,
    isAllowed: warnings.length === 0
  };
};

module.exports = {
  evaluateRelationship
};
