/**
 * GemGuide AI - Astrology Service
 * 
 * Fetches real coordinate/timezone details using the geocoding service,
 * calls VedicAstroAPI for all chart calculations, and executes recommendation rules.
 */

const axios = require('axios');
const { geocodePlace } = require('./geocodingService');
const { generateRecommendations } = require('./recommendationService');

/**
 * Generates Vedic birth chart and analyzes gemstone recommendations using professional API data.
 * @param {Object} birthData - { name, dob, tob, pob, gender }
 */
const getAstrologyReport = async (birthData) => {
  const { name, dob, tob, pob, gender } = birthData;
  const apiKey = process.env.ASTROLOGY_API_KEY;

  if (!apiKey || apiKey.startsWith('your_') || apiKey === '') {
    console.warn('ASTROLOGY_API_KEY is missing or invalid. Falling back to offline local calculations engine.');
    
    // Import local calculation engine
    const { generateBirthChart } = require('../utils/astrologyCalculator');
    
    // 1. Calculate geocoding locally
    let coords = { latitude: 28.6139, longitude: 77.2090, timezone: 5.5, timezoneName: 'Asia/Kolkata' };
    try {
      coords = await geocodePlace(pob, dob, tob);
    } catch (err) {
      console.warn('Geocoding failed, using default coords:', err.message);
    }

    // 2. Generate birth chart using offline engine
    const offlineChart = generateBirthChart(dob, tob, pob);
    
    // 3. Generate mock dasha and transit
    const currentDasha = { mahadasha: 'Jupiter', antardasha: 'Mercury' };
    const transitData = { sadeSatiActive: false, jupiterHouse: 11, saturnHouse: 10 };
    const navPlanets = offlineChart.chartData.planets.map(p => ({
      name: p.name,
      sign: p.sign,
      house: p.house
    }));

    // 4. Generate recommendations
    const recResults = generateRecommendations(offlineChart.chartData, currentDasha, transitData, navPlanets);

    return {
      birthInfo: {
        name,
        dob,
        tob,
        pob,
        gender,
        latitude: coords.latitude,
        longitude: coords.longitude,
        timezone: coords.timezone
      },
      chartData: offlineChart.chartData,
      currentDasha,
      transitData,
      navPlanets,
      rawApiResponse: {
        planetDetails: {},
        dasha: currentDasha,
        navamsha: navPlanets,
        transit: transitData,
        isMocked: true
      },
      analysis: recResults.analysis,
      recommendations: {
        lifeStone: recResults.lifeStone,
        luckStone: recResults.luckStone,
        intellectStone: recResults.intellectStone,
        remedialStones: recResults.remedialStones,
        categoryRecommendations: recResults.categoryRecommendations
      },
      moonSign: offlineChart.chartData.planets.find(p => p.name === 'Moon')?.sign || 'Unknown',
      nakshatra: 'Chitra' // Default mock nakshatra
    };
  }

  // 1. Geocode place to get lat, lon, and timezone historically
  const { latitude, longitude, timezone, timezoneName } = await geocodePlace(pob, dob, tob);

  // 2. Format inputs for VedicAstroAPI
  // Date format: DD/MM/YYYY
  const [year, month, day] = dob.split('-');
  const formattedDob = `${day}/${month}/${year}`;
  const formattedTob = tob;

  const params = {
    api_key: apiKey,
    dob: formattedDob,
    tob: formattedTob,
    lat: latitude,
    lon: longitude,
    tz: timezone,
    lang: 'en'
  };

  const baseUrl = 'https://api.vedicastroapi.com/v3-json';

  try {
    // A. Fetch Planet Details (Ascendant & Natal Planets)
    const planetRes = await axios.get(`${baseUrl}/horoscope/planet-details`, { params });
    if (planetRes.data.status !== 200) {
      throw new Error(`Astrology API (planet-details) error: ${planetRes.data.message || 'Status not 200'}`);
    }
    const rawPlanets = planetRes.data.response;

    // B. Fetch Current Dasha
    let currentDasha = { mahadasha: 'Unknown', antardasha: 'Unknown' };
    try {
      const dashaRes = await axios.get(`${baseUrl}/dashas/current-dasha`, { params });
      if (dashaRes.data.status === 200 && dashaRes.data.response) {
        currentDasha = {
          mahadasha: dashaRes.data.response.major || dashaRes.data.response.mahadasha || 'Unknown',
          antardasha: dashaRes.data.response.sub || dashaRes.data.response.antardasha || 'Unknown'
        };
      } else {
        // Fallback to fetch full vimshottari-dasha
        const fullDashaRes = await axios.get(`${baseUrl}/dashas/vimshottari-dasha`, { params });
        if (fullDashaRes.data.status === 200 && Array.isArray(fullDashaRes.data.response)) {
          const now = new Date();
          const activeMaha = fullDashaRes.data.response.find(m => {
            const start = new Date(m.start);
            const end = new Date(m.end);
            return now >= start && now <= end;
          });
          if (activeMaha) {
            currentDasha.mahadasha = activeMaha.planet;
            const activeAntar = (activeMaha.sub_periods || []).find(a => {
              const start = new Date(a.start);
              const end = new Date(a.end);
              return now >= start && now <= end;
            });
            if (activeAntar) {
              currentDasha.antardasha = activeAntar.planet;
            }
          }
        }
      }
    } catch (dashaErr) {
      console.error('Error fetching dasha from API:', dashaErr.message);
    }

    // C. Fetch Navamsha (D9) Chart
    let navPlanets = [];
    try {
      const vargasRes = await axios.get(`${baseUrl}/horoscope/divisional-charts`, {
        params: { ...params, chart_id: 'd9' }
      });
      if (vargasRes.data.status === 200 && vargasRes.data.response) {
        const rawD9Response = vargasRes.data.response;
        navPlanets = Object.values(rawD9Response)
          .filter(p => p && typeof p === 'object' && p.name)
          .map(p => ({
            name: p.name,
            sign: p.sign || p.zodiac_sign,
            house: p.house !== undefined ? p.house : 1
          }));
      }
    } catch (vargasErr) {
      console.error('Error fetching D9 chart from API:', vargasErr.message);
    }

    // D. Fetch Transit Data
    let transitData = { sadeSatiActive: false, jupiterHouse: 1, saturnHouse: 12 };
    try {
      const transitRes = await axios.get(`${baseUrl}/transit/daily`, { params });
      if (transitRes.data.status === 200 && transitRes.data.response) {
        const rawTransit = transitRes.data.response;
        
        const moonNatal = Object.values(rawPlanets).find(p => p && p.name === 'Moon');
        const saturnTransit = Object.values(rawTransit).find(p => p && p.name === 'Saturn');
        const jupiterTransit = Object.values(rawTransit).find(p => p && p.name === 'Jupiter');

        if (moonNatal && saturnTransit) {
          const ZODIAC_SIGNS = [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
          ];
          const moonSignNum = ZODIAC_SIGNS.indexOf(moonNatal.sign) + 1;
          const saturnSignNum = ZODIAC_SIGNS.indexOf(saturnTransit.sign || saturnTransit.zodiac_sign) + 1;
          
          if (moonSignNum > 0 && saturnSignNum > 0) {
            const diff = (saturnSignNum - moonSignNum + 12) % 12;
            if ([11, 0, 1].includes(diff)) {
              transitData.sadeSatiActive = true;
            }
          }
        }

        if (jupiterTransit) {
          const ascNatal = Object.values(rawPlanets).find(p => p && (p.name === 'Ascendant' || p.name === 'Lagna'));
          if (ascNatal) {
            const ZODIAC_SIGNS = [
              'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
              'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
            ];
            const ascSignNum = ZODIAC_SIGNS.indexOf(ascNatal.sign) + 1;
            const jupiterSignNum = ZODIAC_SIGNS.indexOf(jupiterTransit.sign || jupiterTransit.zodiac_sign) + 1;
            if (ascSignNum > 0 && jupiterSignNum > 0) {
              transitData.jupiterHouse = ((jupiterSignNum - ascSignNum + 12) % 12) + 1;
            }
          }
        }
      }
    } catch (transitErr) {
      console.error('Error fetching transit from API:', transitErr.message);
    }

    // E. Map rawPlanets to standard chartData format
    const planetsMapped = [];
    let ascendantDetails = { sign: 'Aries', degree: 0, house: 1 };

    Object.entries(rawPlanets).forEach(([key, p]) => {
      if (!p || typeof p !== 'object') return;
      
      const pName = p.name || key;
      if (pName === 'Ascendant' || pName === 'Lagna') {
        ascendantDetails = {
          sign: p.sign || p.zodiac_sign,
          degree: p.norm_degree !== undefined ? p.norm_degree : (p.degree !== undefined ? p.degree : 0),
          house: 1
        };
      } else {
        const isRetrograde = p.is_retrograde === true || p.is_retrograde === 'true';
        const isCombust = p.is_combust === true || p.is_combust === 'true';
        
        planetsMapped.push({
          name: pName,
          sign: p.sign || p.zodiac_sign,
          degree: p.norm_degree !== undefined ? p.norm_degree : (p.degree !== undefined ? p.degree : 0),
          house: p.house !== undefined ? p.house : 1,
          isCombust,
          isRetrograde,
          nakshatra: p.nakshatra || ''
        });
      }
    });

    const chartData = {
      ascendant: ascendantDetails,
      planets: planetsMapped
    };

    // Store raw responses for MongoDB archiving
    const rawApiResponse = {
      planetDetails: rawPlanets,
      dasha: currentDasha,
      navamsha: navPlanets,
      transit: transitData
    };

    // F. Run recommendations rules engine
    const recommendationResults = generateRecommendations(chartData, currentDasha, transitData, navPlanets);

    // Get the Moon Sign and Nakshatra for general metadata
    const moonPlanet = planetsMapped.find(p => p.name === 'Moon');
    const moonSign = moonPlanet ? moonPlanet.sign : 'Unknown';
    const nakshatra = moonPlanet ? moonPlanet.nakshatra : 'Unknown';

    return {
      birthInfo: {
        name,
        dob,
        tob,
        pob,
        gender,
        latitude,
        longitude,
        timezone
      },
      chartData,
      currentDasha,
      transitData,
      navPlanets,
      rawApiResponse,
      analysis: recommendationResults.analysis,
      recommendations: {
        lifeStone: recommendationResults.lifeStone,
        luckStone: recommendationResults.luckStone,
        intellectStone: recommendationResults.intellectStone,
        remedialStones: recommendationResults.remedialStones,
        categoryRecommendations: recommendationResults.categoryRecommendations
      },
      moonSign,
      nakshatra
    };
  } catch (error) {
    console.error('Error querying Vedic Astrology API:', error.message);
    throw new Error(`Astrology API request failed: ${error.message}`);
  }
};

module.exports = {
  getAstrologyReport
};
