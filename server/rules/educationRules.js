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
 * Evaluates education rules and returns gemstone recommendations.
 */
const evaluateEducation = (analysisData, dashaData, transitData) => {
  const { ascendantSign, lagnaLord, functionalBenefics, functionalMalefics, planets } = analysisData;
  
  // 5th house rules higher education, intellect. 4th house rules academic foundation.
  const fifthLord = getHouseLord(5, ascendantSign);
  const fourthLord = getHouseLord(4, ascendantSign);
  
  const fifthLordPlanet = planets.find(p => p.name === fifthLord);
  const fourthLordPlanet = planets.find(p => p.name === fourthLord);
  const mercuryPlanet = planets.find(p => p.name === 'Mercury');
  const jupiterPlanet = planets.find(p => p.name === 'Jupiter');

  let chosenPlanet = null;
  const warnings = [];
  const cautions = [];

  // Determine educational planet
  const isFifthSafe = fifthLordPlanet && fifthLordPlanet.house !== 8 && fifthLordPlanet.house !== 12;
  const isFourthSafe = fourthLordPlanet && fourthLordPlanet.house !== 8 && fourthLordPlanet.house !== 12;

  if (isFifthSafe && functionalBenefics.includes(fifthLord)) {
    chosenPlanet = fifthLord;
  } else if (mercuryPlanet && mercuryPlanet.house !== 8 && mercuryPlanet.house !== 12 && !functionalMalefics.includes('Mercury')) {
    chosenPlanet = 'Mercury'; // Mercury represents intellect and concentration
  } else if (isFourthSafe && functionalBenefics.includes(fourthLord)) {
    chosenPlanet = fourthLord;
  } else {
    chosenPlanet = 'Jupiter'; // Jupiter is the planet of knowledge
  }

  const chosenPlanetDetails = planets.find(p => p.name === chosenPlanet);

  // Check Lal Kitab restrictions
  if (chosenPlanetDetails && chosenPlanetDetails.house === 8) {
    warnings.push(`Lal Kitab Restriction: Education planet ${chosenPlanet} is in the 8th House. Wearing its gemstone (${PLANET_TO_GEM[chosenPlanet]}) is prohibited.`);
  }

  // Yogas (Saraswati Yoga)
  let yogaDescription = '';
  if (mercuryPlanet && jupiterPlanet && planets.find(p => p.name === 'Venus')) {
    const venusPlanet = planets.find(p => p.name === 'Venus');
    // Saraswati Yoga: Jupiter, Venus, Mercury occupy Kendras (1,4,7,10) or Trikonas (5,9) or 2nd house
    const isKendraOrTrikonaOr2nd = (p) => [1, 2, 4, 5, 7, 9, 10].includes(p.house);
    if (isKendraOrTrikonaOr2nd(jupiterPlanet) && isKendraOrTrikonaOr2nd(venusPlanet) && isKendraOrTrikonaOr2nd(mercuryPlanet)) {
      yogaDescription = 'A highly auspicious Saraswati Yoga is present in your chart, granting high academic potential and memory.';
    }
  }

  // Dasha
  let dashaInfluence = '';
  if (dashaData && (dashaData.mahadasha === chosenPlanet || dashaData.antardasha === chosenPlanet)) {
    dashaInfluence = `Currently in the ${dashaData.mahadasha}-${dashaData.antardasha} Dasha. Strengthening ${chosenPlanet} helps resolve academic distractions and increases concentration.`;
  }

  // Transit
  let transitInfluence = '';
  if (transitData && (transitData.jupiterHouse === 5 || transitData.jupiterHouse === 4)) {
    transitInfluence = `Transit Jupiter is currently aspecting or moving through your house of intellect/education, boosting academic success.`;
  }

  let reason = `Recommended to strengthen your educational and memory planet (${chosenPlanet}). This planet rules concentration, memory power, analytical intellect, and academic success.`;
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
  evaluateEducation
};
