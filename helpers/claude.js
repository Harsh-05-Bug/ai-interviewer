const fetch = require('node-fetch');
const CLAUDE_API = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

function buildSystemPrompt(config, questionCount, performanceData = null) {
  const total = parseInt(config.questions);
  const typeDesc =
    config.type === 'mixed'
      ? `DSA (Q1-${Math.ceil(total / 4)}), Technical (Q${Math.ceil(total / 4) + 1}-${Math.ceil(total / 2)}), System Design (Q${Math.ceil(total / 2) + 1}-${Math.ceil((3 * total) / 4)}), Behavioral (Q${Math.ceil((3 * total) / 4) + 1}-${total})`
      : `All ${total} questions are ${config.type} type`;

  // Dynamic difficulty adjustment
  let difficultyInstruction = '';
  if (performanceData && questionCount > 0) {
    const { strongAnswers, weakAnswers, skippedAnswers, currentStreak } = performanceData;
    const totalAnswered = strongAnswers + weakAnswers + skippedAnswers;
    const strongRatio = totalAnswered > 0 ? strongAnswers / totalAnswered : 0;

    let effectiveDifficulty = config.difficulty;

    if (strongRatio >= 0.8 && totalAnswered >= 2) {
      if (config.difficulty === 'Easy') effectiveDifficulty = 'Medium';
      else if (config.difficulty === 'Medium') effectiveDifficulty = 'Hard';
      else effectiveDifficulty = 'Hard+';
    } else if (strongRatio >= 0.6 && currentStreak >= 2) {
      if (config.difficulty === 'Easy') effectiveDifficulty = 'Medium';
      else if (config.difficulty === 'Medium') effectiveDifficulty = 'Medium-Hard';
    } else if (strongRatio <= 0.3 && totalAnswered >= 2) {
      if (config.difficulty === 'Hard') effectiveDifficulty = 'Medium';
      else if (config.difficulty === 'Medium') effectiveDifficulty = 'Easy-Medium';
      else effectiveDifficulty = 'Easy';
    } else if (weakAnswers >= 2 && currentStreak <= -2) {
      if (config.difficulty === 'Hard') effectiveDifficulty = 'Medium';
      else if (config.difficulty === 'Medium') effectiveDifficulty = 'Easy';
    }

    difficultyInstruction = `
ADAPTIVE DIFFICULTY:
- Base difficulty: ${config.difficulty}
- Current effective difficulty: ${effectiveDifficulty}
- Performance so far: ${strongAnswers} strong, ${weakAnswers} weak, ${skippedAnswers} skipped out of ${totalAnswered} answers
- Current streak: ${currentStreak > 0 ? `+${currentStreak} strong` : currentStreak < 0 ? `${currentStreak} weak` : 'neutral'}
- IMPORTANT: Adjust the NEXT question's difficulty to ${effectiveDifficulty} level.
  - If candidate is performing well (strong streak), make questions harder, add edge cases, ask for optimization.
  - If candidate is struggling (weak streak), ask slightly easier questions, give more context, break problems into smaller parts.
  - Always stay challenging but fair. The goal is to find the candidate's true level.
  - NEVER tell the candidate you are adjusting difficulty. Keep it seamless.`;
  }

  // Multi-language support
  const languageInstruction = config.language && config.language !== 'English'
    ? `
LANGUAGE INSTRUCTION:
- Conduct this ENTIRE interview in ${config.language}.
- Ask all questions in ${config.language}.
- Give all feedback and responses in ${config.language}.
- Write the final report (STRENGTHS, WEAKNESSES, etc.) in ${config.language}.
- Technical terms like "array", "binary tree", "API", "linked list", "hash map", "database", "REST", "TCP/IP", etc. should REMAIN in English.
- Code snippets, variable names, and programming keywords must stay in English.
- The report format keys (OVERALL_SCORE, TECHNICAL_SCORE, etc.) must stay in English — only the VALUES should be in ${config.language}.
- Be natural and fluent in ${config.language}. Do not mix languages unnecessarily.
- If the candidate responds in English, you may acknowledge but continue in ${config.language}.`
    : '';

  return `You are a strict, senior technical interviewer at a top-tier tech company (Google/Amazon/Meta level).
${languageInstruction}

CANDIDATE PROFILE:
- Role: ${config.role}
- Experience: ${config.experience}
- Difficulty: ${config.difficulty}
- Interview Type: ${config.type}
- Total Questions: ${total}
- Questions asked so far: ${questionCount}
${config.language && config.language !== 'English' ? `- Interview Language: ${config.language}` : ''}
${config.resumeText ? `\nRESUME CONTEXT:\n${config.resumeText.substring(0, 3000)}` : ''}

PHASE STRUCTURE: ${typeDesc}
${difficultyInstruction}

ANSWER EVALUATION (internal — do not share with candidate):
When evaluating each answer, internally classify it as:
- STRONG: Correct, well-explained, covers edge cases, shows depth
- MODERATE: Partially correct, missing some aspects but shows understanding
- WEAK: Incorrect, vague, shallow, or significantly incomplete
- SKIPPED: Candidate chose to skip

Use this classification to calibrate the difficulty of your next question.

STRICT RULES:
1. Ask exactly ONE question per response. Never more.
2. Be professional and slightly strict. Not overly warm.
3. Adjust difficulty dynamically based on answer quality — this is CRITICAL.
4. If answer is incomplete/shallow, ask a sharp follow-up. Prefix with "Follow-up:". Does NOT count as new question.
5. When asking a new numbered question, prefix with "Question ${questionCount + 1}:".
6. Never reveal ideal answers during the interview.
7. Do not repeat questions.
8. After each answer, give brief feedback (1 line) before the next question. Example: "Good approach." or "That's partially correct." or "Not quite, but let's move on."
${config.resumeText ? '9. Reference specific projects/tech from resume when relevant.' : ''}

When all ${total} questions are done, output exactly: INTERVIEW_COMPLETE
Then provide the full report in this EXACT format (plain text):

OVERALL_SCORE: [0-100]
TECHNICAL_SCORE: [0-100 based on technical accuracy and depth]
PROBLEM_SOLVING_SCORE: [0-100 based on approach, optimization, edge cases]
COMMUNICATION_SCORE: [0-100 based on clarity, structure, articulation]
CONFIDENCE_SCORE: [0-100 based on conviction, hesitation, assertiveness]
STRENGTHS: [2-3 specific strengths${config.language && config.language !== 'English' ? ` in ${config.language}` : ''}]
WEAKNESSES: [2-3 specific weaknesses${config.language && config.language !== 'English' ? ` in ${config.language}` : ''}]
TECHNICAL_GAPS: [areas to improve${config.language && config.language !== 'English' ? ` in ${config.language}` : ''}]
COMMUNICATION: [feedback on clarity and depth${config.language && config.language !== 'English' ? ` in ${config.language}` : ''}]
CONFIDENCE: [Low/Medium/High with brief note${config.language && config.language !== 'English' ? ` in ${config.language}` : ''}]
IMPROVEMENTS: [3 actionable suggestions${config.language && config.language !== 'English' ? ` in ${config.language}` : ''}]
DIFFICULTY_PROGRESSION: [How difficulty changed during the interview]
VERDICT: [Selected/Borderline/Rejected]
IDEAL_ANSWERS_START
Q1: [brief ideal answer${config.language && config.language !== 'English' ? ` in ${config.language}` : ''}]
Q2: [brief ideal answer${config.language && config.language !== 'English' ? ` in ${config.language}` : ''}]
IDEAL_ANSWERS_END`;
}

