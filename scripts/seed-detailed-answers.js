// scripts/seed-detailed-answers.js
//
// Upserts the `detailedAnswer` field on existing Question docs.
// Matches by { topic, title } — adjust the match field below if your
// Question schema uses a different field (e.g. `question` instead of `title`).
//
// Usage:
//   - As a CLI:        node scripts/seed-detailed-answers.js
//   - As a function:   const seedDetailedAnswers = require('./scripts/seed-detailed-answers');
//                      await seedDetailedAnswers();

const mongoose = require('mongoose');
const Question = require('../models/Question');
const detailedAnswers = require('./detailed-answers-data');

// CHANGE THIS if your Question schema's title field is named differently.
const TITLE_FIELD = 'title';

async function seedDetailedAnswers() {
  let updated = 0;
  let notFound = 0;
  let unchanged = 0;
  const missing = [];

  for (const topic of Object.keys(detailedAnswers)) {
    for (const title of Object.keys(detailedAnswers[topic])) {
      const detailedAnswer = detailedAnswers[topic][title];

      const filter = { topic, [TITLE_FIELD]: title };
      const result = await Question.updateOne(
        filter,
        { $set: { detailedAnswer } }
      );

      if (result.matchedCount === 0) {
        notFound++;
        missing.push(`${topic} / ${title}`);
      } else if (result.modifiedCount === 0) {
        unchanged++; // matched but value already identical
      } else {
        updated++;
      }
    }
  }

  return {
    totalEntries: Object.values(detailedAnswers).reduce(
      (a, t) => a + Object.keys(t).length,
      0
    ),
    updated,
    unchanged,
    notFound,
    missing,
  };
}

// CLI mode
if (require.main === module) {
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('ERROR: MONGODB_URI (or MONGO_URI) env var not set.');
    process.exit(1);
  }

  (async () => {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(MONGO_URI);
      console.log('Connected. Seeding detailed answers...');

      const result = await seedDetailedAnswers();

      console.log('\n=== Seed Complete ===');
      console.log('Total entries in data file:', result.totalEntries);
      console.log('Updated (value changed):  ', result.updated);
      console.log('Unchanged (already same): ', result.unchanged);
      console.log('Not found in DB:          ', result.notFound);

      if (result.missing.length > 0) {
        console.log('\nUnmatched entries (no Question doc found):');
        result.missing.forEach(m => console.log('  -', m));
        console.log(
          '\nFix: ensure the question titles in MongoDB match the keys in detailed-answers-data.js,'
        );
        console.log('or change TITLE_FIELD in this script if your schema uses a different field name.');
      }

      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('Seed failed:', err);
      process.exit(1);
    }
  })();
}

module.exports = seedDetailedAnswers;
