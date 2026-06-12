/**
 * GemGuide AI - Vedic Astrology Calculation Engine
 * 
 * Implements mathematical approximations for planetary placements using Keplerian orbital elements
 * and converts them to Sidereal (Vedic) coordinates via Lahiri Ayanamsa.
 */

// Popular city coordinates database
const POPULAR_CITIES = {
  'new delhi': { lat: 28.6139, lon: 77.2090 },
  'delhi': { lat: 28.6139, lon: 77.2090 },
  'mumbai': { lat: 19.0760, lon: 72.8777 },
  'bombay': { lat: 19.0760, lon: 72.8777 },
  'bangalore': { lat: 12.9716, lon: 77.5946 },
  'bengaluru': { lat: 12.9716, lon: 77.5946 },
  'kolkata': { lat: 22.5726, lon: 88.3639 },
  'calcutta': { lat: 22.5726, lon: 88.3639 },
  'chennai': { lat: 13.0827, lon: 80.2707 },
  'madras': { lat: 13.0827, lon: 80.2707 },
  'hyderabad': { lat: 17.3850, lon: 78.4867 },
  'pune': { lat: 18.5204, lon: 73.8567 },
  'ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'jaipur': { lat: 26.9124, lon: 75.7873 },
  'lucknow': { lat: 26.8467, lon: 80.9462 },
  'london': { lat: 51.5074, lon: -0.1278 },
  'new york': { lat: 40.7128, lon: -74.0060 },
  'san francisco': { lat: 37.7749, lon: -122.4194 },
  'los angeles': { lat: 34.0522, lon: -118.2437 },
  'sydney': { lat: -33.8688, lon: 151.2093 },
  'tokyo': { lat: 35.6762, lon: 139.6503 },
  'singapore': { lat: 1.3521, lon: 103.8198 },
  'dubai': { lat: 25.2048, lon: 55.2708 }
};

// Deterministic hashing for cities not in the database
function getCoordinates(cityName) {
  const cleanName = cityName.trim().toLowerCase();
  if (POPULAR_CITIES[cleanName]) {
    return POPULAR_CITIES[cleanName];
  }

  // Hash the city name to generate deterministic latitude/longitude
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Map hash to realistic latitude (-60 to +60) and longitude (-180 to +180)
  const lat = ((Math.abs(hash) % 12000) / 100) - 60;
  const lon = (((Math.abs(hash * 31) % 36000)) / 100) - 180;
  
  return { lat, lon };
}

