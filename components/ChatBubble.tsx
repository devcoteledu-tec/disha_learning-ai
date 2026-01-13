
import React from 'react';
import { Role, Message } from '../types';
import MathRenderer from './MathRenderer';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;

  return (
    <div className={`flex w-full mb-12 animate-slide-up ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[92%] md:max-w-[85%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar/Icon */}
        <div className={`flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg border
          ${isModel 
            ? 'bg-slate-900 border-slate-700 mr-5' 
            : 'bg-indigo-600 border-indigo-400 ml-5'}`}>
          {isModel ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-blue-400">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          ) : (
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>

        {/* Message Content */}
        <div className={`relative px-8 py-6 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border transition-all duration-500
          ${isModel 
            ? 'bg-white border-slate-100 rounded-tl-none text-slate-800' 
            : 'bg-indigo-600 border-indigo-500 rounded-tr-none text-white shadow-indigo-100 shadow-xl'}`}>
          
          <div className={`text-[9px] font-black uppercase tracking-[0.3em] mb-4 flex justify-between items-center opacity-60
            ${isModel ? 'text-indigo-600' : 'text-indigo-100'}`}>
             <div className="flex items-center gap-2">
                {isModel && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                {isModel ? 'Socratic Mentor Node' : 'Student Input'}
             </div>
             <span className="font-bold lowercase tracking-normal opacity-40">
               {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
          </div>

          <div className={`leading-relaxed text-lg ${isModel ? 'text-slate-700 font-medium' : 'text-white font-semibold'}`}>
            <MathRenderer 
              content={message.content} 
              className={isModel ? 'prose-slate' : 'prose-invert prose-white prose-strong:text-white prose-code:text-indigo-100'} 
            />
          </div>

          {/* Minimal accent for the mentor bubble */}
          {isModel && (
            <div className="absolute top-0 left-0 w-2 h-8 bg-blue-500 -ml-[1px] -mt-[1px] rounded-tl-lg opacity-20" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
