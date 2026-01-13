
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className = "" }) => {
  return (
    <div className={`prose max-w-none prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tight ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          code: ({ inline, className, children, ...props }: any) => {
            if (!inline) {
              return (
                <div className="my-8 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 overflow-x-auto shadow-inner group relative">
                   <div className="absolute top-4 right-6 text-[8px] font-black text-slate-300 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Equation Focus</div>
                   <code className="text-blue-600 font-mono text-base leading-relaxed font-bold" {...props}>
                    {children}
                  </code>
                </div>
              );
            }
            return (
              <code className="bg-slate-100 text-blue-600 px-2 py-0.5 rounded-lg font-bold text-sm border border-slate-200/50 mx-1" {...props}>
                {children}
              </code>
            );
          },
          strong: ({ children }) => <strong className="text-indigo-600 font-black">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MathRenderer;
