// scripts/seed-detailed-answers.js
//
// Upserts the `detailedAnswer` field on existing Question docs.
// Matches by { topic, title } with apostrophe-tolerant fallback.
//
// Usage:
//   - As a CLI:        node scripts/seed-detailed-answers.js
//   - As a function:   const seedDetailedAnswers = require('./scripts/seed-detailed-answers');
//                      await seedDetailedAnswers();

const mongoose = require('mongoose');
const Question = require('../models/Question');
const detailedAnswers = require('./detailed-answers-data');

const TITLE_FIELD = 'title';

// Normalize: lowercase + replace curly quotes with straight + collapse whitespace
function norm(s) {
  return String(s)
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .toLowerCase()
    .trim();
}

async function seedDetailedAnswers() {
  let updated = 0;
  let notFound = 0;
  let unchanged = 0;
  const missing = [];

  // Pre-load all titles per topic for fallback fuzzy matching
  const allDocs = await Question.find({}, { topic: 1, [TITLE_FIELD]: 1 }).lean();
  const byTopicNorm = {};
  for (const doc of allDocs) {
    if (!byTopicNorm[doc.topic]) byTopicNorm[doc.topic] = new Map();
    byTopicNorm[doc.topic].set(norm(doc[TITLE_FIELD]), doc[TITLE_FIELD]);
  }

  for (const topic of Object.keys(detailedAnswers)) {
    for (const title of Object.keys(detailedAnswers[topic])) {
      const detailedAnswer = detailedAnswers[topic][title];

      // 1) Try exact match
      let result = await Question.updateOne(
        { topic, [TITLE_FIELD]: title },
        { $set: { detailedAnswer } }
      );

      // 2) Fallback: case/apostrophe-insensitive lookup
      if (result.matchedCount === 0) {
        const normalized = norm(title);
        const actualTitle = byTopicNorm[topic]?.get(normalized);
        if (actualTitle) {
          result = await Question.updateOne(
            { topic, [TITLE_FIELD]: actualTitle },
            { $set: { detailedAnswer } }
          );
        }
      }

      if (result.matchedCount === 0) {
        notFound++;
        missing.push(`${topic} / ${title}`);
      } else if (result.modifiedCount === 0) {
        unchanged++;
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

if (require.main === module) {
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('ERROR: MONGODB_URI (or MONGO_URI) env var not set.');
    process.exit(1);
  }

  (async () => {
    try {
      await mongoose.connect(MONGO_URI);
      const result = await seedDetailedAnswers();
      console.log(JSON.stringify(result, null, 2));
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('Seed failed:', err);
      process.exit(1);
    }
  })();
}

module.exports = seedDetailedAnswers;
