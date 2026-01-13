
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from './types';
import { INITIAL_MESSAGE } from './constants';
import { mathAgent } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import TopicSelector from './components/TopicSelector';
import StarBackground from './components/StarBackground';

const App: React.FC = () => {
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
    if (selectedTopic) {
      scrollToBottom();
    }
  }, [messages, isLoading, selectedTopic]);

  useEffect(() => {
    if (messages.length > 1) {
      setMasteryProgress(prev => Math.min(prev + 10, 100));
    }
  }, [messages]);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setMasteryProgress(10);
    const greeting = `Starting our session on **${topic}**. ${INITIAL_MESSAGE}`;
    setMessages([{ 
      role: Role.MODEL, 
      content: greeting, 
      timestamp: new Date() 
    }]);
    mathAgent.resetChat();
  };

  const handleResetTopic = () => {
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
          content: "Oops! My logic circuits had a tiny hiccup. Can you ask that one more time?", 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative overflow-hidden text-slate-900">
      <StarBackground />
      
      {/* Dynamic Mastery Bar */}
      {selectedTopic && (
        <div className="fixed top-0 left-0 w-full h-1.5 z-[60] bg-slate-100">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
            style={{ width: `${masteryProgress}%` }} 
          />
        </div>
      )}

      {!selectedTopic ? (
        <>
          <header className="bg-white/70 backdrop-blur-lg border-b border-slate-100 px-8 py-6 flex items-center justify-between sticky top-0 z-50">
            <a href="https://devcotel.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group cursor-pointer">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100 transition-all group-hover:scale-110 group-hover:rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">DEVCOTEL<span className="text-indigo-600"> </span></h1>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.4em] mt-1"> agentic builders</p>
              </div>
            </a>
          </header>
          
          <main className="flex-1 flex items-center py-12 relative z-10">
            <TopicSelector onSelect={handleTopicSelect} />
          </main>
        </>
      ) : (
        <div className="flex flex-col h-screen relative z-10">
          <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <div className="flex items-center space-x-6">
              <button 
                className="bg-white p-2 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group shadow-sm" 
                onClick={handleResetTopic}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <a href="https://devcotel.com" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center space-x-3 group cursor-pointer border-l border-slate-100 pl-6">
                <div className="bg-indigo-600 p-1.5 rounded-lg transition-all group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors uppercase">DEVCOTEL</span>
              </a>

              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-black text-slate-900 tracking-tight">Math Mentor</h1>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                    {selectedTopic}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse" />
                   <p className="text-[9px] text-slate-400 font-bold tracking-[0.1em] uppercase">Brain Sync Active • Mastery Level: {masteryProgress}%</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleResetTopic}
              className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors"
            >
              Reset chat
            </button>
          </header>

          <main className="flex-1 overflow-y-auto px-4 md:px-12 py-10 scroll-smooth">
            <div className="max-w-4xl mx-auto pb-24">
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-8 animate-slide-up">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 mr-4 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-md border border-slate-100 px-6 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mentor is solving...</span>
                    <div className="flex gap-1.5">
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

          <footer className="p-6 md:p-8 bg-gradient-to-t from-white via-white/95 to-transparent">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-3xl blur opacity-10 group-focus-within:opacity-20 transition duration-500"></div>
                <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl pr-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question or share your idea..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent px-6 py-5 text-slate-800 focus:outline-none placeholder-slate-400 font-medium text-lg"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-indigo-600 text-white p-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-20 transition-all shadow-lg"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.5em]">
                  Powered by <a href="https://devcotel.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Devcotel team_3</a> AND google LLM &bull; Hero Mode
                </p>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
