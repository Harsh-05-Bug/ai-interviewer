import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100">
      {copied ? <Check size={12} className="text-jade-500" /> : <Copy size={12} />}
    </button>
  );
};

const customStyle = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#0D0D14',
    borderRadius: '0.75rem',
    padding: '1rem',
    margin: '0.5rem 0',
    fontSize: '0.8rem',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.8rem',
  },
};

const MarkdownMessage = memo(({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeStr = String(children).replace(/\n$/, '');

          if (!inline && (match || codeStr.includes('\n'))) {
            return (
              <div className="relative group">
                {match && (
                  <div className="flex items-center justify-between px-3 py-1.5 bg-ink-700 rounded-t-xl border border-b-0 border-white/5 mt-2">
                    <span className="text-[10px] uppercase tracking-widest text-slate-dim font-mono">{match[1]}</span>
                  </div>
                )}
                <CopyButton text={codeStr} />
                <SyntaxHighlighter
                  style={customStyle}
                  language={match?.[1] || 'text'}
                  PreTag="div"
                  customStyle={match ? { borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: 0 } : {}}
                  {...props}
                >
                  {codeStr}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <code className="px-1.5 py-0.5 rounded-md bg-ink-600 text-gold-300 font-mono text-xs border border-white/5" {...props}>
              {children}
            </code>
          );
        },
        h1: ({ children }) => <h1 className="text-lg font-bold text-white mt-3 mb-1">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold text-white mt-3 mb-1">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-bold text-white mt-2 mb-1">{children}</h3>,
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        em: ({ children }) => <em className="text-gold-200 italic">{children}</em>,
        ul: ({ children }) => <ul className="list-disc list-outside ml-4 mb-2 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-outside ml-4 mb-2 space-y-0.5">{children}</ol>,
        li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-gold-400/40 pl-3 my-2 text-slate-dim italic">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-2 rounded-lg border border-white/5">
            <table className="w-full text-xs">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-ink-700 text-slate-dim uppercase tracking-wider">{children}</thead>,
        th: ({ children }) => <th className="px-3 py-2 text-left font-medium">{children}</th>,
        td: ({ children }) => <td className="px-3 py-2 border-t border-white/5">{children}</td>,
        hr: () => <hr className="my-3 border-white/10" />,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-gold-400 underline underline-offset-2 hover:text-gold-300 transition-colors">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

MarkdownMessage.displayName = 'MarkdownMessage';
export default MarkdownMessage;