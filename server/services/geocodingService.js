const axios = require('axios');
const tzlookup = require('tz-lookup');
const moment = require('moment-timezone');

/**
 * Geocodes a place name into latitude, longitude, and timezone offset.
 * 
 * @param {string} pob - Place of Birth (e.g., "Dehradun")
 * @param {string} dob - Date of Birth (YYYY-MM-DD)
 * @param {string} tob - Time of Birth (HH:MM)
 * @returns {Promise<{ latitude: number, longitude: number, timezone: number, timezoneName: string }>}
 */
const geocodePlace = async (pob, dob, tob) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pob)}&format=json&limit=1`;
    
    // OSM Nominatim requires a user-agent header
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'GemGuideAI/1.0 (contact@gemguideai.com)'
      }
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(`Place of birth "${pob}" could not be resolved to geographical coordinates.`);
    }

    const firstResult = response.data[0];
    const latitude = parseFloat(firstResult.lat);
    const longitude = parseFloat(firstResult.lon);

    // Resolve timezone name (e.g. "Asia/Kolkata")
    const timezoneName = tzlookup(latitude, longitude);

    // Calculate timezone offset at the historical birth date and time
    // format of dob: YYYY-MM-DD, tob: HH:MM
    const datetimeStr = `${dob}T${tob}:00`;
    const birthMoment = moment.tz(datetimeStr, timezoneName);
    
    if (!birthMoment.isValid()) {
      throw new Error(`Invalid Date/Time combination: ${dob} ${tob}`);
    }

    // utcOffset returns offset in minutes (e.g. +330 for India, -300 for EST)
    const offsetMinutes = birthMoment.utcOffset();
    const timezone = offsetMinutes / 60; // Decimal hours (e.g. 5.5, -5)

    return {
      latitude,
      longitude,
      timezone,
      timezoneName
    };
  } catch (error) {
    console.error('Geocoding service error:', error.message);
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

module.exports = {
  geocodePlace
};
