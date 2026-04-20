const mongoose = require('mongoose');
const Groq = require('groq-sdk');

const MONGODB_URI = 'mongodb://localhost:27017/ai_interviewer';
const GROQ_API_KEY = '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';

const groq = new Groq({ apiKey: GROQ_API_KEY });

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  topic: {
    type: String,
    required: true,
    enum: [
      'Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues',
      'Trees', 'Graphs', 'Dynamic Programming', 'Recursion',
      'Sorting & Searching', 'Hashing', 'Heaps',
      'System Design', 'OS', 'DBMS', 'Networks', 'OOP', 'Custom'
    ]
  },
  type: { type: String, enum: ['coding', 'theory'], default: 'coding' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [{ type: String, trim: true }],
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [String],
  hints: [String],
  companies: [String],
  leetcodeLink: { type: String, default: '' },
  customTopic: { type: String, default: '' },
  answer: { type: String, default: '' },
}, { timestamps: true });

questionSchema.index({ title: 1, topic: 1 }, { unique: true });
const Question = mongoose.model('Question', questionSchema);

const DSA_TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues',
  'Trees', 'Graphs', 'Dynamic Programming', 'Recursion',
  'Sorting & Searching', 'Hashing', 'Heaps'
];

const CS_TOPICS = ['System Design', 'OS', 'DBMS', 'Networks', 'OOP'];
const ALL_TOPICS = [...CS_TOPICS, ...DSA_TOPICS];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const MIN_QUESTIONS = 100;

async function generateCodingQuestions(topic, batchNum) {
  const prompt = `Generate exactly 5 unique coding/CS interview questions for the topic: "${topic}". Batch ${batchNum}.

Return ONLY a valid JSON array with exactly 5 objects. No markdown, no explanation, just the JSON array.

Each object must have these exact fields:
{
  "title": "Question title",
  "description": "Problem description in 2 sentences max",
  "difficulty": "Easy" or "Medium" or "Hard",
  "tags": ["tag1", "tag2"],
  "examples": [{"input": "example input", "output": "example output", "explanation": "why"}],
  "constraints": ["constraint 1"],
  "hints": ["hint 1"],
  "companies": ["Google", "Amazon", "Microsoft"],
  "leetcodeLink": "",
  "type": "coding",
  "answer": ""
}

Return ONLY the JSON array, nothing else.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0].message.content.trim();
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array found in response');

  let questions;
  try {
    questions = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`Invalid JSON from model: ${e.message}`);
  }

  return questions.map(q => ({ ...q, topic, type: 'coding' }));
}

async function generateTheoryQuestions(topic, batchNum) {
  const prompt = `Generate exactly 5 unique theory interview questions for the topic: "${topic}". Batch ${batchNum}.

Return ONLY a valid JSON array with exactly 5 objects. No markdown, no explanation, just the JSON array.

Each object must have these exact fields:
{
  "title": "Question title e.g. What is a deadlock?",
  "description": "The question asked clearly in 1-2 sentences",
  "difficulty": "Easy" or "Medium" or "Hard",
  "answer": "Detailed theory answer in 4-6 sentences explaining the concept clearly with a real world example",
  "examples": [{"input": "Real world scenario", "output": "How it applies", "explanation": "Why this example"}],
  "tags": ["tag1", "tag2"],
  "hints": ["hint 1"],
  "companies": [],
  "leetcodeLink": "",
  "type": "theory"
}

Questions should be deep theory questions asked in interviews. Mix Easy/Medium/Hard.
Return ONLY the JSON array, nothing else.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0].message.content.trim();
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array found in response');

  let questions;
  try {
    questions = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`Invalid JSON from model: ${e.message}`);
  }

  return questions.map(q => ({ ...q, topic, type: 'theory' }));
}

async function seedTopic(topic) {
  const existing = await Question.countDocuments({ topic });

  if (existing >= MIN_QUESTIONS) {
    console.log(`\n⏭️  Skipping "${topic}" (${existing} questions already in DB)`);
    return;
  }

  const isTheory = CS_TOPICS.includes(topic);

  if (existing > 0) {
    console.log(`\n🔄 Resuming "${topic}" (${existing} questions, need ${MIN_QUESTIONS}) [${isTheory ? 'theory' : 'coding'}]`);
  } else {
    console.log(`\n🚀 Seeding "${topic}" [${isTheory ? 'theory' : 'coding'}]`);
  }

  // ✅ Removed delete block — no longer deletes existing questions

  let allQuestions = [];

  for (let batch = 1; batch <= 10; batch++) {
    console.log(`  📦 Batch ${batch}/10...`);
    try {
      const questions = isTheory
        ? await generateTheoryQuestions(topic, batch)
        : await generateCodingQuestions(topic, batch);

      const existingTitles = await Question.distinct('title', { topic });
      const newQuestions = questions.filter(q => !existingTitles.includes(q.title));

      allQuestions = allQuestions.concat(newQuestions);
      console.log(`  ✅ Got ${newQuestions.length} new questions (total so far: ${allQuestions.length})`);
      await sleep(15000);
    } catch (err) {
      console.error(`  ❌ Batch ${batch} failed:`, err.message);
      await sleep(20000);
    }
  }

  if (allQuestions.length > 0) {
    try {
      await Question.insertMany(allQuestions, { ordered: false });
    } catch (err) {
      if (err.code === 11000) {
        console.log(`  ⚠️  Some duplicates skipped, continuing...`);
      } else {
        throw err;
      }
    }
    console.log(`  💾 Saved ${allQuestions.length} questions for "${topic}"`);
  }
}

async function main() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected!\n');

  console.log('🧹 Cleaning up duplicate questions...');
  for (const topic of ALL_TOPICS) {
    const seen = new Set();
    const all = await Question.find({ topic }).sort({ createdAt: 1 });
    for (const q of all) {
      if (seen.has(q.title)) {
        await Question.deleteOne({ _id: q._id });
      } else {
        seen.add(q.title);
      }
    }
  }
  console.log('✅ Cleanup done!\n');

  const startTime = Date.now();

  for (const topic of ALL_TOPICS) {
    await seedTopic(topic);
    await sleep(10000);
  }

  const total = await Question.countDocuments();
  const elapsed = Math.round((Date.now() - startTime) / 1000);

  console.log(`\n🎉 Done! ${total} questions in database (took ${elapsed}s)`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Fatal error:', err);
  mongoose.disconnect();
  process.exit(1);
});