
import React from 'react';

export const MATH_TOPICS = [
  { 
    id: 'algebra', 
    name: 'Algebra', 
    color: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M18 6L6 18M6 6l12 12" />
        <rect x="4" y="10" width="16" height="4" rx="1" className="opacity-20 text-blue-500 fill-current" />
      </svg>
    ), 
    description: 'Variables and balanced equations.' 
  },
  { 
    id: 'geometry', 
    name: 'Geometry', 
    color: 'indigo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M12 2L2 22h20L12 2z" />
        <circle cx="12" cy="14" r="3" className="opacity-20 text-indigo-500 fill-current" />
      </svg>
    ), 
    description: 'Angles and spatial logic.' 
  },
  { 
    id: 'trigonometry', 
    name: 'Trigonometry', 
    color: 'violet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M22 12c-4-8-6-8-10 0s-6 8-10 0" />
      </svg>
    ), 
    description: 'Triangle relationships.' 
  },
  { 
    id: 'statistics', 
    name: 'Statistics', 
    color: 'emerald',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ), 
    description: 'Data analysis and patterns.' 
  },
  { 
    id: 'arithmetic', 
    name: 'Arithmetic', 
    color: 'sky',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M5 12h14M12 5v14" />
      </svg>
    ), 
    description: 'Fundamental number logic.' 
  },
  { 
    id: 'custom', 
    name: 'Freeform', 
    color: 'slate',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ), 
    description: 'Any math challenge.' 
  },
];

interface TopicSelectorProps {
  onSelect: (topic: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MATH_TOPICS.map((topic, index) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.name)}
            className={`group relative flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50 hover:-translate-y-1 transition-all duration-500 text-center opacity-0 animate-slide-up`}
            style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <div className="mb-6 h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              {topic.icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight uppercase">{topic.name}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{topic.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicSelector;
