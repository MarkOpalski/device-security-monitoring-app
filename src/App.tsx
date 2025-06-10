import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, CheckCircle, Send, Loader, Activity, MessageCircle, Zap, Cpu, Wifi, Terminal, Users, Globe, Lock } from 'lucide-react';

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
  affectedHosts?: number;
}

interface AffectedHost {
  id: string;
  hostname: string;
  ip: string;
  status: 'infected' | 'isolated' | 'clean' | 'scanning';
  lastSeen: Date;
}

const INITIAL_ALERT: Alert = {
  id: '123',
  title: 'POTENTIAL MALWARE OUTBREAK',
  description: 'Cybermesh detected 52 endpoints establishing outbound connections to suspicious C2 server.',
  severity: 'critical',
  timestamp: new Date(),
  source: 'Network Anomaly Detection',
  ip: '172.24.1.250',
  status: 'active',
  affectedHosts: 52
};

const AFFECTED_HOSTS: AffectedHost[] = [
  { id: '1', hostname: 'WKSTN-HR-01', ip: '10.10.10.21', status: 'infected', lastSeen: new Date() },
  { id: '2', hostname: 'WKSTN-FIN-03', ip: '10.10.10.45', status: 'infected', lastSeen: new Date() },
  { id: '3', hostname: 'WKSTN-DEV-12', ip: '10.10.10.78', status: 'scanning', lastSeen: new Date() },
  { id: '4', hostname: 'WKSTN-MKT-07', ip: '10.10.10.92', status: 'isolated', lastSeen: new Date() },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: 'CYBERMESH ALERT: **CRITICAL - Potential Malware Outbreak (50+ hosts)** detected. Anomalous outbound connections to `172.24.1.250`. Process `svchost_mal.exe` identified. Immediate investigation required.',
    timestamp: new Date(),
  }
];

