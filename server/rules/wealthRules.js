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
 * Evaluates wealth rules and returns wealth gemstone recommendations.
 */
const evaluateWealth = (analysisData, dashaData, transitData) => {
  const { ascendantSign, lagnaLord, functionalBenefics, functionalMalefics, planets } = analysisData;
  
  // Wealth houses: 2nd (accumulated wealth) and 11th (gains)
  const secondLord = getHouseLord(2, ascendantSign);
  const eleventhLord = getHouseLord(11, ascendantSign);
  
  // We prefer the lord that is a functional benefic and not placed in a bad house (6, 8, 12)
  const secondLordPlanet = planets.find(p => p.name === secondLord);
  const eleventhLordPlanet = planets.find(p => p.name === eleventhLord);
  const jupiterPlanet = planets.find(p => p.name === 'Jupiter');

  let chosenPlanet = null;
  const warnings = [];
  const cautions = [];

  // Determine which wealth planet is safer and stronger to amplify
  const isSecondSafe = secondLordPlanet && secondLordPlanet.house !== 8 && secondLordPlanet.house !== 12 && secondLordPlanet.house !== 6;
  const isEleventhSafe = eleventhLordPlanet && eleventhLordPlanet.house !== 8 && eleventhLordPlanet.house !== 12 && eleventhLordPlanet.house !== 6;

  if (isEleventhSafe && functionalBenefics.includes(eleventhLord)) {
    chosenPlanet = eleventhLord;
  } else if (isSecondSafe && functionalBenefics.includes(secondLord)) {
    chosenPlanet = secondLord;
  } else if (jupiterPlanet && jupiterPlanet.house !== 8 && jupiterPlanet.house !== 12 && !functionalMalefics.includes('Jupiter')) {
    chosenPlanet = 'Jupiter'; // Jupiter is natural significator of wealth
  } else {
    chosenPlanet = lagnaLord; // Fallback to Life Stone
  }

  const chosenPlanetDetails = planets.find(p => p.name === chosenPlanet);

  // Check Lal Kitab restrictions
  if (chosenPlanetDetails && chosenPlanetDetails.house === 8) {
    warnings.push(`Lal Kitab Alert: Wealth-related planet ${chosenPlanet} is in the 8th House. Wearing its gemstone (${PLANET_TO_GEM[chosenPlanet]}) is strictly prohibited.`);
  }
  if (chosenPlanetDetails && chosenPlanetDetails.house === 6) {
    cautions.push(`Lal Kitab Caution: Wealth planet ${chosenPlanet} is in the 6th House (House of Debts). Wearing ${PLANET_TO_GEM[chosenPlanet]} may trigger debt disputes.`);
  }

  // Yogas (e.g. Dhana Yoga)
  let yogaDescription = '';
  const secondHousePlanets = planets.filter(p => p.house === 2);
  const eleventhHousePlanets = planets.filter(p => p.house === 11);
  if (secondHousePlanets.some(p => p.name === 'Jupiter') || eleventhHousePlanets.some(p => p.name === 'Jupiter')) {
    yogaDescription = 'Auspicious placement of Jupiter in a wealth house (Dhana Yoga).';
  }

  // Dasha influence
  let dashaInfluence = '';
  if (dashaData && (dashaData.mahadasha === chosenPlanet || dashaData.antardasha === chosenPlanet)) {
    dashaInfluence = `You are currently undergoing the ${dashaData.mahadasha}-${dashaData.antardasha} Dasha. Strengthening ${chosenPlanet} now will help activate your financial fortunes and income streams.`;
  }

  // Transit influence
  let transitInfluence = '';
  if (transitData && (transitData.jupiterHouse === 2 || transitData.jupiterHouse === 11)) {
    transitInfluence = `Transit Jupiter is currently moving through your ${transitData.jupiterHouse} house of wealth and gains, creating an exceptional window for wealth accumulation.`;
  }

  let reason = `Recommended to strengthen your wealth-signifying planet (${chosenPlanet}) governing financial growth, bank balance, and secondary income channels.`;
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
  evaluateWealth
};
