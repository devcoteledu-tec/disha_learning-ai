
import React from 'react';

export const MATH_TOPICS = [
  { 
    id: 'algebra', 
    name: 'Algebra', 
    color: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
        <path d="M18 6L6 18M6 6l12 12" />
        <rect x="4" y="10" width="16" height="4" rx="1" className="opacity-20 text-blue-500 fill-current" />
      </svg>
    ), 
    description: 'Cracking the codes of hidden variables and balanced equations.' 
  },
  { 
    id: 'geometry', 
    name: 'Geometry', 
    color: 'indigo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
        <path d="M12 2L2 22h20L12 2z" />
        <circle cx="12" cy="14" r="3" className="opacity-20 text-indigo-500 fill-current" />
      </svg>
    ), 
    description: 'Decoding the secrets of shapes, angles, and the 3D world.' 
  },
  { 
    id: 'trigonometry', 
    name: 'Trigonometry', 
    color: 'violet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
        <path d="M22 12c-4-8-6-8-10 0s-6 8-10 0" />
        <path d="M5 19L19 5v14H5z" className="opacity-20 text-violet-500 fill-current" />
      </svg>
    ), 
    description: 'Riding mathematical waves and triangle relationships.' 
  },
  { 
    id: 'arithmetic', 
    name: 'Arithmetic', 
    color: 'sky',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
        <path d="M5 12h14M12 5v14" />
        <circle cx="7" cy="7" r="1.5" className="fill-current text-sky-400 opacity-60" />
        <circle cx="17" cy="17" r="1.5" className="fill-current text-sky-400 opacity-60" />
      </svg>
    ), 
    description: 'Building speed and accuracy with numbers and logic.' 
  },
  { 
    id: 'statistics', 
    name: 'Statistics', 
    color: 'emerald',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
        <path d="M18 20V10M12 20V4M6 20v-6" />
        <path d="M3 20h18" />
        <circle cx="12" cy="4" r="2" className="opacity-20 fill-current text-emerald-500" />
      </svg>
    ), 
    description: 'Predicting the future by analyzing patterns and data.' 
  },
  { 
    id: 'coord-geo', 
    name: 'Coordinate Geo', 
    color: 'rose',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
        <path d="M3 12h18M12 3v18" />
        <path d="M6 18l12-12" className="text-rose-400 opacity-60" />
        <circle cx="15" cy="9" r="2" className="fill-current text-rose-500" />
      </svg>
    ), 
    description: 'Charting paths and plotting points on the master grid.' 
  },
];

interface TopicSelectorProps {
  onSelect: (topic: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 w-full relative z-10">
      <div className="text-center mb-16 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-[11px] font-black tracking-[0.3em] text-indigo-600 uppercase bg-indigo-50 rounded-full border border-indigo-100 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse shadow-indigo-200 shadow-lg" />
          Designed for 9th/10th students.
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600">Level Up?</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-xl font-medium">
          I'm your mentor. I won't give you the answers, but I'll give you the power to find them yourself. Pick your challenge below!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {MATH_TOPICS.map((topic, index) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.name)}
            className={`group relative flex flex-col items-start p-10 bg-white rounded-[3rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-indigo-200 hover:-translate-y-2 transition-all duration-500 text-left overflow-hidden opacity-0 animate-slide-up`}
            style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'forwards' }}
          >
            {/* Visual Flare */}
            <div className={`absolute -right-16 -top-16 w-40 h-40 bg-indigo-50 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-700`} />
            
            <div className="flex items-center justify-center h-20 w-20 rounded-[2rem] bg-slate-50 border border-slate-100 text-slate-900 mb-8 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-indigo-200 group-hover:shadow-xl">
              {topic.icon}
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors tracking-tight">{topic.name}</h3>
            <p className="text-slate-500 leading-relaxed mb-8 font-medium text-base group-hover:text-slate-600 transition-colors">{topic.description}</p>
            
            <div className="mt-auto flex items-center gap-4 text-[11px] font-black tracking-widest text-indigo-400 group-hover:text-indigo-600 transition-all uppercase">
              Start Journey
              <div className="w-10 h-[2px] bg-slate-100 group-hover:w-16 group-hover:bg-indigo-600 transition-all" />
            </div>
          </button>
        ))}
        
        <button 
          onClick={() => onSelect("General Math")}
          className="group relative flex flex-col items-center justify-center p-10 bg-slate-900 rounded-[3rem] shadow-2xl hover:scale-[1.03] transition-all duration-500 text-center opacity-0 animate-slide-up stagger-3"
          style={{ animationFillMode: 'forwards' }}
        >
          <div className="h-20 w-20 rounded-[2rem] bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-10 h-10 text-white">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-white mb-2">Custom Quiz</h3>
          <p className="text-slate-400 text-base mb-8 font-medium px-4 opacity-80">Facing a specific boss level? Paste your question here.</p>
          <div className="px-8 py-3 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl group-hover:bg-indigo-50 transition-colors">
            Initialize
          </div>
        </button>
      </div>
    </div>
  );
};

export default TopicSelector;