// Dynamic Blinking Cursor Component
const DynamicBlinkingCursor = ({ inputValue }: { inputValue: string }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`text-[#00FF00] transition-opacity duration-100 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        position: 'absolute',
        left: `${inputValue.length * 0.6}ch`,
        pointerEvents: 'none'
      }}
    >
      |
    </span>
  );
};

function App() {
  const [currentAlert, setCurrentAlert] = useState<Alert>(INITIAL_ALERT);
  const [affectedHosts, setAffectedHosts] = useState<AffectedHost[]>(AFFECTED_HOSTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<'secure' | 'threat' | 'investigating'>('threat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    setTimeout(() => {
      const aiResponse = generateAIResponse(content.trim());
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes('show active alerts') || input.includes('active alerts')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Active Alerts (1): **CRITICAL - Potential Malware Outbreak (50+ hosts)** - Anomaly: outbound connections to `172.24.1.250`. Type \'details alert 123\' for more.',
        timestamp: new Date(),
      };
    }
    
    if (input.includes('details alert 123') || input.includes('details alert')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Alert 123: **CRITICAL - Malware Outbreak.** Source: Network Anomaly. 52 endpoints connecting to `172.24.1.250`:443. Process `svchost_mal.exe`. Potential C2. Affected Hosts (see widget). Try: \'list affected hosts\', \'block ip 172.24.1.250\'.',
        timestamp: new Date(),
      };
    }
    
    if (input.includes('list affected hosts') || input.includes('affected hosts')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Displaying affected hosts in \'Affected Hosts\' widget. **52 total hosts affected**:\n\n• WKSTN-HR-01 (10.10.10.21) - INFECTED\n• WKSTN-FIN-03 (10.10.10.45) - INFECTED\n• WKSTN-DEV-12 (10.10.10.78) - SCANNING\n• WKSTN-MKT-07 (10.10.10.92) - ISOLATED\n\n...and 48 more. Use \'isolate all infected\' for mass containment.',
        timestamp: new Date(),
      };
    }
    
    if (input.includes('block ip') && input.includes('172.24.1.250')) {
      setActionInProgress('blocking');
      setTimeout(() => {
        setActionInProgress(null);
      }, 3000);
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '⚡ **INITIATING NETWORK-WIDE BLOCK** for `172.24.1.250`\n\n```\n> UPDATING FIREWALL RULES... ✓\n> BLOCKING C2 COMMUNICATION... ✓\n> NOTIFYING SECURITY TEAM... ✓\n```\n\nStatus: **BLOCKED**. C2 communication severed. Monitor for reconnection attempts.',
        timestamp: new Date(),
      };
    }
    
    if (input.includes('show origin') || input.includes('origin of outbreak')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '**OUTBREAK ORIGIN ANALYSIS:**\n\nPatient Zero: `WKSTN-HR-01` (`10.10.10.21`)\nVector: Phishing email - "Urgent Payroll Update"\nTimestamp: 14:23:07 UTC\nUser: j.smith@company.com\n\nRecommend: \'isolate host WKSTN-HR-01\', \'ioc for alert 123\'',
        timestamp: new Date(),
      };
    }
    
    if (input.includes('isolate host') && input.includes('wkstn-hr-01')) {
      setActionInProgress('isolating');
      setTimeout(() => {
        setActionInProgress(null);
        setAffectedHosts(prev => prev.map(host => 
          host.hostname === 'WKSTN-HR-01' ? { ...host, status: 'isolated' } : host
        ));
      }, 2000);
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '🔒 **ISOLATING HOST** `WKSTN-HR-01`\n\n```\n> SEVERING NETWORK ACCESS... ✓\n> QUARANTINE PROTOCOLS... ✓\n> USER NOTIFICATION... ✓\n```\n\nHost isolated successfully. Network access revoked.',
        timestamp: new Date(),
      };
    }
    
    if (input.includes('ioc for alert 123') || input.includes('ioc')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '**INDICATORS OF COMPROMISE (IOCs):**\n\n• **Hash (SHA256):** `a1b2c3d4e5f6789...`\n• **C2 IP:** `172.24.1.250:443`\n• **File Path:** `C:\\Users\\Public\\svchost_mal.exe`\n• **Email Subject:** "Urgent Payroll Update"\n• **Registry Key:** `HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\SvcHost`\n\nAction: \'push iocs to threat intel\' to share with security community.',
        timestamp: new Date(),
      };
    }
    
    if (input.includes('recommended remediation') || input.includes('remediation')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '**RECOMMENDED REMEDIATION STEPS:**\n\n1. **Full System Scan** - Deep malware analysis\n2. **Quarantine Infected Files** - Isolate malicious binaries\n3. **User Account Review** - Check for privilege escalation\n4. **Security Patching** - Close exploitation vectors\n5. **System Re-imaging** - If compromise is severe\n\nAction: \'start automated remediation playbook\' for systematic cleanup.',
        timestamp: new Date(),
      };
    }
    
    if (input.includes('start automated remediation') || input.includes('remediation playbook')) {
      setActionInProgress('remediating');
      setTimeout(() => {
        setActionInProgress(null);
        setSystemStatus('investigating');
      }, 5000);
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '🔧 **AUTOMATED REMEDIATION INITIATED**\n\n```\nPhase 1: Malware Scanning... [████████░░] 80%\nPhase 2: File Quarantine... [██████░░░░] 60%\nPhase 3: Registry Cleanup... [███░░░░░░░] 30%\nPhase 4: User Account Audit... [░░░░░░░░░░] 0%\n```\n\nEstimated completion: 15 minutes. Monitor progress in Quick Actions widget.',
        timestamp: new Date(),
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: '**GUARDIAN AI READY**\n\nAvailable commands:\n• `show active alerts` - Display current threats\n• `details alert [ID]` - Get detailed threat analysis\n• `list affected hosts` - Show compromised systems\n• `block ip [ADDRESS]` - Network-wide IP blocking\n• `isolate host [HOSTNAME]` - Quarantine specific system\n• `ioc for alert [ID]` - Extract indicators of compromise\n\nWhat would you like to investigate?',
      timestamp: new Date(),
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

  const getHostStatusColor = (status: string) => {
    switch (status) {
      case 'infected': return 'text-red-400';
      case 'isolated': return 'text-orange-400';
      case 'scanning': return 'text-yellow-400';
      case 'clean': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'secure': return <CheckCircle className="w-5 h-5 text-cyan-400" />;
      case 'threat': return <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />;
      case 'investigating': return <Activity className="w-5 h-5 text-orange-400 animate-pulse" />;
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'secure': return 'CYBERMESH SECURE';
      case 'threat': return 'THREAT ACTIVE';
      case 'investigating': return 'ANALYZING THREAT';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-100 font-mono">
      {/* Animated submarine-style grid background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>

      {/* Command Center Header */}
      <header className="relative bg-gray-800/90 backdrop-blur-md border-b-2 border-cyan-500/50 sticky top-0 z-10 shadow-lg shadow-cyan-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/30 border border-cyan-400/50">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cyan-100 tracking-widest">GUARDIAN AI</h1>
                <p className="text-sm text-cyan-400/90 tracking-wider">CYBERMESH THREAT MONITORING</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <span className={`text-sm font-bold tracking-widest ${
                  systemStatus === 'secure' ? 'text-cyan-400' : 
                  systemStatus === 'threat' ? 'text-red-400' : 'text-orange-400'
                }`}>
                  {getStatusText()}
                </span>
              </div>
              
              <div className="h-8 w-px bg-cyan-500/40"></div>
              
              <div className="flex items-center space-x-3">
                <Terminal className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-sm text-cyan-300 tracking-wider">NEURAL PROCESSING ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Widgets */}
          <div className="col-span-4 space-y-6">
            {/* Active Alerts Widget */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl border-2 border-red-500/40 overflow-hidden shadow-2xl shadow-red-500/20">
              <div className="p-4 border-b-2 border-red-500/30 bg-gradient-to-r from-red-900/30 to-red-800/30">
                <h2 className="text-lg font-bold text-red-300 tracking-widest flex items-center justify-between">
                  <span>ACTIVE ALERTS</span>
                  <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                </h2>
              </div>
              
              <div className="p-4">
                <div className={`p-4 rounded-lg border-2 ${getSeverityColor(currentAlert.severity)} bg-gradient-to-br from-gray-900/60 to-gray-800/60`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest ${
                      currentAlert.status === 'active' ? 'bg-red-900/60 text-red-300 border border-red-500/60' :
                      currentAlert.status === 'resolved' ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/60' :
                      'bg-orange-900/60 text-orange-300 border border-orange-500/60'
                    }`}>
                      {currentAlert.severity.toUpperCase()} • {currentAlert.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-lg mb-3 text-cyan-100 tracking-wide">{currentAlert.title}</h4>
                  <p className="text-sm mb-4 text-gray-300 leading-relaxed">{currentAlert.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 bg-gray-900/60 rounded border border-gray-700/60">
                      <span className="text-gray-400 tracking-wider">TARGET IP:</span>
                      <span className="font-bold text-red-300">{currentAlert.ip}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-900/60 rounded border border-gray-700/60">
                      <span className="text-gray-400 tracking-wider">AFFECTED HOSTS:</span>
                      <span className="font-bold text-orange-300">{currentAlert.affectedHosts}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Affected Hosts Widget */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl border-2 border-orange-500/40 overflow-hidden shadow-2xl shadow-orange-500/20">
              <div className="p-4 border-b-2 border-orange-500/30 bg-gradient-to-r from-orange-900/30 to-orange-800/30">
                <h2 className="text-lg font-bold text-orange-300 tracking-widest flex items-center justify-between">
                  <span>AFFECTED HOSTS</span>
                  <Users className="w-6 h-6 text-orange-400" />
                </h2>
              </div>
              
              <div className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {affectedHosts.map((host) => (
                    <div key={host.id} className="p-3 bg-gray-900/60 rounded border border-gray-700/60">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-cyan-300 text-sm">{host.hostname}</span>
                        <span className={`text-xs font-bold tracking-widest ${getHostStatusColor(host.status)}`}>
                          {host.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">{host.ip}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Widget */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl border-2 border-cyan-500/40 overflow-hidden shadow-2xl shadow-cyan-500/20">
              <div className="p-4 border-b-2 border-cyan-500/30 bg-gradient-to-r from-cyan-900/30 to-cyan-800/30">
                <h2 className="text-lg font-bold text-cyan-300 tracking-widest flex items-center justify-between">
                  <span>QUICK ACTIONS</span>
                  <Zap className="w-6 h-6 text-cyan-400" />
                </h2>
              </div>
              
              <div className="p-4 space-y-2">
                <button 
                  onClick={() => handleSendMessage('block ip 172.24.1.250 network-wide')}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-sm font-bold tracking-widest transition-all duration-200 border border-red-500/60 shadow-lg shadow-red-500/30"
                  style={{ height: '40px', paddingLeft: '12px', textAlign: 'left' }}
                  disabled={actionInProgress !== null}
                >
                  <span style={{ marginLeft: '4px' }}>BLOCK C2 IP</span>
                </button>
                
                <button 
                  onClick={() => handleSendMessage('isolate host WKSTN-HR-01')}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg text-sm font-bold tracking-widest transition-all duration-200 border border-orange-500/60 shadow-lg shadow-orange-500/30"
                  style={{ height: '40px', paddingLeft: '12px', textAlign: 'left' }}
                >
                  <span style={{ marginLeft: '4px' }}>ISOLATE PATIENT ZERO</span>
                </button>
                
                <button 
                  onClick={() => handleSendMessage('start automated remediation playbook')}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-sm font-bold tracking-widest transition-all duration-200 border border-cyan-500/60 shadow-lg shadow-cyan-500/30"
                  style={{ height: '40px', paddingLeft: '12px', textAlign: 'left' }}
                >
                  <span style={{ marginLeft: '4px' }}>START REMEDIATION</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Console Interface */}
          <div className="col-span-8">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl border-2 border-cyan-500/40 flex flex-col h-[700px] shadow-2xl shadow-cyan-500/20">
              {/* Console Header */}
              <div className="p-6 border-b-2 border-cyan-500/30 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
                <h2 className="text-xl font-bold text-cyan-100 tracking-widest flex items-center justify-between">
                  <span>RETRO-CONSOLE INTERFACE</span>
                  <Terminal className="w-7 h-7 text-cyan-400" />
                </h2>
                <p className="text-sm text-cyan-400/90 mt-1 tracking-wider">Neural language processing • Prompt-driven commands</p>
              </div>

              {/* Messages Display */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-900/20">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-cyan-600/90 to-blue-600/90 text-white rounded-l-xl rounded-tr-xl border-2 border-cyan-500/60 shadow-lg shadow-cyan-500/30' 
                        : 'bg-gradient-to-br from-gray-800/90 to-gray-700/90 text-cyan-100 rounded-r-xl rounded-tl-xl border-2 border-gray-600/60'
                    } px-5 py-4`}>
                      <div className="text-sm whitespace-pre-line leading-relaxed">
                        {message.content.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index} className="text-cyan-300">{part}</strong> : part
                        )}
                      </div>
                      <div className="text-xs opacity-70 mt-2 tracking-wider">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 rounded-r-xl rounded-tl-xl px-5 py-4 border-2 border-gray-600/60">
                      <div className="flex items-center space-x-3">
                        <Loader className="w-5 h-5 animate-spin text-cyan-400" />
                        <span className="text-sm text-cyan-300 tracking-wider">GUARDIAN AI PROCESSING...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Progress Indicator */}
              {actionInProgress && (
                <div className="px-6 py-4 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-t-2 border-cyan-500/30">
                  <div className="flex items-center space-x-4">
                    <Loader className="w-6 h-6 animate-spin text-cyan-400" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-cyan-300 mb-2 tracking-widest">
                        {actionInProgress === 'blocking' ? 'EXECUTING NETWORK BLOCK...' :
                         actionInProgress === 'isolating' ? 'ISOLATING HOST...' :
                         actionInProgress === 'remediating' ? 'AUTOMATED REMEDIATION IN PROGRESS...' :
                         'PROCESSING ACTION...'}
                      </div>
                      <div className="w-full bg-gray-700/60 rounded-full h-3 overflow-hidden border border-gray-600/60">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full animate-pulse shadow-lg shadow-cyan-500/60" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Command Input */}
              <div className="p-6 border-t-2 border-cyan-500/30 bg-gradient-to-r from-gray-900/40 to-gray-800/40">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                      placeholder="Enter command or query..."
                      className="w-full px-4 py-4 bg-gray-900/60 border-2 border-cyan-500/40 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-cyan-100 placeholder-cyan-400/60 backdrop-blur-sm shadow-inner"
                      disabled={isTyping || actionInProgress !== null}
                      style={{ 
                        fontFamily: 'monospace',
                        caretColor: 'transparent'
                      }}
                    />
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 pointer-events-none"
                      style={{ 
                        left: `${16 + (inputValue.length * 9.6)}px`
                      }}
                    >
                      <DynamicBlinkingCursor inputValue={inputValue} />
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping || actionInProgress !== null}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg transition-all duration-200 flex items-center space-x-2 border-2 border-cyan-500/60 shadow-lg shadow-cyan-500/30"
                  >
                    <Send className="w-5 h-5" />
                    <span className="font-bold tracking-wider">EXECUTE</span>
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