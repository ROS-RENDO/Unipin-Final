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
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);
  const [side, setSide] = useState<'right' | 'left'>('right');
  
  // Dragging state
  const [position, setPosition] = useState({ x: window.innerWidth - 520, y: window.innerHeight - 340 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const windowStartPos = useRef({ x: 0, y: 0 });
  
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
      } catch (_) {}
    };

    es.onerror = () => setConnected(false);

    // Handle window resize to keep it on screen
    const handleResize = () => {
      setPosition(p => ({
        x: Math.min(p.x, window.innerWidth - 100),
        y: Math.min(p.y, window.innerHeight - 50)
      }));
    };
    window.addEventListener('resize', handleResize);

    return () => { 
      es.close(); 
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, minimized]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    windowStartPos.current = { ...position };
    // Prevent text selection while dragging
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    // Clamp to screen bounds
    const newX = Math.max(0, Math.min(window.innerWidth - 300, windowStartPos.current.x + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 40, windowStartPos.current.y + dy));
    
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const clear = () => setLogs([]);

  if (closed) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '40px',
          [side]: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: side === 'right' ? 'row' : 'row-reverse',
          alignItems: 'center',
          gap: '2px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <button
          onClick={() => setClosed(false)}
          title="Open Terminal"
          style={{
            background: '#0f172a',
            color: '#22c55e',
            border: '1px solid #1e293b',
            borderRight: side === 'right' ? 'none' : '1px solid #1e293b',
            borderLeft: side === 'left' ? 'none' : '1px solid #1e293b',
            padding: '12px 10px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            borderTopLeftRadius: side === 'right' ? '8px' : 0,
            borderBottomLeftRadius: side === 'right' ? '8px' : 0,
            borderTopRightRadius: side === 'left' ? '8px' : 0,
            borderBottomRightRadius: side === 'left' ? '8px' : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {side === 'right' ? '◀' : '▶'}
        </button>
        <button
          onClick={() => setSide(s => s === 'right' ? 'left' : 'right')}
          title="Switch side"
          style={{
            background: '#1e293b',
            color: '#94a3b8',
            border: '1px solid #0f172a',
            padding: '12px 6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            borderTopLeftRadius: side === 'left' ? '8px' : 0,
            borderBottomLeftRadius: side === 'left' ? '8px' : 0,
            borderTopRightRadius: side === 'right' ? '8px' : 0,
            borderBottomRightRadius: side === 'right' ? '8px' : 0,
          }}
        >
          {side === 'right' ? '«' : '»'}
        </button>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed', 
        left: position.x,
        top: position.y,
        zIndex: 9999,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        width: minimized ? '350px' : '500px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #1e293b',
        opacity: isDragging ? 0.9 : 1,
        transition: isDragging ? 'none' : 'width 0.2s',
      }}
    >
      {/* Title bar (Draggable Area) */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          background: '#0f172a',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none' // Prevent scrolling while dragging on touch
        }}
      >
        {/* Window controls */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {/* Close (Red) */}
          <span 
            onClick={() => setClosed(true)}
            onPointerDown={e => e.stopPropagation()}
            style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', display: 'inline-block', cursor: 'pointer' }} 
            title="Close"
          />
          {/* Minimize (Yellow) */}
          <span 
            onClick={() => setMinimized(true)}
            onPointerDown={e => e.stopPropagation()}
            style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', cursor: 'pointer' }} 
            title="Minimize"
          />
          {/* Restore/Maximize (Green) */}
          <span 
            onClick={() => setMinimized(false)}
            onPointerDown={e => e.stopPropagation()}
            style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', display: 'inline-block', cursor: 'pointer' }} 
            title="Restore"
          />
        </div>

        <span style={{ color: '#64748b', fontSize: '0.78rem', flex: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⚙️ Backend Terminal
          <span style={{ color: connected ? '#22c55e' : '#ef4444', fontSize: '1.2rem', lineHeight: 0.5 }}>•</span>
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); clear(); }}
          style={{ background: 'none', border: '1px solid #334155', borderRadius: '4px', color: '#64748b', padding: '0.15rem 0.6rem', fontSize: '0.72rem', cursor: 'pointer', zIndex: 10 }}
          onPointerDown={e => e.stopPropagation()} // don't start dragging if clicking clear
        >
          Clear
        </button>
      </div>

      {/* Log body */}
      {!minimized && (
        <div style={{
          background: 'rgba(2, 6, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          height: '280px',
          overflowY: 'auto',
          padding: '0.5rem 1rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          {logs.length === 0 && (
            <div style={{ color: '#334155', fontSize: '0.8rem', paddingTop: '0.5rem', textAlign: 'center' }}>
              Waiting for backend events...
            </div>
          )}
          {logs.map(line => {
            const tag = getTagLabel(line.message);
            const color = getLineColor(line.message);
            const time = new Date(line.ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return (
              <div key={line.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.4rem', fontSize: '0.75rem', lineHeight: 1.4 }}>
                {/* Timestamp */}
                <span style={{ color: '#475569', flexShrink: 0, minWidth: '4.5rem' }}>{time}</span>
                {/* Pattern tag badge */}
                {tag ? (
                  <span style={{ background: TAG_BG[tag] || '#ffffff10', color, border: `1px solid ${color}44`, borderRadius: '4px', padding: '0 0.4rem', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, minWidth: '5.5rem', textAlign: 'center' }}>
                    {tag}
                  </span>
                ) : (
                  <span style={{ minWidth: '5.5rem', flexShrink: 0 }} />
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
      )}
    </div>
  );
}