function parseReport(text) {
  const get = (key) => {
    const match = text.match(
      new RegExp(key + ':\\s*(.+?)(?=\\n[A-Z_]+:|IDEAL_ANSWERS_START|$)', 's')
    );
    return match ? match[1].trim() : '';
  };
  const idealMatch = text.match(/IDEAL_ANSWERS_START([\s\S]*?)IDEAL_ANSWERS_END/);
  const ideals = idealMatch
    ? idealMatch[1].trim().split('\n').filter((l) => l.trim())
    : [];
  return {
    overallScore: parseInt(get('OVERALL_SCORE')) || 0,
    technicalScore: parseInt(get('TECHNICAL_SCORE')) || 0,
    problemSolvingScore: parseInt(get('PROBLEM_SOLVING_SCORE')) || 0,
    communicationScore: parseInt(get('COMMUNICATION_SCORE')) || 0,
    confidenceScore: parseInt(get('CONFIDENCE_SCORE')) || 0,
    strengths: get('STRENGTHS'),
    weaknesses: get('WEAKNESSES'),
    technicalGaps: get('TECHNICAL_GAPS'),
    communication: get('COMMUNICATION'),
    confidence: get('CONFIDENCE'),
    improvements: get('IMPROVEMENTS'),
    difficultyProgression: get('DIFFICULTY_PROGRESSION'),
    verdict: get('VERDICT') || 'Borderline',
    idealAnswers: ideals,
  };
}

function analyzePerformance(history) {
  let strongAnswers = 0;
  let weakAnswers = 0;
  let skippedAnswers = 0;
  let currentStreak = 0;

  for (let i = 0; i < history.length; i++) {
    const msg = history[i];

    if (msg.role === 'user') {
      const content = (msg.content || '').toLowerCase();
      if (content.includes('[skipped]') || content.includes('skip this question')) {
        skippedAnswers++;
        currentStreak = Math.min(currentStreak - 1, -1);
        continue;
      }
    }

    if (msg.role === 'assistant' && i > 0 && history[i - 1]?.role === 'user') {
      const content = (msg.content || '').toLowerCase();
      const userAnswer = (history[i - 1].content || '').toLowerCase();

      if (userAnswer.includes('ready to begin')) continue;

      const strongPatterns = /\b(excellent|great|perfect|correct|impressive|well done|good approach|strong answer|nicely|spot[- ]on|thorough|comprehensive|exactly|right)\b/i;
      const weakPatterns = /\b(not quite|incorrect|wrong|missing|incomplete|partially|vague|shallow|needs more|could be better|not entirely|lacks|gap|reconsider|think again|unfortunately)\b/i;
      const isFollowUp = /^follow[- ]?up:/i.test(content.trim());

      if (isFollowUp) {
        weakAnswers++;
        currentStreak = Math.min(currentStreak - 1, -1);
      } else if (strongPatterns.test(content)) {
        strongAnswers++;
        currentStreak = currentStreak >= 0 ? currentStreak + 1 : 1;
      } else if (weakPatterns.test(content)) {
        weakAnswers++;
        currentStreak = currentStreak <= 0 ? currentStreak - 1 : -1;
      } else {
        currentStreak = currentStreak > 0 ? currentStreak - 1 : currentStreak < 0 ? currentStreak + 1 : 0;
      }
    }
  }

  return { strongAnswers, weakAnswers, skippedAnswers, currentStreak };
}

async function callClaude(systemPrompt, messages) {
  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];
  const response = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      temperature: 0.7,
      messages: groqMessages,
    }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `Groq API error: ${response.status}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

module.exports = { callClaude, buildSystemPrompt, parseReport, analyzePerformance, MODEL };