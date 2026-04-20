import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, History } from 'lucide-react';

const CODE_CHARS = 'const function return import export class extends async await if else for while var let typeof new this true false null undefined => { } ( ) [ ] ; : . , 0 1 2 3 4 5 6 7 8 9 < > / \\ " \' ` ! = + - * & | ^ % $ # @'.split(' ');
const COLORS = ['#ffffff','#e5e5e5','#cccccc','#aaaaaa','#888888','#666666'];

function CodeRainCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const fontSize = 13;
    let columns = [];
    const initColumns = () => {
      const cols = Math.floor(canvas.width / (fontSize * 1.2));
      columns = Array.from({ length: cols }, () => ({
        y: Math.random() * -canvas.height,
        speed: 0.3 + Math.random() * 0.9,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        chars: Array.from({ length: 30 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]),
        changeTimer: 0,
      }));
    };
    initColumns();
    window.addEventListener('resize', initColumns);
    const animate = () => {
      ctx.fillStyle = 'rgba(10,10,10,0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      columns.forEach((col, i) => {
        const x = i * fontSize * 1.2;
        col.changeTimer++;
        if (col.changeTimer > 10) {
          col.chars[Math.floor(Math.random() * col.chars.length)] = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
          col.changeTimer = 0;
        }
        col.chars.forEach((char, j) => {
          const y = col.y + j * fontSize;
          if (y < 0 || y > canvas.height) return;
          const distFromHead = Math.abs(j - col.chars.length + 1);
          const alpha = Math.max(0.02, 0.18 - distFromHead * 0.006);
          if (j === col.chars.length - 1) {
            ctx.fillStyle = `rgba(255,255,255,${Math.min(alpha * 2.5, 0.55)})`;
          } else {
            const r = parseInt(col.color.slice(1,3),16)||200;
            const g = parseInt(col.color.slice(3,5),16)||200;
            const b = parseInt(col.color.slice(5,7),16)||200;
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          }
          ctx.fillText(char, x, y);
        });
        col.y += col.speed;
        if (col.y > canvas.height + 100) {
          col.y = Math.random() * -300;
          col.speed = 0.3 + Math.random() * 0.9;
          col.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', initColumns);
    };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

const STARTERS = {
  python: `# Python 3\ndef greet(name):\n    return f"Hello, {name}!"\n\nfor name in ["Alice", "Bob", "Charlie"]:\n    print(greet(name))\n\nfor i in range(1, 21):\n    if i % 15 == 0: print("FizzBuzz")\n    elif i % 3 == 0: print("Fizz")\n    elif i % 5 == 0: print("Buzz")\n    else: print(i)`,
  javascript: `// JavaScript (Node.js)\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}\nfor (let i = 0; i <= 10; i++) {\n  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);\n}`,
  typescript: `// TypeScript\ninterface Person { name: string; age: number; }\nfunction greet(p: Person): string {\n  return \`Hello, \${p.name}! Age: \${p.age}\`;\n}\nconst people: Person[] = [{name:"Alice",age:30},{name:"Bob",age:25}];\npeople.forEach(p => console.log(greet(p)));`,
  java: `// Java\npublic class Main {\n    public static int factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n-1);\n    }\n    public static void main(String[] args) {\n        for (int i = 1; i <= 10; i++)\n            System.out.println(i + "! = " + factorial(i));\n    }\n}`,
  c: `// C\n#include <stdio.h>\nint isPrime(int n) {\n    if (n < 2) return 0;\n    for (int i = 2; i*i <= n; i++)\n        if (n%i == 0) return 0;\n    return 1;\n}\nint main() {\n    for (int i = 2; i <= 50; i++)\n        if (isPrime(i)) printf("%d ", i);\n    printf("\\n");\n    return 0;\n}`,
  cpp: `// C++\n#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    vector<int> nums = {5,2,8,1,9,3,7,4,6};\n    sort(nums.begin(), nums.end());\n    for (int n : nums) cout << n << " ";\n    cout << endl;\n    return 0;\n}`,
  csharp: `// C#\nusing System;\nclass Program {\n    static void Main() {\n        for (int i=1;i<=5;i++) {\n            for (int j=1;j<=i;j++) Console.Write("* ");\n            Console.WriteLine();\n        }\n    }\n}`,
  go: `// Go\npackage main\nimport "fmt"\nfunc main() {\n    sum := 0\n    for i := 1; i <= 10; i++ { sum += i }\n    fmt.Printf("Sum 1-10 = %d\\n", sum)\n}`,
  rust: `// Rust\nfn main() {\n    let evens: Vec<u32> = (1..=20).filter(|n| n%2==0).collect();\n    println!("{:?}", evens);\n}`,
  ruby: `# Ruby\ndef bubble_sort(arr)\n  n = arr.length\n  (n-1).times { (n-1).times { |i| arr[i],arr[i+1]=arr[i+1],arr[i] if arr[i]>arr[i+1] } }\n  arr\nend\nputs bubble_sort([64,34,25,12,22,11,90]).inspect`,
  php: `<?php\nfunction reverse_str($s) { return strrev($s); }\n$words = ["Hello","World","PHP"];\nforeach ($words as $w) echo $w." -> ".reverse_str($w)."\\n";`,
  bash: `#!/bin/bash\nfor i in {1..5}; do echo "Line $i"; done`,
  kotlin: `// Kotlin\nfun factorial(n: Int): Long = if (n<=1) 1L else n*factorial(n-1)\nfun main() { (1..10).forEach { println("$it! = \${factorial(it)}") } }`,
  swift: `// Swift\nfunc isPalindrome(_ s: String) -> Bool { let c = Array(s.lowercased()); return c==c.reversed() }\nlet words = ["racecar","hello","level","madam"]\nfor w in words { print("\\(w): \\(isPalindrome(w))") }`,
  r: `# R\ncat(paste((1:10)^2, collapse=" "), "\\n")`
};

const LANG_LABELS = {
  python: 'Python 3', javascript: 'JavaScript', typescript: 'TypeScript',
  java: 'Java', c: 'C', cpp: 'C++', csharp: 'C#', go: 'Go',
  rust: 'Rust', ruby: 'Ruby', php: 'PHP', bash: 'Bash',
  kotlin: 'Kotlin', swift: 'Swift', r: 'R'
};

export default function Compiler() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('python');
  const [code, setCode] = useState(STARTERS['python']);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('// Run your code to see output here');
  const [isError, setIsError] = useState(false);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');

  const handleLangChange = (e) => {
    setLang(e.target.value);
    setCode(STARTERS[e.target.value] || '');
    setOutput('// Run your code to see output here');
    setStatus('');
    setIsError(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;
      const newVal = val.substring(0, s) + '  ' + val.substring(end);
      setCode(newVal);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  const runCode = async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setOutput('Running...');
    setIsError(false);
    setStatus('');
    const start = Date.now();

    try {
      const res = await fetch('http://localhost:5000/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, code, stdin })
      });

      const data = await res.json();
      const elapsed = ((Date.now() - start) / 1000).toFixed(2);

      if (data.stderr && !data.stdout) {
        setIsError(true);
        setOutput(data.stderr.trim());
        setStatus(`error · ${elapsed}s`);
      } else {
        setIsError(false);
        setOutput(data.stdout.trim() || '(no output)');
        setStatus(`exited 0 · ${elapsed}s`);
      }
    } catch (err) {
      setIsError(true);
      setOutput('Network error: ' + err.message);
      setStatus('failed');
    }
    setRunning(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden', color: '#e5e5e5' }}>
      <CodeRainCanvas />

      {/* NAV */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(10,10,10,0.88)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 800, fontSize: '14px', fontFamily: 'monospace' }}>P</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#fff', fontFamily: 'monospace' }}>AI Interviewer</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '13px', fontFamily: 'monospace', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#666'}>
            Home
          </button>
          <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '13px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '5px', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#666'}>
            <History size={13} /> History
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px',
            border: '1px solid rgba(34,197,94,0.7)',
            background: 'rgba(34,197,94,0.18)',
            color: '#4ade80', fontSize: '13px', fontWeight: 600,
            fontFamily: 'monospace', cursor: 'default'
          }}>
            {'</>'} Compiler
          </button>
        </div>

        <button onClick={() => navigate('/setup')} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.07)',
          color: '#fff', fontSize: '13px', fontWeight: 600,
          fontFamily: 'monospace', cursor: 'pointer', transition: 'all 0.2s'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}>
          Start Interview <ArrowRight size={14} />
        </button>
      </nav>

      {/* COMPILER BODY */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1300px', margin: '0 auto', padding: '36px 24px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', fontFamily: 'monospace', marginBottom: '4px' }}>
            {'<'} <span style={{ color: '#4ade80' }}>Compiler</span> {' />'}
          </h1>
          <p style={{ color: '#444', fontSize: '12px', fontFamily: 'monospace' }}>
            15 languages · Ctrl+Enter to run · Tab to indent
          </p>
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          borderRadius: '10px 10px 0 0',
          flexWrap: 'wrap'
        }}>
          <select value={lang} onChange={handleLangChange} style={{
            fontFamily: 'monospace', fontSize: '13px', padding: '6px 10px',
            borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)',
            background: '#111', color: '#fff', cursor: 'pointer', outline: 'none'
          }}>
            {Object.keys(LANG_LABELS).map(l => (
              <option key={l} value={l}>{LANG_LABELS[l]}</option>
            ))}
          </select>

          <button onClick={runCode} disabled={running} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 20px', borderRadius: '6px',
            border: '1px solid rgba(34,197,94,0.5)',
            background: running ? 'rgba(34,197,94,0.05)' : 'rgba(34,197,94,0.15)',
            color: '#4ade80', fontSize: '13px', fontWeight: 600,
            fontFamily: 'monospace', cursor: running ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { if (!running) e.currentTarget.style.background = 'rgba(34,197,94,0.28)'; }}
            onMouseLeave={e => { if (!running) e.currentTarget.style.background = 'rgba(34,197,94,0.15)'; }}>
            {running
              ? <span style={{ display: 'inline-block', width: '10px', height: '10px', border: '1.5px solid #4ade80', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              : <svg width="10" height="12" viewBox="0 0 10 12" fill="#4ade80"><path d="M0 0l10 6-10 6z"/></svg>
            }
            {running ? 'Running...' : 'Run'}
          </button>

          <button onClick={() => { setOutput('// Output cleared'); setIsError(false); setStatus(''); }} style={{
            padding: '7px 14px', borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent', color: '#555',
            fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
            Clear
          </button>

          {status && (
            <span style={{ marginLeft: 'auto', fontSize: '12px', fontFamily: 'monospace', color: isError ? '#f87171' : '#4ade80' }}>
              {status}
            </span>
          )}
        </div>

        {/* Editor + Output grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '0 0 10px 10px',
          overflow: 'hidden',
          minHeight: '500px'
        }}>
          {/* LEFT — Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '11px', color: '#444', padding: '5px 14px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              editor
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              style={{
                flex: 1, minHeight: '440px', resize: 'none',
                border: 'none', outline: 'none',
                padding: '16px', fontFamily: 'monospace',
                fontSize: '13px', lineHeight: 1.75,
                background: '#0d0d0d', color: '#e5e5e5',
                tabSize: 2
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '11px', color: '#444', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>stdin</span>
              <input
                value={stdin}
                onChange={e => setStdin(e.target.value)}
                placeholder="Input for your program (optional)..."
                style={{
                  flex: 1, fontFamily: 'monospace', fontSize: '12px',
                  padding: '5px 10px', borderRadius: '5px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: '#0a0a0a', color: '#888', outline: 'none'
                }}
              />
            </div>
          </div>

          {/* RIGHT — Output */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', color: '#444', padding: '5px 14px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              output
            </div>
            <div style={{
              flex: 1, padding: '16px',
              fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.75,
              background: '#0d0d0d',
              color: isError ? '#f87171' : output === '// Run your code to see output here' || output === '// Output cleared' ? '#444' : '#4ade80',
              overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
            }}>
              {output}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        select option { background: #111; color: #fff; }
        textarea::-webkit-scrollbar { width: 6px; }
        textarea::-webkit-scrollbar-track { background: #0d0d0d; }
        textarea::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
      `}</style>
    </div>
  );
}