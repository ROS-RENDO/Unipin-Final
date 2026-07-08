import { useEffect, useRef, useState } from 'react';

interface LogLine {
  message: string;
  ts: number;
  id: number;
}

// Detect pattern tag and return color
function getLineColor(msg: string): string {
  if (msg.includes('[Singleton]'))         return '#f59e0b';
  if (msg.includes('[Builder]'))           return '#10b981';
  if (msg.includes('[AbstractFactory') || msg.includes('Factory]')) return '#8b5cf6';
  if (msg.includes('[Strategy'))          return '#06b6d4';
  if (msg.includes('[State'))             return '#ef4444';
  if (msg.includes('[Facade]') || msg.includes('[SSE]')) return '#f97316';
  if (msg.includes('✅') || msg.includes('running'))     return '#34d399';
  if (msg.includes('❌') || msg.includes('Error') || msg.includes('error')) return '#f87171';
  return '#94a3b8';
}

function getTagLabel(msg: string): string | null {
  if (msg.includes('[Singleton]'))         return 'SINGLETON';
  if (msg.includes('[Builder]'))           return 'BUILDER';
  if (msg.includes('[AbstractFactory'))    return 'FACTORY';
  if (msg.includes('[Strategy'))           return 'STRATEGY';
  if (msg.includes('[State'))              return 'STATE';
  if (msg.includes('[Facade]'))            return 'FACADE';
  if (msg.includes('[SSE]'))               return 'SSE';
  return null;
}

const TAG_BG: Record<string, string> = {
  SINGLETON: '#f59e0b22',
  BUILDER:   '#10b98122',
  FACTORY:   '#8b5cf622',
  STRATEGY:  '#06b6d422',
  STATE:     '#ef444422',
  FACADE:    '#f9731622',
  SSE:       '#ffffff11',
};

let lineId = 0;

export default function TerminalLog() {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [connected, setConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource('http://localhost:3001/api/logs/stream');
    esRef.current = es;

    es.onopen = () => setConnected(true);

    es.onmessage = (e) => {
      try {
        const { message, ts } = JSON.parse(e.data);
        setLogs(prev => [...prev.slice(-200), { message, ts, id: ++lineId }]);
        
        // Increase unread count if sidebar is closed
        setUnreadCount(prev => isOpen ? 0 : prev + 1);
      } catch (_) {}
    };

    es.onerror = () => setConnected(false);

    return () => { 
      es.close(); 
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0); // clear unread when opened
    }
  }, [logs, isOpen]);

  const clear = () => setLogs([]);

  return (
    <>
      {/* Floating Toggle Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10000,
          background: '#0f172a',
          color: '#e2e8f0',
          border: '1px solid #1e293b',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          transition: 'transform 0.2s, background 0.2s',
          outline: 'none',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
        onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        🧑‍💻
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#ef4444',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            padding: '2px 6px',
            borderRadius: '10px',
            border: '2px solid #0f172a'
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Sidebar */}
      <div 
        style={{
          position: 'fixed', 
          right: isOpen ? '0' : '-450px', // slide out of view
          top: 0,
          height: '100vh',
          width: '450px',
          zIndex: 9999,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          background: '#020617', // Very dark blue/black
          boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
          borderLeft: '1px solid #1e293b',
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: '#0f172a',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '0.9rem', flex: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚙️ Backend Terminal
            <span style={{ color: connected ? '#22c55e' : '#ef4444', fontSize: '1.2rem', lineHeight: 0.5 }} title={connected ? "Connected to SSE" : "Disconnected"}>•</span>
          </span>

          <button
            onClick={clear}
            style={{ background: 'none', border: '1px solid #334155', borderRadius: '4px', color: '#94a3b8', padding: '0.3rem 0.8rem', fontSize: '0.75rem', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            Clear
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.5rem' }}
          >
            ✕
          </button>
        </div>

        {/* Log body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
        }}>
          {logs.length === 0 && (
            <div style={{ color: '#475569', fontSize: '0.85rem', paddingTop: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
              Listening to backend events...
            </div>
          )}
          {logs.map(line => {
            const tag = getTagLabel(line.message);
            const color = getLineColor(line.message);
            const time = new Date(line.ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return (
              <div key={line.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', marginBottom: '0.6rem', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {/* Timestamp */}
                <span style={{ color: '#475569', flexShrink: 0 }}>{time}</span>
                {/* Pattern tag badge */}
                {tag ? (
                  <span style={{ background: TAG_BG[tag] || '#ffffff10', color, border: `1px solid ${color}44`, borderRadius: '4px', padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, minWidth: '6rem', textAlign: 'center' }}>
                    {tag}
                  </span>
                ) : (
                  <span style={{ minWidth: '6rem', flexShrink: 0 }} />
                )}
                {/* Message */}
                <span style={{ color, wordBreak: 'break-word', flex: 1, fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
                  {line.message}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
    </>
  );
}
