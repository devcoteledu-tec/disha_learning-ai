
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messages, isLoading, view]);

  useEffect(() => {
    if (messages.length > 1) {
      setMasteryProgress(prev => Math.min(prev + 10, 100));
    }
  }, [messages]);

  const handleStartJourney = () => {
    setView('selection');
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setView('chat');
    setMasteryProgress(10);
    const greeting = `Starting our session on **${topic}**. ${INITIAL_MESSAGE}`;
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
    mathAgent.resetChat();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { 
          role: Role.MODEL, 
          content: "I encountered a logical paradox. Please ensure your API key is correctly configured and try again.", 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden text-slate-900">
      {/* Immersive background only for home and selection */}
      {view !== 'chat' && (
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000">
          <canvas id="star-canvas" className="absolute inset-0 z-0"></canvas>
          <div className="math-grid absolute inset-0 z-0 opacity-40"></div>
          <div className="glow-orb absolute z-0" style={{ top: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)' }}></div>
          <div className="glow-orb absolute z-0" style={{ bottom: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)' }}></div>
          <StarBackground />
        </div>
      )}

      {/* Mastery Progress Bar */}
      {view === 'chat' && (
        <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-1000 ease-out" 
            style={{ width: `${masteryProgress}%` }} 
          />
        </div>
      )}

      {/* Main Viewport */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* WELCOME VIEW */}
        {view === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-slide-up">
             <a href="https://devcotel.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group transition-transform hover:scale-[1.02]">
               <div className="mb-8 bg-indigo-600 p-5 rounded-[2.5rem] shadow-2xl shadow-indigo-200 group-hover:shadow-indigo-300 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
               </div>
               <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                 DEVCOTEL<span className="text-indigo-600"> MATH</span>
               </h1>
             </a>
             <p className="text-slate-400 font-bold uppercase tracking-[0.6em] text-xs sm:text-sm mb-12">
               Socratic Learning Engine
             </p>
             <button 
               onClick={handleStartJourney}
               className="group relative px-10 py-5 bg-slate-900 text-white rounded-full font-black text-sm uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
             >
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">Begin Journey</span>
             </button>
          </div>
        )}

        {/* SELECTION VIEW */}
        {view === 'selection' && (
          <div className="flex-1 flex flex-col pt-20 pb-12">
            <div className="px-6 mb-12 animate-slide-up text-center">
               <button onClick={handleReset} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 mb-4 transition-colors">
                 ← Back to home
               </button>
               <h2 className="text-4xl font-black tracking-tighter text-slate-900">Choose Topic</h2>
            </div>
            <TopicSelector onSelect={handleTopicSelect} />
          </div>
        )}

        {/* CHAT VIEW */}
        {view === 'chat' && (
          <div className="flex flex-col h-screen bg-white">
            <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
              <div className="flex items-center space-x-4 min-w-0">
                <button 
                  onClick={() => setView('selection')}
                  className="bg-white p-2 rounded-xl border border-slate-200 hover:border-indigo-500 transition-all shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <a href="https://devcotel.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group min-w-0">
                  <div className="bg-indigo-600 p-1.5 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 truncate">
                      Mentor Lab <span className="text-indigo-600 ml-2 group-hover:underline">// {selectedTopic}</span>
                    </h2>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Neural Link Established</p>
                  </div>
                </a>
              </div>
              <button onClick={handleReset} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">
                End Session
              </button>
            </header>

            <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-10 scroll-smooth custom-scrollbar">
              <div className="max-w-4xl mx-auto pb-24">
                {messages.map((msg, idx) => (
                  <ChatBubble key={idx} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-8 animate-slide-up">
                    <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thinking</span>
                      <div className="flex gap-1">
                         <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                         <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                         <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </main>

            <footer className="p-4 sm:p-8 border-t border-slate-50 bg-white">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="relative group">
                  <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:bg-white focus-within:border-indigo-400 focus-within:shadow-xl transition-all duration-300 pr-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Share your logic or ask a question..."
                      disabled={isLoading}
                      className="flex-1 bg-transparent px-6 py-5 text-slate-800 focus:outline-none placeholder-slate-400 font-medium text-base sm:text-lg"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="bg-indigo-600 text-white p-3.5 rounded-xl hover:bg-slate-900 disabled:opacity-20 transition-all shadow-lg"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
