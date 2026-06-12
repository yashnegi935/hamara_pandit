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
 * Evaluates marriage rules and returns gemstone recommendations.
 */
const evaluateMarriage = (analysisData, dashaData, transitData, navamshaPlanets) => {
  const { ascendantSign, lagnaLord, functionalBenefics, functionalMalefics, planets } = analysisData;
  
  // 7th house rules marriage, partner
  const seventhLord = getHouseLord(7, ascendantSign);
  const seventhLordPlanet = planets.find(p => p.name === seventhLord);
  const venusPlanet = planets.find(p => p.name === 'Venus');
  const jupiterPlanet = planets.find(p => p.name === 'Jupiter');

  let chosenPlanet = null;
  const warnings = [];
  const cautions = [];

  // Determine marriage planet to strengthen
  const isSeventhSafe = seventhLordPlanet && seventhLordPlanet.house !== 8 && seventhLordPlanet.house !== 12;
  
  if (isSeventhSafe && functionalBenefics.includes(seventhLord)) {
    chosenPlanet = seventhLord;
  } else if (venusPlanet && venusPlanet.house !== 8 && venusPlanet.house !== 12) {
    chosenPlanet = 'Venus'; // Venus is natural marriage significator
  } else if (jupiterPlanet && jupiterPlanet.house !== 8 && jupiterPlanet.house !== 12) {
    chosenPlanet = 'Jupiter'; // Jupiter is husband significator
  } else {
    chosenPlanet = lagnaLord; // Fallback
  }

  const chosenPlanetDetails = planets.find(p => p.name === chosenPlanet);

  // Check Lal Kitab restrictions
  if (chosenPlanetDetails && chosenPlanetDetails.house === 8) {
    warnings.push(`Lal Kitab Restriction: Marriage-related planet ${chosenPlanet} is in the 8th House. Wearing its gemstone (${PLANET_TO_GEM[chosenPlanet]}) is prohibited.`);
  }

  // 1. Analyze Navamsha (D9) Chart strength if data is available
  let navamshaDetails = '';
  if (navamshaPlanets && navamshaPlanets.length > 0) {
    const d9Planet = navamshaPlanets.find(p => p.name === chosenPlanet);
    if (d9Planet) {
      if (d9Planet.house === 6 || d9Planet.house === 8 || d9Planet.house === 12) {
        cautions.push(`In your Navamsha (D9) chart, ${chosenPlanet} is positioned in a challenging house (${d9Planet.house}). Wearing ${PLANET_TO_GEM[chosenPlanet]} helps support relationship strength, but wear with mild caution.`);
      } else if (d9Planet.house === 1 || d9Planet.house === 5 || d9Planet.house === 9) {
        navamshaDetails = `Auspiciously, ${chosenPlanet} is placed in a trine house (${d9Planet.house}) in your Navamsha (D9) chart, enhancing martial blessing.`;
      }
    }
  }

  // Dasha
  let dashaInfluence = '';
  if (dashaData && (dashaData.mahadasha === chosenPlanet || dashaData.antardasha === chosenPlanet)) {
    dashaInfluence = `Currently in the ${dashaData.mahadasha}-${dashaData.antardasha} Dasha. Strengthening ${chosenPlanet} during this phase is highly beneficial for resolving marital delays or disputes.`;
  }

  // Transit
  let transitInfluence = '';
  if (transitData && transitData.jupiterHouse === 7) {
    transitInfluence = `Transit Jupiter is currently moving through your 7th house of partnership, forming a double blessing for marriage harmony.`;
  }

  let reason = `Recommended to strengthen your marriage and partnership lord (${chosenPlanet}). This planet rules marital bliss, harmony with partner, and relationship stability.`;
  if (navamshaDetails) reason += ` ${navamshaDetails}`;
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
  evaluateMarriage
};
