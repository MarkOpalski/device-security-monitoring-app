import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, CheckCircle, X, Send, Loader, Network, Eye, Lock, Trash2, Activity, Clock, MessageCircle } from 'lucide-react';

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
    content: '🚨 **Potential Compromise Detected!** \'CoolGame.app\' is attempting a suspicious outgoing network connection to `185.199.108.153`. This connection appears to be associated with known malware distribution networks. How would you like to proceed?',
    timestamp: new Date(),
    actions: [
      { id: 'investigate', label: 'Tell me more about this threat', type: 'secondary' },
      { id: 'block', label: 'Block connection immediately', type: 'danger' }
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
    
    if (input.includes('tell me more') || input.includes('investigate') || input.includes('what kind')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'The app \'CoolGame.app\' is attempting an outgoing connection to IP address `185.199.108.153` on port 443 (HTTPS). This IP address is flagged as potentially associated with **known malware distribution networks**. It\'s highly unusual for a game to make such a connection, suggesting potential compromise or malicious activity. This is considered **dangerous**.',
        timestamp: new Date(),
        actions: [
          { id: 'block_now', label: 'Block connection now', type: 'danger' },
          { id: 'advanced', label: 'Show advanced options', type: 'secondary' }
        ]
      };
    }
    
    if (input.includes('block') || input.includes('action: block') || input.includes('stop')) {
      setActionInProgress('blocking');
      setTimeout(() => {
        setActionInProgress(null);
        setCurrentAlert(prev => ({ ...prev, status: 'resolved' }));
        setSystemStatus('secure');
      }, 3000);
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '🛡️ **Action Initiated:** Blocking network connection and quarantining \'CoolGame.app\'...\n\n✅ **Connection successfully blocked**\n✅ **Application quarantined**\n\nA full system scan is recommended to check for related threats. Would you like me to initiate a comprehensive security scan?',
        timestamp: new Date(),
        actions: [
          { id: 'scan', label: 'Start full system scan', type: 'primary' },
          { id: 'quarantine_info', label: 'Manage quarantined apps', type: 'secondary' }
        ]
      };
    }
    
    if (input.includes('compromise') || input.includes('what is')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'In this context, a **\'compromise\'** refers to unauthorized access to your device or data, or a breach of your system\'s security. This could result from:\n\n• **Malware infection** - malicious software executing on your device\n• **Vulnerable applications** being exploited by attackers\n• **Suspicious network activity** indicating potential data theft\n• **Unauthorized system modifications**\n\nGuardian AI continuously monitors for these events and helps you respond quickly to maintain your digital security.',
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
        content: '🔍 **Initiating comprehensive security scan...**\n\nScanning system files, network connections, and installed applications for threats. This may take a few minutes.\n\n*Scan progress will be displayed below.*',
        timestamp: new Date()
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: 'I understand your concern. Could you please clarify what specific information you need about this security alert? I can help explain the threat, recommend actions, or answer any security-related questions you have.',
      timestamp: new Date(),
      actions: [
        { id: 'explain_threat', label: 'Explain this threat', type: 'secondary' },
        { id: 'recommend_action', label: 'What should I do?', type: 'primary' }
      ]
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'secure': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'threat': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'investigating': return <Eye className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'secure': return 'System Secure';
      case 'threat': return 'Threat Detected';
      case 'investigating': return 'Investigating';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Guardian AI</h1>
                <p className="text-sm text-gray-500">Device Security Monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className={`text-sm font-medium ${
                  systemStatus === 'secure' ? 'text-green-700' : 
                  systemStatus === 'threat' ? 'text-red-700' : 'text-orange-700'
                }`}>
                  {getStatusText()}
                </span>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <Activity className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Real-time monitoring active</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alert Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Active Alert</span>
                </h2>
              </div>
              
              <div className="p-6">
                <div className={`p-4 rounded-lg border-2 ${getSeverityColor(currentAlert.severity)} mb-4`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">
                      {currentAlert.severity} Severity
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentAlert.status === 'active' ? 'bg-red-100 text-red-700' :
                      currentAlert.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {currentAlert.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{currentAlert.title}</h4>
                  <p className="text-sm mb-3">{currentAlert.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <span className="font-mono font-medium">{currentAlert.source}</span>
                    </div>
                    {currentAlert.ip && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target IP:</span>
                        <span className="font-mono font-medium">{currentAlert.ip}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Detected:</span>
                      <span>{currentAlert.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">Quick Actions</h4>
                  {currentAlert.status === 'active' ? (
                    <>
                      <button 
                        onClick={() => handleActionClick('block')}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                        disabled={actionInProgress !== null}
                      >
                        <Lock className="w-4 h-4" />
                        <span>Block & Quarantine</span>
                      </button>
                      <button 
                        onClick={() => handleActionClick('investigate')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Investigate</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-green-700 font-medium">Threat Resolved</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <span>AI Security Assistant</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">Ask questions or request actions in natural language</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-l-xl rounded-tr-xl' 
                        : 'bg-gray-100 text-gray-900 rounded-r-xl rounded-tl-xl'
                    } px-4 py-3`}>
                      <div className="text-sm whitespace-pre-line">
                        {message.content.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                        )}
                      </div>
                      {message.actions && (
                        <div className="mt-3 space-y-2">
                          {message.actions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleActionClick(action.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                action.type === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                                action.type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' :
                                'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-r-xl rounded-tl-xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Loader className="w-4 h-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-500">Guardian AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Progress Indicator */}
              {actionInProgress && (
                <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
                  <div className="flex items-center space-x-3">
                    <Loader className="w-5 h-5 animate-spin text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-900 mb-1">
                        {actionInProgress === 'blocking' ? 'Blocking connection and quarantining application...' :
                         actionInProgress === 'scanning' ? 'Performing comprehensive security scan...' :
                         'Processing action...'}
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    placeholder="Ask about this alert or request an action..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={isTyping || actionInProgress !== null}
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping || actionInProgress !== null}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
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