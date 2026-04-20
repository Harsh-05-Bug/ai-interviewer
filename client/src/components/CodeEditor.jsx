import React, { useState, memo } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import { Code2, ChevronDown, RotateCcw, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';

const LANGUAGES = [
  { id: 'python', label: 'Python', grammar: languages.python, template: '# Write your solution here\n\ndef solution():\n    pass\n' },
  { id: 'javascript', label: 'JavaScript', grammar: languages.javascript, template: '// Write your solution here\n\nfunction solution() {\n  \n}\n' },
  { id: 'java', label: 'Java', grammar: languages.java, template: '// Write your solution here\n\nclass Solution {\n    public void solve() {\n        \n    }\n}\n' },
  { id: 'cpp', label: 'C++', grammar: languages.cpp, template: '// Write your solution here\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n' },
  { id: 'typescript', label: 'TypeScript', grammar: languages.typescript, template: '// Write your solution here\n\nfunction solution(): void {\n  \n}\n' },
  { id: 'go', label: 'Go', grammar: languages.go, template: '// Write your solution here\npackage main\n\nfunc main() {\n\t\n}\n' },
];

const CodeEditor = memo(({ onSubmit, disabled }) => {
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const switchLang = (l) => {
    setLang(l);
    setCode(l.template);
    setShowLangMenu(false);
  };

  const reset = () => setCode(lang.template);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const submit = () => {
    if (disabled || !code.trim()) return;
    const formatted = `\`\`\`${lang.id}\n${code}\n\`\`\``;
    onSubmit(formatted);
  };

  return (
    <div className={`border border-white/10 rounded-xl bg-ink-800 overflow-hidden transition-all ${expanded ? 'fixed inset-4 z-50' : ''}`}>
      <div className="flex items-center justify-between px-3 py-2 bg-ink-700 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Code2 size={13} className="text-gold-400" />
          <span className="text-xs text-slate-dim font-mono">Code Editor</span>
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-ink-600 border border-white/5 text-xs text-white hover:border-white/15 transition-all"
            >
              {lang.label} <ChevronDown size={10} />
            </button>
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <div className="absolute top-full left-0 mt-1 w-36 bg-ink-700 border border-white/10 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.id}
                      onClick={() => switchLang(l)}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${l.id === lang.id ? 'text-gold-400 bg-gold-400/5' : 'text-slate-dim hover:text-white hover:bg-ink-600'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={reset} className="p-1.5 rounded-md text-slate-dim hover:text-white hover:bg-ink-600 transition-all" title="Reset">
            <RotateCcw size={12} />
          </button>
          <button onClick={copy} className="p-1.5 rounded-md text-slate-dim hover:text-white hover:bg-ink-600 transition-all" title="Copy">
            {copied ? <Check size={12} className="text-jade-500" /> : <Copy size={12} />}
          </button>
          <button onClick={() => setExpanded(e => !e)} className="p-1.5 rounded-md text-slate-dim hover:text-white hover:bg-ink-600 transition-all" title={expanded ? 'Minimize' : 'Expand'}>
            {expanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>
      <div className={`overflow-auto ${expanded ? 'h-[calc(100%-90px)]' : 'h-48 md:h-56'}`}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={c => highlight(c, lang.grammar, lang.id)}
          padding={16}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem',
            lineHeight: '1.6',
            minHeight: '100%',
            background: 'transparent',
            color: '#E8E8F0',
          }}
          textareaClassName="outline-none"
          disabled={disabled}
        />
      </div>
      <div className="flex items-center justify-between px-3 py-2 bg-ink-700 border-t border-white/5">
        <span className="text-[10px] text-slate-muted">
          {code.split('\n').length} lines · {lang.label}
        </span>
        <button
          onClick={submit}
          disabled={disabled || !code.trim()}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            disabled || !code.trim()
              ? 'bg-ink-600 text-slate-muted cursor-not-allowed'
              : 'shimmer-btn text-ink-900 hover:scale-105'
          }`}
        >
          Submit Code
        </button>
      </div>
      {expanded && <div className="fixed inset-0 bg-black/60 -z-10" onClick={() => setExpanded(false)} />}
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';
export default CodeEditor;