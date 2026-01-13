
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from './types';
import { INITIAL_MESSAGE } from './constants';
import { mathAgent } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import TopicSelector from './components/TopicSelector';
import StarBackground from './components/StarBackground';

type ViewState = 'welcome' | 'selection' | 'chat';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('welcome');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [masteryProgress, setMasteryProgress] = useState(0);
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messages, isLoading, view]);

  useEffect(() => {
    if (messages.length > 2) {
      setMasteryProgress(prev => Math.min(prev + 7, 100));
    }
  }, [messages]);

  const handleStartJourney = () => {
    setView('selection');
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setView('chat');
    setDiagnosticError(null);
    setMasteryProgress(15);
    const greeting = `Focusing on **${topic}**. ${INITIAL_MESSAGE}`;
    setMessages([{ 
      role: Role.MODEL, 
      content: greeting, 
      timestamp: new Date() 
    }]);
    mathAgent.resetChat();
  };

  const handleReset = () => {
    setView('welcome');
    setSelectedTopic(null);
    setMessages([]);
    setMasteryProgress(0);
    setDiagnosticError(null);
    mathAgent.resetChat();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setDiagnosticError(null);
    const userMessage: Message = {
      role: Role.USER,
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseStream = mathAgent.sendMessageStream(input, selectedTopic || undefined);
      
      const aiMessage: Message = {
        role: Role.MODEL,
        content: '',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);

      let fullResponse = '';
      for await (const chunk of responseStream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponse;
          return newMessages;
        });
      }
    } catch (err: any) {
      console.error("Critical Fault:", err);
      setDiagnosticError(err.message || "Unexpected failure in neural link.");
      
      const errorResponse = `### ⚠️ System Diagnostic\n\nI was unable to process that request. This usually indicates a configuration issue with the API service.\n\n**Error Details:**\n\`${err.message || "Unknown Connection Failure"}\`\n\n*Please ensure your environment variables are correctly synchronized.*`;
      
      setMessages(prev => [
        ...prev,
        { 
          role: Role.MODEL, 
          content: errorResponse, 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden text-slate-900">
      {view !== 'chat' && (
        <div className="absolute inset-0 pointer-events-none">
          <canvas id="star-canvas" className="absolute inset-0 z-0"></canvas>
          <div className="math-grid absolute inset-0 z-0 opacity-40"></div>
          <StarBackground />
        </div>
      )}

      {view === 'chat' && (
        <div className="fixed top-0 left-0 w-full h-1 z-[70] bg-slate-100">
          <div 
            className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-1000 ease-out" 
            style={{ width: `${masteryProgress}%` }} 
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        {view === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-slide-up">
             <div className="flex flex-col items-center group transition-transform hover:scale-[1.02]">
               <div className="mb-8 bg-indigo-600 p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-200 group-hover:shadow-indigo-400 transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
               </div>
               <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                 DEVCOTEL<span className="text-indigo-600">.</span>
               </h1>
             </div>
             <p className="text-slate-400 font-bold uppercase tracking-[0.8em] text-[10px] sm:text-xs mb-12">
               Socratic Logic Engine
             </p>
             <button 
               onClick={handleStartJourney}
               className="group relative px-12 py-6 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
             >
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10">Initialize Session</span>
             </button>
          </div>
        )}

        {view === 'selection' && (
          <div className="flex-1 flex flex-col pt-24 pb-12 animate-slide-up">
            <div className="px-6 mb-16 text-center">
               <button onClick={handleReset} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 mb-6 transition-all">
                 ← System Standby
               </button>
               <h2 className="text-5xl font-black tracking-tighter text-slate-900">Select Discipline</h2>
               <p className="text-slate-400 mt-2 font-medium">Choose a mathematical realm to explore.</p>
            </div>
            <TopicSelector onSelect={handleTopicSelect} />
          </div>
        )}

        {view === 'chat' && (
          <div className="flex flex-col h-screen bg-white animate-slide-up">
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 sm:px-10 py-5 flex items-center justify-between sticky top-0 z-[60]">
              <div className="flex items-center space-x-6 min-w-0">
                <button 
                  onClick={() => setView('selection')}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all shrink-0 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="min-w-0">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 truncate">
                      Module: <span className="text-indigo-600">{selectedTopic}</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Logic Stream Active</p>
                    </div>
                </div>
              </div>
              <button onClick={handleReset} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors px-4 py-2 rounded-lg border border-transparent hover:border-rose-100">
                End Journey
              </button>
            </header>

            <main className="flex-1 overflow-y-auto px-4 sm:px-12 lg:px-24 py-12 scroll-smooth custom-scrollbar bg-slate-50/30">
              <div className="max-w-4xl mx-auto pb-32">
                {messages.map((msg, idx) => (
                  <ChatBubble key={idx} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-12 animate-slide-up">
                    <div className="bg-white border border-slate-100 px-8 py-5 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-4">
                      <div className="flex gap-1.5">
                         <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                         <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                         <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Processing Logic</span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} className="h-1" />
              </div>
            </main>

            <footer className="p-6 sm:p-10 border-t border-slate-100 bg-white/95 backdrop-blur-md">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="relative group">
                  <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-[2rem] overflow-hidden focus-within:bg-white focus-within:border-indigo-400 focus-within:shadow-2xl focus-within:shadow-indigo-50 transition-all duration-500 pr-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter your calculation or reasoning..."
                      disabled={isLoading}
                      className="flex-1 bg-transparent px-8 py-6 text-slate-800 focus:outline-none placeholder-slate-400 font-medium text-lg"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="bg-indigo-600 text-white p-4.5 rounded-2xl hover:bg-slate-900 disabled:opacity-10 transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
                <p className="text-[9px] text-center mt-6 text-slate-400 font-bold uppercase tracking-[0.3em]">
                  Encouraging Intellectual Independence
                </p>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
