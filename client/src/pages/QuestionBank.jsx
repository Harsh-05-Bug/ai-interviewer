import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TOPICS = [
  'All', 'Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues',
  'Trees', 'Graphs', 'Dynamic Programming', 'Recursion',
  'Sorting & Searching', 'Hashing', 'Heaps',
  'System Design', 'OS', 'DBMS', 'Networks', 'OOP', 'Custom'
];

const CS_TOPICS = ['System Design', 'OS', 'DBMS', 'Networks', 'OOP'];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

// ✅ Companies list with Indian companies added
const COMPANIES = [
  'All',
  // Global
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
  'Netflix', 'Uber', 'LinkedIn', 'Twitter', 'Adobe',
  'Salesforce', 'Oracle', 'IBM', 'Intel', 'Nvidia',
  // Indian
  'TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra',
  'Cognizant', 'Accenture', 'Capgemini', 'LTIMindtree',
  'Flipkart', 'Swiggy', 'Zomato', 'Paytm', 'PhonePe',
  'Razorpay', 'CRED', 'Meesho', 'Freshworks', 'Zoho',
  'Ola', 'Naukri',
];

const diffStyles = {
  Easy:   'bg-green-500/10 text-green-400 border border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  Hard:   'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [company, setCompany] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false); // ✅ NEW

  useEffect(() => {
    fetchQuestions();
  }, [topic, difficulty, company, page]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/questions', {
        params: { topic, difficulty, company, search, page, limit: 20 },
        withCredentials: true,
      });
      setQuestions(data.questions);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const handleSelectQuestion = async (q) => {
    setSelected(q);
    setShowAnswer(false);
    setShowDetailed(false); // ✅ reset on each open
    setModalLoading(true);
    try {
      const { data } = await axios.get(`/api/questions/${q._id}`, {
        withCredentials: true,
      });
      setSelected(data);
    } catch (err) {
      console.error(err);
    }
    setModalLoading(false);
  };

  const isTheoryTopic = (t) => CS_TOPICS.includes(t);
  const isTheoryQuestion = (q) => q?.type === 'theory' || isTheoryTopic(q?.topic);
  const hasDetailedAnswer = (q) => q?.detailedAnswer && q.detailedAnswer.trim().length > 0; // ✅ NEW

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Question Bank</h1>
          <p className="text-gray-400">Practice DSA, System Design & CS fundamentals</p>
        </div>

        {/* Search + Company Filter row */}
        <div className="flex gap-2 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or tag..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition"
            />
            <button type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-sm font-medium transition">
              Search
            </button>
          </form>

          {/* ✅ Company dropdown */}
          <select
            value={company}
            onChange={e => { setCompany(e.target.value); setPage(1); }}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-indigo-500 transition cursor-pointer min-w-[160px]"
          >
            {COMPANIES.map(c => (
              <option key={c} value={c}>{c === 'All' ? '🏢 All Companies' : c}</option>
            ))}
          </select>
        </div>

        {/* Topic filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TOPICS.map(t => (
            <button key={t} onClick={() => { setTopic(t); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                topic === t
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : isTheoryTopic(t)
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:border-purple-400'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}>
              {t}
              {isTheoryTopic(t) && (
                <span className="ml-1 text-purple-400 text-[10px]">T</span>
              )}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 mb-6">
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => { setDifficulty(d); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition border ${
                difficulty === d
                  ? diffStyles[d] || 'bg-gray-700 border-gray-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}>
              {d}
            </button>
          ))}
        </div>

        {/* Active filters display */}
        {(company !== 'All' || topic !== 'All' || difficulty !== 'All') && (
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="text-gray-500 text-xs">Active filters:</span>
            {company !== 'All' && (
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                🏢 {company}
                <button onClick={() => setCompany('All')} className="hover:text-white ml-1">×</button>
              </span>
            )}
            {topic !== 'All' && (
              <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                {topic}
                <button onClick={() => setTopic('All')} className="hover:text-white ml-1">×</button>
              </span>
            )}
            {difficulty !== 'All' && (
              <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${diffStyles[difficulty]}`}>
                {difficulty}
                <button onClick={() => setDifficulty('All')} className="hover:text-white ml-1">×</button>
              </span>
            )}
            <button
              onClick={() => { setCompany('All'); setTopic('All'); setDifficulty('All'); setPage(1); }}
              className="text-xs text-gray-500 hover:text-red-400 transition">
              Clear all
            </button>
          </div>
        )}

        {/* Count */}
        {!loading && (
          <p className="text-gray-500 text-sm mb-4">{total} questions found</p>
        )}

        {/* Question list */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No questions found.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => (
              <div key={q._id} onClick={() => handleSelectQuestion(q)}
                className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-600 rounded-xl px-5 py-4 cursor-pointer transition">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm w-6">{(page - 1) * 20 + i + 1}.</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{q.title}</p>
                      {isTheoryQuestion(q) && (
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">
                          Theory
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{q.topic}</span>
                      {!isTheoryQuestion(q) && q.companies?.slice(0, 2).map(c => (
                        <span key={c} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">{c}</span>
                      ))}
                      {q.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-lg whitespace-nowrap ${diffStyles[q.difficulty]}`}>
                  {q.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm disabled:opacity-40 hover:border-gray-500 transition">
              Prev
            </button>
            <span className="text-gray-400 text-sm">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm disabled:opacity-40 hover:border-gray-500 transition">
              Next
            </button>
          </div>
        )}

        {/* Question detail modal */}
        {selected && (
          <div onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto">

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{selected.title}</h2>
                  {isTheoryQuestion(selected) && (
                    <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">
                      Theory
                    </span>
                  )}
                </div>
                <button onClick={() => setSelected(null)}
                  className="text-gray-500 hover:text-white text-2xl leading-none ml-4">×</button>
              </div>

              {modalLoading ? (
                <div className="text-center py-10 text-gray-500">Loading...</div>
              ) : showDetailed ? (
                /* ✅ DETAILED ANSWER VIEW */
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-sm text-purple-300">📚 Detailed Answer</h3>
                    <button
                      onClick={() => setShowDetailed(false)}
                      className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition">
                      ← Back to Quick Answer
                    </button>
                  </div>
                  <div className="prose-detailed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selected.detailedAnswer}
                    </ReactMarkdown>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-lg">{selected.topic}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${diffStyles[selected.difficulty]}`}>
                      {selected.difficulty}
                    </span>
                    {!isTheoryQuestion(selected) && selected.companies?.map(c => (
                      <span key={c} className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg">{c}</span>
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-5">{selected.description}</p>

                  {isTheoryQuestion(selected) && (
                    <div className="mb-5">
                      <button
                        onClick={() => setShowAnswer(v => !v)}
                        className="w-full flex items-center justify-between bg-purple-500/10 border border-purple-500/20 hover:border-purple-400 rounded-xl px-4 py-3 text-sm font-medium text-purple-300 transition mb-3">
                        <span>💡 {showAnswer ? 'Hide Answer' : 'Show Answer'}</span>
                        <span>{showAnswer ? '▲' : '▼'}</span>
                      </button>
                      {showAnswer && selected.answer && (
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                          {selected.answer}
                        </div>
                      )}

                      {/* ✅ DETAILED ANSWER BUTTON */}
                      {hasDetailedAnswer(selected) && (
                        <button
                          onClick={() => setShowDetailed(true)}
                          className="w-full mt-3 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 hover:border-indigo-400 rounded-xl px-4 py-3 text-sm font-medium text-indigo-300 transition">
                          <span>📚 Show Detailed Answer (Interview-Ready)</span>
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  )}

                  {selected.examples?.length > 0 && (
                    <div className="mb-5">
                      <h3 className="font-semibold text-sm mb-2">
                        {isTheoryQuestion(selected) ? 'Real World Examples' : 'Examples'}
                      </h3>
                      {selected.examples.map((ex, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg p-3 mb-2 text-xs">
                          <div><span className="text-gray-400">
                            {isTheoryQuestion(selected) ? 'Scenario:' : 'Input:'}
                          </span> {ex.input}</div>
                          <div><span className="text-gray-400">
                            {isTheoryQuestion(selected) ? 'Application:' : 'Output:'}
                          </span> {ex.output}</div>
                          {ex.explanation && <div className="text-gray-500 mt-1">{ex.explanation}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {!isTheoryQuestion(selected) && selected.constraints?.length > 0 && (
                    <div className="mb-5">
                      <h3 className="font-semibold text-sm mb-2">Constraints</h3>
                      <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                        {selected.constraints.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}

                  {selected.hints?.length > 0 && (
                    <details className="mb-5">
                      <summary className="cursor-pointer text-indigo-400 text-sm font-medium">Show hints</summary>
                      <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 mt-2">
                        {selected.hints.map((h, i) => <li key={i}>{h}</li>)}
                      </ul>
                    </details>
                  )}

                  {!isTheoryQuestion(selected) && selected.leetcodeLink && (
                    <a href={selected.leetcodeLink} target="_blank" rel="noreferrer"
                      className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-sm px-5 py-2 rounded-lg transition">
                      Solve on LeetCode ↗
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ✅ Markdown styling for the detailed answer view (dark theme) */}
      <style>{`
        .prose-detailed {
          color: #e5e7eb;
          line-height: 1.7;
          font-size: 0.9rem;
        }
        .prose-detailed h2 {
          color: #c4b5fd;
          font-size: 1.05rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          padding-bottom: 0.35rem;
          border-bottom: 1px solid #374151;
        }
        .prose-detailed h2:first-child { margin-top: 0; }
        .prose-detailed h3 {
          color: #a78bfa;
          font-size: 0.95rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.4rem;
        }
        .prose-detailed h4 {
          color: #93c5fd;
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.3rem;
        }
        .prose-detailed p { margin: 0.65rem 0; color: #d1d5db; }
        .prose-detailed strong { color: #f9fafb; font-weight: 600; }
        .prose-detailed ul, .prose-detailed ol {
          margin: 0.5rem 0;
          padding-left: 1.4rem;
          color: #d1d5db;
        }
        .prose-detailed li { margin: 0.25rem 0; }
        .prose-detailed code {
          background: #1f2937;
          color: #f0abfc;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          font-size: 0.85em;
          font-family: 'Fira Code', 'Consolas', monospace;
        }
        .prose-detailed pre {
          background: #0f172a;
          border: 1px solid #1e293b;
          padding: 0.9rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 0.75rem 0;
          font-size: 0.82rem;
        }
        .prose-detailed pre code {
          background: transparent;
          color: #e2e8f0;
          padding: 0;
        }
        .prose-detailed table {
          border-collapse: collapse;
          margin: 0.75rem 0;
          width: 100%;
          font-size: 0.85rem;
        }
        .prose-detailed th, .prose-detailed td {
          border: 1px solid #374151;
          padding: 0.4rem 0.65rem;
          text-align: left;
        }
        .prose-detailed th {
          background: #1f2937;
          color: #f9fafb;
          font-weight: 600;
        }
        .prose-detailed td { color: #d1d5db; }
        .prose-detailed blockquote {
          border-left: 3px solid #8b5cf6;
          padding-left: 0.85rem;
          margin: 0.75rem 0;
          color: #9ca3af;
          font-style: italic;
        }
        .prose-detailed hr {
          border: none;
          border-top: 1px solid #374151;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}