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
 * Evaluates health rules and returns gemstone recommendations.
 */
const evaluateHealth = (analysisData, dashaData, transitData) => {
  const { ascendantSign, lagnaLord, functionalBenefics, functionalMalefics, planets } = analysisData;
  
  // Lagna Lord represents the physical body, immunity, and overall longevity.
  const lagnaLordPlanet = planets.find(p => p.name === lagnaLord);
  const sunPlanet = planets.find(p => p.name === 'Sun');
  const marsPlanet = planets.find(p => p.name === 'Mars');
  
  let chosenPlanet = lagnaLord; // Lagna Lord is the prime health protector
  const warnings = [];
  const cautions = [];

  // Check if Lagna Lord is safe to wear
  const isLagnaSafe = lagnaLordPlanet && lagnaLordPlanet.house !== 8 && lagnaLordPlanet.house !== 12;

  if (!isLagnaSafe) {
    // If Lagna Lord is in 8th/12th, fallback to Sun (if safe) or Mars (if safe)
    const isSunSafe = sunPlanet && sunPlanet.house !== 8 && sunPlanet.house !== 12;
    const isMarsSafe = marsPlanet && marsPlanet.house !== 8 && marsPlanet.house !== 12;

    if (isSunSafe) {
      chosenPlanet = 'Sun';
    } else if (isMarsSafe) {
      chosenPlanet = 'Mars';
    } else {
      // If nothing is safe, we cannot recommend a direct gemstone. Fallback to general health practices.
      chosenPlanet = 'Sun'; // Use Sun as default, but flag warnings
    }
  }

  const chosenPlanetDetails = planets.find(p => p.name === chosenPlanet);

  // Check Lal Kitab restrictions
  if (chosenPlanetDetails && chosenPlanetDetails.house === 8) {
    warnings.push(`Lal Kitab Restriction: Health planet ${chosenPlanet} is in the 8th House. Wearing ${PLANET_TO_GEM[chosenPlanet]} is strictly prohibited as it can trigger health crises.`);
  }
  if (chosenPlanetDetails && chosenPlanetDetails.house === 6) {
    cautions.push(`Lal Kitab Caution: Health planet ${chosenPlanet} is in the 6th House (disease/enemies). Wearing its gemstone requires expert consultation.`);
  }

  // Dasha
  let dashaInfluence = '';
  if (dashaData && (dashaData.mahadasha === chosenPlanet || dashaData.antardasha === chosenPlanet)) {
    dashaInfluence = `Currently in the ${dashaData.mahadasha}-${dashaData.antardasha} Dasha. Strengthening ${chosenPlanet} now will boost your immunity, cellular vitality, and recuperative strength.`;
  }

  // Transit
  let transitInfluence = '';
  if (transitData && transitData.sadeSatiActive && chosenPlanet === 'Moon') {
    transitInfluence = `Under Sade Sati transit. Strengthening Moon with Pearl is highly recommended to protect physical health and keep blood pressure/mind calm.`;
  }

  let reason = `Recommended to strengthen your overall life force, physical body, and immunity planet (${chosenPlanet}). This planet rules your physical constitution, vitality, and cellular defense.`;
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
  evaluateHealth
};
