/**
 * GemGuide AI - Gemstone Database Seeder
 * 
 * Run using: node backend/utils/seedGemstones.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Gemstone = require('../models/Gemstone');

// Try to load env from root first, then fall back to server dir
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const gemstones = [
  {
    name: 'Ruby',
    sanskritName: 'Manikya',
    hindiName: 'Manik',
    rulingPlanet: 'Sun',
    deity: 'Surya',
    metal: 'Gold or Copper',
    finger: 'Ring Finger of Right Hand',
    day: 'Sunday Morning (during sunrise)',
    mantra: 'Om Hram Hreem Hroum Sah Suryaya Namah',
    color: '#E0115F', // Crimson / Ruby Red
    description: 'Ruby is the king of gemstones and represents the Sun. It is known to bestow name, fame, power, and leadership qualities upon the wearer.',
    benefits: [
      'Enhances leadership skills, authority, and self-confidence.',
      'Improves relationship with father and government authorities.',
      'Boosts energy levels, vitality, and blood circulation.',
      'Clears confusion and instills positive thinking.'
    ],
    precautions: [
      'Do not wear with Blue Sapphire (Saturn), Diamond (Venus), Gomed (Rahu), or Cat\'s Eye (Ketu).'
    ],
    weightRule: '1 Carat per 10 kg of body weight (e.g., a 70kg person should wear a 7-carat Ruby).',
    wearingInstructions: 'Purify the gemstone in unboiled milk and gangajal (holy water). Light incense, chant the Sun mantra 108 times, and wear it on a Sunday morning during the ascending moon cycle.'
  },
  {
    name: 'Pearl',
    sanskritName: 'Mukta',
    hindiName: 'Moti',
    rulingPlanet: 'Moon',
    deity: 'Chandra / Shiva',
    metal: 'Silver',
    finger: 'Little Finger of Right Hand',
    day: 'Monday Morning (during sunrise)',
    mantra: 'Om Shram Shreem Shroum Sah Chandraya Namah',
    color: '#F4F6F0', // Pearl White
    description: 'Pearl is the stone of the Moon. It governs the mind, emotions, and mental peace. It brings emotional stability and calms an overactive brain.',
    benefits: [
      'Calms anger, reduces stress, and relieves anxiety/depression.',
      'Brings mental clarity and enhances intuitive powers.',
      'Improves relation with mother and benefits maternal health.',
      'Controls body fluids and resolves sleep disorders.'
    ],
    precautions: [
      'Do not wear with Blue Sapphire, Gomed, or Cat\'s Eye.'
    ],
    weightRule: '1 Carat per 10 kg of body weight.',
    wearingInstructions: 'Purify in raw milk, honey, and holy water. Chant the Moon mantra 108 times on Monday morning, and wear the silver ring on your little finger.'
  },
  {
    name: 'Red Coral',
    sanskritName: 'Praval',
    hindiName: 'Moonga',
    rulingPlanet: 'Mars',
    deity: 'Hanuman / Kartikeya',
    metal: 'Gold or Copper',
    finger: 'Ring Finger of Right Hand',
    day: 'Tuesday Morning',
    mantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namah',
    color: '#FF4F00', // Coral Red
    description: 'Red Coral is the stone of Mars, the planet of energy, courage, and action. It enhances courage, physical strength, and helps overcome fear.',
    benefits: [
      'Improves courage, willpower, and leadership.',
      'Helps overcome debts, legal obstacles, and enemies.',
      'Purifies blood, boosts stamina, and aids muscle recovery.',
      'Aids in overcoming Manglik Dosha (when recommended).'
    ],
    precautions: [
      'Do not wear with Emerald, Diamond, Blue Sapphire, or Gomed.'
    ],
    weightRule: '1 Carat per 10 kg of body weight.',
    wearingInstructions: 'Purify in milk and holy water. Light red flowers and incense, chant the Mars mantra 108 times, and wear on a Tuesday morning.'
  },
  {
    name: 'Emerald',
    sanskritName: 'Marakata',
    hindiName: 'Panna',
    rulingPlanet: 'Mercury',
    deity: 'Ganesha / Vishnu',
    metal: 'Gold or Bronze',
    finger: 'Little Finger of Right Hand',
    day: 'Wednesday Morning',
    mantra: 'Om Bram Breem Broum Sah Budhaya Namah',
    color: '#50C878', // Emerald Green
    description: 'Emerald represents Mercury, the planet of intellect, business, speech, and communication. It boosts intellectual capacity and trading success.',
    benefits: [
      'Enhances communication skills, memory, and analytical intellect.',
      'Highly beneficial for business owners, accountants, writers, and speakers.',
      'Brings financial prosperity and career growth.',
      'Improves skin health and calms the nervous system.'
    ],
    precautions: [
      'Do not wear with Pearl or Red Coral.'
    ],
    weightRule: '1 Carat per 12 kg of body weight.',
    wearingInstructions: 'Dip the ring in raw milk and gangajal. Worship Lord Ganesha, chant the Mercury mantra 108 times, and wear on a Wednesday morning.'
  },
  {
    name: 'Yellow Sapphire',
    sanskritName: 'Pushparaja',
    hindiName: 'Pukhraj',
    rulingPlanet: 'Jupiter',
    deity: 'Brihaspati / Shiva',
    metal: 'Gold',
    finger: 'Index Finger of Right Hand',
    day: 'Thursday Morning',
    mantra: 'Om Gram Greem Groum Sah Gurave Namah',
    color: '#FFD700', // Golden Yellow
    description: 'Yellow Sapphire represents Jupiter, the most benefic planet representing wisdom, fortune, marriage, and spiritual realization. It brings overall prosperity.',
    benefits: [
      'Attracts wealth, wisdom, and spiritual growth.',
      'Highly auspicious for marriage and marital harmony.',
      'Improves liver, stomach, and digestive health.',
      'Protects from negative energy and provides clear foresight.'
    ],
    precautions: [
      'Do not wear with Diamond, Blue Sapphire, Gomed, or Cat\'s Eye.'
    ],
    weightRule: '1 Carat per 12 kg of body weight.',
    wearingInstructions: 'Purify in raw milk and holy water. Worship Lord Shiva or Guru, chant the Jupiter mantra 108 times on Thursday morning, and wear it on your index finger.'
  },
  {
    name: 'Diamond',
    sanskritName: 'Vajra',
    hindiName: 'Heera',
    rulingPlanet: 'Venus',
    deity: 'Shukradev / Lakshmi',
    metal: 'White Gold, Platinum, or Silver',
    finger: 'Middle or Little Finger of Right Hand',
    day: 'Friday Morning',
    mantra: 'Om Dram Dreem Droum Sah Shukraya Namah',
    color: '#E0F7FA', // Brilliant Diamond Sparkle
    description: 'Diamond represents Venus, the planet of luxury, art, beauty, love, and relationships. It brings artistic success, comfort, and rich experiences.',
    benefits: [
      'Attracts luxury, comforts, wealth, and material assets.',
      'Enhances creative talents, beauty, and social status.',
      'Improves romantic life and strengthens marital relationships.',
      'Boosts vitality and reproductive health.'
    ],
    precautions: [
      'Do not wear with Ruby, Pearl, or Yellow Sapphire.'
    ],
    weightRule: '0.5 to 1.5 Carats (Diamond is rarely worn by body weight; substitute Opal / White Sapphire can be worn: 1 Carat per 10kg).',
    wearingInstructions: 'Purify in raw milk and holy water. Worship Goddess Lakshmi, chant the Venus mantra 108 times on Friday morning, and wear the ring.'
  },
  {
    name: 'Blue Sapphire',
    sanskritName: 'Neelam',
    hindiName: 'Neelam',
    rulingPlanet: 'Saturn',
    deity: 'Shani / Shiva',
    metal: 'Iron, Silver, or White Gold',
    finger: 'Middle Finger of Right Hand',
    day: 'Saturday Evening or Morning',
    mantra: 'Om Pram Preem Proum Sah Shanishcharaya Namah',
    color: '#0F52BA', // Sapphire Blue
    description: 'Blue Sapphire represents Saturn. It is the fastest-acting gemstone. It can bring immense wealth, health, and relief from obstacles if favorable, but must be tested before wearing.',
    benefits: [
      'Offers rapid advancement in career and sudden wealth.',
      'Protects against enemies, evil eyes, and black magic.',
      'Removes laziness, improves focus and discipline.',
      'Alleviates chronic neurological and bone issues.'
    ],
    precautions: [
      'Do not wear with Ruby, Pearl, Red Coral, or Yellow Sapphire. Test by placing under your pillow for 3 days before wearing.'
    ],
    weightRule: '1 Carat per 12 kg of body weight.',
    wearingInstructions: 'Dip in mustard oil, raw milk, and gangajal. Test under your pillow. Worship Lord Shani, chant the Saturn mantra 108 times, and wear on a Saturday.'
  },
  {
    name: 'Hessonite',
    sanskritName: 'Gomedaka',
    hindiName: 'Gomed',
    rulingPlanet: 'Rahu',
    deity: 'Saraswati',
    metal: 'Silver or Alloy',
    finger: 'Middle Finger of Right Hand',
    day: 'Saturday Morning or Wednesday Night',
    mantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namah',
    color: '#8B4513', // Honey / Cinnamon Brown
    description: 'Hessonite represents Rahu. It clears confusion, removes fear of the unknown, and helps succeed in speculative businesses and politics.',
    benefits: [
      'Protects from sudden accidents, litigation, and hidden enemies.',
      'Brings success in IT, politics, research, and import-export.',
      'Cures gastric problems and skin allergies.',
      'Helps overcome deep-seated anxieties and hallucinations.'
    ],
    precautions: [
      'Do not wear with Ruby, Pearl, or Yellow Sapphire.'
    ],
    weightRule: '1 Carat per 10 kg of body weight.',
    wearingInstructions: 'Purify in milk and gangajal. Chant the Rahu mantra 108 times, and wear on your middle finger on a Saturday or Wednesday night.'
  },
  {
    name: "Cat's Eye",
    sanskritName: 'Vaidurya',
    hindiName: 'Lehsuniya',
    rulingPlanet: 'Ketu',
    deity: 'Ganesha',
    metal: 'Silver',
    finger: 'Middle Finger of Right Hand',
    day: 'Tuesday Morning or Thursday Night',
    mantra: 'Om Stram Streem Stroum Sah Ketave Namah',
    color: '#808000', // Olive / Cat\'s Eye chrysoberyl
    description: 'Cat\'s Eye represents Ketu. It brings intuition, spiritual liberation (Moksha), protection from losses, and restores ruined businesses.',
    benefits: [
      'Protects from accidents, bad luck, and spiritual attacks.',
      'Enhances psychic abilities, memory, and deep intuition.',
      'Helps retrieve stuck wealth and rebuild broken enterprises.',
      'Heals respiratory issues and kidney-related ailments.'
    ],
    precautions: [
      'Do not wear with Ruby, Pearl, or Yellow Sapphire.'
    ],
    weightRule: '1 Carat per 10 kg of body weight.',
    wearingInstructions: 'Purify in milk and gangajal. Worship Lord Ganesha, chant the Ketu mantra 108 times, and wear on Tuesday morning.'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/gemguide_ai';
    console.log(`Connecting to database for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Clear existing
    await Gemstone.deleteMany({});
    console.log('Cleared existing gemstones database.');

    // Insert new
    await Gemstone.insertMany(gemstones);
    console.log('Successfully seeded 9 primary gemstones!');

    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