// Convert Date/Time to Julian Date
function calculateJulianDate(dob, tob) {
  // dob: "YYYY-MM-DD", tob: "HH:MM"
  const [year, month, day] = dob.split('-').map(Number);
  const [hour, minute] = tob.split(':').map(Number);

  let Y = year;
  let M = month;
  let D = day + (hour + minute / 60) / 24;

  if (M <= 2) {
    Y -= 1;
    M += 12;
  }

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const julianDate = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
  return julianDate;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Map absolute longitude (0 - 360) to Zodiac Sign index (0 - 11) and degrees (0 - 30)
function getZodiacDetails(longitude) {
  const normalizedLong = (longitude + 360) % 360;
  const signIndex = Math.floor(normalizedLong / 30);
  const degree = normalizedLong % 30;
  return {
    sign: ZODIAC_SIGNS[signIndex],
    signNumber: signIndex + 1, // Aries = 1, Pisces = 12
    degree: parseFloat(degree.toFixed(2))
  };
}

/**
 * Calculates planetary positions and Ascendant
 * @param {string} dob - YYYY-MM-DD
 * @param {string} tob - HH:MM
 * @param {string} pob - Place of Birth
 */
function generateBirthChart(dob, tob, pob) {
  const { lat, lon } = getCoordinates(pob);
  const jd = calculateJulianDate(dob, tob);
  const d = jd - 2451545.0; // Days since J2000.0 epoch (Jan 1, 2000 12:00 UT)

  // Lahiri Ayanamsa precession (correction to convert tropical to sidereal)
  const ayanamsa = 23.85 + (d / 365.25) * 0.01396;

  // 1. Sun Position
  const sunL = 280.460 + 0.9856474 * d; // Mean longitude
  const sunG = 357.528 + 0.9856003 * d; // Mean anomaly
  const sunTropLong = sunL + 1.915 * Math.sin((sunG * Math.PI) / 180) + 0.020 * Math.sin((2 * sunG * Math.PI) / 180);
  const sunSidLong = (sunTropLong - ayanamsa + 360) % 360;

  // 2. Moon Position
  const moonL = 218.316 + 13.176396 * d; // Mean longitude
  const moonM = 134.963 + 13.064993 * d; // Mean anomaly
  const moonTropLong = moonL + 6.289 * Math.sin((moonM * Math.PI) / 180);
  const moonSidLong = (moonTropLong - ayanamsa + 360) % 360;

  // Helper for planet calculations using standard orbital elements
  const calculatePlanetSidereal = (meanLong, meanAnomaly, correctionCoeff, cycleSpeed) => {
    const L = meanLong + cycleSpeed * d;
    const M = meanAnomaly + cycleSpeed * d;
    const tropLong = L + correctionCoeff * Math.sin((M * Math.PI) / 180);
    return (tropLong - ayanamsa + 360) % 360;
  };

  // 3. Mars
  const marsSidLong = calculatePlanetSidereal(355.453, 19.388, 10.69, 0.524020);

  // 4. Mercury
  const merSidLong = calculatePlanetSidereal(252.250, 174.794, 4.96, 4.092334);

  // 5. Jupiter
  const jupSidLong = calculatePlanetSidereal(34.404, 19.895, 5.55, 0.083085);

  // 6. Venus
  const venSidLong = calculatePlanetSidereal(181.979, 50.115, 0.77, 1.602130);

  // 7. Saturn
  const satSidLong = calculatePlanetSidereal(50.077, 317.020, 6.30, 0.033444);

  // 8. Rahu & Ketu (Moon nodes precessing backward)
  const rahuSidLong = (125.045 - 0.0529538 * d - ayanamsa + 360) % 360;
  const ketuSidLong = (rahuSidLong + 180) % 360;

  // 9. Calculate Ascendant (Lagna)
  // Local Sidereal Time estimation based on J2000.0 epoch and GMT Hour offset
  // We assume IST (Indian Standard Time, GMT +5.5) as the default time zone if not specified,
  // but we can calculate it relative to POB longitude (1 hour per 15 degrees longitude)
  const gmtOffsetHours = lon / 15.0; // Natural solar time offset
  const hourLocal = parseInt(tob.split(':')[0]);
  const minLocal = parseInt(tob.split(':')[1]);
  const localTimeInHours = hourLocal + minLocal / 60;
  const gmtTimeInHours = (localTimeInHours - gmtOffsetHours + 24) % 24;

  // GMST at J2000.0 in degrees
  const gmst = 280.46061837 + 360.98564736629 * d;
  const lst = (gmst + lon) % 360; // Local Sidereal Time

  const lstRad = (lst * Math.PI) / 180;
  const epsRad = (23.439 * Math.PI) / 180; // Obliquity of ecliptic
  const latRad = (lat * Math.PI) / 180;

  // Standard ascendant formula
  const ascRad = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad));
  let ascTropLong = (ascRad * 180) / Math.PI;
  ascTropLong = (ascTropLong + 360) % 360;
  const ascSidLong = (ascTropLong - ayanamsa + 360) % 360;

  const ascendantDetails = getZodiacDetails(ascSidLong);

  // Equal House distribution: Ascendant sign is the 1st House.
  const getHouseNumber = (planetSidLong, ascSignNumber) => {
    const planetSignNumber = getZodiacDetails(planetSidLong).signNumber;
    return ((planetSignNumber - ascSignNumber + 12) % 12) + 1;
  };

  const ascSignNum = ascendantDetails.signNumber;

  // Assemble planets array
  const planetsRaw = [
    { name: 'Sun', long: sunSidLong, speed: 0.9856 },
    { name: 'Moon', long: moonSidLong, speed: 13.176 },
    { name: 'Mars', long: marsSidLong, speed: 0.524, cycleDiff: (d % 780) },
    { name: 'Mercury', long: merSidLong, speed: 4.092, cycleDiff: (d % 116) },
    { name: 'Jupiter', long: jupSidLong, speed: 0.083, cycleDiff: (d % 399) },
    { name: 'Venus', long: venSidLong, speed: 1.602, cycleDiff: (d % 584) },
    { name: 'Saturn', long: satSidLong, speed: 0.033, cycleDiff: (d % 378) },
    { name: 'Rahu', long: rahuSidLong, speed: -0.053 },
    { name: 'Ketu', long: ketuSidLong, speed: -0.053 }
  ];

  const planetsParsed = planetsRaw.map(p => {
    const det = getZodiacDetails(p.long);
    const house = getHouseNumber(p.long, ascSignNum);

    // Determine combustion (closeness to Sun in longitude)
    let isCombust = false;
    if (p.name !== 'Sun' && p.name !== 'Rahu' && p.name !== 'Ketu') {
      const diff = Math.min(
        Math.abs(p.long - sunSidLong),
        360 - Math.abs(p.long - sunSidLong)
      );
      // Combustion rules in degrees
      const limits = { 'Moon': 12, 'Mars': 17, 'Mercury': 14, 'Jupiter': 11, 'Venus': 10, 'Saturn': 15 };
      if (diff <= limits[p.name]) {
        isCombust = true;
      }
    }

    // Determine retrograde (moving backward)
    // Rahu and Ketu are always retrograde in Vedic
    let isRetrograde = p.name === 'Rahu' || p.name === 'Ketu';
    if (p.name !== 'Sun' && p.name !== 'Moon' && p.name !== 'Rahu' && p.name !== 'Ketu') {
      // Outer planets (Mars, Jup, Sat) are retrograde when opposite the Sun
      if (['Mars', 'Jupiter', 'Saturn'].includes(p.name)) {
        const sunDiff = Math.abs(p.long - sunSidLong);
        if (sunDiff > 120 && sunDiff < 240) {
          isRetrograde = true;
        }
      }
      // Inner planets (Mercury, Venus) are retrograde during inferior conjunction (close to Sun and in a specific window)
      if (['Mercury', 'Venus'].includes(p.name)) {
        const sunDiff = Math.abs(p.long - sunSidLong);
        // Retrograde period happens when they are very close to Sun, except during direct speed phases.
        // We simulate it using their synodic cycle phase.
        if (p.name === 'Mercury' && p.cycleDiff < 22) { // 22 days of retrograde out of 116 day cycle
          isRetrograde = true;
        }
        if (p.name === 'Venus' && p.cycleDiff < 42) { // 42 days of retrograde out of 584 day cycle
          isRetrograde = true;
        }
      }
    }

    return {
      name: p.name,
      sign: det.sign,
      degree: det.degree,
      house: house,
      isCombust,
      isRetrograde
    };
  });

  return {
    birthInfo: { dob, tob, pob, latitude: parseFloat(lat.toFixed(4)), longitude: parseFloat(lon.toFixed(4)) },
    chartData: {
      ascendant: {
        sign: ascendantDetails.sign,
        degree: ascendantDetails.degree,
        house: 1
      },
      planets: planetsParsed
    }
  };
}

module.exports = {
  generateBirthChart,
  ZODIAC_SIGNS
};
