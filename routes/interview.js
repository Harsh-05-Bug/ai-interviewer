const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const { callClaude, buildSystemPrompt, parseReport, analyzePerformance } = require('../helpers/claude');
const { JWT_SECRET } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF, DOCX, and TXT files are allowed.'));
  },
});

async function parseResume(buffer, mimetype, originalname) {
  if (mimetype === 'text/plain') return buffer.toString('utf-8');
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || originalname?.endsWith('.docx')) {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  if (mimetype === 'application/pdf') {
    try {
      const pdfParse = require('pdf-parse');
      const fn = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
      const data = await fn(buffer);
      if (data.text && data.text.trim().length > 10) return data.text;
    } catch (e) { console.log('pdf-parse failed:', e.message); }
    const raw = buffer.toString('utf-8');
    const textChunks = [];
    const regex = /\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(raw)) !== null) {
      const chunk = match[1].replace(/\\n/g, '\n').replace(/\\\(/g, '(').replace(/\\\)/g, ')');
      if (chunk.trim().length > 1) textChunks.push(chunk.trim());
    }
    if (textChunks.join(' ').trim().length > 10) return textChunks.join(' ');
    return '';
  }
  return buffer.toString('utf-8');
}

function getUserId(req) {
  try {
    const token = req.cookies?.token;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch { return null; }
}

router.post('/start', async (req, res) => {
  try {
    const { role, experience, difficulty, type, questions, resumeText } = req.body;
    if (!role || !experience || !difficulty || !type || !questions)
      return res.status(400).json({ success: false, error: 'Missing required config fields.' });
    const sessionId = uuidv4();
    const userId = getUserId(req);
    const config = { role, experience, difficulty, type, questions: parseInt(questions), hasResume: !!resumeText, resumeText };
    const systemPrompt = buildSystemPrompt(config, 0);
    const initMessages = [{ role: 'user', content: 'Hello, I am ready to begin the interview. Please start.' }];
    const reply = await callClaude(systemPrompt, initMessages);
    const session = await Session.create({
      sessionId, userId,
      config: { role, experience, difficulty, type, questions: parseInt(questions), hasResume: !!resumeText },
      history: [
        { role: 'user', content: 'Hello, I am ready to begin the interview. Please start.' },
        { role: 'assistant', content: reply },
      ],
      questionCount: /question 1:/i.test(reply) ? 1 : 0,
      status: 'in_progress',
    });
    res.status(201).json({ success: true, sessionId, reply, questionCount: session.questionCount });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/message', async (req, res) => {
  try {
    const { sessionId, answer, resumeText } = req.body;
    if (!sessionId || !answer) return res.status(400).json({ success: false, error: 'sessionId and answer required.' });
    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found.' });
    const userId = getUserId(req);
    if (session.userId && (!userId || session.userId.toString() !== userId.toString()))
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    if (session.status === 'completed') return res.status(400).json({ success: false, error: 'Interview already completed.' });
    session.history.push({ role: 'user', content: answer });
    const messages = session.history.map(m => ({ role: m.role, content: m.content }));
    const performanceData = analyzePerformance(session.history);
    const systemPrompt = buildSystemPrompt({ ...session.config, resumeText: resumeText || '' }, session.questionCount, performanceData);
    const reply = await callClaude(systemPrompt, messages);
    session.history.push({ role: 'assistant', content: reply });
    if (reply.includes('INTERVIEW_COMPLETE')) {
      const report = parseReport(reply);
      session.report = report; session.status = 'completed'; session.completedAt = new Date();
      await session.save();
      return res.json({ success: true, reply: reply.split('INTERVIEW_COMPLETE')[0].trim(), done: true, report, questionCount: session.questionCount });
    }
    const nextQ = session.questionCount + 1;
    if (new RegExp(`question ${nextQ}:`, 'i').test(reply)) session.questionCount = nextQ;
    await session.save();
    res.json({ success: true, reply, done: false, questionCount: session.questionCount });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/hint', async (req, res) => {
  try {
    const { sessionId, resumeText } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, error: 'sessionId required.' });
    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found.' });
    const userId = getUserId(req);
    if (session.userId && (!userId || session.userId.toString() !== userId.toString()))
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    if (session.status === 'completed') return res.status(400).json({ success: false, error: 'Already completed.' });
    const messages = session.history.map(m => ({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: 'I need a hint for this question. Please give me a brief hint without revealing the full answer.' });
    const performanceData = analyzePerformance(session.history);
    const systemPrompt = buildSystemPrompt({ ...session.config, resumeText: resumeText || '' }, session.questionCount, performanceData);
    const reply = await callClaude(systemPrompt, messages);
    res.json({ success: true, hint: reply });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found.' });
    const userId = getUserId(req);
    if (session.userId && (!userId || session.userId.toString() !== userId.toString()))
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    res.json({ success: true, session });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/transcript/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found.' });
    const userId = getUserId(req);
    if (session.userId && (!userId || session.userId.toString() !== userId.toString()))
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    res.json({ success: true, transcript: { sessionId: session.sessionId, config: session.config, status: session.status, history: session.history, questionCount: session.questionCount, startedAt: session.startedAt, completedAt: session.completedAt, report: session.report } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/shared-report/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId, status: 'completed' });
    if (!session || !session.report) return res.status(404).json({ success: false, error: 'Report not found.' });
    res.json({ success: true, report: { overallScore: session.report.overallScore, technicalScore: session.report.technicalScore, problemSolvingScore: session.report.problemSolvingScore, communicationScore: session.report.communicationScore, confidenceScore: session.report.confidenceScore, strengths: session.report.strengths, weaknesses: session.report.weaknesses, technicalGaps: session.report.technicalGaps, communication: session.report.communication, confidence: session.report.confidence, improvements: session.report.improvements, verdict: session.report.verdict }, config: session.config, completedAt: session.completedAt, startedAt: session.startedAt });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = getUserId(req);
    const filter = { status: 'completed' };
    if (userId) filter.userId = userId; else filter.userId = null;
    const sessions = await Session.find(filter).select('sessionId config report startedAt completedAt').sort({ createdAt: -1 }).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit));
    const total = await Session.countDocuments(filter);
    res.json({ success: true, sessions, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/stats', async (req, res) => {
  try {
    const userId = getUserId(req);
    const baseFilter = userId ? { userId } : { userId: null };
    const totalSessions = await Session.countDocuments(baseFilter);
    const completedSessions = await Session.countDocuments({ ...baseFilter, status: 'completed' });
    const verdictStats = await Session.aggregate([{ $match: { ...baseFilter, status: 'completed' } }, { $group: { _id: '$report.verdict', count: { $sum: 1 } } }]);
    const avgScore = await Session.aggregate([{ $match: { ...baseFilter, status: 'completed', 'report.overallScore': { $gt: 0 } } }, { $group: { _id: null, avg: { $avg: '$report.overallScore' } } }]);
    const roleStats = await Session.aggregate([{ $match: { ...baseFilter, status: 'completed' } }, { $group: { _id: '$config.role', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]);
    res.json({ success: true, stats: { totalSessions, completedSessions, averageScore: avgScore[0]?.avg?.toFixed(1) || 0, verdictBreakdown: verdictStats, topRoles: roleStats } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.delete('/session/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found.' });
    const userId = getUserId(req);
    if (session.userId && (!userId || session.userId.toString() !== userId.toString()))
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    await Session.deleteOne({ sessionId: req.params.sessionId });
    res.json({ success: true, message: 'Session deleted.' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded.' });
    const rawText = await parseResume(req.file.buffer, req.file.mimetype, req.file.originalname);
    const text = rawText.substring(0, 4000);
    if (!text.trim()) return res.status(400).json({ success: false, error: 'Could not extract text.' });
    res.json({ success: true, resumeText: text, filename: req.file.originalname });
  } catch (err) { res.status(500).json({ success: false, error: 'Failed to parse resume: ' + err.message }); }
});

router.get('/report-pdf/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId, status: 'completed' });
    if (!session || !session.report) return res.status(404).json({ success: false, error: 'Not found.' });
    const userId = getUserId(req);
    if (session.userId && (!userId || session.userId.toString() !== userId.toString()))
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=interview-report-${session.sessionId.slice(0, 8)}.pdf`);
    doc.pipe(res);
    const r = session.report; const c = session.config;
    const verdictColor = r.verdict === 'Selected' ? '#00C896' : r.verdict === 'Rejected' ? '#FF3A5C' : '#F5C842';
    doc.rect(0, 0, 595, 100).fill('#0A0A0F');
    doc.fontSize(24).fill('#F5C842').text('AI Interviewer', 50, 30);
    doc.fontSize(10).fill('#8888AA').text('Interview Performance Report', 50, 60);
    doc.fontSize(10).fill('#8888AA').text(new Date(session.completedAt || session.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }), 400, 60);
    let y = 120;
    doc.rect(50, y, 495, 60).fill('#13131A').stroke();
    doc.fontSize(10).fill('#8888AA').text('CANDIDATE PROFILE', 65, y + 10);
    doc.fontSize(11).fill('#E8E8F0').text(`${c.role}  ·  ${c.experience}  ·  ${c.type} interview  ·  ${c.difficulty} difficulty`, 65, y + 30);
    y += 80;
    doc.rect(50, y, 240, 80).fill('#13131A').stroke();
    doc.fontSize(10).fill('#8888AA').text('VERDICT', 65, y + 10);
    doc.fontSize(22).fill(verdictColor).text(r.verdict || 'Borderline', 65, y + 30);
    doc.rect(305, y, 240, 80).fill('#13131A').stroke();
    doc.fontSize(10).fill('#8888AA').text('OVERALL SCORE', 320, y + 10);
    doc.fontSize(28).fill('#E8E8F0').text(`${r.overallScore || 0}`, 320, y + 30);
    doc.fontSize(12).fill('#8888AA').text('/ 100', 370, y + 40);
    y += 100;
    const scores = [{ label: 'Technical', val: r.technicalScore || r.overallScore || 0 }, { label: 'Problem Solving', val: r.problemSolvingScore || r.overallScore || 0 }, { label: 'Communication', val: r.communicationScore || r.overallScore || 0 }, { label: 'Confidence', val: r.confidenceScore || r.overallScore || 0 }];
    const boxW = 113;
    scores.forEach((s, i) => { const x = 50 + i * (boxW + 10); doc.rect(x, y, boxW, 55).fill('#13131A').stroke(); const sc = s.val >= 75 ? '#00C896' : s.val >= 50 ? '#F5C842' : '#FF3A5C'; doc.fontSize(18).fill(sc).text(`${s.val}`, x + 10, y + 8, { width: boxW - 20, align: 'center' }); doc.fontSize(8).fill('#8888AA').text(s.label, x + 10, y + 35, { width: boxW - 20, align: 'center' }); });
    y += 75;
    const addSection = (title, content, textColor) => { if (!content) return; if (y > 700) { doc.addPage(); y = 50; } doc.fontSize(9).fill('#8888AA').text(title.toUpperCase(), 50, y); y += 15; doc.fontSize(10).fill(textColor || '#E8E8F0').text(content, 50, y, { width: 495 }); y = doc.y + 15; };
    addSection('Strengths', r.strengths, '#00C896');
    addSection('Weaknesses', r.weaknesses, '#FF6B84');
    addSection('Technical Gaps', r.technicalGaps, '#F5C842');
    addSection('Communication Feedback', r.communication, '#E8E8F0');
    addSection('Confidence', r.confidence, '#E8E8F0');
    addSection('Improvements', r.improvements, '#00DFA8');
    addSection('Difficulty Progression', r.difficultyProgression, '#818cf8');
    if (r.idealAnswers && r.idealAnswers.length > 0) { if (y > 650) { doc.addPage(); y = 50; } doc.fontSize(9).fill('#8888AA').text('IDEAL ANSWERS', 50, y); y += 15; r.idealAnswers.forEach(ans => { if (y > 720) { doc.addPage(); y = 50; } doc.fontSize(10).fill('#E8E8F0').text(`${ans}`, 50, y, { width: 495 }); y = doc.y + 10; }); }
    if (y > 720) { doc.addPage(); y = 50; }
    y = Math.max(y + 20, 750);
    doc.fontSize(8).fill('#5C5C7A').text('Generated by AI Interviewer · This is an AI-generated assessment', 50, y, { width: 495, align: 'center' });
    doc.end();
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Daily Challenge - Get
router.get('/daily-challenge', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, error: 'Login required.' });
    const User = require('../models/User');
    const user = await User.findById(userId);
    const today = new Date().toISOString().split('T')[0];
    const completedToday = user.dailyChallenges?.some(d => d.date === today);
    let streak = 0;
    if (user.dailyChallenges?.length > 0) {
      const sorted = [...user.dailyChallenges].sort((a, b) => new Date(b.date) - new Date(a.date));
      const checkDate = new Date();
      if (!completedToday) checkDate.setDate(checkDate.getDate() - 1);
      for (let i = 0; i < sorted.length; i++) {
        const expected = new Date(checkDate); expected.setDate(expected.getDate() - i);
        if (sorted[i].date === expected.toISOString().split('T')[0]) streak++; else break;
      }
      if (completedToday) streak = Math.max(streak, 1);
    }
    const seed = today.replace(/-/g, '');
    const topics = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching', 'Stacks & Queues', 'Hash Maps', 'Recursion', 'Bit Manipulation', 'Greedy Algorithms', 'Backtracking', 'System Design Basics'];
    const difficulties = ['Easy', 'Medium', 'Medium', 'Hard'];
    res.json({ success: true, challenge: { date: today, topic: topics[parseInt(seed) % topics.length], difficulty: difficulties[parseInt(seed.slice(-2)) % difficulties.length], completed: completedToday, streak, totalCompleted: user.dailyChallenges?.length || 0 } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Daily Challenge - Submit
router.post('/daily-challenge', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, error: 'Login required.' });
    const User = require('../models/User');
    const user = await User.findById(userId);
    const today = new Date().toISOString().split('T')[0];
    if (user.dailyChallenges?.some(d => d.date === today)) return res.status(400).json({ success: false, error: 'Already completed today.' });
    const { answer, topic, difficulty } = req.body;
    if (!answer || !topic) return res.status(400).json({ success: false, error: 'Answer and topic required.' });
    const systemPrompt = `You are a technical interviewer. Evaluate this answer to a ${difficulty} ${topic} question.\nGive a score from 0-100, brief feedback (2-3 sentences), and the ideal answer (2-3 sentences).\nFormat your response EXACTLY like:\nSCORE: [number]\nFEEDBACK: [your feedback]\nIDEAL: [ideal answer]`;
    const questionPrompt = `Topic: ${topic}, Difficulty: ${difficulty}.\nFirst generate a ${difficulty} interview question about ${topic}, then evaluate the candidate's answer.\n\nCandidate's answer: "${answer}"\n\nRemember to format response as:\nSCORE: [number]\nFEEDBACK: [feedback]\nIDEAL: [ideal answer]`;
    const reply = await callClaude(systemPrompt, [{ role: 'user', content: questionPrompt }]);
    const score = parseInt(reply.match(/SCORE:\s*(\d+)/)?.[1]) || 50;
    const feedback = reply.match(/FEEDBACK:\s*(.+?)(?=\nIDEAL:|$)/s)?.[1]?.trim() || 'Good attempt.';
    const ideal = reply.match(/IDEAL:\s*(.+?)$/s)?.[1]?.trim() || '';
    if (!user.dailyChallenges) user.dailyChallenges = [];
    user.dailyChallenges.push({ date: today, topic, difficulty, score });
    await user.save();
    let streak = 0;
    const sorted = [...user.dailyChallenges].sort((a, b) => new Date(b.date) - new Date(a.date));
    const checkDate = new Date();
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date(checkDate); expected.setDate(expected.getDate() - i);
      if (sorted[i].date === expected.toISOString().split('T')[0]) streak++; else break;
    }
    res.json({ success: true, result: { score, feedback, ideal, streak, totalCompleted: user.dailyChallenges.length } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// AI Study Plan
router.get('/study-plan', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, error: 'Login required.' });
    const sessions = await Session.find({ userId, status: 'completed' }).select('report config startedAt').sort({ startedAt: -1 }).limit(15).lean();
    if (sessions.length < 2) return res.json({ success: true, plan: null, message: 'Complete at least 2 interviews to get a personalized study plan.' });

    const scores = sessions.map(s => s.report?.overallScore || 0).filter(s => s > 0);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    const typeScores = {};
    sessions.forEach(s => { const t = s.config?.type || 'mixed'; if (!typeScores[t]) typeScores[t] = []; typeScores[t].push(s.report?.overallScore || 0); });
    const typeAnalysis = Object.entries(typeScores).map(([type, sc]) => ({ type, avg: Math.round(sc.reduce((a, b) => a + b, 0) / sc.length), count: sc.length })).sort((a, b) => a.avg - b.avg);

    const weaknesses = sessions.map(s => s.report?.weaknesses).filter(Boolean).join('; ');
    const technicalGaps = sessions.map(s => s.report?.technicalGaps).filter(Boolean).join('; ');
    const improvements = sessions.map(s => s.report?.improvements).filter(Boolean).join('; ');
    const strengths = sessions.map(s => s.report?.strengths).filter(Boolean).join('; ');
    const difficulty = sessions[0]?.config?.difficulty || 'Medium';
    const role = sessions[0]?.config?.role || 'Software Engineer';

    const systemPrompt = `You are an expert interview coach. Analyze the candidate's performance data and create a personalized 2-week study plan.

Format your response EXACTLY like this (use these exact headers):
SUMMARY: [1-2 sentence overall assessment]
WEAK_AREAS: [comma-separated list of 3-5 weak topics]
STRONG_AREAS: [comma-separated list of 2-3 strong topics]
PRIORITY: [High/Medium/Low]

WEEK1_TITLE: [title for week 1]
WEEK1_DAY1: [specific task]
WEEK1_DAY2: [specific task]
WEEK1_DAY3: [specific task]
WEEK1_DAY4: [specific task]
WEEK1_DAY5: [specific task]
WEEK1_DAY6: [specific task]
WEEK1_DAY7: [rest or review]

WEEK2_TITLE: [title for week 2]
WEEK2_DAY1: [specific task]
WEEK2_DAY2: [specific task]
WEEK2_DAY3: [specific task]
WEEK2_DAY4: [specific task]
WEEK2_DAY5: [specific task]
WEEK2_DAY6: [specific task]
WEEK2_DAY7: [rest or review]

RESOURCES: [3-5 specific resources]
TIPS: [3 actionable tips]`;

    const userPrompt = `Candidate: ${role}, ${difficulty} difficulty, ${sessions.length} interviews, avg ${avgScore}/100, best ${bestScore}, worst ${worstScore}.\nTypes: ${typeAnalysis.map(t => `${t.type}: avg ${t.avg} (${t.count}x)`).join(', ')}.\nWeaknesses: ${weaknesses || 'N/A'}\nGaps: ${technicalGaps || 'N/A'}\nImprovements: ${improvements || 'N/A'}\nStrengths: ${strengths || 'N/A'}`;

    const reply = await callClaude(systemPrompt, [{ role: 'user', content: userPrompt }]);

    const get = (key) => { const m = reply.match(new RegExp(key + ':\\s*(.+?)(?=\\n[A-Z0-9_]+:|$)', 's')); return m ? m[1].trim() : ''; };

    const plan = {
      summary: get('SUMMARY'),
      weakAreas: get('WEAK_AREAS').split(',').map(s => s.trim()).filter(Boolean),
      strongAreas: get('STRONG_AREAS').split(',').map(s => s.trim()).filter(Boolean),
      priority: get('PRIORITY'),
      weeks: [
        { title: get('WEEK1_TITLE') || 'Week 1', days: [get('WEEK1_DAY1'), get('WEEK1_DAY2'), get('WEEK1_DAY3'), get('WEEK1_DAY4'), get('WEEK1_DAY5'), get('WEEK1_DAY6'), get('WEEK1_DAY7')].filter(Boolean) },
        { title: get('WEEK2_TITLE') || 'Week 2', days: [get('WEEK2_DAY1'), get('WEEK2_DAY2'), get('WEEK2_DAY3'), get('WEEK2_DAY4'), get('WEEK2_DAY5'), get('WEEK2_DAY6'), get('WEEK2_DAY7')].filter(Boolean) },
      ],
      resources: get('RESOURCES').split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 3),
      tips: get('TIPS').split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 5),
      meta: { avgScore, bestScore, totalSessions: sessions.length, role, difficulty },
    };

    res.json({ success: true, plan });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;