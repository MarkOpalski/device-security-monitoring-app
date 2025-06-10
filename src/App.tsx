import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, CheckCircle, X, Send, Loader, Network, Eye, Lock, Trash2, Activity, Clock, MessageCircle, Zap, Cpu, Wifi } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actions?: ActionOption[];
}

interface ActionOption {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  source: string;
  ip?: string;
  status: 'active' | 'resolved' | 'investigating';
}

const INITIAL_ALERT: Alert = {
  id: '1',
  title: 'Suspicious Network Connection Detected',
  description: 'CoolGame.app is attempting an unusual outgoing network connection to a flagged IP address.',
  severity: 'critical',
  timestamp: new Date(),
  source: 'CoolGame.app',
  ip: '185.199.108.153',
  status: 'active'
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: '🚨 **THREAT DETECTED** \'CoolGame.app\' attempting suspicious outbound connection to `185.199.108.153`. Connection flagged as **MALWARE DISTRIBUTION NETWORK**. Immediate action required.',
    timestamp: new Date(),
    actions: [
      { id: 'investigate', label: 'ANALYZE THREAT', type: 'secondary' },
      { id: 'block', label: 'TERMINATE CONNECTION', type: 'danger' }
    ]
  }
];

function App() {
  const [currentAlert, setCurrentAlert] = useState<Alert>(INITIAL_ALERT);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<'secure' | 'threat' | 'investigating'>('threat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content.trim());
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleActionClick = (actionId: string) => {
    handleSendMessage(`Action: ${actionId}`);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes('tell me more') || input.includes('investigate') || input.includes('analyze') || input.includes('what kind')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '**THREAT ANALYSIS COMPLETE**\n\nTarget: `CoolGame.app`\nDestination: `185.199.108.153:443`\nProtocol: HTTPS\nThreat Level: **CRITICAL**\n\nThis IP is associated with **KNOWN MALWARE C&C SERVERS**. Gaming applications should not establish such connections. **SYSTEM COMPROMISE HIGHLY PROBABLE**.',
        timestamp: new Date(),
        actions: [
          { id: 'block_now', label: 'EXECUTE COUNTERMEASURES', type: 'danger' },
          { id: 'advanced', label: 'ADVANCED OPTIONS', type: 'secondary' }
        ]
      };
    }
    
    if (input.includes('block') || input.includes('action: block') || input.includes('terminate') || input.includes('stop')) {
      setActionInProgress('blocking');
      setTimeout(() => {
        setActionInProgress(null);
        setCurrentAlert(prev => ({ ...prev, status: 'resolved' }));
        setSystemStatus('secure');
      }, 3000);
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '⚡ **COUNTERMEASURES INITIATED**\n\n```\n> BLOCKING CONNECTION... ✓\n> QUARANTINING APPLICATION... ✓\n> UPDATING FIREWALL RULES... ✓\n```\n\n**THREAT NEUTRALIZED**\n\nRecommend full system scan to detect additional compromises.',
        timestamp: new Date(),
        actions: [
          { id: 'scan', label: 'INITIATE DEEP SCAN', type: 'primary' },
          { id: 'quarantine_info', label: 'VIEW QUARANTINE', type: 'secondary' }
        ]
      };
    }
    
    if (input.includes('compromise') || input.includes('what is')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '**SYSTEM COMPROMISE DEFINITION**\n\nA compromise indicates unauthorized access or control over your system:\n\n• **MALWARE INFILTRATION** - Hostile code execution\n• **DATA EXFILTRATION** - Unauthorized information theft\n• **BACKDOOR INSTALLATION** - Persistent remote access\n• **PRIVILEGE ESCALATION** - Elevated system permissions\n\nGuardian AI maintains continuous surveillance to detect and neutralize such threats.',
        timestamp: new Date()
      };
    }
    
    if (input.includes('scan') || input.includes('action: scan')) {
      setActionInProgress('scanning');
      setTimeout(() => {
        setActionInProgress(null);
      }, 5000);
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '🔍 **DEEP SYSTEM SCAN INITIATED**\n\n```\nScanning: System Files... [████████░░] 80%\nScanning: Network Connections... [██████████] 100%\nScanning: Process Memory... [██████░░░░] 60%\n```\n\n*Full scan in progress. Threat assessment updating...*',
        timestamp: new Date()
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: '**AWAITING INSTRUCTIONS**\n\nPlease specify your query regarding the current security alert. I can provide threat analysis, execute countermeasures, or answer security-related questions.',
      timestamp: new Date(),
      actions: [
        { id: 'explain_threat', label: 'EXPLAIN THREAT', type: 'secondary' },
        { id: 'recommend_action', label: 'RECOMMEND ACTION', type: 'primary' }
      ]
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-900/30 border-red-400/50 text-red-300';
      case 'high': return 'bg-orange-900/30 border-orange-400/50 text-orange-300';
      case 'medium': return 'bg-yellow-900/30 border-yellow-400/50 text-yellow-300';
      case 'low': return 'bg-blue-900/30 border-blue-400/50 text-blue-300';
      default: return 'bg-gray-900/30 border-gray-400/50 text-gray-300';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'secure': return <CheckCircle className="w-5 h-5 text-cyan-400" />;
      case 'threat': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'investigating': return <Eye className="w-5 h-5 text-orange-400" />;
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'secure': return 'SYSTEM SECURE';
      case 'threat': return 'THREAT ACTIVE';
      case 'investigating': return 'ANALYZING';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-100">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative bg-gray-800/80 backdrop-blur-md border-b border-cyan-500/30 sticky top-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/25">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-cyan-100 tracking-wide">GUARDIAN AI</h1>
                <p className="text-sm text-cyan-400/80 font-mono">NEURAL SECURITY MATRIX</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className={`text-sm font-bold font-mono tracking-wider ${
                  systemStatus === 'secure' ? 'text-cyan-400' : 
                  systemStatus === 'threat' ? 'text-red-400' : 'text-orange-400'
                }`}>
                  {getStatusText()}
                </span>
              </div>
              <div className="h-8 w-px bg-cyan-500/30"></div>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-sm text-cyan-300 font-mono">MONITORING ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alert Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-500/10">
              <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-red-900/20 to-orange-900/20">
                <h2 className="text-lg font-bold text-red-300 flex items-center space-x-2 font-mono tracking-wide">
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  <span>ACTIVE THREAT</span>
                </h2>
              </div>
              
              <div className="p-6">
                <div className={`p-4 rounded-lg border-2 ${getSeverityColor(currentAlert.severity)} mb-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm uppercase tracking-widest font-mono">
                      {currentAlert.severity} SEVERITY
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider ${
                      currentAlert.status === 'active' ? 'bg-red-900/50 text-red-300 border border-red-500/50' :
                      currentAlert.status === 'resolved' ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/50' :
                      'bg-orange-900/50 text-orange-300 border border-orange-500/50'
                    }`}>
                      {currentAlert.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-3 text-cyan-100">{currentAlert.title}</h4>
                  <p className="text-sm mb-4 text-gray-300 leading-relaxed">{currentAlert.description}</p>
                  
                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded border border-gray-700/50">
                      <span className="text-gray-400">SOURCE:</span>
                      <span className="font-bold text-cyan-300">{currentAlert.source}</span>
                    </div>
                    {currentAlert.ip && (
                      <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded border border-gray-700/50">
                        <span className="text-gray-400">TARGET IP:</span>
                        <span className="font-bold text-red-300">{currentAlert.ip}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded border border-gray-700/50">
                      <span className="text-gray-400">DETECTED:</span>
                      <span className="text-cyan-300">{currentAlert.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-cyan-300 mb-3 font-mono tracking-wide">QUICK ACTIONS</h4>
                  {currentAlert.status === 'active' ? (
                    <>
                      <button 
                        onClick={() => handleActionClick('block')}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-3 rounded-lg text-sm font-bold font-mono tracking-wide transition-all duration-200 flex items-center justify-center space-x-2 border border-red-500/50 shadow-lg shadow-red-500/25"
                        disabled={actionInProgress !== null}
                      >
                        <Lock className="w-4 h-4" />
                        <span>TERMINATE & QUARANTINE</span>
                      </button>
                      <button 
                        onClick={() => handleActionClick('investigate')}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-3 rounded-lg text-sm font-bold font-mono tracking-wide transition-all duration-200 flex items-center justify-center space-x-2 border border-cyan-500/50 shadow-lg shadow-cyan-500/25"
                      >
                        <Eye className="w-4 h-4" />
                        <span>ANALYZE THREAT</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <CheckCircle className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                      <p className="text-sm text-cyan-300 font-bold font-mono tracking-wide">THREAT NEUTRALIZED</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-cyan-500/30 flex flex-col h-[600px] shadow-2xl shadow-cyan-500/10">
              <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                <h2 className="text-lg font-bold text-cyan-100 flex items-center space-x-2 font-mono tracking-wide">
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                  <span>AI SECURITY INTERFACE</span>
                </h2>
                <p className="text-sm text-cyan-400/80 mt-1 font-mono">Neural language processing enabled</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-l-xl rounded-tr-xl border border-cyan-500/50 shadow-lg shadow-cyan-500/25' 
                        : 'bg-gradient-to-br from-gray-800 to-gray-700 text-cyan-100 rounded-r-xl rounded-tl-xl border border-gray-600/50'
                    } px-4 py-3`}>
                      <div className="text-sm whitespace-pre-line font-mono leading-relaxed">
                        {message.content.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index} className="text-cyan-300">{part}</strong> : part
                        )}
                      </div>
                      {message.actions && (
                        <div className="mt-3 space-y-2">
                          {message.actions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleActionClick(action.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold font-mono tracking-wide transition-all duration-200 ${
                                action.type === 'primary' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-500/50 shadow-lg shadow-cyan-500/25' :
                                action.type === 'danger' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-500/50 shadow-lg shadow-red-500/25' :
                                'bg-gray-700 hover:bg-gray-600 text-cyan-100 border border-gray-600/50'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-2 font-mono">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-r-xl rounded-tl-xl px-4 py-3 border border-gray-600/50">
                      <div className="flex items-center space-x-2">
                        <Loader className="w-4 h-4 animate-spin text-cyan-400" />
                        <span className="text-sm text-cyan-300 font-mono">GUARDIAN AI PROCESSING...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Progress Indicator */}
              {actionInProgress && (
                <div className="px-6 py-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-t border-cyan-500/30">
                  <div className="flex items-center space-x-3">
                    <Loader className="w-5 h-5 animate-spin text-cyan-400" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-cyan-300 mb-1 font-mono tracking-wide">
                        {actionInProgress === 'blocking' ? 'EXECUTING COUNTERMEASURES...' :
                         actionInProgress === 'scanning' ? 'DEEP SYSTEM SCAN IN PROGRESS...' :
                         'PROCESSING ACTION...'}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full animate-pulse shadow-lg shadow-cyan-500/50" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-6 border-t border-cyan-500/20 bg-gradient-to-r from-gray-900/30 to-gray-800/30">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    placeholder="Enter command or query..."
                    className="flex-1 px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-cyan-100 placeholder-cyan-400/50 font-mono backdrop-blur-sm"
                    disabled={isTyping || actionInProgress !== null}
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping || actionInProgress !== null}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 border border-cyan-500/50 shadow-lg shadow-cyan-500/25"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;