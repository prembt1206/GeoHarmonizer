// GeoRecon AI - Intelligent Gemini Geospatial Copilot (SIH26013)

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Compass,
  ArrowRight,
  Mic,
  MicOff,
  Cpu,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import {
  geminiChatService,
  ChatMessage,
  isGeminiConfigured
} from '../../services/geminiChatService';

const SUGGESTED_PROMPTS = [
  { label: '🔍 Explain P-0102 Conflict', query: 'Why does Parcel P-0102 have a boundary conflict and what is the recommended resolution?' },
  { label: '📐 Explain IoU Matching', query: 'How does Intersection over Union (IoU) and Hausdorff distance work in matching cadastral vs drone layers?' },
  { label: '⚠️ Topology Anomalies', query: 'What topology issues exist in the current Bengaluru dataset and how are slivers healed?' },
  { label: '🏆 SIH26013 Judge Overview', query: 'Give me a 60-second executive pitch for Smart India Hackathon judges explaining GeoRecon AI.' }
];

export const GeoReconChatbot: React.FC = () => {
  const {
    activePage,
    setActivePage,
    selectedParcelId,
    setSelectedParcelId,
    parcels,
    conflicts,
    topologyIssues,
    userRole,
    settings,
    runFullHarmonization,
    isChatOpen: isOpen,
    setIsChatOpen: setIsOpen
  } = useGeoRecon();

  const [isMinimized, setIsMinimized] = useState(false);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `### Welcome to GeoRecon Copilot 🛰️
I am your **Gemini 3.8 Flash AI Geospatial Assistant** for **Smart India Hackathon SIH26013**.

I have real-time access to the **Bengaluru Urban Land Records Sector (Indiranagar / Domlur)** (${parcels.length} parcels, ${conflicts.filter(c => c.status === 'open').length} open conflicts, EPSG:32643).

Ask me about:
- **Boundary Discrepancies & Disputed Parcels** (e.g. Parcel P-0102)
- **Mathematical Spatial Metrics** (IoU, Hausdorff, Centroid Euclidean Distance)
- **Topological Auto-Healing** (PostGIS ST_SnapToGrid sliver absorption)
- **Cross-Departmental Schema Alignment** (Bhoomi RTC, Municipal Property IDs)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { type: 'NAVIGATE', label: 'Open Conflict Center', payload: 'conflict-center' },
        { type: 'SELECT_PARCEL', label: 'Inspect Parcel P-0102', payload: 'P-0102' }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const openConflicts = conflicts.filter(c => c.status === 'open').length;
    const avgConfidence = Math.round(
      parcels.reduce((acc, p) => acc + p.confidence_score, 0) / (parcels.length || 1)
    );

    const appContext = {
      activePage,
      selectedParcelId,
      totalParcels: parcels.length,
      openConflictsCount: openConflicts,
      topologyIssuesCount: topologyIssues.filter(t => t.status === 'open').length,
      avgConfidence,
      userRole,
      targetCrs: settings.projectCrs
    };

    try {
      const response = await geminiChatService.sendMessage(query, messages, appContext);
      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: response.actions
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['actions']>[number]) => {
    if (action.type === 'NAVIGATE' && action.payload) {
      setActivePage(action.payload as any);
    } else if (action.type === 'SELECT_PARCEL' && action.payload) {
      setSelectedParcelId(action.payload);
      setActivePage('parcel-explorer');
    } else if (action.type === 'RUN_PIPELINE') {
      setActivePage('harmonization');
      runFullHarmonization();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Render markdown-like text with bolding, lists, and headers
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-sm text-sky-400 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullet point
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs leading-relaxed text-slate-200 my-0.5">
            {renderInlineMarkdown(text)}
          </li>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Normal paragraph
      return (
        <p key={idx} className="text-xs leading-relaxed text-slate-200 my-0.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string) => {
    // Basic bold and code span formatting
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1 py-0.5 rounded bg-sky-950/80 text-sky-300 font-mono text-[11px] border border-sky-800/60">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* 1. Floating Action Trigger Button (When Closed) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 group">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-sky-600/30 border border-sky-400/40 transition-all hover:scale-105 active:scale-95 animate-in fade-in"
            title="Open GeoRecon AI Copilot"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold tracking-tight">GeoRecon Copilot</span>
              <span className="block text-[10px] text-sky-200 font-medium">Gemini 3.8 Flash Live</span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Floating Chat Window (When Open) */}
      {isOpen && (
        <div
          className={`fixed bottom-5 right-5 z-50 w-[420px] max-w-[calc(100vw-32px)] transition-all duration-200 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white ${
            isMinimized ? 'h-14' : 'h-[590px] max-h-[calc(100vh-60px)]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-inner shadow-sky-400/30">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold tracking-tight">GeoRecon Copilot</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
                    Gemini 3.8 Flash
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {selectedParcelId ? `Context: Parcel ${selectedParcelId}` : 'Bengaluru Urban Cadastral Engine'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages(messages.slice(0, 1))}
                title="Clear Conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Strip */}
              <div className="px-3.5 py-1.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="truncate">Bengaluru Sector • {settings.projectCrs}</span>
                </div>
                <span className="font-mono text-emerald-400 font-semibold shrink-0">
                  {parcels.length} Parcels Active
                </span>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                      {msg.role === 'user' ? (
                        <>
                          <span>You ({(userRole || 'officer').replace(/_/g, ' ')})</span>
                          <User className="w-3 h-3 text-sky-400" />
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-indigo-400" />
                          <span>GeoRecon Copilot</span>
                          <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                        </>
                      )}
                    </div>

                    <div
                      className={`relative group rounded-2xl px-3.5 py-2.5 max-w-[90%] ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                          : 'bg-slate-800/90 text-slate-100 rounded-tl-sm border border-slate-700/80 shadow-inner'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        renderFormattedContent(msg.content)
                      ) : (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}

                      {/* Interactive Action Buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex flex-wrap gap-1.5">
                          {msg.actions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => handleActionClick(act)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all hover:scale-105 active:scale-95"
                            >
                              <span>{act.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Copy Action for Assistant */}
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          title="Copy response"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-900/80 text-slate-400 hover:text-white transition-opacity"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading / Typing Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/70 w-fit">
                    <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
                    <span className="text-[11px] text-slate-300 font-medium">
                      Gemini 3.8 Flash is analyzing spatial topology...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Carousel */}
              <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                {SUGGESTED_PROMPTS.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sp.query)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-sky-500/40 transition-all shrink-0 active:scale-95"
                  >
                    {sp.label}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder={isListening ? 'Listening...' : 'Ask GeoRecon Copilot anything...'}
                      className="w-full px-3.5 py-2.5 pl-3.5 pr-8 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      title={isListening ? 'Stop Listening' : 'Voice Input'}
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                        isListening ? 'text-rose-400 animate-pulse' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`p-2.5 rounded-xl transition-all shadow-md ${
                      !input.trim() || isLoading
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:from-sky-500 hover:to-indigo-500 active:scale-95'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
                  <span>Google Gemini 3.8 Flash • SIH26013</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Ready
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
